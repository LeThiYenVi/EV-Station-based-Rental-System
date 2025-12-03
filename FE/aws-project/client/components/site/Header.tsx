import { Link, useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { ChevronDown } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useMessage } from "@/components/ui/message";
import { useUser } from "@/hooks/useUser";
import "./Header.css";

const links = [
  { href: "/nearly-stations", label: "Tìm trạm gần bạn" },
  { href: "/about", label: "Về chúng tôi" },
  { href: "/news", label: "Tin tức" },
  { href: "/history", label: "Lịch sử thuê xe" },
];

const serviceItems = [
  {
    title: "THUÊ XE TỰ LÁI",
    subtitle: "Thuê xe đám cưới",
    color: "bg-gray-800",
    href: "/services/self-drive",
  },
  {
    title: "THUÊ XE CÓ TÀI XẾ",
    subtitle: "Đưa đón sân bay",
    color: "bg-green-500",
    href: "/services/chauffeur",
    comingSoon: true,
  },
  {
    title: "THUÊ XE SỰ KIỆN",
    subtitle: "Đưa đón đường dài",
    color: "bg-gray-800",
    href: "/services/events",
    comingSoon: true,
  },
  {
    title: "SỞ HỮU XE LINH HOẠT",
    subtitle: "Đặt xe đưa đón",
    color: "bg-gray-800",
    href: "/services/flexible-ownership",
    comingSoon: true,
  },
];

