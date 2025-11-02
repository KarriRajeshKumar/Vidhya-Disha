// Utility to provide fallback images instead of placeholder API calls
export const getPlaceholderImage = (width: number, height: number, category?: string): string => {
  // Using a reliable placeholder service that doesn't require API calls
  const baseUrl = 'https://via.placeholder.com';
  
  // Color schemes based on category
  const colorSchemes = {
    technology: '2563eb/ffffff',
    careers: '059669/ffffff', 
    skills: 'f59e0b/ffffff',
    environment: '10b981/ffffff',
    education: '7c3aed/ffffff',
    wellness: 'ec4899/ffffff',
    profile: '6b7280/ffffff',
    project: '3b82f6/ffffff',
    default: '6b7280/ffffff'
  };
  
  const colorScheme = colorSchemes[category as keyof typeof colorSchemes] || colorSchemes.default;
  
  return `${baseUrl}/${width}x${height}/${colorScheme}?text=${category || 'Image'}`;
};

// Alternative: Use Unsplash for more realistic images (requires internet)
export const getUnsplashImage = (width: number, height: number, category?: string): string => {
  const categories = {
    technology: 'technology,computer',
    careers: 'business,office',
    skills: 'education,learning',
    environment: 'nature,environment',
    education: 'education,books',
    wellness: 'wellness,health',
    profile: 'person,portrait',
    project: 'work,project',
    default: 'abstract'
  };
  
  const searchTerm = categories[category as keyof typeof categories] || categories.default;
  return `https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=${width}&h=${height}&fit=crop&q=80`;
};

// Fallback for when no internet connection
export const getLocalFallback = (width: number, height: number): string => {
  return `data:image/svg+xml;base64,${btoa(`
    <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
      <rect width="100%" height="100%" fill="#f3f4f6"/>
      <text x="50%" y="50%" text-anchor="middle" dy=".3em" fill="#6b7280" font-family="Arial, sans-serif" font-size="14">
        ${width}×${height}
      </text>
    </svg>
  `)}`;
};