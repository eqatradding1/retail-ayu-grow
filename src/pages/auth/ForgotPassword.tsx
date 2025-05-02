
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import { toast } from "@/components/ui/sonner";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email) {
      toast.error("Please enter your email address.");
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // In a real app, this would call a backend API to send a password reset email
      // For this demo, we'll just simulate a successful request
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      setIsSubmitted(true);
      toast.success("Password reset instructions sent! Please check your email.");
    } catch (error) {
      toast.error("Failed to send reset instructions. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="space-y-2 text-center">
        <h1 className="text-2xl font-bold">Reset your password</h1>
        {!isSubmitted ? (
          <p className="text-muted-foreground">
            Enter your email address and we'll send you instructions to reset your password.
          </p>
        ) : (
          <p className="text-muted-foreground">
            If an account exists for {email}, you will receive password reset instructions.
          </p>
        )}
      </div>

      {!isSubmitted ? (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid gap-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="name@example.com"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={isSubmitting}
            />
          </div>
          
          <Button
            type="submit"
            className="w-full"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Sending..." : "Reset Password"}
          </Button>
        </form>
      ) : (
        <div className="p-4 bg-green-50 border border-green-100 rounded-md space-y-3">
          <p className="text-sm">
            We've sent an email to <span className="font-medium">{email}</span> with instructions to reset your password.
          </p>
          <p className="text-sm">
            Please check your inbox and follow the link in the email. If you don't see it, check your spam folder.
          </p>
        </div>
      )}
      
      <div className="text-center">
        <Link
          to="/auth/login"
          className="inline-flex items-center text-sm text-primary hover:underline"
        >
          <ArrowLeft className="w-4 h-4 mr-1" />
          Back to login
        </Link>
      </div>
    </div>
  );
}
