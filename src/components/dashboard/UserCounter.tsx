
import { useEffect, useState } from "react";
import { Users } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const UserCounter = () => {
  const [onlineUsers, setOnlineUsers] = useState(0);

  useEffect(() => {
    // In a real app, this would connect to a backend service
    // For demo, we'll simulate random online users
    const randomUsers = Math.floor(Math.random() * 15) + 5; // Between 5 and 20
    setOnlineUsers(randomUsers);

    // Simulate users coming online and going offline
    const interval = setInterval(() => {
      setOnlineUsers(prev => {
        const change = Math.floor(Math.random() * 3) - 1; // -1, 0, or 1
        return Math.max(1, Math.min(30, prev + change)); // Keep between 1 and 30
      });
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-muted-foreground">Online Users</p>
            <h3 className="text-2xl font-bold mt-1">{onlineUsers}</h3>
          </div>
          <div className="w-12 h-12 rounded-full flex items-center justify-center bg-blue-100 text-blue-600">
            <Users className="h-6 w-6" />
          </div>
        </div>
        <div className="mt-4 text-sm text-blue-600">
          Active in the last 5 minutes
        </div>
      </CardContent>
    </Card>
  );
};

export default UserCounter;
