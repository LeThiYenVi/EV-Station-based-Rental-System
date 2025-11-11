import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { authService } from "@/service";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

/**
 * Google OAuth Callback Handler
 *
 * This component should be rendered at the route: /auth/callback
 * It handles the OAuth callback from Google.
 */
export default function GoogleCallbackPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState<"loading" | "success" | "error">(
    "loading",
  );
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const handleCallback = async () => {
      try {
        const code = searchParams.get("code");
        const state = searchParams.get("state");

        if (!code || !state) {
          throw new Error("Missing authorization code or state");
        }

        // Validate state
        const storedState = sessionStorage.getItem("oauth_state");
        if (state !== storedState) {
          throw new Error("Invalid state parameter - possible CSRF attack");
        }

        // Login with Google
        const response = await authService.loginWithGoogle(code, state);

        // Clean up
        sessionStorage.removeItem("oauth_state");

        setStatus("success");

        // Redirect after a short delay
        setTimeout(() => {
          navigate("/", { replace: true });
        }, 1500);
      } catch (error: any) {
        console.error("Google callback failed:", error);
        setStatus("error");
        setErrorMessage(
          error.response?.data?.message ||
            error.message ||
            "Failed to complete Google login",
        );

        // Redirect to login after error
        setTimeout(() => {
          navigate("/login?error=google_auth_failed", { replace: true });
        }, 3000);
      }
    };

    handleCallback();
  }, [searchParams, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-center">
            {status === "loading" && "Processing Google Login..."}
            {status === "success" && "Login Successful!"}
            {status === "error" && "Login Failed"}
          </CardTitle>
        </CardHeader>
        <CardContent className="text-center">
          {status === "loading" && (
            <div className="flex flex-col items-center space-y-4">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
              <p className="text-gray-600">Please wait...</p>
            </div>
          )}

          {status === "success" && (
            <div className="flex flex-col items-center space-y-4">
              <svg
                className="h-12 w-12 text-green-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
              <p className="text-gray-600">Redirecting to home page...</p>
            </div>
          )}

          {status === "error" && (
            <div className="flex flex-col items-center space-y-4">
              <svg
                className="h-12 w-12 text-red-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
              <p className="text-red-600">{errorMessage}</p>
              <p className="text-gray-600 text-sm">
                Redirecting to login page...
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
