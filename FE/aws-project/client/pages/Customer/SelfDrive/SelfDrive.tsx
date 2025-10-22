import { useState } from "react";
import { Link } from "react-router-dom";
import {
  Car,
  Shield,
  MapPin,
  Clock,
  Star,
  Search,
  SlidersHorizontal,
  ChevronRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function SelfDrive() {
  const [searchTerm, setSearchTerm] = useState("");

  const benefits = [
    {
      icon: Shield,
      title: "Bảo hiểm toàn diện",
      description: "Bảo hiểm vật chất & tai nạn cho người ngồi trên xe",
    },
    {
      icon: MapPin,
      title: "Giao xe tận nơi",
      description: "Miễn phí giao xe trong bán kính 10km",
    },
    {
      icon: Clock,
      title: "Hỗ trợ 24/7",
      description: "Đội ngũ chăm sóc khách hàng luôn sẵn sàng hỗ trợ",
    },
    {
      icon: Star,
      title: "Xe chất lượng cao",
      description: "Đội xe đa dạng, được bảo dưỡng định kỳ",
    },
  ];

  const cars = [
    {
      id: 1,
      name: "VinFast VF 3",
      image:
        "https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=800&h=600&fit=crop",
      badge: "Miễn phí sốc",
      transmission: "Minicar",
      seats: "4 chỗ",
      fuel: "210km (NEDC)",
      price: "590.000",
      rating: 4.9,
      trips: 120,
    },
    {
      id: 2,
      name: "VinFast VF 6 Plus",
      image:
        "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=800&h=600&fit=crop",
      badge: "Miễn phí sốc",
      transmission: "B-SUV",
      seats: "5 chỗ",
      fuel: "460km (NEDC)",
      price: "1.250.000",
      rating: 5.0,
      trips: 98,
    },
    {
      id: 3,
      name: "VinFast VF 5 Plus",
      image:
        "https://images.unsplash.com/photo-1580273916550-e323be2ae537?w=800&h=600&fit=crop",
      badge: "Miễn phí sốc",
      transmission: "A-SUV",
      seats: "5 chỗ",
      fuel: "380km (NEDC)",
      price: "890.000",
      rating: 4.8,
      trips: 156,
    },
    {
      id: 4,
      name: "VinFast VF 7 Plus",
      image:
        "https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=800&h=600&fit=crop",
      badge: "Miễn phí sốc",
      transmission: "C-SUV",
      seats: "5 chỗ",
      fuel: "450km (NEDC)",
      price: "1.450.000",
      rating: 4.9,
      trips: 87,
    },
    {
      id: 5,
      name: "VinFast VF 8 Plus",
      image:
        "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=800&h=600&fit=crop",
      badge: "Miễn phí sốc",
      transmission: "C-SUV",
      seats: "5 chỗ",
      fuel: "471km (NEDC)",
      price: "1.650.000",
      rating: 5.0,
      trips: 64,
    },
    {
      id: 6,
      name: "VinFast VF 3",
      image:
        "https://images.unsplash.com/photo-1583121274602-3e2820c69888?w=800&h=600&fit=crop",
      badge: "Miễn phí sốc",
      transmission: "Minicar",
      seats: "4 chỗ",
      fuel: "210km (NEDC)",
      price: "590.000",
      rating: 4.7,
      trips: 142,
    },
        {
      id: 7,
      name: "VinFast VF 3",
      image:
        "https://images.unsplash.com/photo-1583121274602-3e2820c69888?w=800&h=600&fit=crop",
      badge: "Miễn phí sốc",
      transmission: "Minicar",
      seats: "4 chỗ",
      fuel: "210km (NEDC)",
      price: "590.000",
      rating: 4.7,
      trips: 142,
    },
        {
      id: 8,
      name: "VinFast VF 3",
      image:
        "https://images.unsplash.com/photo-1583121274602-3e2820c69888?w=800&h=600&fit=crop",
      badge: "Miễn phí sốc",
      transmission: "Minicar",
      seats: "4 chỗ",
      fuel: "210km (NEDC)",
      price: "590.000",
      rating: 4.7,
      trips: 142,
    },
        {
      id: 9,
      name: "VinFast VF 3",
      image:
        "https://images.unsplash.com/photo-1583121274602-3e2820c69888?w=800&h=600&fit=crop",
      badge: "Miễn phí sốc",
      transmission: "Minicar",
      seats: "4 chỗ",
      fuel: "210km (NEDC)",
      price: "590.000",
      rating: 4.7,
      trips: 142,
    },
  ];

  const steps = [
    {
      number: "01",
      title: "Chọn xe",
      description: "Tìm kiếm và chọn xe phù hợp với nhu cầu của bạn",
    },
    {
      number: "02",
      title: "Đặt xe",
      description: "Điền thông tin và xác nhận đặt xe trực tuyến",
    },
    {
      number: "03",
      title: "Nhận xe",
      description: "Nhận xe tại địa điểm hoặc giao xe tận nơi",
    },
    {
      number: "04",
      title: "Trải nghiệm",
      description: "Tận hưởng hành trình của bạn một cách thoải mái",
    },
        {
      id: 10,
      name: "VinFast VF 3",
      image:
        "https://images.unsplash.com/photo-1583121274602-3e2820c69888?w=800&h=600&fit=crop",
      badge: "Miễn phí sóc",
      transmission: "Minicar",
      seats: "4 chỗ",
      fuel: "210km (NEDC)",
      price: "590.000",
      rating: 4.7,
      trips: 142,
    },
        {
      id: 11,
      name: "VinFast VF 3",
      image:
        "https://images.unsplash.com/photo-1583121274602-3e2820c69888?w=800&h=600&fit=crop",
      badge: "Miễn phí sóc",
      transmission: "Minicar",
      seats: "4 chỗ",
      fuel: "210km (NEDC)",
      price: "590.000",
      rating: 4.7,
      trips: 142,
    },
        {
      id: 12,
      name: "VinFast VF 3",
      image:
        "https://images.unsplash.com/photo-1583121274602-3e2820c69888?w=800&h=600&fit=crop",
      badge: "Miễn phí sóc",
      transmission: "Minicar",
      seats: "4 chỗ",
      fuel: "210km (NEDC)",
      price: "590.000",
      rating: 4.7,
      trips: 142,
    },
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative h-[500px] flex items-center justify-center overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1619767886558-efdc259cde1a?w=1920&h=800&fit=crop&crop=center')",
          }}
        ></div>
        <div className="absolute inset-0 bg-black opacity-30"></div>

        <div className="relative z-10 text-center text-white max-w-4xl px-5">
          <h1 className="text-5xl md:text-6xl font-extrabold mb-4 tracking-tight drop-shadow-lg">
            Thuê Xe Tự Lái
          </h1>
          <p className="text-xl mb-10 opacity-95">
            Tự do khám phá mọi hành trình cùng đội xe đa dạng, chất lượng cao
          </p>

          <div className="flex justify-center gap-12 mt-8">
            <div className="flex flex-col items-center">
              <span className="text-4xl font-bold mb-2">200+</span>
              <span className="text-sm uppercase tracking-wider opacity-90">
                Xe sẵn sàng
              </span>
            </div>
            <div className="flex flex-col items-center">
              <span className="text-4xl font-bold mb-2">10K+</span>
              <span className="text-sm uppercase tracking-wider opacity-90">
                Khách hàng
              </span>
            </div>
            <div className="flex flex-col items-center">
              <span className="text-4xl font-bold mb-2">4.9/5</span>
              <span className="text-sm uppercase tracking-wider opacity-90">
                Đánh giá
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Search & Filter Section */}
      <section className="bg-white py-8 border-b">
        <div className="max-w-7xl mx-auto px-5">
          <div className="flex gap-4 items-center">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
              <Input
                type="text"
                placeholder="Tìm kiếm xe theo tên, loại xe..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-12 h-12 text-base rounded-xl border-2 focus:border-green-500"
              />
            </div>
            <Button
              variant="outline"
              className="h-12 px-6 rounded-xl border-2 hover:border-green-500 hover:bg-green-50 hover:text-green-600 text-black"
            >
              <SlidersHorizontal className="mr-2 h-4 w-4 text-black" />
              Bộ lọc
            </Button>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-7xl mx-auto px-5">
          <h2 className="text-4xl font-bold text-center mb-4 text-gray-900">
            Tại sao chọn thuê xe tự lái?
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mt-12">
            {benefits.map((benefit, index) => {
              const Icon = benefit.icon;
              return (
                <div
                  key={index}
                  className="text-center p-8 rounded-2xl bg-white border border-gray-200 transition-all hover:-translate-y-2 hover:shadow-xl hover:border-green-500"
                >
                  <div className="w-16 h-16 mx-auto mb-6 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl flex items-center justify-center text-white">
                    <Icon className="w-8 h-8" />
                  </div>
                  <h3 className="text-xl font-semibold mb-3 text-gray-900">
                    {benefit.title}
                  </h3>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    {benefit.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Cars Grid Section */}
      <section className="py-20 bg-white">
        <div className="container max-w-[75%] mx-auto">
          <div className="max-w-7xl mx-auto px-5">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold mb-4 text-gray-900">
                Xe tự lái phổ biến
              </h2>
              <p className="text-lg text-gray-600">
                Đa dạng các loại xe từ phổ thông đến cao cấp
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-12">
              {cars.map((car) => (
                <Card
                  key={car.id}
                  className="rounded-3xl overflow-hidden border border-gray-200 transition-all hover:-translate-y-2 hover:shadow-2xl cursor-pointer"
                >
                  <div className="relative h-56 overflow-hidden">
                    <img
                      src={car.image}
                      alt={car.name}
                      className="w-full h-full object-cover transition-transform hover:scale-105"
                    />
                    <Badge className="absolute top-3 left-3 bg-green-500 text-white px-3 py-1.5 rounded-lg text-xs font-semibold">
                      {car.badge}
                    </Badge>
                  </div>

                  <CardContent className="p-6">
                    <div className="flex flex-col mb-4">
                      <span className="text-sm text-green-600 font-semibold mb-1">
                        Chỉ từ
                      </span>
                      <span className="text-xl font-bold text-green-600">
                        {car.price} VNĐ/Ngày
                      </span>
                    </div>

                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      {car.name}
                    </h3>
                    <p className="text-sm text-gray-600 mb-4">
                      {car.transmission}
                    </p>

                    <div className="flex gap-4 mb-6 pb-6 border-b border-gray-200">
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Car className="w-4 h-4" />
                        <span>{car.seats}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <span>{car.fuel}</span>
                      </div>
                    </div>

                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-2 text-sm text-gray-900">
                        <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                        <span className="font-medium">{car.rating}</span>
                        <span className="text-gray-400">
                          • {car.trips} chuyến
                        </span>
                      </div>
                      <Link to={`/car/${car.id}`}>
                        <Button className="bg-green-500 hover:bg-green-600 text-white rounded-xl px-4 py-2 font-semibold transition-all hover:translate-x-1">
                          Thuê xe
                          <ChevronRight className="ml-1 h-4 w-4" />
                        </Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Hướng Dẫn Thuê Xe */}
      <section className="py-16 bg-white">
        <div className="container max-w-[70%] mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-black mb-4">
              Hướng Dẫn Thuê Xe
            </h2>
            <p className="text-gray-600 text-base">
              Chỉ với 4 bước đơn giản để trải nghiệm thuê xe BF Car Rental một
              cách nhanh chóng
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-7xl mx-auto">
            {[
              {
                step: "01",
                title: "Đặt xe trên app/web BF Car Rental",
                image: "/mocks/huongdan/Screenshot 2025-10-02 132938.png",
                color: "text-green-500",
              },
              {
                step: "02",
                title: "Nhận xe",
                image: "/mocks/huongdan/Screenshot 2025-10-02 132946.png",
                color: "text-green-500",
              },
              {
                step: "03",
                title: "Bắt đầu hành trình",
                image: "/mocks/huongdan/Screenshot 2025-10-02 132953.png",
                color: "text-green-500",
              },
              {
                step: "04",
                title: "Trả xe & kết thúc chuyến đi",
                image: "/mocks/huongdan/Screenshot 2025-10-02 132958.png",
                color: "text-green-500",
              },
            ].map((item, index) => (
              <div
                key={index}
                className="flex flex-col items-center text-center"
              >
                <div className="mb-6 w-full flex justify-center">
                  <div className="relative w-64 h-64 flex items-center justify-center bg-white rounded-3xl p-4">
                    <img
                      src={item.image}
                      alt={item.title}
                      className="max-w-full max-h-full object-contain"
                    />
                  </div>
                </div>
                <div className="mb-3">
                  <span className={`text-2xl font-bold ${item.color} mr-2`}>
                    {item.step}
                  </span>
                  <span className="text-xl font-bold text-black">
                    {item.title}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 text-green">
        <div className="max-w-4xl mx-auto text-center px-5">
          <h2 className="text-4xl md:text-5xl font-bold mb-4 text-gray-600">
            Sẵn sàng cho hành trình tiếp theo?
          </h2>
          <p className="text-lg mb-8 opacity-95 text-green-700">
            Đặt xe ngay hôm nay và nhận ưu đãi đặc biệt cho khách hàng mới
          </p>

          {/* <div className="flex flex-wrap gap-4 justify-center text-green">
            <Button
              size="lg"
              className="bg-white text-green-600 hover:bg-green-50 font-semibold px-8 py-6 text-base rounded-xl transition-all hover:-translate-y-1 hover:shadow-xl"
            >
              <Car className="mr-2 h-5 w-5" />
              Đặt xe ngay
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="bg-transparent text-green border-2 border-white hover:bg-white/10 font-semibold px-8 py-6 text-base rounded-xl transition-all hover:-translate-y-1"
            >
              Xem thêm xe
            </Button>
          </div> */}
        </div>
      </section>
    </div>
  );
}
