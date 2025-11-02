// College data service for loading and managing college information

export interface College {
  id: number;
  name: string;
  address: string;
  type: string;
  latitude: number;
  longitude: number;
}

export const loadCollegeData = async (): Promise<College[]> => {
  try {
    console.log('🏫 Loading college data from JSON file...');
    
    const response = await fetch('/jk_govt_colleges_148.json', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch college data: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    
    if (!Array.isArray(data)) {
      throw new Error('Invalid data format: Expected array of colleges');
    }

    // Ensure each college has proper structure and ID
    const processedColleges = data.map((college: any, index: number) => ({
      id: college.id || index + 1,
      name: college.name || `College ${index + 1}`,
      address: college.address || 'Address not available',
      type: college.type || 'Government College',
      latitude: parseFloat(college.latitude) || 0,
      longitude: parseFloat(college.longitude) || 0
    }));

    console.log('✅ College data processed successfully:', processedColleges.length, 'colleges');
    return processedColleges;
    
  } catch (error) {
    console.error('❌ Error loading college data:', error);
    
    // Return fallback data
    const fallbackColleges: College[] = [
      {
        id: 1,
        name: "Government Degree College, Jammu",
        address: "Jammu, Jammu & Kashmir, India",
        type: "Government College",
        latitude: 32.7236,
        longitude: 74.8585
      },
      {
        id: 2,
        name: "Government Degree College, Srinagar",
        address: "Srinagar, Jammu & Kashmir, India",
        type: "Government College",
        latitude: 34.0837,
        longitude: 74.7973
      },
      {
        id: 3,
        name: "Government Degree College, Anantnag",
        address: "Anantnag, Jammu & Kashmir, India",
        type: "Government College",
        latitude: 33.7311,
        longitude: 75.1480
      }
    ];
    
    console.log('⚠️ Using fallback college data:', fallbackColleges.length, 'colleges');
    return fallbackColleges;
  }
};

export const searchColleges = (colleges: College[], searchTerm: string): College[] => {
  if (!searchTerm.trim()) return colleges;
  
  const term = searchTerm.toLowerCase().trim();
  return colleges.filter(college =>
    college.name.toLowerCase().includes(term) ||
    college.address.toLowerCase().includes(term) ||
    college.type.toLowerCase().includes(term)
  );
};

export const filterCollegesByLocation = (colleges: College[], location: string): College[] => {
  if (location === 'all') return colleges;
  
  return colleges.filter(college =>
    college.address.toLowerCase().includes(location.toLowerCase())
  );
};

export const filterCollegesByType = (colleges: College[], type: string): College[] => {
  if (type === 'all') return colleges;
  
  return colleges.filter(college =>
    college.type.toLowerCase().includes(type.toLowerCase())
  );
};