const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '';

export const getApiUrl = (path) => {
    // This logic ensures there is never a double slash.
    const cleanPath = path.startsWith('/') ? path.substring(1) : path;
    
    // If API_BASE_URL is empty (like in local dev), the path starts with /api.
    // If it's present, it correctly joins them.
    return `${API_BASE_URL}/api/${cleanPath}`;
};