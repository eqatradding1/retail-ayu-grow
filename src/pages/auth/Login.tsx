
import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/components/ui/sonner";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { signIn } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = (location.state as any)?.from || "/dashboard";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await signIn(email, password);
      navigate(from, { replace: true });
    } catch (error) {
      console.error("Login failed:", error);
      // Error toast is shown by the auth context
    } finally {
      setIsSubmitting(false);
    }
  };

  // Show demo credentials
  const fillDemoCredentials = (role: string) => {
    switch (role) {
      case "owner":
        setEmail("owner@retailayu.com");
        setPassword("password");
        toast.info("Owner credentials filled. You can now sign in.");
        break;
      case "warehouse":
        setEmail("warehouse@retailayu.com");
        setPassword("password");
        toast.info("Warehouse admin credentials filled. You can now sign in.");
        break;
      case "cashier":
        setEmail("cashier@retailayu.com");
        setPassword("password");
        toast.info("Cashier credentials filled. You can now sign in.");
        break;
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h1 className="text-2xl font-semibold">Sign In</h1>
        <p className="text-muted-foreground mt-2">
          Welcome back! Please enter your credentials below.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            disabled={isSubmitting}
            className="retailayu-input"
          />
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="password">Password</Label>
            <Link
              to="/auth/forgot-password"
              className="text-sm text-retailayu-purple hover:underline"
            >
              Forgot password?
            </Link>
          </div>
          <Input
            id="password"
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            disabled={isSubmitting}
            className="retailayu-input"
          />
        </div>

        <Button
          type="submit"
          disabled={isSubmitting}
          className="w-full retailayu-gradient"
        >
          {isSubmitting ? (
            <div className="flex items-center">
              <div className="w-4 h-4 border-2 border-t-transparent border-white rounded-full animate-spin mr-2"></div>
              Signing in...
            </div>
          ) : (
            "Sign In"
          )}
        </Button>
      </form>

      <div className="text-center text-sm">
        <p>
          Don't have an account?{" "}
          <Link
            to="/auth/register"
            className="text-retailayu-purple hover:underline font-semibold"
          >
            Sign up
          </Link>
        </p>
      </div>

      {/* Demo Account Section */}
      <div className="border-t pt-4 mt-6">
        <p className="text-center text-sm text-muted-foreground mb-3">
          Demo Accounts (use password "password" for all)
        </p>
        <div className="flex flex-col sm:flex-row gap-2 justify-center">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => fillDemoCredentials("owner")}
          >
            Owner Account
          </Button>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => fillDemoCredentials("warehouse")}
          >
            Warehouse Admin
          </Button>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => fillDemoCredentials("cashier")}
          >
            Cashier Account
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Login;