export function Header() {
  const navigate = useNavigate();
  const location = useLocation();
  const { contextHolder, showWarning } = useMessage();
  const { getMyStats } = useUser();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState("");
  const [displayName, setDisplayName] = useState("");

  // Check if we're on the homepage
  const isHomePage = location.pathname === "/";

  // Determine if header should be transparent (on homepage and not scrolled)
  const isTransparent = isHomePage && !isScrolled;

  // Check if current path matches the link
  const isActive = (href: string) => {
    if (href === "/" && location.pathname === "/") return true;
    if (href !== "/" && location.pathname.startsWith(href)) return true;
    return false;
  };

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Check login status from localStorage and fetch user info
  useEffect(() => {
    const checkLoginStatus = async () => {
      const loggedIn = localStorage.getItem("isLoggedIn") === "true";
      const user = localStorage.getItem("username") || "";
      const token = localStorage.getItem("accessToken");

      setIsLoggedIn(loggedIn);
      setUsername(user);

      // If logged in and has token, fetch full name from API
      if (loggedIn && token) {
        try {
          const result = await getMyStats();
          if (result.success && result.data) {
            // Use fullName if available, otherwise fall back to email
            setDisplayName(result.data.fullName || result.data.email || user);
          }
        } catch (error) {
          console.error("Error fetching user info for header:", error);
          setDisplayName(user);
        }
      } else {
        setDisplayName(user);
      }
    };

    checkLoginStatus();

    // Listen for storage changes (for login/logout from other tabs)
    window.addEventListener("storage", checkLoginStatus);
    // Custom event for same-tab login/logout
    window.addEventListener("loginStatusChanged", checkLoginStatus);

    return () => {
      window.removeEventListener("storage", checkLoginStatus);
      window.removeEventListener("loginStatusChanged", checkLoginStatus);
    };
  }, [getMyStats]);

  const handleLogout = () => {
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("username");
    setIsLoggedIn(false);
    setUsername("");

    // Dispatch custom event
    window.dispatchEvent(new Event("loginStatusChanged"));

    // Redirect to home
    window.location.href = "/";
  };

  const handleProtectedNavigation = (e: React.MouseEvent, href: string) => {
    if (!isLoggedIn) {
      e.preventDefault();
      showWarning("Vui lòng đăng nhập để sử dụng tính năng này");
    } else {
      navigate(href);
    }
  };

  return (
    <header
      className={`fixed top-0 z-50 w-full transition-all duration-300 ${
        isTransparent
          ? "bg-transparent border-transparent"
          : "bg-white border-b border-gray-200 shadow-sm"
      }`}
    >
      {contextHolder}
      <div className="container flex h-16 items-center justify-between">
        <Link to="/" className="flex items-center gap-3">
          <div
            className={`w-12 h-12 rounded-lg flex items-center justify-center font-bold text-xl ${
              isTransparent
                ? "bg-white/20 backdrop-blur-sm text-white"
                : "bg-green-500 text-white"
            }`}
          >
            M
          </div>
          <div className="flex flex-col leading-tight">
            <span
              className={`text-xl font-bold ${isTransparent ? "text-white" : "text-black"}`}
            >
              BF Car Rental
            </span>
            <span
              className={`text-xs ${isTransparent ? "text-white/80" : "text-gray-600"}`}
            >
              Thuê xe tự lái
            </span>
          </div>
        </Link>

        <nav className="hidden md:flex items-center gap-8">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                className={`flex items-center gap-1 font-medium transition ${
                  isTransparent
                    ? "text-white hover:text-green-300"
                    : "text-gray-700 hover:text-green-500"
                }`}
              >
                Dịch vụ
                <ChevronDown className="h-4 w-4" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="dropdown-content">
              <div className="services-grid">
                {serviceItems.map((service, index) => (
                  <DropdownMenuItem key={service.href} asChild className="p-0">
                    <div
                      onClick={(e) =>
                        handleProtectedNavigation(e, service.href)
                      }
                      className="service-card cursor-pointer"
                    >
                      <div
                        className={`service-image ${
                          index === 0
                            ? "service-self-drive"
                            : index === 1
                              ? "service-chauffeur"
                              : index === 2
                                ? "service-events"
                                : "service-flexible"
                        }`}
                      >
                        {service.comingSoon && (
                          <div className="coming-soon">COMING SOON</div>
                        )}
                      </div>
                      <h3
                        className={`service-title ${index === 1 ? "service-title-green" : ""}`}
                      >
                        {service.title}
                      </h3>
                      <p className="service-subtitle">{service.subtitle}</p>
                    </div>
                  </DropdownMenuItem>
                ))}
              </div>
            </DropdownMenuContent>
          </DropdownMenu>

          {links.map((item) => (
            <a
              key={item.href}
              onClick={(e) => handleProtectedNavigation(e, item.href)}
              className={`font-medium transition cursor-pointer ${
                isActive(item.href)
                  ? isTransparent
                    ? "text-green-300 font-bold"
                    : "text-green-600 font-bold"
                  : isTransparent
                    ? "text-white hover:text-green-300"
                    : "text-gray-700 hover:text-green-500"
              }`}
            >
              {item.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          {isLoggedIn ? (
            <>
              <Link
                to="/user/info"
                className={`hidden md:flex font-medium transition-colors ${
                  isTransparent
                    ? "text-white hover:text-green-300"
                    : "text-gray-700 hover:text-green-600"
                }`}
              >
                Xin chào,{" "}
                <span
                  className={`ml-1 hover:underline ${isTransparent ? "text-green-300" : "text-green-600"}`}
                >
                  {displayName || username}
                </span>
              </Link>
              <Button
                variant="outline"
                className={
                  isTransparent
                    ? "border-transparent bg-transparent text-green-500 hover:bg-green-50/10"
                    : "border-green-500 text-green-600 hover:bg-green-50"
                }
                onClick={handleLogout}
              >
                Đăng xuất
              </Button>
            </>
          ) : (
            <>
              <Button
                variant="ghost"
                className={`hidden md:flex ${
                  isTransparent
                    ? "text-white hover:text-green-300 hover:bg-white/10"
                    : "text-gray-700 hover:text-green-500 hover:bg-green-50"
                }`}
                asChild
              >
                <Link to="/login?mode=register">Đăng ký</Link>
              </Button>
              <Button
                className="bg-green-500 hover:bg-green-600 text-white"
                asChild
              >
                <Link to="/login">Đăng nhập</Link>
              </Button>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
