import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import AvatarDemo from "@/components/ui/AvatarDemo";
import {
  Calendar,
  Clock,
  User,
  Search,
  ArrowRight,
  Loader2,
} from "lucide-react";
import { useState, useEffect } from "react";
import { useBlog } from "@/hooks/useBlog";
import type { BlogResponse } from "@/service/types/blog.types";

// Helper function to format date
const formatDate = (dateString: string | null): string => {
  if (!dateString) return "Chưa xuất bản";
  const date = new Date(dateString);
  return date.toLocaleDateString("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
};

// Helper function to estimate read time based on content length
const estimateReadTime = (content: string): string => {
  const wordsPerMinute = 200;
  const wordCount = content.split(/\s+/).length;
  const minutes = Math.ceil(wordCount / wordsPerMinute);
  return `${Math.max(1, minutes)} phút đọc`;
};

export default function Blog() {
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(0);
  const { loading, error, blogs, pagination, getAllBlogs } = useBlog();

  // Fetch blogs on component mount and when page changes
  useEffect(() => {
    getAllBlogs({
      page: currentPage,
      size: 10,
      sortBy: "createdAt",
      sortDirection: "DESC",
    });
  }, [currentPage, getAllBlogs]);

  // Filter blogs based on search query (client-side filtering)
  const filteredBlogs = blogs.filter((blog) => {
    const matchesSearch =
      blog.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      blog.content.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSearch;
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
        {/* Loading State */}
        {loading && (
          <div className="flex justify-center items-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-green-600" />
            <span className="ml-2 text-gray-600">Đang tải bài viết...</span>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="text-center py-12">
            <p className="text-red-500 text-lg mb-4">{error}</p>
            <Button
              onClick={() =>
                getAllBlogs({
                  page: currentPage,
                  size: 10,
                  sortBy: "createdAt",
                  sortDirection: "DESC",
                })
              }
              className="bg-green-600 hover:bg-green-700"
            >
              Thử lại
            </Button>
          </div>
        )}

        {/* Blog Grid */}
        {!loading && !error && filteredBlogs.length > 0 ? (
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
                      src={blog.thumbnailUrl || "/mocks/city/hanoi.webp"}
                      alt={blog.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src =
                          "/mocks/city/hanoi.webp";
                      }}
                    />
                    {!blog.published && (
                      <Badge className="absolute top-4 left-4 bg-yellow-500 hover:bg-yellow-600">
                        Nháp
                      </Badge>
                    )}
                  </div>

                  <CardHeader>
                    <h3 className="text-xl font-bold text-gray-900 group-hover:text-green-600 transition-colors line-clamp-2">
                      {blog.title}
                    </h3>
                  </CardHeader>

                  <CardContent className="space-y-4">
                    <p className="text-gray-600 text-sm line-clamp-3">
                      {blog.content}
                    </p>

                    {/* Meta Info */}
                    <div className="flex items-center gap-4 text-xs text-gray-500">
                      <div className="flex items-center gap-1">
                        <User className="w-4 h-4" />
                        <span>{blog.authorName}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        <span>
                          {formatDate(blog.publishedAt || blog.createdAt)}
                        </span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        <span>{estimateReadTime(blog.content)}</span>
                      </div>
                    </div>

                    {/* Read More */}
                    <div className="flex items-center justify-between pt-4 border-t">
                      <div className="flex items-center gap-2">
                        <div className="flex items-center rounded-full p-0.5 gap-1.5 border border-border shadow-sm shadow-black/5">
                          <div className="flex -space-x-1">
                            <Avatar className="size-6">
                              <AvatarImage
                                src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${blog.authorName}`}
                                alt={blog.authorName}
                                className="border-2 border-background hover:z-10"
                              />
                              <AvatarFallback className="bg-green-600 text-white text-xs">
                                {blog.authorName.charAt(0)}
                              </AvatarFallback>
                            </Avatar>
                            <Avatar className="size-6">
                              <AvatarImage
                                src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${blog.authorName}2`}
                                alt="Reader"
                                className="border-2 border-background hover:z-10"
                              />
                              <AvatarFallback className="bg-blue-600 text-white text-xs">
                                R
                              </AvatarFallback>
                            </Avatar>
                            <Avatar className="size-6">
                              <AvatarImage
                                src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${blog.authorName}3`}
                                alt="Reader"
                                className="border-2 border-background hover:z-10"
                              />
                              <AvatarFallback className="bg-purple-600 text-white text-xs">
                                R
                              </AvatarFallback>
                            </Avatar>
                          </div>
                          <span className="text-xs text-gray-600 me-1.5">
                            {blog.viewCount.toLocaleString()} lượt xem
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
        ) : !loading && !error ? (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">
              Không tìm thấy bài viết nào phù hợp
            </p>
          </div>
        ) : null}

        {/* Pagination */}
        {pagination && pagination.totalPages > 1 && (
          <div className="flex justify-center gap-2 mt-8">
            <Button
              variant="outline"
              disabled={currentPage === 0}
              onClick={() => setCurrentPage((prev) => Math.max(0, prev - 1))}
            >
              Trang trước
            </Button>
            <span className="flex items-center px-4 text-gray-600">
              Trang {currentPage + 1} / {pagination.totalPages}
            </span>
            <Button
              variant="outline"
              disabled={currentPage >= pagination.totalPages - 1}
              onClick={() => setCurrentPage((prev) => prev + 1)}
            >
              Trang sau
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
