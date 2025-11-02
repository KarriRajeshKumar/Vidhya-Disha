import { Link, useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
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
  Menu,
  X,
  ChevronLeft,
  ChevronRight,
  TrendingUp,
  Map
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

interface SidebarProps {
  userName?: string;
  isOpen: boolean;
  onToggle: () => void;
}

export const Sidebar = ({ userName = "SHAIK SULEMAN", isOpen, onToggle }: SidebarProps) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { notifications, getUnreadNotificationsCount, markNotificationAsRead } = useAppContext();
  const { signOut } = useAuth();
  const [showNotifications, setShowNotifications] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);

  const unreadCount = getUnreadNotificationsCount();

  const handleNotificationClick = () => {
    setShowNotifications(!showNotifications);
  };

  const handleMarkAsRead = (notificationId: string) => {
    markNotificationAsRead(notificationId);
  };

  const handleLogout = async () => {
    try {
      // Clear localStorage data on logout
      localStorage.removeItem('education_level');
      localStorage.removeItem('aptitude_results');
      await signOut();
      navigate('/');
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  const toggleCollapse = () => {
    setIsCollapsed(!isCollapsed);
  };

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={onToggle}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed left-0 top-0 z-50 h-full bg-nav-background border-r border-nav-border shadow-xl transition-all duration-300 ease-in-out",
          isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0",
          isCollapsed ? "w-16" : "w-64"
        )}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-nav-border">
            {!isCollapsed && (
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center shadow-primary glow-primary">
                  <span className="text-primary-foreground font-bold text-sm">CN</span>
                </div>
                <span className="text-primary font-semibold text-lg">Vidhya Disha</span>
              </div>
            )}

            <div className="flex items-center space-x-2">
              {/* Collapse button - only show on desktop */}
              <Button
                variant="ghost"
                size="icon"
                className="hidden lg:flex text-foreground hover:text-primary"
                onClick={toggleCollapse}
              >
                {isCollapsed ? (
                  <ChevronRight className="w-4 h-4" />
                ) : (
                  <ChevronLeft className="w-4 h-4" />
                )}
              </Button>

              {/* Mobile close button */}
              <Button
                variant="ghost"
                size="icon"
                className="lg:hidden text-foreground hover:text-primary"
                onClick={onToggle}
              >
                <X className="w-5 h-5" />
              </Button>
            </div>
          </div>

          {/* Navigation Items */}
          <nav className="flex-1 px-3 py-4 space-y-2 overflow-y-auto">
            {navigationItems.map((item) => {
              const isActive = location.pathname === item.href;
              const Icon = item.icon;

              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={cn(
                    "flex items-center space-x-3 px-3 py-3 rounded-lg text-sm font-medium transition-all duration-200 group",
                    isActive
                      ? "bg-primary text-primary-foreground shadow-primary glow-primary"
                      : "text-foreground hover:bg-nav-hover hover:text-primary hover:shadow-primary"
                  )}
                  onClick={() => {
                    // Close mobile sidebar when navigation item is clicked
                    if (window.innerWidth < 1024) {
                      onToggle();
                    }
                  }}
                >
                  <Icon className={cn("w-5 h-5 flex-shrink-0", isCollapsed && "mx-auto")} />
                  {!isCollapsed && (
                    <span className="truncate">{item.name}</span>
                  )}
                  {isCollapsed && (
                    <div className="absolute left-16 ml-2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-50 whitespace-nowrap">
                      {item.name}
                    </div>
                  )}
                </Link>
              );
            })}
          </nav>

          {/* User Section */}
          <div className="border-t border-nav-border p-4 space-y-3">
            {/* Notifications */}
            <div className="relative">
              <Button
                variant="ghost"
                className={cn(
                  "w-full justify-start text-foreground hover:text-primary hover:bg-nav-hover",
                  isCollapsed ? "px-3" : "px-3"
                )}
                onClick={handleNotificationClick}
              >
                <Bell className="w-5 h-5 flex-shrink-0" />
                {!isCollapsed && (
                  <>
                    <span className="ml-3">Notifications</span>
                    {unreadCount > 0 && (
                      <span className="ml-auto bg-destructive text-destructive-foreground text-xs rounded-full px-2 py-1">
                        {unreadCount > 9 ? '9+' : unreadCount}
                      </span>
                    )}
                  </>
                )}
                {isCollapsed && unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-destructive text-destructive-foreground text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {unreadCount > 9 ? '9+' : unreadCount}
                  </span>
                )}
              </Button>

              {/* Notifications Dropdown */}
              {showNotifications && (
                <div className={cn(
                  "absolute bottom-full left-0 mb-2 bg-card border border-border rounded-lg shadow-xl z-50",
                  isCollapsed ? "w-80" : "w-80"
                )}>
                  <div className="p-4 border-b border-border">
                    <h3 className="font-semibold text-card-foreground">Notifications</h3>
                  </div>
                  <div className="max-h-96 overflow-y-auto">
                    {notifications.length === 0 ? (
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
                          onClick={() => handleMarkAsRead(notification.id)}
                        >
                          <div className="flex justify-between items-start">
                            <div className="flex-1">
                              <h4 className="font-medium text-card-foreground text-sm">
                                {notification.title}
                              </h4>
                              <p className="text-muted-foreground text-xs mt-1">
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
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* User Info */}
            {!isCollapsed && (
              <div className="text-center py-2">
                <div className="text-xs font-medium text-foreground">Welcome,</div>
                <div className="text-xs text-muted-foreground truncate">{userName}</div>
              </div>
            )}

            {/* Logout Button */}
            <Button
              variant="ghost"
              className={cn(
                "w-full justify-start text-foreground hover:text-destructive hover:bg-destructive/10",
                isCollapsed ? "px-3" : "px-3"
              )}
              onClick={handleLogout}
            >
              <LogOut className="w-5 h-5 flex-shrink-0" />
              {!isCollapsed && <span className="ml-3">Logout</span>}
            </Button>
          </div>
        </div>
      </aside>

      {/* Overlay to close notifications when clicking outside */}
      {showNotifications && (
        <div
          className="fixed inset-0 z-30"
          onClick={() => setShowNotifications(false)}
        />
      )}
    </>
  );
};