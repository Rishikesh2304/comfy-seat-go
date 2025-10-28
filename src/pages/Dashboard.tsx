import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Award, Clock, AlertCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import MobileNav from "@/components/MobileNav";

interface User {
  username: string;
  honestyScore: number;
  bookings: any[];
}

const Dashboard = () => {
  const [userData, setUserData] = useState<User | null>(null);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const stored = localStorage.getItem("vshuttle_user");
    if (!stored) {
      navigate("/login");
    } else {
      setUserData(JSON.parse(stored));
    }
  }, [navigate]);

  const routes = [
    { name: "Alandur", available: 32 },
    { name: "Tambaram", available: 10 },
    { name: "Velachery", available: 0 },
    { name: "Sholinganallur", available: 25 },
  ];

  const hasActiveBooking = userData?.bookings?.some(
    (booking) => booking.status !== "cancelled"
  );

  const handleBookNow = () => {
    if (hasActiveBooking) {
      toast({
        title: "Active Booking Exists",
        description: "You already have an active booking. Cancel it from your profile to book a new ticket.",
        variant: "destructive",
      });
    } else {
      navigate("/booking");
    }
  };

  if (!userData) return null;

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Hero Header */}
      <header className="bg-gradient-hero text-primary-foreground p-6 pb-8">
        <div>
          <h1 className="text-2xl font-bold mb-2">Welcome back!</h1>
          <p className="text-sm opacity-90">{userData.username}</p>
        </div>
        
        <div className="mt-6">
          <div className="bg-primary-foreground/10 backdrop-blur-sm rounded-lg p-4">
            <p className="text-xs opacity-80 mb-1">Your Honesty Score</p>
            <div className="flex items-center gap-2">
              <Award className="w-6 h-6" />
              <span className="text-3xl font-bold">{userData.honestyScore}</span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="p-4 space-y-4">
        {/* Quick Actions */}
        <div className="grid grid-cols-2 gap-3">
          <Button 
            variant="default" 
            className="h-20 flex flex-col gap-2"
            onClick={handleBookNow}
          >
            <span className="text-2xl">🎫</span>
            <span className="text-xs">Book Seat</span>
          </Button>
          <Button 
            variant="outline" 
            className="h-20 flex flex-col gap-2"
            onClick={() => navigate("/tracking")}
          >
            <span className="text-2xl">📍</span>
            <span className="text-xs">Track Live</span>
          </Button>
        </div>

        {/* Active Booking Alert */}
        {hasActiveBooking && (
          <Card className="p-4 bg-primary/5 border-primary/20">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-primary mt-0.5" />
              <div>
                <p className="font-semibold text-sm">Active Booking</p>
                <p className="text-xs text-muted-foreground">
                  You have an active booking. Check your profile for details.
                </p>
              </div>
            </div>
          </Card>
        )}

        {/* Live Analytics */}
        <Card className="p-4">
          <div className="flex items-center gap-2 mb-4">
            <Clock className="w-5 h-5 text-primary" />
            <h2 className="font-bold">Live Availability</h2>
          </div>
          
          <div className="space-y-3">
            {routes.map((route) => (
              <div
                key={route.name}
                className="flex items-center justify-between p-3 rounded-lg bg-muted/30"
              >
                <div>
                  <p className="font-semibold">{route.name}</p>
                  <p className="text-xs text-muted-foreground">Next: 1:45 PM</p>
                </div>
                <Badge
                  variant={route.available > 0 ? "default" : "destructive"}
                  className="ml-auto"
                >
                  {route.available} seats
                </Badge>
              </div>
            ))}
          </div>
        </Card>

        {/* Recent Activity */}
        <Card className="p-4">
          <h2 className="font-bold mb-3">Recent Bookings</h2>
          {userData.bookings && userData.bookings.length > 0 ? (
            <div className="space-y-2">
              {userData.bookings.slice(0, 3).map((booking, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 rounded-lg bg-muted/30"
                >
                  <div>
                    <p className="text-sm font-semibold">{booking.route}</p>
                    <p className="text-xs text-muted-foreground">
                      Seat {booking.seat}
                    </p>
                  </div>
                  <Badge
                    variant={booking.status === "cancelled" ? "destructive" : "default"}
                  >
                    {booking.status || "Active"}
                  </Badge>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground text-center py-4">
              No bookings yet
            </p>
          )}
        </Card>
      </main>

      <MobileNav />
    </div>
  );
};

export default Dashboard;
