import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Target, Bot, Users, Trophy, Globe, Brain, BookOpen, GraduationCap, Play, Star, Award, Facebook, Twitter, Instagram, Youtube, Sparkles, LogOut } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { AuthForm } from "@/components/auth/AuthForm";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { useToast } from "@/hooks/use-toast";

export default function Landing() {
   const { user, loading, signOut } = useAuth();
   const navigate = useNavigate();
   const { toast } = useToast();
   const [isVisible, setIsVisible] = useState(false);

   useEffect(() => {
     setIsVisible(true);
   }, []);

   // Loading state while checking auth
    if (loading) {
      return (
        <div className="min-h-screen bg-background flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-primary">Loading...</p>
          </div>
        </div>
      );
    }
 
    // Redirect unauthenticated users to home page (CareerHome)
    if (!user) {
      navigate('/');
      return null;
    }

   const handleGetStarted = () => {
     navigate("/dashboard");
   };

   const handleExploreCourses = () => {
     navigate("/career-paths");
   };

   const handleLogout = async () => {
     try {
       await signOut();
       toast({
         title: "Logged out successfully",
         description: "You have been signed out of your account"
       });
       navigate("/");
     } catch (error: any) {
       toast({
         title: "Logout failed",
         description: error.message || "Failed to sign out",
         variant: "destructive"
       });
     }
   };

   const categoryCards = [
     {
       title: "Class 12th Students",
       subtitle: "Course & College Mapping",
       description: "Find the perfect courses and colleges based on your stream and goals",
       icon: <GraduationCap className="w-8 h-8" />,
       features: ["Course Recommendations", "College Matching", "Entrance Exam Prep"],
       gradient: "from-blue-900 to-blue-700",
       bgGradient: "from-blue-50 to-blue-100 dark:from-blue-950/20 dark:to-blue-900/20"
     },
     {
       title: "Degree Students",
       subtitle: "Career Advancement",
       description: "Navigate higher studies, job opportunities, and skill development",
       icon: <Target className="w-8 h-8" />,
       features: ["Higher Studies Guidance", "Job Opportunities", "Skill Enhancement"],
       gradient: "from-blue-700 to-blue-500",
       bgGradient: "from-blue-100 to-blue-200 dark:from-blue-900/20 dark:to-blue-800/20"
     }
   ];

   const features = [
     {
       icon: Target,
       title: "Personalized Insights",
       description: "AI-driven career recommendations based on your profile and goals"
     },
     {
       icon: Bot,
       title: "AI Career Mentor",
       description: "Get instant advice and guidance powered by advanced AI technology"
     },
     {
       icon: Users,
       title: "Team Collaboration",
       description: "Join teams and work on projects to build real-world experience"
     },
     {
       icon: Trophy,
       title: "Achievements",
       description: "Track progress and earn badges as you advance your career"
     }
   ];

   const testimonials = [
     {
       name: "Rahul Sharma",
       role: "B.Tech Computer Science",
       content: "Vidhya Disha helped me choose the right engineering branch. Now I'm pursuing my dream career in AI!",
       rating: 5
     },
     {
       name: "Priya Patel",
       role: "MBBS Student",
       content: "The aptitude assessment was spot-on. It guided me towards medicine when I was confused about my career path.",
       rating: 5
     },
     {
       name: "Amit Kumar",
       role: "MBA Finance",
       content: "From 12th commerce to MBA, this platform provided all the guidance I needed for my career journey.",
       rating: 5
     }
   ];

   return (
     <div className="min-h-screen bg-primary-main text-foreground overflow-hidden">
       {/* Animated Background Shapes */}
       <div className="fixed inset-0 overflow-hidden pointer-events-none">
         <motion.div
           className="absolute top-20 left-10 w-72 h-72 bg-primary/5 rounded-full blur-3xl"
           animate={{
             scale: [1, 1.2, 1],
             opacity: [0.3, 0.6, 0.3]
           }}
           transition={{
             duration: 4,
             repeat: Infinity,
             ease: "easeInOut"
           }}
         />
         <motion.div
           className="absolute bottom-20 right-10 w-96 h-96 bg-secondary/10 rounded-full blur-3xl"
           animate={{
             scale: [1.2, 1, 1.2],
             opacity: [0.4, 0.7, 0.4]
           }}
           transition={{
             duration: 5,
             repeat: Infinity,
             ease: "easeInOut"
           }}
         />
         <motion.div
           className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-muted/15 rounded-full blur-3xl"
           animate={{
             scale: [1, 1.3, 1],
             opacity: [0.2, 0.5, 0.2]
           }}
           transition={{
             duration: 6,
             repeat: Infinity,
             ease: "easeInOut"
           }}
         />
       </div>

       {/* Navigation */}
       <motion.nav
         className="relative z-10 border-b border-border bg-secondary shadow-primary"
         initial={{ y: -100 }}
         animate={{ y: 0 }}
         transition={{ duration: 0.8, ease: "easeOut" }}
       >
         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
           <div className="flex justify-between items-center h-16">
             <div className="flex items-center space-x-2">
               <motion.div
                 className="w-8 h-8 bg-accent rounded-lg flex items-center justify-center"
                 whileHover={{ scale: 1.1 }}
                 whileTap={{ scale: 0.95 }}
               >
                 <span className="text-accent-foreground font-bold text-sm">VD</span>
               </motion.div>
               <span className="text-primary-foreground font-semibold text-lg">Vidhya Disha</span>
             </div>
             <div className="flex items-center gap-3">
               <Link to="/dashboard">
                 <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                   <Button className="btn-accent">
                     Dashboard
                   </Button>
                 </motion.div>
               </Link>
               <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                 <Button
                   onClick={handleLogout}
                   variant="outline"
                   size="sm"
                   className="border-border hover:bg-muted text-muted-foreground hover:text-foreground"
                 >
                   <LogOut className="w-4 h-4 mr-2" />
                   Logout
                 </Button>
               </motion.div>
             </div>
           </div>
         </div>
       </motion.nav>

       {/* Hero Section */}
       <section className="relative z-10 py-20 px-4 sm:px-6 lg:px-8">
         <div className="max-w-7xl mx-auto">
           <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
             {/* Left Content */}
             <motion.div
               initial={{ opacity: 0, x: -50 }}
               animate={{ opacity: 1, x: 0 }}
               transition={{ duration: 0.8, delay: 0.2 }}
             >
               <motion.h1
                 className="text-5xl lg:text-6xl font-bold mb-6 leading-tight"
                 initial={{ opacity: 0, y: 30 }}
                 animate={{ opacity: 1, y: 0 }}
                 transition={{ duration: 0.8, delay: 0.4 }}
               >
                 Education{" "}
                 <motion.span
                   className="text-transparent bg-clip-text bg-gradient-to-r from-blue-900 via-blue-600 to-blue-400"
                   animate={{
                     backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"]
                   }}
                   transition={{
                     duration: 3,
                     repeat: Infinity,
                     ease: "linear"
                   }}
                   style={{ backgroundSize: "200% 200%" }}
                 >
                   Empowers Dreams
                 </motion.span>
               </motion.h1>

               <motion.p
                 className="text-xl text-muted-foreground mb-8 leading-relaxed"
                 initial={{ opacity: 0, y: 30 }}
                 animate={{ opacity: 1, y: 0 }}
                 transition={{ duration: 0.8, delay: 0.6 }}
               >
                 Your personalized career & education guide for 10th, 12th, and Degree students.
               </motion.p>

               <motion.div
                 className="flex flex-col sm:flex-row gap-4"
                 initial={{ opacity: 0, y: 30 }}
                 animate={{ opacity: 1, y: 0 }}
                 transition={{ duration: 0.8, delay: 0.8 }}
               >
                 <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                   <Button
                     size="lg"
                     className="btn-primary px-8 py-4 text-lg font-semibold"
                     onClick={handleGetStarted}
                   >
                     Get Started
                   </Button>
                 </motion.div>

                 <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                   <Button
                     size="lg"
                     className="btn-accent px-8 py-4 text-lg font-semibold"
                     onClick={handleExploreCourses}
                   >
                     Explore Courses
                   </Button>
                 </motion.div>
               </motion.div>
             </motion.div>

             {/* Right Content - Interactive Video */}
             <motion.div
               initial={{ opacity: 0, x: 50 }}
               animate={{ opacity: 1, x: 0 }}
               transition={{ duration: 0.8, delay: 0.4 }}
               className="relative"
             >
               <motion.div
                 className="relative bg-gradient-to-br from-card to-muted rounded-2xl overflow-hidden shadow-2xl border border-border"
                 whileHover={{ scale: 1.02 }}
                 transition={{ duration: 0.3 }}
               >
                 {/* Glow Effect */}
                 <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-secondary/10 rounded-2xl blur-xl"></div>

                 <div className="relative aspect-video bg-gradient-to-br from-muted to-card overflow-hidden rounded-lg">
                   <motion.video
                     className="w-full h-full object-cover"
                     initial={{ scale: 0.8, opacity: 0 }}
                     animate={{ scale: 1, opacity: 1 }}
                     transition={{ duration: 0.6, delay: 0.8 }}
                     controls
                     poster="/career-navigator-poster.jpg"
                     preload="metadata"
                     autoPlay={false}
                     muted={false}
                     onPlay={(e) => {
                       // Hide overlay when video starts playing
                       const overlay = e.currentTarget.nextElementSibling as HTMLElement;
                       if (overlay) overlay.style.opacity = '0';
                     }}
                     onPause={(e) => {
                       // Show overlay when video pauses
                       const overlay = e.currentTarget.nextElementSibling as HTMLElement;
                       if (overlay) overlay.style.opacity = '1';
                     }}
                     onEnded={(e) => {
                       // Show overlay when video ends
                       const overlay = e.currentTarget.nextElementSibling as HTMLElement;
                       if (overlay) overlay.style.opacity = '1';
                     }}
                   >
                     <source src="/videos/career-navigator-intro.mp4" type="video/mp4" />
                     Your browser does not support the video tag.
                   </motion.video>

                   {/* Custom Play Button Overlay */}
                   <motion.div
                     className="absolute inset-0 flex items-center justify-center bg-black/20 opacity-100 hover:opacity-100 transition-opacity duration-300 cursor-pointer"
                     initial={{ opacity: 1 }}
                     animate={{ opacity: 1 }}
                     transition={{ duration: 0.6, delay: 1.2 }}
                     onClick={(e) => {
                       const video = e.currentTarget.previousElementSibling as HTMLVideoElement;
                       if (video) {
                         if (video.paused) {
                           video.play();
                         } else {
                           video.pause();
                         }
                       }
                     }}
                   >
                     <motion.div
                       className="w-16 h-16 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg"
                       whileHover={{ scale: 1.1 }}
                       whileTap={{ scale: 0.95 }}
                     >
                       <Play className="w-6 h-6 text-foreground ml-0.5" />
                     </motion.div>
                   </motion.div>
                 </div>

                 <motion.div
                   className="p-8 text-center"
                   initial={{ opacity: 0, y: 20 }}
                   animate={{ opacity: 1, y: 0 }}
                   transition={{ duration: 0.6, delay: 1 }}
                 >
                   <motion.h3
                     className="text-2xl font-bold text-foreground mb-3"
                     animate={{
                       textShadow: [
                         "0 0 0px rgba(var(--primary), 0)",
                         "0 0 10px rgba(var(--primary), 0.3)",
                         "0 0 0px rgba(var(--primary), 0)"
                       ]
                     }}
                     transition={{
                       duration: 2,
                       repeat: Infinity,
                       ease: "easeInOut"
                     }}
                   >
                     Transform Your Future with Quality Education
                   </motion.h3>
                   <p className="text-muted-foreground">Unlock your potential and achieve your dreams</p>
                 </motion.div>
               </motion.div>
             </motion.div>
           </div>
         </div>
       </section>

       {/* Category Pathways Section */}
       <section className="py-20 px-4 sm:px-6 lg:px-8 relative z-10">
         <div className="max-w-7xl mx-auto">
           <motion.div
             className="text-center mb-16"
             initial={{ opacity: 0, y: 30 }}
             whileInView={{ opacity: 1, y: 0 }}
             transition={{ duration: 0.8 }}
             viewport={{ once: true }}
           >
             <h2 className="text-4xl font-bold mb-4">Choose Your Learning Path</h2>
             <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
               Personalized guidance tailored to your educational level and career aspirations
             </p>
           </motion.div>

           <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
             {categoryCards.map((card, index) => (
               <motion.div
                 key={index}
                 initial={{ opacity: 0, y: 50 }}
                 whileInView={{ opacity: 1, y: 0 }}
                 transition={{ duration: 0.6, delay: index * 0.2 }}
                 viewport={{ once: true }}
                 whileHover={{ y: -10 }}
                 className="group"
               >
                 <Card className={`bg-gradient-to-br ${card.bgGradient} border-gray-700 hover:border-blue-500/50 transition-all duration-300 overflow-hidden relative`}>
                   {/* Card Glow Effect */}
                   <div className={`absolute inset-0 bg-gradient-to-r ${card.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-300`}></div>

                   <CardContent className="p-8 relative z-10">
                     <motion.div
                       className={`w-16 h-16 bg-gradient-to-r ${card.gradient} rounded-xl flex items-center justify-center mb-6 text-white`}
                       whileHover={{ rotate: 360 }}
                       transition={{ duration: 0.6 }}
                     >
                       {card.icon}
                     </motion.div>

                     <h3 className="text-2xl font-bold mb-2 text-foreground">{card.title}</h3>
                     <p className="text-primary font-semibold mb-4">{card.subtitle}</p>
                     <p className="text-muted-foreground mb-6">{card.description}</p>

                     <div className="space-y-2">
                       {card.features.map((feature, featureIndex) => (
                         <motion.div
                           key={featureIndex}
                           className="flex items-center gap-2"
                           initial={{ opacity: 0, x: -20 }}
                           whileInView={{ opacity: 1, x: 0 }}
                           transition={{ duration: 0.4, delay: (index * 0.2) + (featureIndex * 0.1) }}
                           viewport={{ once: true }}
                         >
                           <div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
                           <span className="text-sm text-muted-foreground">{feature}</span>
                         </motion.div>
                       ))}
                     </div>
                   </CardContent>
                 </Card>
               </motion.div>
             ))}
           </div>
         </div>
       </section>

       {/* Features Section */}
       <section className="py-20 px-4 sm:px-6 lg:px-8 bg-muted/30 relative z-10">
         <div className="max-w-7xl mx-auto">
           <motion.div
             className="text-center mb-16"
             initial={{ opacity: 0, y: 30 }}
             whileInView={{ opacity: 1, y: 0 }}
             transition={{ duration: 0.8 }}
             viewport={{ once: true }}
           >
             <h2 className="text-4xl font-bold mb-4 text-foreground">Why Choose Vidhya Disha?</h2>
             <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
               Advanced AI-powered platform designed to guide your educational and career journey
             </p>
           </motion.div>

           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
             {features.map((feature, index) => {
               const Icon = feature.icon;
               return (
                 <motion.div
                   key={index}
                   initial={{ opacity: 0, y: 50 }}
                   whileInView={{ opacity: 1, y: 0 }}
                   transition={{ duration: 0.6, delay: index * 0.1 }}
                   viewport={{ once: true }}
                   whileHover={{ y: -10 }}
                   className="group"
                 >
                   <Card className="bg-card border-border hover:border-primary/50 transition-all duration-300 h-full shadow-sm hover:shadow-md">
                     <CardContent className="p-6 text-center">
                       <motion.div
                         className="w-16 h-16 bg-gradient-to-r from-primary to-primary/80 rounded-xl flex items-center justify-center mx-auto mb-6 text-primary-foreground"
                         whileHover={{ rotate: 360 }}
                         transition={{ duration: 0.6 }}
                       >
                         <Icon className="w-8 h-8" />
                       </motion.div>
                       <h3 className="text-xl font-semibold mb-3 text-foreground">{feature.title}</h3>
                       <p className="text-muted-foreground text-sm leading-relaxed">{feature.description}</p>
                     </CardContent>
                   </Card>
                 </motion.div>
               );
             })}
           </div>
         </div>
       </section>

       {/* Trust & Impact Section */}
       <section className="py-20 px-4 sm:px-6 lg:px-8 relative z-10">
         <div className="max-w-7xl mx-auto">
           <motion.div
             className="text-center mb-16"
             initial={{ opacity: 0, y: 30 }}
             whileInView={{ opacity: 1, y: 0 }}
             transition={{ duration: 0.8 }}
             viewport={{ once: true }}
           >
             <h2 className="text-4xl font-bold mb-4">Trusted by Thousands of Students</h2>
             <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
               Real success stories from students who transformed their careers with our guidance
             </p>
           </motion.div>

           {/* Stats */}
           <motion.div
             className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-16"
             initial={{ opacity: 0, y: 30 }}
             whileInView={{ opacity: 1, y: 0 }}
             transition={{ duration: 0.8 }}
             viewport={{ once: true }}
           >
             {[
               { number: "5000+", label: "Students Guided", icon: Users },
               { number: "95%", label: "Success Rate", icon: Trophy },
               { number: "50+", label: "Partner Colleges", icon: GraduationCap },
               { number: "24/7", label: "AI Support", icon: Bot }
             ].map((stat, index) => {
               const Icon = stat.icon;
               return (
                 <motion.div
                   key={index}
                   className="text-center"
                   whileHover={{ scale: 1.05 }}
                   transition={{ duration: 0.3 }}
                 >
                   <div className="w-16 h-16 bg-gradient-to-r from-blue-900 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                     <Icon className="w-8 h-8 text-white" />
                   </div>
                   <div className="text-4xl font-bold text-foreground mb-2">{stat.number}</div>
                   <div className="text-muted-foreground">{stat.label}</div>
                 </motion.div>
               );
             })}
           </motion.div>

           {/* Testimonials */}
           <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
             {testimonials.map((testimonial, index) => (
               <motion.div
                 key={index}
                 initial={{ opacity: 0, y: 50 }}
                 whileInView={{ opacity: 1, y: 0 }}
                 transition={{ duration: 0.6, delay: index * 0.2 }}
                 viewport={{ once: true }}
                 whileHover={{ y: -10 }}
               >
                 <Card className="bg-card border-border hover:border-primary/50 transition-all duration-300 h-full">
                   <CardContent className="p-6">
                     <div className="flex mb-4">
                       {[...Array(testimonial.rating)].map((_, i) => (
                         <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                       ))}
                     </div>
                     <p className="text-card-foreground mb-6 italic">"{testimonial.content}"</p>
                     <div>
                       <div className="font-semibold text-card-foreground">{testimonial.name}</div>
                       <div className="text-primary text-sm">{testimonial.role}</div>
                     </div>
                   </CardContent>
                 </Card>
               </motion.div>
             ))}
           </div>
         </div>
       </section>

       {/* Footer */}
       <footer className="bg-muted/50 border-t border-border py-12 px-4 sm:px-6 lg:px-8">
         <div className="max-w-7xl mx-auto">
           <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
             {/* Logo & Description */}
             <div className="md:col-span-2">
               <div className="flex items-center space-x-2 mb-4">
                 <div className="w-8 h-8 bg-accent rounded-lg flex items-center justify-center">
                   <span className="text-accent-foreground font-bold text-sm">VD</span>
                 </div>
                 <span className="text-primary font-semibold text-lg">Vidhya Disha</span>
               </div>
               <p className="text-muted-foreground mb-4 max-w-md">
                 Empowering students across India with AI-driven career guidance and personalized education pathways.
               </p>
               <div className="flex space-x-4">
                 <motion.a
                   href="#"
                   className="w-10 h-10 bg-card border border-border rounded-lg flex items-center justify-center text-muted-foreground hover:text-primary hover:border-primary transition-all duration-300"
                   whileHover={{ scale: 1.1 }}
                   whileTap={{ scale: 0.95 }}
                 >
                   <Facebook className="w-5 h-5" />
                 </motion.a>
                 <motion.a
                   href="#"
                   className="w-10 h-10 bg-card border border-border rounded-lg flex items-center justify-center text-muted-foreground hover:text-primary hover:border-primary transition-all duration-300"
                   whileHover={{ scale: 1.1 }}
                   whileTap={{ scale: 0.95 }}
                 >
                   <Twitter className="w-5 h-5" />
                 </motion.a>
                 <motion.a
                   href="#"
                   className="w-10 h-10 bg-card border border-border rounded-lg flex items-center justify-center text-muted-foreground hover:text-primary hover:border-primary transition-all duration-300"
                   whileHover={{ scale: 1.1 }}
                   whileTap={{ scale: 0.95 }}
                 >
                   <Instagram className="w-5 h-5" />
                 </motion.a>
                 <motion.a
                   href="#"
                   className="w-10 h-10 bg-card border border-border rounded-lg flex items-center justify-center text-muted-foreground hover:text-primary hover:border-primary transition-all duration-300"
                   whileHover={{ scale: 1.1 }}
                   whileTap={{ scale: 0.95 }}
                 >
                   <Youtube className="w-5 h-5" />
                 </motion.a>
               </div>
             </div>

             {/* Quick Links */}
             <div>
               <h3 className="text-foreground font-semibold mb-4">Quick Links</h3>
               <ul className="space-y-2">
                 {['Dashboard', 'Career Paths', 'AI Mentor', 'Achievements', 'Teams'].map((link) => (
                   <li key={link}>
                     <a href="#" className="text-muted-foreground hover:text-primary transition-colors duration-300">
                       {link}
                     </a>
                   </li>
                 ))}
               </ul>
             </div>

             {/* Government */}
             <div>
               <h3 className="text-foreground font-semibold mb-4">Official</h3>
               <div className="flex items-center space-x-2 mb-4">
                 <div className="w-8 h-8 bg-muted rounded-lg flex items-center justify-center">
                   <span className="text-muted-foreground text-xs">J&K</span>
                 </div>
                 <span className="text-muted-foreground text-sm">Higher Education Dept.</span>
               </div>
               <p className="text-muted-foreground text-sm">
                 Powered by the Department of Higher Education, Jammu & Kashmir
               </p>
             </div>
           </div>

           <div className="border-t border-border mt-8 pt-8 text-center">
             <p className="text-muted-foreground text-sm">
               © 2024 Vidhya Disha. All rights reserved. | Made with ❤️ for students
             </p>
           </div>
         </div>
       </footer>
     </div>
   );
 }