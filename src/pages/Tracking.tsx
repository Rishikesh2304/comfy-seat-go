import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import MobileNav from "@/components/MobileNav";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin, Navigation, Clock } from "lucide-react";

interface RouteStop {
  name: string;
  time: string;
}

const routeData: Record<string, RouteStop[]> = {
  Alandur: [
    { name: "VIT College", time: "1:30 PM" },
    { name: "Sanatorium", time: "1:38 PM" },
    { name: "Chromepet", time: "1:45 PM" },
    { name: "Pallavaram", time: "1:52 PM" },
    { name: "Airport", time: "1:58 PM" },
    { name: "Meenambakkam", time: "2:03 PM" },
    { name: "Alandur Metro", time: "2:10 PM" },
  ],
  Tambaram: [
    { name: "VIT College", time: "1:30 PM" },
    { name: "Vandalur", time: "1:42 PM" },
    { name: "Perungalathur", time: "1:50 PM" },
    { name: "Tambaram", time: "2:00 PM" },
  ],
  Sholinganallur: [
    { name: "VIT College", time: "1:30 PM" },
    { name: "Chetinad Hospital", time: "1:40 PM" },
    { name: "Satyabama College", time: "1:48 PM" },
    { name: "Sholinganallur", time: "2:00 PM" },
  ],
  Velachery: [
    { name: "VIT College", time: "1:30 PM" },
    { name: "Phoenix Mall", time: "1:42 PM" },
    { name: "Velachery Toll", time: "1:50 PM" },
    { name: "Velachery", time: "2:00 PM" },
  ],
};

const Tracking = () => {
  const [bookedRoute, setBookedRoute] = useState<string | null>(null);
  const [currentStopIndex, setCurrentStopIndex] = useState(2);
  const navigate = useNavigate();
  
  useEffect(() => {
    const userData = localStorage.getItem("vshuttle_user");
    if (!userData) {
      navigate("/login");
      return;
    }

    const user = JSON.parse(userData);
    const activeBooking = user.bookings?.find(
      (booking: any) => booking.status === "active"
    );

    if (activeBooking) {
      setBookedRoute(activeBooking.route);
    }
  }, [navigate]);

  if (!bookedRoute) {
    return (
      <div className="min-h-screen bg-background pb-20">
        <header className="bg-gradient-hero p-6 text-primary-foreground">
          <h1 className="text-2xl font-bold mb-2">Live Tracking</h1>
          <p className="text-sm opacity-90">Track your shuttle in real-time</p>
        </header>
        <div className="p-4">
          <Card className="p-8 text-center">
            <MapPin className="w-12 h-12 mx-auto mb-3 text-muted-foreground" />
            <h2 className="text-lg font-semibold mb-2">No Active Booking</h2>
            <p className="text-sm text-muted-foreground">
              Book a shuttle to track it in real-time
            </p>
          </Card>
        </div>
        <MobileNav />
      </div>
    );
  }

  const stops = routeData[bookedRoute];
  const currentStop = stops[currentStopIndex];
  const nextStop = currentStopIndex < stops.length - 1 ? stops[currentStopIndex + 1] : null;
  
  const busInfo = {
    route: bookedRoute,
    currentLocation: `Near ${currentStop.name}`,
    eta: nextStop ? "8 mins" : "Arriving soon",
    nextStop: nextStop?.name || "Final destination",
    speed: "45 km/h",
    status: "On Time"
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <header className="bg-gradient-hero p-6 text-primary-foreground">
        <h1 className="text-2xl font-bold mb-2">Live Tracking</h1>
        <p className="text-sm opacity-90">Track your shuttle in real-time</p>
      </header>

      {/* Map Container */}
      <div className="p-4 space-y-4">
        <Card className="h-80 bg-muted flex items-center justify-center relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-accent/10" />
          <div className="relative text-center z-10">
            <MapPin className="w-12 h-12 mx-auto mb-3 text-primary animate-bounce" />
            <p className="text-sm text-muted-foreground">Map integration coming soon</p>
          </div>
        </Card>

        {/* Bus Info */}
        <Card className="p-4 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">{busInfo.route} Route</h2>
            <Badge className="bg-success text-success-foreground">
              {busInfo.status}
            </Badge>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-start gap-3">
              <Navigation className="w-5 h-5 text-primary mt-0.5" />
              <div>
                <p className="text-xs text-muted-foreground">Current Location</p>
                <p className="text-sm font-medium">{busInfo.currentLocation}</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Clock className="w-5 h-5 text-primary mt-0.5" />
              <div>
                <p className="text-xs text-muted-foreground">ETA</p>
                <p className="text-sm font-medium">{busInfo.eta}</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <MapPin className="w-5 h-5 text-primary mt-0.5" />
              <div>
                <p className="text-xs text-muted-foreground">Next Stop</p>
                <p className="text-sm font-medium">{busInfo.nextStop}</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Navigation className="w-5 h-5 text-primary mt-0.5" />
              <div>
                <p className="text-xs text-muted-foreground">Speed</p>
                <p className="text-sm font-medium">{busInfo.speed}</p>
              </div>
            </div>
          </div>
        </Card>

        {/* Route Timeline */}
        <Card className="p-4">
          <h3 className="font-bold mb-4">Route Stops</h3>
          <div className="space-y-3">
            {stops.map((stop, index) => {
              const status = 
                index < currentStopIndex ? "completed" :
                index === currentStopIndex ? "current" : "upcoming";
              
              return (
                <div key={index} className="flex items-center gap-3">
                  <div
                    className={`w-3 h-3 rounded-full ${
                      status === "completed"
                        ? "bg-success"
                        : status === "current"
                        ? "bg-primary animate-pulse"
                        : "bg-muted"
                    }`}
                  />
                  <div className="flex-1">
                    <p className="text-sm font-medium">{stop.name}</p>
                    <p className="text-xs text-muted-foreground">{stop.time}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </Card>
      </div>

      <MobileNav />
    </div>
  );
};

export default Tracking;
