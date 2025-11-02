import { Link, useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import {
  Home,
  BarChart3,
  User,
  MapPin,
  Users,
  Trophy,
  Bot,
  Bell,
  LogOut,
  BookOpen,
  Zap,
  TrendingUp,
  Map,
  ChevronLeft
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useAppContext } from "../../contexts/AppContext";
import { useAuth } from "../../hooks/useAuth";

const navigationItems = [
  { name: "Home", href: "/", icon: Home },
  { name: "Dashboard", href: "/dashboard", icon: BarChart3 },
  { name: "Up to Date", href: "/up-to-date", icon: TrendingUp },
  { name: "Exams", href: "/exams", icon: BookOpen },
  { name: "College Map", href: "/map", icon: Map },
  { name: "Career Paths", href: "/career-paths", icon: MapPin },
  { name: "AI Mentor", href: "/ai-mentor", icon: Bot },
  { name: "Teams", href: "/teams", icon: Users },
  { name: "Achievements", href: "/achievements", icon: Trophy },
  { name: "Profile", href: "/profile", icon: User },
];

interface NavigationProps {
  userName?: string;
}

export const Navigation = ({ userName = "SHAIK SULEMAN" }: NavigationProps) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { notifications, getUnreadNotificationsCount, markNotificationAsRead } = useAppContext();
  const { signOut } = useAuth();
  const [showNotifications, setShowNotifications] = useState(false);
  const [selectedNotification, setSelectedNotification] = useState<any>(null);

  const unreadCount = getUnreadNotificationsCount();

  const handleBellClick = () => {
    setShowNotifications(!showNotifications);
    setSelectedNotification(null); // Reset selected notification when opening/closing
  };

  const handleNotificationItemClick = (notification: any) => {
    setSelectedNotification(notification);
    if (!notification.read) {
      markNotificationAsRead(notification.id);
    }
  };

  const handleBackToList = () => {
    setSelectedNotification(null);
  };

  const getNotificationDetails = (notification: any) => {
    switch (notification.type) {
      case 'college':
        return {
          title: notification.title,
          details: notification.message,
          actionText: 'View Colleges',
          actionLink: '/map'
        };
      case 'exam':
        return {
          title: notification.title,
          details: notification.message,
          actionText: 'View Exams',
          actionLink: '/exams'
        };
      case 'scholarship':
        return {
          title: notification.title,
          details: notification.message,
          actionText: 'View Scholarships',
          actionLink: '/up-to-date'
        };
      default:
        return {
          title: notification.title,
          details: notification.message,
          actionText: null,
          actionLink: null
        };
    }
  };

  const handleLogout = async () => {
    try {
      // Clear localStorage data on logout
      localStorage.removeItem('education_level');
      await signOut();
      navigate('/');
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  return (
    <>
      <nav className="bg-nav-background border-b border-nav-border shadow-primary relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center shadow-primary glow-primary">
                <span className="text-primary-foreground font-bold text-sm">CN</span>
              </div>
              <span className="text-primary font-semibold text-lg">Vidhya Disha</span>
            </div>

            {/* Navigation Items */}
            <div className="hidden md:flex items-center space-x-1">
              {navigationItems.map((item) => {
                const isActive = location.pathname === item.href;
                const Icon = item.icon;

                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={cn(
                      "flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200",
                      isActive
                        ? "bg-primary text-primary-foreground shadow-primary glow-primary"
                        : "text-foreground hover:bg-nav-hover hover:text-primary hover:shadow-primary"
                    )}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{item.name}</span>
                  </Link>
                );
              })}
            </div>

            {/* User Section */}
            <div className="flex items-center space-x-4">
              <div className="relative">
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-foreground hover:text-primary relative"
                  onClick={handleBellClick}
                >
                  <Bell className="w-5 h-5" />
                  {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-destructive text-destructive-foreground text-xs rounded-full w-5 h-5 flex items-center justify-center">
                      {unreadCount > 9 ? '9+' : unreadCount}
                    </span>
                  )}
                </Button>

                {/* Notifications Dropdown */}
                {showNotifications && (
                  <div className="absolute right-0 mt-2 w-96 bg-card border border-border rounded-lg shadow-xl z-50">
                    <div className="p-4 border-b border-border flex items-center justify-between">
                      {selectedNotification ? (
                        <>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={handleBackToList}
                            className="p-1 h-8 w-8"
                          >
                            <ChevronLeft className="w-4 h-4" />
                          </Button>
                          <h3 className="font-semibold text-card-foreground">Notification Details</h3>
                          <div></div>
                        </>
                      ) : (
                        <h3 className="font-semibold text-card-foreground">Notifications</h3>
                      )}
                    </div>
                    <div className="max-h-96 overflow-y-auto">
                      {selectedNotification ? (
                        // Detailed notification view
                        <div className="p-4">
                          <div className="mb-4">
                            <h4 className="font-semibold text-card-foreground text-lg mb-2">
                              {selectedNotification.title}
                            </h4>
                            <p className="text-muted-foreground text-sm mb-3">
                              {selectedNotification.message}
                            </p>
                            <p className="text-muted-foreground text-xs">
                              {new Date(selectedNotification.created_at).toLocaleDateString()}
                            </p>
                          </div>

                          {(() => {
                            const details = getNotificationDetails(selectedNotification);
                            return details.actionText && details.actionLink ? (
                              <Button
                                onClick={() => {
                                  navigate(details.actionLink);
                                  setShowNotifications(false);
                                  setSelectedNotification(null);
                                }}
                                className="w-full"
                              >
                                {details.actionText}
                              </Button>
                            ) : null;
                          })()}
                        </div>
                      ) : (
                        // Notification list view
                        notifications.length === 0 ? (
                          <div className="p-4 text-center text-muted-foreground">
                            No notifications yet
                          </div>
                        ) : (
                          notifications.slice(0, 10).map((notification) => (
                            <div
                              key={notification.id}
                              className={cn(
                                "p-4 border-b border-border last:border-b-0 hover:bg-muted/50 cursor-pointer",
                                !notification.read && "bg-primary/5"
                              )}
                              onClick={() => handleNotificationItemClick(notification)}
                            >
                              <div className="flex justify-between items-start">
                                <div className="flex-1">
                                  <h4 className="font-medium text-card-foreground text-sm">
                                    {notification.title}
                                  </h4>
                                  <p className="text-muted-foreground text-xs mt-1 line-clamp-2">
                                    {notification.message}
                                  </p>
                                  <p className="text-muted-foreground text-xs mt-2">
                                    {new Date(notification.created_at).toLocaleDateString()}
                                  </p>
                                </div>
                                {!notification.read && (
                                  <div className="w-2 h-2 bg-primary rounded-full ml-2 mt-1"></div>
                                )}
                              </div>
                            </div>
                          ))
                        )
                      )}
                    </div>
                  </div>
                )}
              </div>

              <div className="text-right">
                <div className="text-sm font-medium text-foreground">Welcome,</div>
                <div className="text-sm text-muted-foreground">{userName}</div>
              </div>

              <Button
                variant="ghost"
                size="icon"
                className="text-foreground hover:text-destructive"
                onClick={handleLogout}
              >
                <LogOut className="w-5 h-5" />
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Overlay to close notifications when clicking outside */}
      {showNotifications && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setShowNotifications(false)}
        ></div>
      )}
    </>
  );
};