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
    cheaper?: {
        build: any; // Using any for simplicity as PCComponent type is in data/mockComponents
        savings: number;
        difference: string;
    };
    performance?: {
        build: any;
        cost: number;
        performanceGain: number;
        difference: string;
    };
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
    return res.json();
}

export async function fetchBrands(category: string) {
    const res = await fetch(`${API_BASE_URL}/components/brands?category=${category}`);
    if (!res.ok) throw new Error('Failed to fetch brands');
    return res.json();
}


export async function generateBuild(budget: number, useCase: string, performancePreference: number) {
    const res = await fetch(`${API_BASE_URL}/builds/generate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ budget, useCase, performancePreference }),
    });
    if (!res.ok) throw new Error('Failed to generate build');
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
