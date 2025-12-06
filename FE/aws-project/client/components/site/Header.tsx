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
            <DropdownMenuContent
              className="w-[600px] p-6 bg-white rounded-2xl shadow-2xl border-0"
              align="start"
              sideOffset={12}
            >
              <div className="grid grid-cols-2 gap-4">
                {serviceItems.map((service, index) => (
                  <DropdownMenuItem
                    key={service.href}
                    asChild
                    className="p-0 focus:bg-transparent"
                  >
                    <div
                      onClick={(e) =>
                        handleProtectedNavigation(e, service.href)
                      }
                      className={`relative group cursor-pointer rounded-xl overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-1 ${
                        service.comingSoon ? "opacity-70" : ""
                      }`}
                    >
                      {/* Background Image */}
                      <div
                        className={`h-32 bg-cover bg-center ${
                          index === 0
                            ? "bg-[url('https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?w=400&h=200&fit=crop')]"
                            : index === 1
                              ? "bg-[url('https://images.unsplash.com/photo-1560179707-f14e90ef3623?w=400&h=200&fit=crop')]"
                              : index === 2
                                ? "bg-[url('https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=400&h=200&fit=crop')]"
                                : "bg-[url('https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?w=400&h=200&fit=crop')]"
                        }`}
                      >
                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

                        {/* Coming Soon Badge */}
                        {service.comingSoon && (
                          <div className="absolute top-2 right-2 bg-orange-500 text-white text-[10px] font-bold px-2 py-1 rounded-full">
                            SẮP RA MẮT
                          </div>
                        )}

                        {/* Content */}
                        <div className="absolute bottom-0 left-0 right-0 p-4">
                          <h3
                            className={`font-bold text-white text-sm mb-1 ${
                              index === 1 ? "text-green-400" : ""
                            }`}
                          >
                            {service.title}
                          </h3>
                          <p className="text-white/80 text-xs">
                            {service.subtitle}
                          </p>
                        </div>
                      </div>

                      {/* Hover effect overlay */}
                      <div className="absolute inset-0 bg-green-500/0 group-hover:bg-green-500/10 transition-all duration-300" />
                    </div>
                  </DropdownMenuItem>
                ))}
              </div>

              {/* Footer */}
              {/* <div className="mt-4 pt-4 border-t border-gray-100 text-center">
                <p className="text-xs text-gray-500">
                  🚗 Đa dạng dịch vụ thuê xe cho mọi nhu cầu
                </p>
              </div> */}
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
