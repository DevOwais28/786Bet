import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";

export default function Login() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    remember: false,
  });

  const loginMutation = useMutation({
    mutationFn: async (data: { email: string; password: string }) => {
      const response = await apiRequest("POST", "/api/auth/login", data);
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Login successful",
        description: "Welcome back to 786Bet.casino",
      });
      setLocation("/dashboard");
    },
    onError: (error) => {
      toast({
        title: "Login failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    loginMutation.mutate({
      email: formData.email,
      password: formData.password,
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 hero-bg">
      <div className="max-w-md w-full space-y-8 bg-gray-800/50 p-8 rounded-2xl backdrop-blur-sm">
        <div className="text-center">
          <Link href="/">
            <div className="flex items-center justify-center space-x-2 mb-6 cursor-pointer">
              <span className="text-3xl font-bold text-gold">786Bet</span>
              <span className="text-white text-xl">.casino</span>
            </div>
          </Link>
          <h2 className="text-3xl font-bold mb-2 tracking-wide">Welcome Back</h2>
          <p className="text-gray-400">Sign in to your account</p>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <Label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
              Email Address
            </Label>
            <Input
              type="email"
              id="email"
              required
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gold focus:border-transparent transition-all duration-300"
              placeholder="Enter your email"
            />
          </div>
          
          <div>
            <Label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-2">
              Password
            </Label>
            <Input
              type="password"
              id="password"
              required
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gold focus:border-transparent transition-all duration-300"
              placeholder="Enter your password"
            />
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="remember"
                checked={formData.remember}
                onCheckedChange={(checked) => setFormData({ ...formData, remember: !!checked })}
              />
              <Label htmlFor="remember" className="text-sm text-gray-400">
                Remember me
              </Label>
            </div>
            <a href="#" className="text-sm text-gold hover:text-emerald transition-colors duration-300">
              Forgot password?
            </a>
          </div>
          
          <Button
            type="submit"
            disabled={loginMutation.isPending}
            className="w-full rounded-2xl bg-gold hover:bg-emerald text-black font-bold px-6 py-3 shadow-md transition-all duration-300"
          >
            {loginMutation.isPending ? "Signing In..." : "Sign In"}
          </Button>
          
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-600"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-gray-800 text-gray-400">Or continue with</span>
            </div>
          </div>
          
          <Button
            type="button"
            variant="outline"
            className="w-full flex items-center justify-center px-4 py-3 border border-gray-600 rounded-xl text-gray-300 bg-gray-700 hover:bg-gray-600 transition-all duration-300"
          >
            <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
              <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            Continue with Google
          </Button>
        </form>
        
        <div className="text-center">
          <span className="text-gray-400">Don't have an account? </span>
          <Link href="/register" className="text-gold hover:text-emerald transition-colors duration-300 font-medium">
              Sign up
          </Link>
        </div>
      </div>
    </div>
  );
}
