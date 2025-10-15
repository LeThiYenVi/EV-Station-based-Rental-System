import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { ChevronDown } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import "./Header.css";

const links = [
  { href: "/about", label: "Về chúng tôi" },
  { href: "/news", label: "Tin tức" },
  { href: "/history", label: "Lịch sử giao dịch" },
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
  const [isScrolled, setIsScrolled] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState("");

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Check login status from localStorage
  useEffect(() => {
    const checkLoginStatus = () => {
      const loggedIn = localStorage.getItem("isLoggedIn") === "true";
      const user = localStorage.getItem("username") || "";
      setIsLoggedIn(loggedIn);
      setUsername(user);
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
  }, []);

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

  return (
    <header className="sticky top-0 z-50 w-full bg-white border-b border-gray-200 shadow-sm">
      <div className="container flex h-16 items-center justify-between">
        <Link to="/" className="flex items-center gap-3">
          <div className="w-12 h-12 bg-green-500 rounded-lg flex items-center justify-center text-white font-bold text-xl">
            M
          </div>
          <div className="flex flex-col leading-tight">
            <span className="text-xl font-bold text-black">MIOTO</span>
            <span className="text-xs text-gray-600">Thuê xe tự lái</span>
          </div>
        </Link>

        <nav className="hidden md:flex items-center gap-8">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="flex items-center gap-1 text-gray-700 hover:text-green-500 font-medium transition">
                Dịch vụ
                <ChevronDown className="h-4 w-4" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="dropdown-content">
              <div className="services-grid">
                {serviceItems.map((service, index) => (
                  <DropdownMenuItem key={service.href} asChild className="p-0">
                    <Link to={service.href} className="service-card">
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
                    </Link>
                  </DropdownMenuItem>
                ))}
              </div>
            </DropdownMenuContent>
          </DropdownMenu>

          {links.map((item) => (
            <Link
              key={item.href}
              to={item.href}
              className="text-gray-700 hover:text-green-500 font-medium transition"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          {isLoggedIn ? (
            <>
              <span className="hidden md:flex text-gray-700 font-medium">
                Xin chào,{" "}
                <span className="text-green-600 ml-1">{username}</span>
              </span>
              <Button
                variant="outline"
                className="border-green-500 text-green-600 hover:bg-green-50"
                onClick={handleLogout}
              >
                Đăng xuất
              </Button>
            </>
          ) : (
            <>
              <Button
                variant="ghost"
                className="hidden md:flex text-gray-700 hover:text-green-500 hover:bg-green-50"
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
