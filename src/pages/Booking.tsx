import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";
import { Check, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import MobileNav from "@/components/MobileNav";

interface Booking {
  route: string;
  seat: string;
  date: string;
  status?: string;
}

const Booking = () => {
  const [selectedRoute, setSelectedRoute] = useState("Alandur");
  const [selectedSeat, setSelectedSeat] = useState<string | null>(null);
  const [hasActiveBooking, setHasActiveBooking] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const userData = localStorage.getItem("vshuttle_user");
    if (!userData) {
      navigate("/login");
      return;
    }

    const user = JSON.parse(userData);
    const activeBooking = user.bookings?.some(
      (booking: Booking) => booking.status !== "cancelled"
    );
    setHasActiveBooking(activeBooking);

    if (activeBooking) {
      toast({
        title: "Cannot Book",
        description: "You already have an active booking. Cancel it from your profile first.",
        variant: "destructive",
      });
    }
  }, [navigate, toast]);

  const routes = [
    { name: "Alandur", available: 32 },
    { name: "Tambaram", available: 10 },
    { name: "Velachery", available: 0 },
    { name: "Sholinganallur", available: 25 },
  ];

  // Create 10 rows with 2 seats on left (A, B) and 3 on right (C, D, E)
  const generateSeats = () => {
    const seats = [];
    for (let row = 1; row <= 10; row++) {
      seats.push({
        row,
        left: [`A${row}`, `B${row}`],
        right: [`C${row}`, `D${row}`, `E${row}`],
      });
    }
    return seats;
  };

  const seatLayout = generateSeats();

  // Different booked seats for each route
  const bookedSeatsByRoute: Record<string, string[]> = {
    Alandur: ["A1", "B2", "C4", "D1", "E3", "A5", "C7", "B8"],
    Tambaram: ["A2", "C1", "D3", "E2", "B5", "C6", "A9", "D8"],
    Sholinganallur: ["B1", "C2", "E1", "A4", "D5", "B7", "C9", "E6"],
    Velachery: ["C3", "D2", "A3", "E4", "B6", "A8", "C8", "D9"],
  };

  const bookedSeats = bookedSeatsByRoute[selectedRoute] || [];

  const handleConfirmBooking = () => {
    if (hasActiveBooking) {
      toast({
        title: "Cannot Book",
        description: "You already have an active booking.",
        variant: "destructive",
      });
      return;
    }

    if (selectedSeat) {
      const userData = localStorage.getItem("vshuttle_user");
      if (userData) {
        const user = JSON.parse(userData);
        user.bookings = user.bookings || [];
        user.bookings.push({
          route: selectedRoute,
          seat: selectedSeat,
          date: new Date().toISOString(),
          status: "active",
        });
        localStorage.setItem("vshuttle_user", JSON.stringify(user));
      }

      toast({
        title: "Booking Confirmed! 🎉",
        description: `Seat ${selectedSeat} on ${selectedRoute} route. Departure at 1:45 PM`,
      });

      setTimeout(() => {
        navigate("/dashboard");
      }, 1500);
    }
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      <header className="bg-gradient-hero text-primary-foreground p-6">
        <h1 className="text-2xl font-bold mb-2">Book Your Seat</h1>
        <p className="text-sm opacity-90">Select route and seat</p>
      </header>

      <main className="p-4 space-y-4">
        {/* Route Selection */}
        <Card className="p-4">
          <h2 className="font-bold mb-3">Select Route</h2>
          <div className="grid grid-cols-2 gap-2">
            {routes.map((route) => (
              <Button
                key={route.name}
                variant={selectedRoute === route.name ? "default" : "outline"}
                className="h-auto py-3 flex flex-col items-center gap-1"
                onClick={() => setSelectedRoute(route.name)}
                disabled={route.available === 0}
              >
                <span className="font-semibold">{route.name}</span>
                <span className="text-xs opacity-80">
                  {route.available} seats
                </span>
              </Button>
            ))}
          </div>
        </Card>

        {/* Seat Map */}
        <Card className="p-4">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-bold">Select Your Seat</h2>
            <div className="text-xs text-muted-foreground">
              Total: 50 seats
            </div>
          </div>

          {/* Legend */}
          <div className="flex gap-4 mb-4 text-xs">
            <div className="flex items-center gap-1">
              <div className="w-6 h-6 rounded border-2 border-primary bg-primary/10" />
              <span>Available</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-6 h-6 rounded bg-primary text-primary-foreground flex items-center justify-center">
                <Check className="w-4 h-4" />
              </div>
              <span>Selected</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-6 h-6 rounded bg-muted text-muted-foreground flex items-center justify-center">
                <X className="w-4 h-4" />
              </div>
              <span>Booked</span>
            </div>
          </div>

          {/* Driver Section */}
          <div className="mb-4 p-2 rounded bg-muted/30 text-center">
            <span className="text-xs font-semibold">🚗 Driver</span>
          </div>

          {/* Seat Layout */}
          <div className="space-y-2">
            {seatLayout.map(({ row, left, right }) => (
              <div key={row} className="flex items-center gap-2">
                {/* Row Number */}
                <div className="w-6 text-center text-xs font-semibold text-muted-foreground">
                  {row}
                </div>

                {/* Left Seats (2 seats) */}
                <div className="flex gap-1 flex-1">
                  {left.map((seat) => {
                    const isBooked = bookedSeats.includes(seat);
                    const isSelected = selectedSeat === seat;

                    return (
                      <button
                        key={seat}
                        onClick={() => {
                          if (!isBooked && !hasActiveBooking) {
                            setSelectedSeat(seat);
                          }
                        }}
                        disabled={isBooked || hasActiveBooking}
                        className={cn(
                          "flex-1 aspect-square rounded flex items-center justify-center text-xs font-medium transition-all",
                          isBooked &&
                            "bg-muted text-muted-foreground cursor-not-allowed",
                          !isBooked &&
                            !isSelected &&
                            "border-2 border-primary bg-primary/10 hover:bg-primary/20",
                          isSelected &&
                            "bg-primary text-primary-foreground shadow-md"
                        )}
                      >
                        {isBooked ? <X className="w-3 h-3" /> : seat}
                      </button>
                    );
                  })}
                </div>

                {/* Aisle */}
                <div className="w-4" />

                {/* Right Seats (3 seats) */}
                <div className="flex gap-1 flex-1">
                  {right.map((seat) => {
                    const isBooked = bookedSeats.includes(seat);
                    const isSelected = selectedSeat === seat;

                    return (
                      <button
                        key={seat}
                        onClick={() => {
                          if (!isBooked && !hasActiveBooking) {
                            setSelectedSeat(seat);
                          }
                        }}
                        disabled={isBooked || hasActiveBooking}
                        className={cn(
                          "flex-1 aspect-square rounded flex items-center justify-center text-xs font-medium transition-all",
                          isBooked &&
                            "bg-muted text-muted-foreground cursor-not-allowed",
                          !isBooked &&
                            !isSelected &&
                            "border-2 border-primary bg-primary/10 hover:bg-primary/20",
                          isSelected &&
                            "bg-primary text-primary-foreground shadow-md"
                        )}
                      >
                        {isBooked ? <X className="w-3 h-3" /> : seat}
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Booking Summary */}
        {selectedSeat && (
          <Card className="p-4 space-y-3">
            <h3 className="font-bold">Booking Summary</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Route:</span>
                <span className="font-semibold">{selectedRoute}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Seat:</span>
                <span className="font-semibold">{selectedSeat}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Departure:</span>
                <span className="font-semibold">1:45 PM</span>
              </div>
            </div>
            <Button
              onClick={handleConfirmBooking}
              className="w-full"
              size="lg"
              disabled={hasActiveBooking}
            >
              Confirm Booking
            </Button>
          </Card>
        )}
      </main>

      <MobileNav />
    </div>
  );
};

export default Booking;
