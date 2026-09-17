import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import Home from "./pages/Home";
import Outgoing from "./pages/Outgoing";
import Tracking from "./pages/Tracking";
import CourierMonitoring from "./pages/CourierMonitoring";
import About from "./pages/About";
import Help from "./pages/Help";
import Login from "./pages/Login";

function Router() {
  return (
    <Switch>
      <Route path="/login" component={Login} />
      <Route path="/" component={Home} />
      <Route path="/outgoing" component={Outgoing} />
      <Route path="/tracking" component={Tracking} />
      <Route path="/courier-monitoring" component={CourierMonitoring} />
      <Route path="/about" component={About} />
      <Route path="/help" component={Help} />
      <Route path="/404" component={NotFound} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="dark">
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
