import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { UserProvider } from "@/contexts/UserContext";
import LanguageSelection from "./pages/LanguageSelection";
import CreateAccount from "./pages/CreateAccount";
import Dashboard from "./pages/Dashboard";
import PostsPage from "./pages/PostsPage";
import MissingItemsPage from "./pages/MissingItemsPage";
import EventsPage from "./pages/EventsPage";
import VisitPlacesPage from "./pages/VisitPlacesPage";
import CrowdDetectionPage from "./pages/CrowdDetectionPage";
import TransportPage from "./pages/TransportPage";
import RoomsPage from "./pages/RoomsPage";
import HelplinePage from "./pages/HelplinePage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <LanguageProvider>
      <UserProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<LanguageSelection />} />
              <Route path="/signup" element={<CreateAccount />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/posts" element={<PostsPage />} />
              <Route path="/missing-items" element={<MissingItemsPage />} />
              <Route path="/events" element={<EventsPage />} />
              <Route path="/visit-places" element={<VisitPlacesPage />} />
              <Route path="/crowd-detection" element={<CrowdDetectionPage />} />
              <Route path="/transport" element={<TransportPage />} />
              <Route path="/rooms" element={<RoomsPage />} />
              <Route path="/helpline" element={<HelplinePage />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </UserProvider>
    </LanguageProvider>
  </QueryClientProvider>
);

export default App;
