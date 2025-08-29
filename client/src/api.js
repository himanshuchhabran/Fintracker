
// A central place to manage the API base URL.
// Vite exposes environment variables on the `import.meta.env` object.
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '';

export const getApiUrl = (path) => {
    // If the path already starts with /api, we don't need to add it again.
    const cleanPath = path.startsWith('/') ? path.substring(1) : path;
    return `${API_BASE_URL}/api/${cleanPath}`;
};