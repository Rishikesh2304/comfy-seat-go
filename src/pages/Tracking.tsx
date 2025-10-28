import { useState } from "react";
import MobileNav from "@/components/MobileNav";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin, Navigation, Clock } from "lucide-react";

const Tracking = () => {
  const [selectedRoute] = useState("Alandur");
  
  const busInfo = {
    route: selectedRoute,
    currentLocation: "Near Velachery Bypass",
    eta: "12 mins",
    nextStop: "Velachery Toll",
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
            {[
              { name: "VIT Campus", time: "1:30 PM", status: "completed" },
              { name: "Kelambakkam", time: "1:40 PM", status: "completed" },
              { name: "Velachery Toll", time: "1:50 PM", status: "current" },
              { name: selectedRoute, time: "2:00 PM", status: "upcoming" },
            ].map((stop, index) => (
              <div key={index} className="flex items-center gap-3">
                <div
                  className={`w-3 h-3 rounded-full ${
                    stop.status === "completed"
                      ? "bg-success"
                      : stop.status === "current"
                      ? "bg-primary animate-pulse"
                      : "bg-muted"
                  }`}
                />
                <div className="flex-1">
                  <p className="text-sm font-medium">{stop.name}</p>
                  <p className="text-xs text-muted-foreground">{stop.time}</p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <MobileNav />
    </div>
  );
};

export default Tracking;
