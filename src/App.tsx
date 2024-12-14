import { Toaster } from "./components/ui/toaster";
import { Toaster as Sonner } from "./components/ui/sonner";
import { TooltipProvider } from "./components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { EditModalProvider } from "./contexts/EditModalContext";
import { ErrorBoundary } from "./components/ErrorBoundary";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Settings from "./pages/Settings";
import Templates from "./pages/Templates";
import Documentation from "./pages/Documentation";
import About from "./pages/About";
import Agents from "./pages/Agents";
import Tools from "./pages/Tools";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <EditModalProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/templates" element={<Templates />} />
          <Route path="/docs" element={<Documentation />} />
          <Route path="/about" element={<About />} />
          <Route path="/agents" element={<Agents />} />
          <Route path="/tools" element={
            <ErrorBoundary>
              <Tools />
            </ErrorBoundary>
          } />
        </Routes>
      </BrowserRouter>
        </BrowserRouter>
      </EditModalProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
