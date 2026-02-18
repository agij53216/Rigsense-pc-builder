import sys
import json
import pandas as pd
import numpy as np

# ─────────────────────────────────────────────────────────────────────────────
# Constants
# ─────────────────────────────────────────────────────────────────────────────
TYPE_MAPPING = {
    'cpu':         ['processor', 'cpu'],
    'gpu':         ['gpu', 'graphics card'],
    'motherboard': ['motherboard', 'mobo'],
    'ram':         ['ram', 'memory'],
    'storage':     ['ssd', 'hdd', 'storage', 'hard drive'],
    'psu':         ['psu', 'power supply'],
    'case':        ['case', 'cabinet'],
    'cooling':     ['cooling', 'cooler', 'cpu cooler'],
}

# Budget share per part per use-case (must sum ≤ 1.0; cooling takes remainder)
RATIOS = {
    'Gaming': {
        'gpu': 0.40, 'cpu': 0.18, 'ram': 0.08,
        'motherboard': 0.10, 'storage': 0.08,
        'psu': 0.06, 'case': 0.05, 'cooling': 0.05,
    },
    'Productivity': {
        'cpu': 0.35, 'gpu': 0.15, 'ram': 0.15,
        'storage': 0.12, 'motherboard': 0.10,
        'psu': 0.06, 'case': 0.04, 'cooling': 0.03,
    },
    'General': {
        'cpu': 0.25, 'gpu': 0.20, 'ram': 0.15,
        'storage': 0.12, 'motherboard': 0.10,
        'psu': 0.08, 'case': 0.05, 'cooling': 0.05,
    },
}

# ─────────────────────────────────────────────────────────────────────────────
# Strategy Definitions
# ─────────────────────────────────────────────────────────────────────────────
# RULE: value < performance <= user_budget < future_proof
#
#  value        → spend 75-80 % of budget (best build clearly under budget)
#  performance  → spend 95-100 % of budget (best build AT budget)
#  future_proof → spend 110-120 % of budget (best build slightly above budget)
#
# hard_cap: if True, totalPrice is clipped to budget_mult * user_budget
# future_socket: prefer AM5 / LGA1700 CPUs
# ─────────────────────────────────────────────────────────────────────────────
STRATEGIES = {
    'value': {
        'budget_mult':   0.78,
        'flexibility':   0.00,   # zero over-run — stay strictly under slice
        'future_socket': False,
        'hard_cap':      True,
        'label':         'Best Value',
        'description':   'Best build under your budget',
    },
    'performance': {
        'budget_mult':   1.00,
        'flexibility':   0.05,   # 5 % per-slice slack to use the full budget
        'future_socket': False,
        'hard_cap':      True,
        'label':         'Max Performance',
        'description':   'Best build at your budget',
    },
    'future_proof': {
        'budget_mult':   1.18,
        'flexibility':   0.18,   # wider slack to pick genuinely better parts
        'future_socket': True,
        'hard_cap':      False,  # allowed to exceed — it's the premium tier
        'label':         'Future Proof',
        'description':   'Higher performance, slightly over budget',
    },
}

BUILD_ORDER = ['cpu', 'motherboard', 'ram', 'gpu', 'storage', 'psu', 'case', 'cooling']

# Bottleneck thresholds: if score ratio between two parts exceeds this, warn
BOTTLENECK_RATIO = 1.6   # CPU score > 1.6× GPU score (or vice-versa) = bottleneck

# ─────────────────────────────────────────────────────────────────────────────
# Helpers
# ─────────────────────────────────────────────────────────────────────────────
def _normalize(s: str) -> str:
    return s.strip().lower().replace(' ', '') if isinstance(s, str) else ''

def _safe_to_dict(row: pd.Series) -> dict:
    """Convert a pandas Series to a plain dict with only JSON-safe primitives."""
    d = row.replace({np.nan: None}).to_dict()
    safe = {}
    for k, v in d.items():
        if v is None or isinstance(v, (bool, int, float, str)):
            safe[k] = v
        elif isinstance(v, (np.integer,)):
            safe[k] = int(v)
        elif isinstance(v, (np.floating,)):
            safe[k] = None if (np.isnan(v) or np.isinf(v)) else float(v)
        elif isinstance(v, np.ndarray):
            safe[k] = v.tolist()
        else:
            safe[k] = str(v)  # ObjectId, datetime, etc. → string
    return safe

def _filter_by_type(df: pd.DataFrame, part_type: str) -> pd.DataFrame:
    """Exact norm_category match first; alias fallback via TYPE_MAPPING."""
    result = df[df['norm_category'] == part_type]
    if not result.empty:
        return result
    aliases = TYPE_MAPPING.get(part_type, [part_type])
    col = next((c for c in ('norm_part', 'norm_type') if c in df.columns), None)
    return df[df[col].isin(aliases)] if col else df.iloc[0:0]

