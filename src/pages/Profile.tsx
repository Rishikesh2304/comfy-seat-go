import { useState, useEffect } from "react";
import MobileNav from "@/components/MobileNav";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { User, Award, Calendar, LogOut, Clock, Ticket } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface Booking {
  route: string;
  seat: string;
  date: string;
  status?: string;
}

interface UserData {
  username: string;
  honestyScore: number;
  bookings: Booking[];
}

const Profile = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [userData, setUserData] = useState<UserData>(() => {
    const stored = localStorage.getItem("vshuttle_user");
    return stored ? JSON.parse(stored) : { username: "Guest", honestyScore: 100, bookings: [] };
  });

  useEffect(() => {
    const stored = localStorage.getItem("vshuttle_user");
    if (stored) {
      setUserData(JSON.parse(stored));
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("vshuttle_user");
    navigate("/login");
  };

  const handleCancelBooking = (index: number) => {
    const updatedBookings = [...userData.bookings];
    updatedBookings[index].status = "cancelled";
    
    const updatedUserData = {
      ...userData,
      bookings: updatedBookings,
    };
    
    setUserData(updatedUserData);
    localStorage.setItem("vshuttle_user", JSON.stringify(updatedUserData));
    
    toast({
      title: "Booking Cancelled",
      description: "Your booking has been cancelled successfully.",
    });
  };

  const activeBookings = userData.bookings?.filter(
    (booking) => booking.status !== "cancelled"
  ) || [];

  const cancelledBookings = userData.bookings?.filter(
    (booking) => booking.status === "cancelled"
  ) || [];

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <header className="bg-gradient-hero p-6 text-primary-foreground">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-primary-foreground/20 flex items-center justify-center">
            <User className="w-8 h-8" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">{userData.username}</h1>
            <p className="text-sm opacity-90">VIT Student</p>
          </div>
        </div>
      </header>

      <div className="p-4 space-y-4">
        {/* Stats */}
        <div className="grid grid-cols-2 gap-4">
          <Card className="p-4">
            <div className="flex items-center gap-3">
              <Award className="w-8 h-8 text-primary" />
              <div>
                <p className="text-xs text-muted-foreground">Honesty Score</p>
                <p className="text-2xl font-bold">{userData.honestyScore}</p>
              </div>
            </div>
          </Card>

          <Card className="p-4">
            <div className="flex items-center gap-3">
              <Calendar className="w-8 h-8 text-primary" />
              <div>
                <p className="text-xs text-muted-foreground">Total Rides</p>
                <p className="text-2xl font-bold">{userData.bookings?.length || 0}</p>
              </div>
            </div>
          </Card>
        </div>

        {/* Active Bookings */}
        <Card className="p-4">
          <div className="flex items-center gap-2 mb-4">
            <Ticket className="w-5 h-5 text-primary" />
            <h2 className="font-bold">Active Bookings</h2>
          </div>

          {activeBookings.length > 0 ? (
            <div className="space-y-3">
              {activeBookings.map((booking, index) => {
                const originalIndex = userData.bookings?.indexOf(booking);
                return (
                  <Card key={index} className="p-4 bg-muted/30">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <p className="font-semibold text-lg">{booking.route}</p>
                        <p className="text-sm text-muted-foreground">
                          {new Date(booking.date).toLocaleDateString()}
                        </p>
                      </div>
                      <Badge className="bg-success text-success-foreground">
                        Active
                      </Badge>
                    </div>
                    
                    <div className="space-y-2 mb-3">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Seat Number:</span>
                        <span className="font-semibold">{booking.seat}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Departure:</span>
                        <span className="font-semibold">1:45 PM</span>
                      </div>
                    </div>

                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="destructive" size="sm" className="w-full">
                          Cancel Booking
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Cancel Booking?</AlertDialogTitle>
                          <AlertDialogDescription>
                            Are you sure you want to cancel this booking? This action cannot be undone.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>No, Keep it</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => handleCancelBooking(originalIndex)}
                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                          >
                            Yes, Cancel
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </Card>
                );
              })}
            </div>
          ) : (
            <p className="text-center text-muted-foreground py-4 text-sm">
              No active bookings
            </p>
          )}
        </Card>

        {/* Booking History */}
        <Card className="p-4">
          <div className="flex items-center gap-2 mb-4">
            <Clock className="w-5 h-5 text-primary" />
            <h2 className="font-bold">Booking History</h2>
          </div>

          {cancelledBookings.length > 0 ? (
            <div className="space-y-2">
              {cancelledBookings.map((booking, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 rounded-lg bg-muted/30"
                >
                  <div>
                    <p className="text-sm font-semibold">{booking.route}</p>
                    <p className="text-xs text-muted-foreground">
                      Seat {booking.seat} • {new Date(booking.date).toLocaleDateString()}
                    </p>
                  </div>
                  <Badge variant="destructive">Cancelled</Badge>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center text-muted-foreground py-4 text-sm">
              No cancelled bookings
            </p>
          )}
        </Card>

        {/* Logout Button */}
        <Button
          variant="outline"
          className="w-full"
          onClick={handleLogout}
          size="lg"
        >
          <LogOut className="w-4 h-4" />
          Logout
        </Button>
      </div>

      <MobileNav />
    </div>
  );
};

export default Profile;
