import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Bus, MapPin, Shield, Clock } from "lucide-react";

const Index = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const userData = localStorage.getItem("vshuttle_user");
    if (userData) {
      navigate("/dashboard");
    }
  }, [navigate]);

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <header className="bg-gradient-hero text-primary-foreground px-6 py-12 text-center">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold mb-4">VShuttle</h1>
          <p className="text-lg opacity-90 mb-8">
            Your Smart Campus Shuttle Booking System
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button
              size="lg"
              variant="hero"
              onClick={() => navigate("/login")}
              className="text-lg px-8"
            >
              Get Started
            </Button>
          </div>
        </div>
      </header>

      {/* Features */}
      <main className="max-w-6xl mx-auto px-6 py-12">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <Card className="p-6 text-center">
            <Bus className="w-12 h-12 mx-auto mb-4 text-primary" />
            <h3 className="font-bold mb-2">Easy Booking</h3>
            <p className="text-sm text-muted-foreground">
              Book your seat in seconds with our intuitive interface
            </p>
          </Card>

          <Card className="p-6 text-center">
            <MapPin className="w-12 h-12 mx-auto mb-4 text-primary" />
            <h3 className="font-bold mb-2">Live Tracking</h3>
            <p className="text-sm text-muted-foreground">
              Track your shuttle in real-time and never miss a ride
            </p>
          </Card>

          <Card className="p-6 text-center">
            <Shield className="w-12 h-12 mx-auto mb-4 text-primary" />
            <h3 className="font-bold mb-2">Honesty System</h3>
            <p className="text-sm text-muted-foreground">
              Build trust with our unique honesty score system
            </p>
          </Card>

          <Card className="p-6 text-center">
            <Clock className="w-12 h-12 mx-auto mb-4 text-primary" />
            <h3 className="font-bold mb-2">24/7 Service</h3>
            <p className="text-sm text-muted-foreground">
              Book anytime, anywhere with round-the-clock availability
            </p>
          </Card>
        </div>

        {/* CTA Section */}
        <Card className="p-8 text-center bg-gradient-card">
          <h2 className="text-2xl font-bold mb-4">Ready to get started?</h2>
          <p className="text-muted-foreground mb-6">
            Join thousands of students already using VShuttle for their daily commute
          </p>
          <Button size="lg" onClick={() => navigate("/login")}>
            Book Your First Ride
          </Button>
        </Card>
      </main>

      {/* Footer */}
      <footer className="border-t border-border py-8 px-6 text-center text-sm text-muted-foreground">
        <p>© 2025 VShuttle. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default Index;
