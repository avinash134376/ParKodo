import React, { useState } from "react"; 
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ParkingProvider } from "./contexts/ParkingContext";
import { UserProvider } from "./contexts/UserContext";
import Index from "./pages/Index";
import Profile from "./pages/Profile";
import NotFound from "./pages/NotFound";
import SplashScreen from "./components/SplashScreen";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import Navbar from "./components/Navbar";

const stripePromise = loadStripe("pk_test_6pRNASCoBOKtIshFeQd4XMUh");

// Create a client
const queryClient = new QueryClient();

function App() {
  const [showSplash, setShowSplash] = useState(true);
  return (
    <QueryClientProvider client={queryClient}>
      <UserProvider>
        <ParkingProvider>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            {showSplash ? (
              <SplashScreen onFinish={() => setShowSplash(false)} />
            ) : (
            <Elements stripe={stripePromise}>
              <BrowserRouter>
                <Navbar />
                <main className="pt-20">
                  <Routes>
                    <Route path="/" element={<Index />} />
                    <Route path="/profile" element={<Profile />} />
                    {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL \"*\" ROUTE */}
                    <Route path="*" element={<NotFound />} />
                  </Routes>
                </main>
              </BrowserRouter>
            </Elements>
            )}
          </TooltipProvider>
        </ParkingProvider>
      </UserProvider>
    </QueryClientProvider>
  );
}

export default App;