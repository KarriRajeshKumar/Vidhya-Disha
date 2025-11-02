import { Layout } from "@/components/layout/Layout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { useEffect, useState } from "react";
import { Search, MapPin, Book, DollarSign, Grid, List, Eye, Navigation, Award, Users } from "lucide-react";
import CollegeDetailsModal from "@/components/college/CollegeDetailsModal";
import CollegeLocationModal from "@/components/college/CollegeLocationModal";

interface College {
  id: number;
  name: string;
  address: string;
  type: string;
  latitude: number;
  longitude: number;
}

export default function MapPage() {
  const [colleges, setColleges] = useState<College[]>([]);
  const [filteredColleges, setFilteredColleges] = useState<College[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [locationFilter, setLocationFilter] = useState("all");
  const [courseFilter, setCourseFilter] = useState("all");
  const [feeFilter, setFeeFilter] = useState("all");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [selectedCollege, setSelectedCollege] = useState<College | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLocationModalOpen, setIsLocationModalOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Dynamic dropdown options based on loaded data
  const getUniqueLocations = () => {
    const locations = colleges.map(college => {
      // Extract city from address (assuming format: "City, State, Country")
      const addressParts = college.address.split(',');
      return addressParts[0]?.trim() || '';
    });
    return [...new Set(locations)].filter(Boolean).sort();
  };

  const getUniqueCollegeTypes = () => {
    const types = colleges.map(college => college.type);
    return [...new Set(types)].filter(Boolean).sort();
  };

  const getFeeRanges = () => {
    // Generate fee ranges based on the dummy fee function
    const feeRanges = [
      { value: "low", label: "Under ₹1k", min: 0, max: 999 },
      { value: "medium", label: "₹1k–₹2k", min: 1000, max: 1999 },
      { value: "high", label: "₹2k+", min: 2000, max: Infinity }
    ];
    return feeRanges;
  };

  const images = [
    '/marker1.png',
    '/marker2.png',
    '/marker3.png',
    '/marker4.png',
    '/marker5.png',
    '/marker6.png',
    '/marker7.png',
    '/marker8.png',
  ];

  useEffect(() => {
    const fetchColleges = async () => {
      try {
        console.log('🏫 Fetching college data...');
        const response = await fetch('/random_100_colleges.json');
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        console.log('📊 College data loaded:', data.length, 'colleges');
        
        // Ensure each college has an ID
        const collegesWithIds = data.map((college: any, index: number) => ({
          ...college,
          id: college.id || index + 1
        }));
        
        setColleges(collegesWithIds);
        setFilteredColleges(collegesWithIds);
        console.log('✅ Colleges loaded successfully:', collegesWithIds.length);
      } catch (error) {
        console.error('❌ Error fetching colleges:', error);
        setError('Failed to load college data. Please refresh the page.');
        
        // Fallback: Create some sample data if fetch fails
        const fallbackColleges = [
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
          }
        ];
        
        setColleges(fallbackColleges);
        setFilteredColleges(fallbackColleges);
        console.log('⚠️ Using fallback college data');
      } finally {
        setLoading(false);
      }
    };

    fetchColleges();
  }, []);

  useEffect(() => {
    let filtered = colleges;

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(college =>
        college.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        college.address.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Location filter
    if (locationFilter !== "all") {
      filtered = filtered.filter(college => {
        const cityFromAddress = college.address.split(',')[0]?.trim() || '';
        return cityFromAddress.toLowerCase() === locationFilter.toLowerCase();
      });
    }

    // Course filter (filter by college type)
    if (courseFilter !== "all") {
      filtered = filtered.filter(college =>
        college.type.toLowerCase() === courseFilter.toLowerCase()
      );
    }

    // Fee filter based on dummy fee calculation
    if (feeFilter !== "all") {
      const feeRanges = getFeeRanges();
      const selectedRange = feeRanges.find(range => range.value === feeFilter);
      if (selectedRange) {
        filtered = filtered.filter(college => {
          const fee = getDummyAdmissionFee(college.id);
          return fee >= selectedRange.min && fee <= selectedRange.max;
        });
      }
    }

    setFilteredColleges(filtered);
  }, [colleges, searchTerm, locationFilter, courseFilter, feeFilter]);

  const getImageForCollege = (college: College) => {
    const cities = ['Jammu', 'Srinagar', 'Anantnag', 'Baramulla', 'Budgam', 'Kupwara', 'Pulwama', 'Shopian'];
    const cityIndex = cities.findIndex(city => college.name.includes(city));
    return images[cityIndex !== -1 ? cityIndex : college.id % 8];
  };

  const getDummyAdmissionFee = (id: number) => {
    const fees = [500, 1000, 1500, 2000, 2500];
    return fees[id % fees.length];
  };

  const getDummyCourses = (id: number) => {
    const courseCounts = [12, 15, 18, 20, 22];
    return courseCounts[id % courseCounts.length];
  };

  const getDummyFeaturedCourses = (id: number) => {
    const courses = [
      ['BCA', 'MCA', 'B.Tech'],
      ['BA', 'MA', 'B.Sc'],
      ['B.Com', 'M.Com', 'MBA'],
      ['MBBS', 'BDS', 'Nursing'],
      ['Law', 'Journalism', 'Education']
    ];
    return courses[id % courses.length];
  };

  const getDummyInfra = (id: number) => {
    const infras = [
      ['Library', 'Hostel', 'Wi-Fi'],
      ['Labs', 'Sports', 'Cafeteria'],
      ['Auditorium', 'Gym', 'Parking'],
      ['Medical', 'Security', 'Transport'],
      ['Internet', 'AC Classrooms', 'Playground']
    ];
    return infras[id % infras.length];
  };

  if (loading) {
    return (
      <Layout>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center py-12">
            <div className="w-16 h-16 border-4 border-primary/30 border-t-primary rounded-full animate-spin mx-auto mb-4"></div>
            <h2 className="text-xl font-semibold text-foreground mb-2">Loading College Data</h2>
            <p className="text-muted-foreground">Fetching information for 148+ government colleges...</p>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero Section */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-4">
            Discover Your Perfect College
          </h1>
          <p className="text-xl text-muted-foreground mb-6 max-w-3xl mx-auto">
            Explore government degree colleges across Jammu & Kashmir. Find detailed information about courses,
            facilities, placement records, and admission processes to make an informed decision about your future.
          </p>
          <div className="flex flex-wrap justify-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center">
              <Book className="w-4 h-4 mr-2 text-primary" />
              <span>148+ Colleges</span>
            </div>
            <div className="flex items-center">
              <Users className="w-4 h-4 mr-2 text-primary" />
              <span>Detailed Information</span>
            </div>
            <div className="flex items-center">
              <MapPin className="w-4 h-4 mr-2 text-primary" />
              <span>Location Services</span>
            </div>
            <div className="flex items-center">
              <Award className="w-4 h-4 mr-2 text-primary" />
              <span>Placement Data</span>
            </div>
          </div>
        </div>

        {/* Smart Filters */}
        <div className="bg-gradient-to-r from-green-800/50 to-emerald-800/50 backdrop-blur-sm rounded-2xl p-6 mb-8 border border-green-500/20">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search colleges..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-white/10 border-white/20 text-white placeholder:text-white/60"
              />
            </div>
            <Select value={locationFilter} onValueChange={setLocationFilter}>
              <SelectTrigger className="bg-white/10 border-white/20 text-white">
                <MapPin className="w-4 h-4 mr-2" />
                <SelectValue placeholder="Location" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Locations</SelectItem>
                {getUniqueLocations().map((location) => (
                  <SelectItem key={location} value={location.toLowerCase()}>
                    {location}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={courseFilter} onValueChange={setCourseFilter}>
              <SelectTrigger className="bg-white/10 border-white/20 text-white">
                <Book className="w-4 h-4 mr-2" />
                <SelectValue placeholder="College Types" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                {getUniqueCollegeTypes().map((type) => (
                  <SelectItem key={type} value={type.toLowerCase()}>
                    {type}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={feeFilter} onValueChange={setFeeFilter}>
              <SelectTrigger className="bg-white/10 border-white/20 text-white">
                <DollarSign className="w-4 h-4 mr-2" />
                <SelectValue placeholder="Fee Range" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Ranges</SelectItem>
                {getFeeRanges().map((range) => (
                  <SelectItem key={range.value} value={range.value}>
                    {range.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Error Notice */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
                <MapPin className="w-4 h-4 text-red-600" />
              </div>
              <div>
                <h4 className="font-medium text-red-800">Data Loading Issue</h4>
                <p className="text-sm text-red-600">{error}</p>
              </div>
            </div>
          </div>
        )}

        {/* Results Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
          <h2 className="text-2xl font-bold text-foreground mb-4 sm:mb-0">
            {filteredColleges.length} Colleges Found
            {error && <span className="text-sm text-red-600 ml-2">(Using fallback data)</span>}
          </h2>
          <div className="flex items-center space-x-4">
            <div className="flex bg-muted rounded-lg p-1">
              <Button
                variant={viewMode === "grid" ? "default" : "ghost"}
                size="sm"
                onClick={() => setViewMode("grid")}
              >
                <Grid className="w-4 h-4" />
              </Button>
              <Button
                variant={viewMode === "list" ? "default" : "ghost"}
                size="sm"
                onClick={() => setViewMode("list")}
              >
                <List className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* College Cards */}
        <div className={viewMode === "grid"
          ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          : "space-y-4"
        }>
          {filteredColleges.map((college) => (
            <Card key={college.id} className="bg-card border-border shadow-card hover:shadow-card-lg transition-shadow overflow-hidden">
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <img
                      src={getImageForCollege(college)}
                      alt="College"
                      className="w-12 h-12 rounded-lg object-contain bg-muted p-2"
                      onError={(e) => {
                        e.currentTarget.src = '/placeholder.svg';
                      }}
                    />
                    <div>
                      <h3 className="text-lg font-semibold text-foreground line-clamp-2">{college.name}</h3>
                      <p className="text-sm text-muted-foreground flex items-center">
                        <MapPin className="w-3 h-3 mr-1" />
                        {college.address}
                      </p>
                    </div>
                  </div>
                  <Badge className="bg-primary/10 text-primary border-primary/20">
                    #{college.id}
                  </Badge>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="text-center">
                    <p className="text-2xl font-bold text-foreground">₹{getDummyAdmissionFee(college.id).toLocaleString()}</p>
                    <p className="text-xs text-muted-foreground">Admission Fee</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-foreground">{getDummyCourses(college.id)}</p>
                    <p className="text-xs text-muted-foreground">Courses</p>
                  </div>
                </div>

                <div className="mb-4">
                  <p className="text-sm text-foreground mb-2">Featured Courses:</p>
                  <div className="flex flex-wrap gap-1">
                    {getDummyFeaturedCourses(college.id).slice(0, 3).map((course, idx) => (
                      <Badge key={idx} variant="secondary" className="bg-primary/10 text-primary border-primary/20 text-xs">
                        {course}
                      </Badge>
                    ))}
                    {getDummyFeaturedCourses(college.id).length > 3 && (
                      <Badge variant="secondary" className="bg-primary/10 text-primary border-primary/20 text-xs">
                        +{getDummyFeaturedCourses(college.id).length - 3}
                      </Badge>
                    )}
                  </div>
                </div>

                <div className="mb-4">
                  <p className="text-sm text-foreground mb-2">Infrastructure:</p>
                  <div className="flex flex-wrap gap-1">
                    {getDummyInfra(college.id).map((item, idx) => (
                      <Badge key={idx} variant="outline" className="border-border text-muted-foreground text-xs">
                        {item}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div className="flex space-x-2">
                  <Button
                    className="flex-1 bg-primary hover:bg-primary/90"
                    onClick={() => {
                      setSelectedCollege(college);
                      setIsModalOpen(true);
                    }}
                  >
                    <Eye className="w-4 h-4 mr-2" />
                    Details
                  </Button>
                  <Button
                    variant="outline"
                    className="border-border text-foreground hover:bg-muted"
                    onClick={() => {
                      setSelectedCollege(college);
                      setIsLocationModalOpen(true);
                    }}
                  >
                    <Navigation className="w-4 h-4 mr-2" />
                    Locate
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>

        <CollegeLocationModal
          college={selectedCollege}
          isOpen={isLocationModalOpen}
          onClose={() => {
            setIsLocationModalOpen(false);
            setSelectedCollege(null);
          }}
        />

        <CollegeDetailsModal
          college={selectedCollege}
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            setSelectedCollege(null);
          }}
        />
      </div>
    </Layout>
  );
}