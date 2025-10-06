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

const links = [
  { href: "/about", label: "Về chúng tôi" },
  { href: "/used-cars", label: "Mua xe cũ chính hãng" },
  { href: "/news", label: "Tin tức" },
];

const serviceItems = [
  {
    title: "THUÊ XE CÓ TÀI",
    subtitle: "Đưa đón sân bay",
    color: "bg-green-500",
    href: "/services/chauffeur",
  },
  {
    title: "THUÊ XE TỰ LÁI",
    subtitle: "Thuê xe đám cưới",
    color: "bg-gray-800",
    href: "/services/self-drive",
  },
  {
    title: "THUÊ XE SỰ KIỆN",
    subtitle: "Đưa đón đường dài",
    color: "bg-gray-800",
    href: "/services/events",
  },
  {
    title: "SỞ HỮU XE LINH HOẠT",
    subtitle: "Đặt xe đưa đón",
    color: "bg-gray-800",
    href: "/services/flexible-ownership",
  },
];

export function Header() {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

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
                            ? "service-chauffeur"
                            : index === 1
                              ? "service-self-drive"
                              : index === 2
                                ? "service-events"
                                : "service-flexible"
                        }`}
                      >
                        {(index === 2 || index === 3) && (
                          <div className="coming-soon">COMING SOON</div>
                        )}
                      </div>
                      <h3
                        className={`service-title ${index === 0 ? "service-title-green" : ""}`}
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
          <Button
            variant="ghost"
            className="hidden md:flex text-gray-700 hover:text-green-500 hover:bg-green-50"
          >
            Đăng ký
          </Button>
          <Button className="bg-green-500 hover:bg-green-600 text-white">
            Đăng nhập
          </Button>
        </div>
      </div>
    </header>
  );
}
