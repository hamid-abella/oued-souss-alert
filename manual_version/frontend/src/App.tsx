import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AppSidebar } from "./components/AppSidebar.js";
import { SidebarProvider, SidebarInset } from "./components/ui/sidebar.js";
import Dashboard from "./pages/Dashboard.js";
import Alertes from "./pages/Alertes.js";
import Capteurs from "./pages/Capteurs.js";

export default function App() {
  return (
    <BrowserRouter>
      <SidebarProvider>
        <AppSidebar />
        <SidebarInset>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/alertes" element={<Alertes />} />
            <Route path="/capteurs" element={<Capteurs />} />
          </Routes>
        </SidebarInset>
      </SidebarProvider>
    </BrowserRouter>
  );
}
