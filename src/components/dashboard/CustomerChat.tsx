
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { toast } from "sonner";
import { Send } from "lucide-react";

const CustomerChat = () => {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [message, setMessage] = useState("");

  const handleSendWhatsApp = () => {
    if (!phoneNumber || !message) {
      toast.error("Please enter both phone number and message");
      return;
    }

    // Clean the phone number (remove any non-digit characters)
    const cleanNumber = phoneNumber.replace(/\D/g, '');
    
    // Check if the number is valid
    if (cleanNumber.length < 10) {
      toast.error("Please enter a valid phone number");
      return;
    }

    // Create WhatsApp URL with the phone number and message
    const whatsappUrl = `https://wa.me/${cleanNumber}?text=${encodeURIComponent(message)}`;
    
    // Open WhatsApp in a new tab
    window.open(whatsappUrl, '_blank');
    
    toast.success("WhatsApp opened with your message");
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Customer Chat</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="phone">Customer Phone Number</Label>
          <Input
            id="phone"
            placeholder="Enter phone number (with country code)"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
          />
          <p className="text-xs text-muted-foreground">
            Example: 62812345678 (Indonesia)
          </p>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="message">Message</Label>
          <Input
            id="message"
            placeholder="Enter your message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
        </div>
      </CardContent>
      <CardFooter>
        <Button 
          className="w-full"
          onClick={handleSendWhatsApp}
        >
          <Send className="mr-2 h-4 w-4" />
          Send WhatsApp
        </Button>
      </CardFooter>
    </Card>
  );
};

export default CustomerChat;
