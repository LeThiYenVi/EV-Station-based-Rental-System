import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Result404 } from "../components/ui/results";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname,
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <Result404 />
    </div>
  );
};

export default NotFound;
