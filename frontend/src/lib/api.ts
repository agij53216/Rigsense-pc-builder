const API_BASE_URL = 'http://localhost:3001/api';

export interface ComponentFilter {
    category?: string;
    tier?: string;
    minPrice?: number;
    maxPrice?: number;
    brand?: string[];
    inStock?: boolean;
    search?: string;
    sort?: string;
    // Compatibility
    socket?: string;
    ramType?: string;
    formFactor?: string;
}

export interface AlternativeBuilds {
    [key: string]: {
        build: any;
        totalPrice?: number;
        cost?: number; // legacy
        savings?: number; // legacy
        score?: number;
        difference: string;
    } | undefined;
}

export async function fetchComponents(filter: ComponentFilter) {
    const params = new URLSearchParams();
    if (filter.category) params.append('category', filter.category);
    if (filter.tier) params.append('tier', filter.tier);
    if (filter.minPrice) params.append('minPrice', filter.minPrice.toString());
    if (filter.maxPrice) params.append('maxPrice', filter.maxPrice.toString());
    if (filter.brand && filter.brand.length > 0) params.append('brand', filter.brand.join(','));
    if (filter.inStock) params.append('inStock', 'true');
    if (filter.search) params.append('search', filter.search);
    if (filter.sort) params.append('sort', filter.sort);
    // Compatibility
    if (filter.socket) params.append('socket', filter.socket);
    if (filter.ramType) params.append('ramType', filter.ramType);
    if (filter.formFactor) params.append('formFactor', filter.formFactor);

    const res = await fetch(`${API_BASE_URL}/components?${params.toString()}`);
    if (!res.ok) throw new Error('Failed to fetch components');
    const data = await res.json();

    // Map backend response to frontend interface
    return data.map((item: any) => ({
        ...item,
        performance: item.performance_score || item.performance || 0,
        // Ensure other fields are present or defaulted
        imageUrl: item.imageUrl || '',
        specs: item.specs || {},
        id: item._id || item.id // Ensure ID is consistent
    }));
}

export async function fetchBrands(category: string) {
    const res = await fetch(`${API_BASE_URL}/components/brands?category=${category}`);
    if (!res.ok) throw new Error('Failed to fetch brands');
    return res.json();
}

export async function fetchPresets() {
    const res = await fetch(`${API_BASE_URL}/presets`);
    if (!res.ok) throw new Error('Failed to fetch presets');
    const data = await res.json();
    // Normalize data to ensure consistent shape
    return data.map((preset: any) => ({
        ...preset,
        id: preset._id || preset.id,
        price: preset.totalPrice || preset.price || 0,
    }));
}

export async function fetchPresetById(id: string) {
    const res = await fetch(`${API_BASE_URL}/presets/${id}`);
    if (!res.ok) throw new Error('Failed to fetch preset');
    return res.json();
}

export async function calculateBuild(components: any, useCase?: string) {
    const res = await fetch(`${API_BASE_URL}/builds/calculate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ components, useCase }),
    });
    if (!res.ok) throw new Error('Failed to calculate build');
    return res.json();
}

export async function generateBuild(budget: number, useCase: string, performancePreference: number) {
    const res = await fetch(`${API_BASE_URL}/builds/generate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ budget, useCase, performancePreference }),
    });
    if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.message || errorData.details || 'Failed to generate build');
    }
    return res.json();
}

export async function validateBuild(components: any, budget: number, useCase: string, performancePreference: number) {
    const res = await fetch(`${API_BASE_URL}/builds/validate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ components, budget, useCase, performancePreference }),
    });
    if (!res.ok) throw new Error('Failed to validate build');
    return res.json();
}

export async function fetchSavedBuilds(guestId?: string) {
    let url = `${API_BASE_URL}/builds`;
    if (guestId) url += `?guestId=${guestId}`;

    const res = await fetch(url);
    if (!res.ok) throw new Error('Failed to fetch saved builds');
    const data = await res.json();
    // Normalize _id -> id so delete/compare logic works consistently
    return data.map((b: any) => ({ ...b, id: b._id || b.id }));
}

export async function saveBuildApi(buildData: any, guestId?: string) {
    const res = await fetch(`${API_BASE_URL}/builds`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...buildData, guestId }),
    });
    if (!res.ok) throw new Error('Failed to save build');
    return res.json();
}

export async function deleteBuildApi(id: string, guestId?: string) {
    let url = `${API_BASE_URL}/builds/${id}`;
    if (guestId) url += `?guestId=${guestId}`;

    const res = await fetch(url, { method: 'DELETE' });
    if (!res.ok) throw new Error('Failed to delete build');
    return res.json();
}
