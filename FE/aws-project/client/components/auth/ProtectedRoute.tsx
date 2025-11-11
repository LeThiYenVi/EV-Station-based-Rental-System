import { Navigate } from "react-router-dom";
import { authService } from "@/service";

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: string;
}

/**
 * Protected Route Component
 *
 * Wraps routes that require authentication.
 * Redirects to login if user is not authenticated.
 *
 * Usage:
 * ```tsx
 * <Route
 *   path="/dashboard"
 *   element={
 *     <ProtectedRoute>
 *       <DashboardPage />
 *     </ProtectedRoute>
 *   }
 * />
 *
 * // With role check
 * <Route
 *   path="/admin"
 *   element={
 *     <ProtectedRoute requiredRole="ADMIN">
 *       <AdminPage />
 *     </ProtectedRoute>
 *   }
 * />
 * ```
 */
export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  requiredRole,
}) => {
  const isAuthenticated = authService.isAuthenticated();

  if (!isAuthenticated) {
    // Redirect to login page
    return <Navigate to="/login" replace />;
  }

  // Check role if required
  if (requiredRole) {
    const user = authService.getCurrentUser();

    if (!user || user.role !== requiredRole) {
      // Redirect to unauthorized page or home
      return <Navigate to="/unauthorized" replace />;
    }
  }

  return <>{children}</>;
};

export default ProtectedRoute;