def _exclude_integrated(df: pd.DataFrame) -> pd.DataFrame:
    """
    Remove integrated / iGPU entries from a GPU candidate list.
    Integrated GPUs are identified by price == 0, or name containing
    known iGPU keywords (UHD, Iris, Vega, RDNA iGPU markers).
    """
    if df.empty:
        return df
    igpu_pattern = r'uhd|iris|vega\s*\d|radeon\s*(rx\s*)?vega\s*(3|5|7|8|10|11)'
    # Cast to str first to avoid crash on NaN/None in name column
    name_is_igpu = df['name'].astype(str).str.lower().str.contains(igpu_pattern, na=False, regex=True)
    price_zero   = df['price'] <= 0
    filtered     = df[~(name_is_igpu | price_zero)]
    return filtered if not filtered.empty else df  # graceful fallback

def _pick_best(df: pd.DataFrame, budget: float, flexibility: float) -> pd.Series:
    """
    Highest performance_score within budget*(1+flexibility).
    Falls back to cheapest available if nothing is affordable.
    """
    if df.empty:
        return pd.Series({'name': 'Unknown', 'price': 0, 'performance_score': 0})
    ceiling    = budget * (1.0 + flexibility)
    affordable = df[df['price'] <= ceiling]
    pool       = affordable if not affordable.empty else df.nsmallest(1, 'price')
    return pool.nlargest(1, 'performance_score').iloc[0]

# ─────────────────────────────────────────────────────────────────────────────
# Bottleneck Analyser
# ─────────────────────────────────────────────────────────────────────────────
def _analyse_bottleneck(parts: dict) -> list:
    """
    Returns a list of human-readable issue strings.
    Checks CPU↔GPU score balance and flags GPU price-zero cases.
    """
    issues = []
    cpu_score = parts.get('cpu', {}).get('performance_score', 0) or 0
    gpu_score = parts.get('gpu', {}).get('performance_score', 0) or 0
    gpu_price = parts.get('gpu', {}).get('price', 0) or 0

    if gpu_price <= 0 or parts.get('gpu', {}).get('name') in (None, 'Unknown', ''):
        issues.append("No dedicated GPU selected. Add a discrete GPU for gaming or rendering workloads.")
        return issues  # no point ratio-checking iGPU

    if cpu_score > 0 and gpu_score > 0:
        ratio = max(cpu_score, gpu_score) / min(cpu_score, gpu_score)
        if ratio >= BOTTLENECK_RATIO:
            if cpu_score > gpu_score:
                issues.append(
                    f"CPU bottleneck: CPU score ({cpu_score:.0f}) is much higher than GPU score "
                    f"({gpu_score:.0f}). Upgrade the GPU for better gaming performance."
                )
            else:
                issues.append(
                    f"GPU bottleneck: GPU score ({gpu_score:.0f}) far exceeds CPU score "
                    f"({cpu_score:.0f}). Upgrade the CPU to avoid throttling the GPU."
                )
    return issues

# ─────────────────────────────────────────────────────────────────────────────
# Build Generator
# ─────────────────────────────────────────────────────────────────────────────
def generate_build(df: pd.DataFrame, budget: float, use_case: str, strategy: str) -> dict:
    ratios      = RATIOS.get(use_case, RATIOS['General'])
    cfg         = STRATEGIES[strategy]
    eff_budget  = budget * cfg['budget_mult']
    flexibility = cfg['flexibility']

    parts       = {}
    total_price = 0.0
    total_score = 0.0

    # ── 1. CPU ───────────────────────────────────────────────────────────────
    cpu_df = _filter_by_type(df, 'cpu')
    if cfg['future_socket']:
        mask   = cpu_df['socket'].str.contains('AM5|LGA1700', case=False, na=False)
        cpu_df = cpu_df[mask] if mask.any() else cpu_df

    cpu            = _pick_best(cpu_df, eff_budget * ratios['cpu'], flexibility)
    parts['cpu']   = _safe_to_dict(cpu)
    total_price   += cpu['price']
    total_score   += cpu.get('performance_score', 0)
    current_socket = _normalize(str(cpu.get('socket', '')))

    # ── 2. Motherboard (socket-matched) ──────────────────────────────────────
    mobo_df = _filter_by_type(df, 'motherboard')
    if current_socket:
        norm_sock = mobo_df['socket'].astype(str).str.lower().str.strip().str.replace(' ', '', regex=False)
        mobo_df   = mobo_df[norm_sock == current_socket]

    mobo                 = _pick_best(mobo_df, eff_budget * ratios['motherboard'], flexibility)
    parts['motherboard'] = _safe_to_dict(mobo)
    total_price         += mobo['price']
    total_score         += mobo.get('performance_score', 0)

    # Resolve RAM type from mobo
    raw_ram  = mobo.get('ramType', 'DDR4')
    curr_ram = _normalize(raw_ram[0] if isinstance(raw_ram, list) else raw_ram)

    # ── 3. RAM (type-matched) ─────────────────────────────────────────────────
    ram_df = _filter_by_type(df, 'ram')
    if curr_ram:
        ram_df = ram_df[
            ram_df['name'].str.lower().str.contains(curr_ram, na=False) |
            ram_df['ramType'].astype(str).str.lower().str.contains(curr_ram, na=False)
        ]

    ram          = _pick_best(ram_df, eff_budget * ratios['ram'], flexibility)
    parts['ram'] = _safe_to_dict(ram)
    total_price += ram['price']
    total_score += ram.get('performance_score', 0)

    # ── 4. GPU — ALWAYS exclude integrated graphics ───────────────────────────
    gpu_df = _exclude_integrated(_filter_by_type(df, 'gpu'))
    gpu    = _pick_best(gpu_df, eff_budget * ratios['gpu'], flexibility)
    parts['gpu'] = _safe_to_dict(gpu)
    total_price += gpu['price']
    total_score += gpu.get('performance_score', 0)

    # ── 5. Remaining parts ────────────────────────────────────────────────────
    for part_type in ('storage', 'psu', 'case', 'cooling'):
        part             = _pick_best(
                               _filter_by_type(df, part_type),
                               eff_budget * ratios.get(part_type, 0.05),
                               flexibility
                           )
        parts[part_type] = _safe_to_dict(part)
        total_price     += part['price']
        total_score     += part.get('performance_score', 0)

    issues = _analyse_bottleneck(parts)

    return {
        'parts':        parts,
        'totalPrice':   round(total_price, 2),
        'ai_score':     round(total_score, 2),
        'strategy':     strategy,
        'label':        cfg['label'],
        'description':  cfg['description'],
        'targetBudget': round(eff_budget, 2),
        'budgetDelta':  round(total_price - budget, 2),  # negative = under budget
        'issues':       issues,                           # bottleneck warnings
        'withinBudget': total_price <= eff_budget,
    }

