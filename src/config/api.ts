// API Configuration
export const API_CONFIG = {
  // Set to false to disable all API calls and use mock data
  ENABLE_API: false,
  
  // Base URL for API calls (when enabled)
  BASE_URL: import.meta.env.DEV ? 'http://localhost:4000' : (import.meta.env.VITE_API_BASE || 'http://localhost:4000'),
  
  // Endpoints
  ENDPOINTS: {
    UPDATES: '/api/updates',
    START_EXAM: '/api/start',
    SUBMIT_EXAM: '/api/submit'
  }
};

// Helper function to make API calls with fallback to mock data
export const apiCall = async (endpoint: string, options?: RequestInit) => {
  if (!API_CONFIG.ENABLE_API) {
    console.log(`API disabled - using mock data for ${endpoint}`);
    return null;
  }
  
  try {
    const response = await fetch(`${API_CONFIG.BASE_URL}${endpoint}`, options);
    if (!response.ok) {
      throw new Error(`API call failed: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error(`API call to ${endpoint} failed:`, error);
    return null;
  }
};

// Image placeholder utility
export const getImageUrl = (width: number, height: number, category?: string): string => {
  // Use a simple SVG placeholder that doesn't require external API
  const colors = {
    technology: '#2563eb',
    careers: '#059669',
    skills: '#f59e0b',
    environment: '#10b981',
    education: '#7c3aed',
    wellness: '#ec4899',
    default: '#6b7280'
  };
  
  const color = colors[category as keyof typeof colors] || colors.default;
  
  return `data:image/svg+xml;base64,${btoa(`
    <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
      <rect width="100%" height="100%" fill="${color}20"/>
      <rect x="20" y="20" width="${width-40}" height="${height-40}" fill="${color}" rx="8"/>
      <text x="50%" y="50%" text-anchor="middle" dy=".3em" fill="white" font-family="Arial, sans-serif" font-size="12" font-weight="bold">
        ${category || 'Image'}
      </text>
    </svg>
  `)}`;
};