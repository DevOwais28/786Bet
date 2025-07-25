import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import Home from "@/pages/home";
import Login from "@/pages/login";
import Register from "@/pages/register";
import Dashboard from "@/pages/dashboard";
import GameRoom from "@/pages/game-room";
import Admin from "@/pages/admin";
import Deposit from "@/pages/deposit";
import Withdraw from "@/pages/withdraw";
import AviatorGame from "@/pages/aviator";
import AdminDashboard from "@/pages/admin/dashboard";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/login" component={Login} />
      <Route path="/register" component={Register} />
      <Route path="/dashboard" component={Dashboard} />
      <Route path="/game-room" component={GameRoom} />
      <Route path="/admin" component={Admin} />
      <Route path="/admin/dashboard" component={AdminDashboard} />
      <Route path="/aviator" component={AviatorGame} />
      <Route path="/deposit" component={Deposit} />
      <Route path="/withdraw" component={Withdraw} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