# ─────────────────────────────────────────────────────────────────────────────
# DataFrame Pre-processor
# ─────────────────────────────────────────────────────────────────────────────
def _build_dataframe(db_parts: list) -> pd.DataFrame:
    df = pd.DataFrame(db_parts)
    if df.empty:
        return df

    for col in ('price', 'performance', 'performance_score'):
        if col in df.columns:
            df[col] = pd.to_numeric(df[col], errors='coerce').fillna(0)

    if 'performance_score' not in df.columns:
        df['performance_score'] = df['performance'] if 'performance' in df.columns else 0

    for col in ('category', 'part', 'type'):
        if col in df.columns:
            df[f'norm_{col}'] = df[col].astype(str).str.lower().str.strip()

    for col in ('socket', 'ramType'):
        if col not in df.columns:
            df[col] = ''

    return df

# ─────────────────────────────────────────────────────────────────────────────
# Entry Point
# ─────────────────────────────────────────────────────────────────────────────
def optimize_build(data: dict) -> dict:
    request  = data.get('request', {})
    budget   = float(request.get('budget', 0))
    use_case = request.get('useCase', 'General')

    if budget <= 0:
        raise ValueError("Budget must be greater than 0")

    df      = _build_dataframe(data.get('database', []))
    options = {s: generate_build(df, budget, use_case, s) for s in STRATEGIES}

    # Sanity check: future_proof must cost more than performance
    if options['future_proof']['totalPrice'] <= options['performance']['totalPrice']:
        options['future_proof']['label']       = 'Future Proof (limited stock)'
        options['future_proof']['description'] = 'Newer platform selected; upgrade GPU when available'

    return {
        'status':     'success',
        'userBudget': budget,
        'useCase':    use_case,
        'options':    options,
        'summary': {
            s: {
                'label':        options[s]['label'],
                'description':  options[s]['description'],
                'totalPrice':   options[s]['totalPrice'],
                'ai_score':     options[s]['ai_score'],
                'budgetDelta':  options[s]['budgetDelta'],
                'withinBudget': options[s]['withinBudget'],
                'issueCount':   len(options[s]['issues']),
            }
            for s in STRATEGIES
        },
        'reasoning': (
            f"Value ₹{options['value']['totalPrice']:,.0f} "
            f"| Performance ₹{options['performance']['totalPrice']:,.0f} "
            f"| Future Proof ₹{options['future_proof']['totalPrice']:,.0f} "
            f"(user budget ₹{budget:,.0f})"
        ),
    }

# ─────────────────────────────────────────────────────────────────────────────
# JSON Serialiser
# ─────────────────────────────────────────────────────────────────────────────
class NumpyEncoder(json.JSONEncoder):
    def default(self, obj):
        if isinstance(obj, np.integer):
            return int(obj)
        if isinstance(obj, np.floating):
            return None if (np.isnan(obj) or np.isinf(obj)) else float(obj)
        if isinstance(obj, float):
            return None if (np.isnan(obj) or np.isinf(obj)) else obj
        if isinstance(obj, np.ndarray):
            return obj.tolist()
        # Catch-all for ObjectId, datetime, bson types, etc.
        return str(obj)

# ─────────────────────────────────────────────────────────────────────────────
if __name__ == '__main__':
    try:
        raw = sys.stdin.read().strip()
        if not raw:
            raise ValueError("No input received from stdin")
        print(json.dumps(optimize_build(json.loads(raw)), cls=NumpyEncoder))
    except Exception as exc:
        print(json.dumps({'status': 'error', 'message': str(exc)}))
        sys.exit(1)
