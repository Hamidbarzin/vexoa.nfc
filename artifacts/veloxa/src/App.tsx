import { Switch, Route, Router as WouterRouter } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";

import Landing from "@/pages/landing";
import AdminCards from "@/pages/admin/cards";
import AdminLeads from "@/pages/admin/leads";
import AdminOwners from "@/pages/admin/owners";
import AdminSponsors from "@/pages/admin/sponsors";
import AdminCrm from "@/pages/admin/crm";
import ProfileSettings from "@/pages/profile/settings";
import NfcFlow from "@/pages/public/nfc-flow";
import ActivatePage from "@/pages/public/activate";
import LoginPage from "@/pages/auth/login";
import { AdminLayout } from "@/components/layout/AdminLayout";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
      staleTime: 30_000,
    },
  },
});

function AdminRoute({ component: Component }: { component: React.ComponentType }) {
  return (
    <AdminLayout>
      <Component />
    </AdminLayout>
  );
}

function Router() {
  return (
    <Switch>
      <Route path="/" component={Landing} />

      {/* Public NFC routes */}
      <Route path="/u/:token" component={NfcFlow} />
      <Route path="/activate/:token" component={ActivatePage} />

      {/* Auth */}
      <Route path="/login" component={LoginPage} />

      {/* Admin */}
      <Route path="/admin/leads">
        <AdminRoute component={AdminLeads} />
      </Route>
      <Route path="/admin/owners">
        <AdminRoute component={AdminOwners} />
      </Route>
      <Route path="/admin/cards">
        <AdminRoute component={AdminCards} />
      </Route>
      <Route path="/admin/sponsors">
        <AdminRoute component={AdminSponsors} />
      </Route>
      <Route path="/admin/crm">
        <AdminRoute component={AdminCrm} />
      </Route>

      {/* Profile */}
      <Route path="/profile/settings">
        <AdminRoute component={ProfileSettings} />
      </Route>

      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
          <Router />
        </WouterRouter>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
