
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import RaffleDetail from "./pages/RaffleDetail";
import CreateRaffle from "./pages/CreateRaffle";
import History from "./pages/History";
import NotFound from "./pages/NotFound";
import Navbar from "./components/layout/Navbar";
import { AnimatePresence } from "framer-motion";
import { RaffleProvider } from "./contexts/RaffleContext";
import { ThemeProvider } from "./contexts/ThemeContext";
import Admin from "./pages/Admin";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <RaffleProvider>
          <BrowserRouter>
            <div className="flex min-h-screen flex-col bg-background">
              <div className="flex-1">
                <AnimatePresence mode="wait">
                  <Routes>
                    <Route path="/" element={<Index />} />
                    <Route path="/raffle/:id" element={<RaffleDetail />} />
                    <Route path="/create" element={<CreateRaffle />} />
                    <Route path="/history" element={<History />} />
                    <Route path="/admin/*" element={<Admin />} />
                    <Route path="*" element={<NotFound />} />
                  </Routes>
                </AnimatePresence>
              </div>
              <Navbar />
            </div>
          </BrowserRouter>
        </RaffleProvider>
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
