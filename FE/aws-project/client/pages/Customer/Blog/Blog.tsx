import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import AvatarDemo from "@/components/ui/AvatarDemo";
import { Calendar, Clock, User, Search, ArrowRight } from "lucide-react";
import { useState } from "react";

// Mock data for blogs
const blogData = [
  {
    id: 1,
    title: "Top 10 xe tự lái được yêu thích nhất năm 2025",
    excerpt:
      "Khám phá danh sách những mẫu xe tự lái được khách hàng đánh giá cao nhất với dịch vụ hoàn hảo và giá cả hợp lý...",
    category: "Xu hướng",
    author: "Admin",
    date: "05/10/2025",
    readTime: "5 phút đọc",
    image: "/mocks/city/hanoi.webp",
    views: 1250,
  },
  {
    id: 2,
    title: "Hướng dẫn thuê xe tự lái cho người mới",
    excerpt:
      "Tất cả những điều bạn cần biết khi lần đầu thuê xe tự lái: thủ tục, giấy tờ, kinh nghiệm và lưu ý quan trọng...",
    category: "Hướng dẫn",
    author: "Staff",
    date: "03/10/2025",
    readTime: "8 phút đọc",
    image: "/mocks/city/hcm.jpg",
    views: 2100,
  },
  {
    id: 3,
    title: "5 địa điểm du lịch lý tưởng cùng xe tự lái",
    excerpt:
      "Cùng khám phá những địa điểm tuyệt vời để trải nghiệm chuyến đi với xe tự lái, từ biển xanh đến núi non hùng vĩ...",
    category: "Du lịch",
    author: "Admin",
    date: "01/10/2025",
    readTime: "6 phút đọc",
    image: "/mocks/city/dalat.webp",
    views: 1800,
  },
  {
    id: 4,
    title: "Bí quyết tiết kiệm chi phí thuê xe",
    excerpt:
      "Những mẹo nhỏ giúp bạn tiết kiệm tối đa chi phí khi thuê xe tự lái mà vẫn đảm bảo chất lượng dịch vụ...",
    category: "Mẹo hay",
    author: "Staff",
    date: "28/09/2025",
    readTime: "4 phút đọc",
    image: "/mocks/city/danang.jpg",
    views: 980,
  },
  {
    id: 5,
    title: "Đánh giá Mazda 2 2024 - Xe thuê hot nhất",
    excerpt:
      "Tìm hiểu chi tiết về Mazda 2 2024 - mẫu xe được khách hàng yêu thích và đặt thuê nhiều nhất hiện nay...",
    category: "Đánh giá",
    author: "Admin",
    date: "25/09/2025",
    readTime: "7 phút đọc",
    image: "/mocks/city/nhatrang.jpg",
    views: 3200,
  },
  {
    id: 6,
    title: "Chính sách bảo hiểm khi thuê xe tự lái",
    excerpt:
      "Hiểu rõ về các gói bảo hiểm, quyền lợi và trách nhiệm của khách hàng khi thuê xe để có chuyến đi an toàn...",
    category: "Chính sách",
    author: "Staff",
    date: "22/09/2025",
    readTime: "5 phút đọc",
    image: "/mocks/city/phuquoc.jpg",
    views: 1500,
  },
];

const categories = [
  "Tất cả",
  "Xu hướng",
  "Hướng dẫn",
  "Du lịch",
  "Mẹo hay",
  "Đánh giá",
  "Chính sách",
];

