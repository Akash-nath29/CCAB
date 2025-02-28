import { Switch, Route } from "wouter";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";
import { Toaster } from "@/components/ui/toaster";
import Navigation from "@/components/Navigation";
import Home from "@/pages/home";
import List from "@/pages/list";
import Mint from "@/pages/mint";
import ListCredit from "@/pages/list-credit";
import NotFound from "@/pages/not-found";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/list" component={List} />
      <Route path="/mint" component={Mint} />
      <Route path="/list-credit" component={ListCredit} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <div className="min-h-screen bg-background">
        <Navigation />
        <Router />
      </div>
      <Toaster />
    </QueryClientProvider>
  );
}

export default App;