import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import AvatarDemo from "@/components/ui/AvatarDemo";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Calendar,
  Clock,
  User,
  Search,
  ArrowRight,
  Loader2,
  Filter,
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
  const [selectedAuthor, setSelectedAuthor] = useState("all");
  const [sortBy, setSortBy] = useState("createdAt");
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
    // Chỉ hiển thị blog đã xuất bản
    if (!blog.published) return false;

    const matchesSearch =
      blog.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      blog.content.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesAuthor =
      selectedAuthor === "all" || blog.authorName === selectedAuthor;

    return matchesSearch && matchesAuthor;
  });

  // Sort filtered blogs
  const sortedBlogs = [...filteredBlogs].sort((a, b) => {
    if (sortBy === "viewCount") {
      return b.viewCount - a.viewCount;
    } else if (sortBy === "createdAt") {
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    } else if (sortBy === "title") {
      return a.title.localeCompare(b.title);
    }
    return 0;
  });

  // Get unique authors for filter
  const uniqueAuthors = Array.from(
    new Set(blogs.map((blog) => blog.authorName)),
  );

  // Reset page when filters change
  useEffect(() => {
    setCurrentPage(0);
  }, [searchQuery, selectedAuthor, sortBy]);

  return (
    <div className="min-h-screen bg-gray-50 mt-[50px]">
      {/* Hero Section */}
      <div className="relative text-white py-16 overflow-hidden">
        {/* Background Image */}
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: "url(/image/service1.jpg)" }}
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
        {/* Filter Section */}
        <Card className="mb-8">
          <CardContent className="pt-6">
            <div className="flex items-center gap-2 mb-4">
              <Filter className="w-5 h-5 text-gray-600" />
              <h3 className="text-lg font-semibold text-gray-900">Bộ lọc</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Author Filter */}
              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">
                  Tác giả
                </label>
                <Select
                  value={selectedAuthor}
                  onValueChange={setSelectedAuthor}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Chọn tác giả" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tất cả tác giả</SelectItem>
                    {uniqueAuthors.map((author) => (
                      <SelectItem key={author} value={author}>
                        {author}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Sort By */}
              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">
                  Sắp xếp theo
                </label>
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger>
                    <SelectValue placeholder="Sắp xếp" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="createdAt">Mới nhất</SelectItem>
                    <SelectItem value="viewCount">Xem nhiều nhất</SelectItem>
                    <SelectItem value="title">Theo tên (A-Z)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Active Filters Display */}
            {(selectedAuthor !== "all" || sortBy !== "createdAt") && (
              <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t">
                <span className="text-sm text-gray-600">Đang lọc:</span>
                {selectedAuthor !== "all" && (
                  <Badge
                    variant="secondary"
                    className="cursor-pointer"
                    onClick={() => setSelectedAuthor("all")}
                  >
                    Tác giả: {selectedAuthor} ×
                  </Badge>
                )}
                {sortBy !== "createdAt" && (
                  <Badge variant="secondary">
                    {sortBy === "viewCount"
                      ? "Xem nhiều nhất"
                      : "Theo tên (A-Z)"}
                  </Badge>
                )}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setSelectedAuthor("all");
                    setSortBy("createdAt");
                  }}
                  className="text-xs h-6 text-red-600 hover:text-red-700 hover:bg-red-50"
                >
                  Xóa tất cả bộ lọc
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

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
        {!loading && !error && sortedBlogs.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {sortedBlogs.map((blog) => (
              <Card
                key={blog.id}
                className="overflow-hidden hover:shadow-xl transition-shadow duration-300 group"
              >
                <Link to={`/blog/${blog.id}`}>
                  {/* Image */}
                  <div className="relative h-48 overflow-hidden">
                    <img
                      src={blog.thumbnailUrl || "/image/city/hanoi.webp"}
                      alt={blog.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src =
                          "/image/city/hanoi.webp";
                      }}
                    />
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
          <div className="flex justify-center gap-2 mt-8 text-black">
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
