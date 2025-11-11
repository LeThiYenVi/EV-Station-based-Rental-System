import "./global.css";

import { Toaster } from "@/components/ui/toaster";
import { createRoot } from "react-dom/client";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Customer/Index";
import About from "./pages/Customer/About/About";
import CarIn4 from "./pages/Customer/CarIn4/CarIn4";
import Blog from "./pages/Customer/Blog/Blog";
import In4Blog from "./pages/Customer/Blog/In4Blog";
import HistoryService from "./pages/Customer/HistoryService/HistoryService";
import OrderDetail from "./pages/Customer/OrderDetail/OrderDetail";
import SelfDrive from "./pages/Customer/SelfDrive/SelfDrive";
import PlaceSefDrive from "./pages/Customer/SelfDrive/PlaceSefDrive";
import UserProfile from "./pages/Customer/User/in4";
import Login from "./pages/Login/Login";
import AdminLayout from "./pages/Admin/AdminLayout";
import StaffLayout from "./pages/Staff/StaffLayout";
import NotificationDemo from "./pages/NotificationDemo";
import ResultDemo from "./pages/ResultDemo";
import ComponentsDemo from "./pages/ComponentsDemo";
import NotFound from "./pages/NotFound";
import { Layout } from "@/components/site/Layout";
import NearlyStations from "./pages/Customer/GeoStation/NearlyStations";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route
            path="/"
            element={
              <Layout>
                <Index />
              </Layout>
            }
          />
          <Route
            path="/nearly-stations"
            element={
              <Layout>
                <NearlyStations/>
              </Layout>
            }
          />
          <Route
            path="/about"
            element={
              <Layout>
                <About />
              </Layout>
            }
          />
          <Route
            path="/car/:id"
            element={
              <Layout>
                <CarIn4 />
              </Layout>
            }
          />
          <Route
            path="/news"
            element={
              <Layout>
                <Blog />
              </Layout>
            }
          />
          <Route
            path="/blog/:id"
            element={
              <Layout>
                <In4Blog />
              </Layout>
            }
          />
          <Route
            path="/history"
            element={
              <Layout>
                <HistoryService />
              </Layout>
            }
          />
          <Route
            path="/order/:id"
            element={
              <Layout>
                <OrderDetail />
              </Layout>
            }
          />
          <Route
            path="/services/self-drive"
            element={
              <Layout>
                <SelfDrive />
              </Layout>
            }
          />
          <Route
            path="/place/:location"
            element={
              <Layout>
                <PlaceSefDrive />
              </Layout>
            }
          />
          <Route
            path="/user/info"
            element={
              <Layout>
                <UserProfile />
              </Layout>
            }
          />
          <Route path="/login" element={<Login />} />
          <Route path="/admin/*" element={<AdminLayout />} />
          <Route path="/staff/*" element={<StaffLayout />} />
          <Route
            path="/demo/notifications"
            element={
              <Layout>
                <NotificationDemo />
              </Layout>
            }
          />
          <Route
            path="/demo/results"
            element={
              <Layout>
                <ResultDemo />
              </Layout>
            }
          />
          <Route
            path="/demo/components"
            element={
              <Layout>
                <ComponentsDemo />
              </Layout>
            }
          />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route
            path="*"
            element={
              <Layout>
                <NotFound />
              </Layout>
            }
          />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

createRoot(document.getElementById("root")!).render(<App />);
