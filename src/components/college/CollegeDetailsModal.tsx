import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  MapPin,
  Star,
  Users,
  UserCheck,
  TrendingUp,
  BookOpen,
  Eye,
  Navigation,
  Calendar,
  University,
  Award,
  Building,
  Wifi,
  Activity,
  Heart,
  Mail,
  Phone,
  Send,
  GraduationCap,
  Microscope,
  Target,
  Briefcase,
  Home,
  Library,
  FlaskConical,
  Gamepad2,
  Stethoscope,
  DollarSign
} from "lucide-react";

interface College {
  id: number;
  name: string;
  address: string;
  type: string;
  latitude: number;
  longitude: number;
}

interface CollegeDetailsModalProps {
  college: College | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function CollegeDetailsModal({ college, isOpen, onClose }: CollegeDetailsModalProps) {
  const [activeTab, setActiveTab] = useState("overview");

  if (!college) return null;

  // Generate realistic data based on college information
  const getCollegeDetails = (college: College) => {
    const baseYear = 1980 + (college.id % 40); // Established between 1980-2020
    const universities = ["University of Jammu", "University of Kashmir", "Cluster University", "Barkatullah University"];
    const university = universities[college.id % universities.length];

    const ratings = [4.1, 4.2, 4.3, 4.4, 4.5, 3.8, 3.9, 4.0];
    const rating = ratings[college.id % ratings.length];

    const principals = ["Dr. Rajesh Kumar", "Dr. Priya Sharma", "Dr. Ahmed Hassan", "Dr. Meera Singh", "Dr. Vikram Joshi"];
    const principal = principals[college.id % principals.length];

    const studentCounts = [1200, 1800, 2200, 2800, 1500, 2000, 2500, 3000];
    const students = studentCounts[college.id % studentCounts.length];

    const facultyCounts = [45, 67, 89, 112, 78, 95, 134, 156];
    const faculty = facultyCounts[college.id % facultyCounts.length];

    const placementRates = [78, 82, 85, 88, 91, 75, 79, 86];
    const placementRate = placementRates[college.id % placementRates.length];

    const libraryBooks = [25000, 35000, 45000, 55000, 30000, 40000, 50000, 60000];
    const books = libraryBooks[college.id % libraryBooks.length];

    const courseSets = [
      ["B.Sc", "M.Sc", "BCA", "MCA"],
      ["BA", "MA", "B.Com", "M.Com"],
      ["B.Tech", "M.Tech", "Diploma"],
      ["MBBS", "BDS", "Nursing", "Pharmacy"],
      ["LLB", "LLM", "BA LLB"]
    ];
    const courses = courseSets[college.id % courseSets.length];

    const researchPapers = [45, 67, 89, 123, 156, 78, 92, 134];
    const papers = researchPapers[college.id % researchPapers.length];

    const activeProjects = [3, 5, 7, 9, 12, 4, 6, 8];
    const projects = activeProjects[college.id % activeProjects.length];

    const researchAreasList = [
      ["Physics", "Chemistry", "Mathematics"],
      ["Computer Science", "Electronics"],
      ["Botany", "Zoology", "Biotechnology"],
      ["History", "Political Science", "Sociology"],
      ["Commerce", "Economics", "Management"]
    ];
    const researchAreas = researchAreasList[college.id % researchAreasList.length];

    const phdAvailable = college.id % 3 !== 0; // Most colleges have PhD

    const highestPackages = [800000, 1000000, 1200000, 1500000, 600000, 900000, 1100000];
    const highestPackage = highestPackages[college.id % highestPackages.length];

    const averagePackages = [300000, 350000, 400000, 450000, 250000, 320000, 380000];
    const averagePackage = averagePackages[college.id % averagePackages.length];

    const recruiterSets = [
      ["TCS", "Infosys", "Wipro", "HCL"],
      ["Accenture", "IBM", "Microsoft", "Google"],
      ["Amazon", "Flipkart", "Paytm", "Ola"],
      ["Jio", "Airtel", "Vodafone", "Reliance"]
    ];
    const recruiters = recruiterSets[college.id % recruiterSets.length];

    const facilities = [
      { name: "Hostel", icon: Home },
      { name: "Central Library", icon: Library },
      { name: "Computer Labs", icon: FlaskConical },
      { name: "Wi-Fi Campus", icon: Wifi },
      { name: "Sports Complex", icon: Activity },
      { name: "Medical Center", icon: Heart }
    ];

    const eligibility = college.type.includes("Engineering") ?
      "10+2 with minimum 50% marks in PCM, JEE Main qualified" :
      college.type.includes("Medical") ?
      "10+2 with minimum 50% marks in PCB, NEET qualified" :
      "10+2 with minimum 45% marks in relevant subjects";

    const cutoffMarks = college.type.includes("Engineering") ?
      "JEE Main: 60-80 percentile, State CET: 100-150 marks" :
      college.type.includes("Medical") ?
      "NEET: 300-400 marks" :
      "State Board: 60-75% aggregate";

    const admissionProcess = [
      "Online Application through official website",
      "Entrance Exam (if applicable)",
      "Merit list preparation",
      "Document verification and fee payment"
    ];

    const admissionFee = 500 + (college.id % 5) * 1000; // 500 to 2500
    const annualFee = 45000 + (college.id % 5) * 10000; // 45000 to 85000

    const scholarships = "Merit-based scholarships, SC/ST/OBC scholarships, Sports quota scholarships available";

    const phone = `+91-191-${2450000 + (college.id * 123) % 999999}`;
    const email = `info@${college.name.toLowerCase().replace(/\s+/g, '')}.edu`;

    const keyFeatures = [
      "Government College with affordable education",
      "Experienced faculty and modern facilities",
      "Good placement record",
      "Research opportunities available",
      "Sports and cultural activities"
    ];

    return {
      established: baseYear,
      university,
      rating,
      principal,
      students,
      faculty,
      placementRate,
      libraryBooks: books,
      courses,
      researchPapers: papers,
      activeProjects: projects,
      researchAreas,
      phdAvailable,
      highestPackage,
      averagePackage,
      recruiters,
      facilities,
      eligibility,
      cutoffMarks,
      admissionProcess,
      scholarships,
      admissionFee,
      annualFee,
      phone,
      email,
      keyFeatures
    };
  };

  const collegeDetails = getCollegeDetails(college);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          {/* Header Section */}
          <div className="relative h-48 bg-gradient-to-r from-blue-600 to-green-600 rounded-lg overflow-hidden">
            <div className="absolute inset-0 bg-black/30" />
            <div className="absolute bottom-4 left-4 text-white">
              <DialogTitle className="text-2xl font-bold mb-2">{college.name}</DialogTitle>
              <div className="flex items-center space-x-4 mb-2">
                <div className="flex items-center">
                  <MapPin className="w-4 h-4 mr-1" />
                  <span>{college.address}</span>
                </div>
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-4 h-4 ${i < Math.floor(collegeDetails.rating) ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
                    />
                  ))}
                  <span className="ml-1">{collegeDetails.rating}</span>
                </div>
                <Badge variant="secondary" className="bg-white/20 text-white border-white/30">
                  {college.type}
                </Badge>
              </div>
              <div className="flex items-center space-x-4">
                <span>Established: {collegeDetails.established}</span>
                <span>Affiliated to: {collegeDetails.university}</span>
                <Button size="sm" className="bg-white/20 hover:bg-white/30 text-white border-white/30">
                  <Navigation className="w-4 h-4 mr-2" />
                  View on Map
                </Button>
              </div>
            </div>
          </div>
        </DialogHeader>

        {/* Quick Stats Section */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-4 rounded-xl border border-blue-200">
            <div className="flex items-center justify-center mb-2">
              <Users className="w-6 h-6 text-blue-600" />
            </div>
            <div className="text-center">
              <div className="text-xl font-bold text-blue-900">{collegeDetails.students.toLocaleString()}</div>
              <div className="text-xs text-blue-700 font-medium">Students</div>
            </div>
          </div>
          <div className="bg-gradient-to-br from-green-50 to-green-100 p-4 rounded-xl border border-green-200">
            <div className="flex items-center justify-center mb-2">
              <UserCheck className="w-6 h-6 text-green-600" />
            </div>
            <div className="text-center">
              <div className="text-xl font-bold text-green-900">{collegeDetails.faculty}</div>
              <div className="text-xs text-green-700 font-medium">Faculty</div>
            </div>
          </div>
          <div className="bg-gradient-to-br from-emerald-50 to-emerald-100 p-4 rounded-xl border border-emerald-200">
            <div className="flex items-center justify-center mb-2">
              <TrendingUp className="w-6 h-6 text-emerald-600" />
            </div>
            <div className="text-center">
              <div className="text-xl font-bold text-emerald-900">{collegeDetails.placementRate}%</div>
              <div className="text-xs text-emerald-700 font-medium">Placement</div>
            </div>
          </div>
          <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-4 rounded-xl border border-purple-200">
            <div className="flex items-center justify-center mb-2">
              <BookOpen className="w-6 h-6 text-purple-600" />
            </div>
            <div className="text-center">
              <div className="text-xl font-bold text-purple-900">{(collegeDetails.libraryBooks / 1000).toFixed(0)}K</div>
              <div className="text-xs text-purple-700 font-medium">Books</div>
            </div>
          </div>
        </div>

        {/* Tabbed Navigation */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="academics">Academics</TabsTrigger>
            <TabsTrigger value="placement">Placement</TabsTrigger>
            <TabsTrigger value="facilities">Facilities</TabsTrigger>
            <TabsTrigger value="admission">Admission</TabsTrigger>
            <TabsTrigger value="contact">Contact</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200">
                <CardHeader>
                  <CardTitle className="flex items-center text-blue-900">
                    <UserCheck className="w-5 h-5 mr-2" />
                    Principal Information
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div>
                      <p className="text-lg font-semibold text-blue-900">{collegeDetails.principal}</p>
                      <p className="text-sm text-blue-700">Principal & Director</p>
                    </div>
                    <div className="grid grid-cols-2 gap-4 pt-3 border-t border-blue-200">
                      <div>
                        <p className="text-sm text-blue-600">Established</p>
                        <p className="font-semibold text-blue-900">{collegeDetails.established}</p>
                      </div>
                      <div>
                        <p className="text-sm text-blue-600">Affiliated To</p>
                        <p className="font-semibold text-blue-900 text-sm">{collegeDetails.university}</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-green-50 to-emerald-50 border-green-200">
                <CardHeader>
                  <CardTitle className="flex items-center text-green-900">
                    <Award className="w-5 h-5 mr-2" />
                    College Rating & Accreditation
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center space-x-2">
                      <div className="flex">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`w-5 h-5 ${i < Math.floor(collegeDetails.rating) ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
                          />
                        ))}
                      </div>
                      <span className="text-lg font-semibold text-green-900">{collegeDetails.rating}/5.0</span>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm text-green-700">NAAC Grade</span>
                        <Badge className="bg-green-100 text-green-800">A+</Badge>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-green-700">Recognition</span>
                        <Badge className="bg-blue-100 text-blue-800">UGC Approved</Badge>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card className="bg-gradient-to-br from-purple-50 to-pink-50 border-purple-200">
              <CardHeader>
                <CardTitle className="flex items-center text-purple-900">
                  <Building className="w-5 h-5 mr-2" />
                  Key Features & Highlights
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {collegeDetails.keyFeatures.map((feature, index) => (
                    <div key={index} className="flex items-center space-x-3 p-3 bg-white/50 rounded-lg border border-purple-100">
                      <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                      <span className="text-sm text-purple-900">{feature}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card className="text-center bg-gradient-to-br from-orange-50 to-red-50 border-orange-200">
                <CardContent className="p-4">
                  <GraduationCap className="w-8 h-8 mx-auto mb-2 text-orange-600" />
                  <div className="text-2xl font-bold text-orange-900">{collegeDetails.courses.length}</div>
                  <div className="text-sm text-orange-700">Courses Offered</div>
                </CardContent>
              </Card>
              <Card className="text-center bg-gradient-to-br from-cyan-50 to-blue-50 border-cyan-200">
                <CardContent className="p-4">
                  <Microscope className="w-8 h-8 mx-auto mb-2 text-cyan-600" />
                  <div className="text-2xl font-bold text-cyan-900">{collegeDetails.researchPapers}</div>
                  <div className="text-sm text-cyan-700">Research Papers</div>
                </CardContent>
              </Card>
              <Card className="text-center bg-gradient-to-br from-rose-50 to-pink-50 border-rose-200">
                <CardContent className="p-4">
                  <Target className="w-8 h-8 mx-auto mb-2 text-rose-600" />
                  <div className="text-2xl font-bold text-rose-900">{collegeDetails.activeProjects}</div>
                  <div className="text-sm text-rose-700">Active Projects</div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="academics" className="space-y-6">
            <Card className="bg-gradient-to-br from-green-50 to-emerald-50 border-green-200">
              <CardHeader>
                <CardTitle className="flex items-center text-green-900">
                  <BookOpen className="w-5 h-5 mr-2" />
                  Programs & Courses Offered
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                  {collegeDetails.courses.map((course, index) => (
                    <div key={index} className="bg-white p-3 rounded-lg border border-green-200 hover:shadow-md transition-shadow">
                      <div className="flex items-center space-x-2">
                        <GraduationCap className="w-4 h-4 text-green-600" />
                        <span className="font-medium text-green-900">{course}</span>
                      </div>
                      <p className="text-xs text-green-700 mt-1">
                        {course.includes('B.') ? 'Undergraduate Program' :
                         course.includes('M.') ? 'Postgraduate Program' :
                         'Diploma/Certificate Program'}
                      </p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200">
                <CardHeader>
                  <CardTitle className="flex items-center text-blue-900">
                    <Microscope className="w-5 h-5 mr-2" />
                    Research Excellence
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-white p-4 rounded-lg border border-blue-200 text-center">
                      <div className="text-2xl font-bold text-blue-600">{collegeDetails.researchPapers}</div>
                      <div className="text-sm text-blue-700">Published Papers</div>
                    </div>
                    <div className="bg-white p-4 rounded-lg border border-blue-200 text-center">
                      <div className="text-2xl font-bold text-indigo-600">{collegeDetails.activeProjects}</div>
                      <div className="text-sm text-indigo-700">Active Projects</div>
                    </div>
                  </div>

                  <div className="bg-white p-4 rounded-lg border border-blue-200">
                    <h4 className="font-semibold text-blue-900 mb-3">Research Focus Areas</h4>
                    <div className="grid grid-cols-2 gap-2">
                      {collegeDetails.researchAreas.map((area, index) => (
                        <div key={index} className="flex items-center space-x-2">
                          <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                          <span className="text-sm text-blue-800">{area}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center justify-between bg-white p-3 rounded-lg border border-blue-200">
                    <div className="flex items-center space-x-2">
                      <Award className="w-4 h-4 text-blue-600" />
                      <span className="text-sm font-medium text-blue-900">PhD Programs</span>
                    </div>
                    <Badge className={collegeDetails.phdAvailable ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}>
                      {collegeDetails.phdAvailable ? "Available" : "Not Available"}
                    </Badge>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-purple-50 to-pink-50 border-purple-200">
                <CardHeader>
                  <CardTitle className="flex items-center text-purple-900">
                    <Building className="w-5 h-5 mr-2" />
                    Academic Infrastructure
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="grid grid-cols-1 gap-3">
                    <div className="bg-white p-3 rounded-lg border border-purple-200">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <Library className="w-4 h-4 text-purple-600" />
                          <span className="text-sm font-medium text-purple-900">Library</span>
                        </div>
                        <span className="text-sm text-purple-700">{collegeDetails.libraryBooks.toLocaleString()} books</span>
                      </div>
                    </div>

                    <div className="bg-white p-3 rounded-lg border border-purple-200">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <FlaskConical className="w-4 h-4 text-purple-600" />
                          <span className="text-sm font-medium text-purple-900">Laboratories</span>
                        </div>
                        <span className="text-sm text-purple-700">Modern Equipment</span>
                      </div>
                    </div>

                    <div className="bg-white p-3 rounded-lg border border-purple-200">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <Wifi className="w-4 h-4 text-purple-600" />
                          <span className="text-sm font-medium text-purple-900">Digital Infrastructure</span>
                        </div>
                        <span className="text-sm text-purple-700">High-speed Internet</span>
                      </div>
                    </div>

                    <div className="bg-white p-3 rounded-lg border border-purple-200">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <Users className="w-4 h-4 text-purple-600" />
                          <span className="text-sm font-medium text-purple-900">Faculty</span>
                        </div>
                        <span className="text-sm text-purple-700">{collegeDetails.faculty} qualified teachers</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="placement" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card>
                <CardContent className="p-4 text-center">
                  <Target className="w-8 h-8 mx-auto mb-2 text-green-600" />
                  <div className="text-2xl font-bold">{collegeDetails.placementRate}%</div>
                  <div className="text-sm text-muted-foreground">Placed</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 text-center">
                  <Award className="w-8 h-8 mx-auto mb-2 text-blue-600" />
                  <div className="text-2xl font-bold">₹{(collegeDetails.highestPackage / 100000).toFixed(1)}L</div>
                  <div className="text-sm text-muted-foreground">Highest Package</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 text-center">
                  <Briefcase className="w-8 h-8 mx-auto mb-2 text-purple-600" />
                  <div className="text-2xl font-bold">₹{(collegeDetails.averagePackage / 100000).toFixed(1)}L</div>
                  <div className="text-sm text-muted-foreground">Average Package</div>
                </CardContent>
              </Card>
            </div>
            <Card>
              <CardHeader>
                <CardTitle>Top Recruiters</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {collegeDetails.recruiters.map((recruiter, index) => (
                    <Badge key={index} variant="outline" className="text-lg px-3 py-1">
                      {recruiter}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="facilities" className="space-y-4">
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {collegeDetails.facilities.map((facility, index) => {
                const IconComponent = facility.icon;
                return (
                  <Card key={index} className="text-center hover:shadow-md transition-shadow">
                    <CardContent className="p-6">
                      <IconComponent className="w-12 h-12 mx-auto mb-3 text-blue-600" />
                      <h3 className="font-semibold">{facility.name}</h3>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </TabsContent>

          <TabsContent value="admission" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="bg-gradient-to-br from-blue-50 to-cyan-50 border-blue-200">
                <CardHeader>
                  <CardTitle className="flex items-center text-blue-900">
                    <UserCheck className="w-5 h-5 mr-2" />
                    Eligibility Criteria
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="bg-white p-4 rounded-lg border border-blue-200">
                    <p className="text-blue-900 leading-relaxed">{collegeDetails.eligibility}</p>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-orange-50 to-red-50 border-orange-200">
                <CardHeader>
                  <CardTitle className="flex items-center text-orange-900">
                    <Target className="w-5 h-5 mr-2" />
                    Cut-off Marks
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="bg-white p-4 rounded-lg border border-orange-200">
                    <p className="text-orange-900 leading-relaxed">{collegeDetails.cutoffMarks}</p>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card className="bg-gradient-to-br from-green-50 to-emerald-50 border-green-200">
              <CardHeader>
                <CardTitle className="flex items-center text-green-900">
                  <Calendar className="w-5 h-5 mr-2" />
                    Admission Process Timeline
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {collegeDetails.admissionProcess.map((step, index) => (
                      <div key={index} className="flex items-start space-x-4">
                        <div className="flex-shrink-0 w-8 h-8 bg-green-500 text-white rounded-full flex items-center justify-center text-sm font-bold">
                          {index + 1}
                        </div>
                        <div className="bg-white p-4 rounded-lg border border-green-200 flex-1">
                          <p className="text-green-900">{step}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="bg-gradient-to-br from-purple-50 to-pink-50 border-purple-200">
                <CardHeader>
                  <CardTitle className="flex items-center text-purple-900">
                    <Award className="w-5 h-5 mr-2" />
                    Scholarships & Financial Aid
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="bg-white p-4 rounded-lg border border-purple-200">
                    <p className="text-purple-900 leading-relaxed">{collegeDetails.scholarships}</p>
                  </div>
                  <div className="mt-4 space-y-2">
                    <div className="flex justify-between items-center bg-purple-50 p-2 rounded">
                      <span className="text-sm text-purple-700">Merit Scholarship</span>
                      <Badge className="bg-purple-100 text-purple-800">Up to 50%</Badge>
                    </div>
                    <div className="flex justify-between items-center bg-purple-50 p-2 rounded">
                      <span className="text-sm text-purple-700">SC/ST Scholarship</span>
                      <Badge className="bg-purple-100 text-purple-800">Full Fee</Badge>
                    </div>
                    <div className="flex justify-between items-center bg-purple-50 p-2 rounded">
                      <span className="text-sm text-purple-700">Sports Quota</span>
                      <Badge className="bg-purple-100 text-purple-800">25% Waiver</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-indigo-50 to-blue-50 border-indigo-200">
                <CardHeader>
                  <CardTitle className="flex items-center text-indigo-900">
                    <DollarSign className="w-5 h-5 mr-2" />
                    Fee Structure
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="bg-white p-3 rounded-lg border border-indigo-200">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-indigo-700">Admission Fee</span>
                        <span className="font-semibold text-indigo-900">₹{collegeDetails.admissionFee.toLocaleString()}</span>
                      </div>
                    </div>
                    <div className="bg-white p-3 rounded-lg border border-indigo-200">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-indigo-700">Annual Tuition</span>
                        <span className="font-semibold text-indigo-900">₹{collegeDetails.annualFee.toLocaleString()}/year</span>
                      </div>
                    </div>
                    <div className="bg-white p-3 rounded-lg border border-indigo-200">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-indigo-700">Hostel Fee</span>
                        <span className="font-semibold text-indigo-900">₹45,000/year</span>
                      </div>
                    </div>
                    <div className="bg-indigo-100 p-3 rounded-lg border border-indigo-300">
                      <p className="text-xs text-indigo-800">
                        *Fees are subject to change. Please check official website for latest information.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="contact" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <Card className="bg-gradient-to-br from-blue-50 to-cyan-50 border-blue-200 lg:col-span-2">
                <CardHeader>
                  <CardTitle className="flex items-center text-blue-900">
                    <MapPin className="w-5 h-5 mr-2" />
                    College Location & Map
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="mb-4">
                    <h4 className="font-semibold text-blue-900 mb-2">Address</h4>
                    <p className="text-blue-800 leading-relaxed">{college.address}</p>
                  </div>

                  <div className="h-64 bg-white rounded-lg border border-blue-200 overflow-hidden">
                    <iframe
                      src={`https://maps.google.com/maps?q=${college.latitude},${college.longitude}&t=&z=15&ie=UTF8&iwloc=&output=embed`}
                      width="100%"
                      height="100%"
                      style={{ border: 0 }}
                      title={`Map showing ${college.name} location`}
                      loading="lazy"
                    />
                  </div>

                  <div className="mt-4 flex justify-center">
                    <Button
                      variant="outline"
                      onClick={() => window.open(`https://www.google.com/maps?q=${college.latitude},${college.longitude}`, '_blank')}
                      className="border-blue-300 text-blue-700 hover:bg-blue-50"
                    >
                      <Navigation className="w-4 h-4 mr-2" />
                      Open in Google Maps
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <div className="space-y-6">
                <Card className="bg-gradient-to-br from-green-50 to-emerald-50 border-green-200">
                  <CardHeader>
                    <CardTitle className="flex items-center text-green-900">
                      <Phone className="w-5 h-5 mr-2" />
                      Contact Details
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="bg-white p-3 rounded-lg border border-green-200">
                      <div className="flex items-center space-x-3">
                        <Phone className="w-4 h-4 text-green-600" />
                        <div>
                          <p className="text-xs text-green-700">Phone</p>
                          <p className="font-semibold text-green-900">{collegeDetails.phone}</p>
                        </div>
                      </div>
                    </div>

                    <div className="bg-white p-3 rounded-lg border border-green-200">
                      <div className="flex items-center space-x-3">
                        <Mail className="w-4 h-4 text-green-600" />
                        <div>
                          <p className="text-xs text-green-700">Email</p>
                          <p className="font-semibold text-green-900">{collegeDetails.email}</p>
                        </div>
                      </div>
                    </div>

                    <div className="bg-white p-3 rounded-lg border border-green-200">
                      <div className="flex items-center space-x-3">
                        <Calendar className="w-4 h-4 text-green-600" />
                        <div>
                          <p className="text-xs text-green-700">Office Hours</p>
                          <p className="font-semibold text-green-900">Mon-Fri: 9AM-5PM</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-purple-50 to-pink-50 border-purple-200">
                  <CardHeader>
                    <CardTitle className="flex items-center text-purple-900">
                      <Send className="w-5 h-5 mr-2" />
                      Quick Inquiry
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <Input placeholder="Your Name" className="bg-white border-purple-200" />
                    <Input placeholder="Your Email" type="email" className="bg-white border-purple-200" />
                    <Textarea
                      placeholder="Your Message"
                      rows={3}
                      className="bg-white border-purple-200 resize-none"
                    />
                    <Button className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700">
                      <Send className="w-4 h-4 mr-2" />
                      Send Message
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </div>

            <Card className="bg-gradient-to-br from-indigo-50 to-blue-50 border-indigo-200">
              <CardHeader>
                <CardTitle className="flex items-center text-indigo-900">
                  <Building className="w-5 h-5 mr-2" />
                    Additional Information
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-white p-4 rounded-lg border border-indigo-200 text-center">
                      <University className="w-8 h-8 mx-auto mb-2 text-indigo-600" />
                      <h4 className="font-semibold text-indigo-900">Affiliated To</h4>
                      <p className="text-sm text-indigo-700">{collegeDetails.university}</p>
                    </div>

                    <div className="bg-white p-4 rounded-lg border border-indigo-200 text-center">
                      <Award className="w-8 h-8 mx-auto mb-2 text-indigo-600" />
                      <h4 className="font-semibold text-indigo-900">Established</h4>
                      <p className="text-sm text-indigo-700">{collegeDetails.established}</p>
                    </div>

                    <div className="bg-white p-4 rounded-lg border border-indigo-200 text-center">
                      <Users className="w-8 h-8 mx-auto mb-2 text-indigo-600" />
                      <h4 className="font-semibold text-indigo-900">Student Strength</h4>
                      <p className="text-sm text-indigo-700">{collegeDetails.students.toLocaleString()}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}