export default function Blog() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Tất cả");

  const filteredBlogs = blogData.filter((blog) => {
    const matchesSearch =
      blog.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      blog.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory =
      selectedCategory === "Tất cả" || blog.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="relative text-white py-16 overflow-hidden">
        {/* Background Image */}
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: "url(/mocks/service1.jpg)" }}
        >
          <div className="absolute inset-0 bg-black/50" />
        </div>

        <div className="container mx-auto px-6 relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 drop-shadow-lg">
              Tin Tức & Blog
            </h1>
            <p className="text-lg md:text-xl text-white/90 mb-8 drop-shadow-md">
              Cập nhật tin tức mới nhất, mẹo hay và kinh nghiệm thuê xe tự lái
            </p>

            {/* Search Bar */}
            <div className="relative max-w-xl mx-auto">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <Input
                type="text"
                placeholder="Tìm kiếm bài viết..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-12 pr-4 py-6 text-lg bg-white text-gray-900 border-0 focus:ring-2 focus:ring-green-300"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-12">
        {/* Category Filter */}
        <div className="flex flex-wrap gap-3 mb-8 justify-center">
          {categories.map((category) => (
            <Button
              key={category}
              variant={selectedCategory === category ? "default" : "outline"}
              onClick={() => setSelectedCategory(category)}
              className={
                selectedCategory === category
                  ? "bg-green-600 hover:bg-green-700 text-white"
                  : "border-gray-300 text-green-600 hover:border-green-600 hover:text-green-700"
              }
            >
              {category}
            </Button>
          ))}
        </div>

        {/* Blog Grid */}
        {filteredBlogs.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredBlogs.map((blog) => (
              <Card
                key={blog.id}
                className="overflow-hidden hover:shadow-xl transition-shadow duration-300 group"
              >
                <Link to={`/blog/${blog.id}`}>
                  {/* Image */}
                  <div className="relative h-48 overflow-hidden">
                    <img
                      src={blog.image}
                      alt={blog.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                    <Badge className="absolute top-4 left-4 bg-green-600 hover:bg-green-700">
                      {blog.category}
                    </Badge>
                  </div>

                  <CardHeader>
                    <h3 className="text-xl font-bold text-gray-900 group-hover:text-green-600 transition-colors line-clamp-2">
                      {blog.title}
                    </h3>
                  </CardHeader>

                  <CardContent className="space-y-4">
                    <p className="text-gray-600 text-sm line-clamp-3">
                      {blog.excerpt}
                    </p>

                    {/* Meta Info */}
                    <div className="flex items-center gap-4 text-xs text-gray-500">
                      <div className="flex items-center gap-1">
                        <User className="w-4 h-4" />
                        <span>{blog.author}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        <span>{blog.date}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        <span>{blog.readTime}</span>
                      </div>
                    </div>

                    {/* Read More */}
                    <div className="flex items-center justify-between pt-4 border-t">
                      <div className="flex items-center gap-2">
                        <div className="flex items-center rounded-full p-0.5 gap-1.5 border border-border shadow-sm shadow-black/5">
                          <div className="flex -space-x-1">
                            <Avatar className="size-6">
                              <AvatarImage
                                src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${blog.author}`}
                                alt={blog.author}
                                className="border-2 border-background hover:z-10"
                              />
                              <AvatarFallback className="bg-green-600 text-white text-xs">
                                {blog.author.charAt(0)}
                              </AvatarFallback>
                            </Avatar>
                            <Avatar className="size-6">
                              <AvatarImage
                                src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${blog.author}2`}
                                alt="Reader"
                                className="border-2 border-background hover:z-10"
                              />
                              <AvatarFallback className="bg-blue-600 text-white text-xs">
                                R
                              </AvatarFallback>
                            </Avatar>
                            <Avatar className="size-6">
                              <AvatarImage
                                src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${blog.author}3`}
                                alt="Reader"
                                className="border-2 border-background hover:z-10"
                              />
                              <AvatarFallback className="bg-purple-600 text-white text-xs">
                                R
                              </AvatarFallback>
                            </Avatar>
                          </div>
                          <span className="text-xs text-gray-600 me-1.5">
                            {blog.views.toLocaleString()} lượt xem
                          </span>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        className="text-green-600 hover:text-green-700 hover:bg-green-50 p-0"
                      >
                        Đọc thêm <ArrowRight className="w-4 h-4 ml-1" />
                      </Button>
                    </div>
                  </CardContent>
                </Link>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">
              Không tìm thấy bài viết nào phù hợp
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
