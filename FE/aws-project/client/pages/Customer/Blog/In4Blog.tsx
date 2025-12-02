import { useParams, Link, useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Calendar,
  Clock,
  User,
  ArrowLeft,
  Share2,
  Heart,
  Eye,
  MessageCircle,
  Loader2,
} from "lucide-react";
import { useState, useEffect } from "react";
import { useBlog } from "@/hooks/useBlog";

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

export default function In4Blog() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [isLiked, setIsLiked] = useState(false);
  const { loading, error, currentBlog, blogs, getBlogById, getAllBlogs } =
    useBlog();

  // Fetch blog detail on mount
  useEffect(() => {
    if (id) {
      getBlogById(id);
      // Also fetch related blogs
      getAllBlogs({
        page: 0,
        size: 5,
        sortBy: "createdAt",
        sortDirection: "DESC",
      });
    }
  }, [id, getBlogById, getAllBlogs]);

  // Get related blogs (excluding current blog)
  const relatedBlogs = blogs.filter((blog) => blog.id !== id).slice(0, 3);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="flex items-center gap-2">
          <Loader2 className="w-8 h-8 animate-spin text-green-600" />
          <span className="text-gray-600">Đang tải bài viết...</span>
        </div>
      </div>
    );
  }

  if (error || !currentBlog) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            {error || "Không tìm thấy bài viết"}
          </h2>
          <Button
            onClick={() => navigate("/news")}
            className="bg-green-600 hover:bg-green-700"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Quay lại danh sách
          </Button>
        </div>
      </div>
    );
  }

  const blog = currentBlog;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Back Button */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-6 py-4">
          <Button
            variant="ghost"
            onClick={() => navigate("/news")}
            className="hover:bg-gray-100"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Quay lại
          </Button>
        </div>
      </div>

      {/* Hero Image */}
      <div className="relative h-[400px] overflow-hidden">
        <img
          src={blog.thumbnailUrl || "/mocks/city/hanoi.webp"}
          alt={blog.title}
          className="w-full h-full object-cover"
          onError={(e) => {
            (e.target as HTMLImageElement).src = "/mocks/city/hanoi.webp";
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-8">
          <div className="container mx-auto">
            {!blog.published && (
              <Badge className="bg-yellow-500 hover:bg-yellow-600 mb-4">
                Bản nháp
              </Badge>
            )}
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              {blog.title}
            </h1>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <Card>
              <CardContent className="p-8">
                {/* Meta Info */}
                <div className="flex flex-wrap items-center gap-6 mb-6 text-sm text-gray-600">
                  <div className="flex items-center gap-2">
                    <Avatar className="w-8 h-8">
                      <AvatarImage
                        src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${blog.authorName}`}
                      />
                      <AvatarFallback className="bg-green-600 text-white text-sm">
                        {blog.authorName.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <span>{blog.authorName}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    <span>
                      {formatDate(blog.publishedAt || blog.createdAt)}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    <span>{estimateReadTime(blog.content)}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Eye className="w-4 h-4" />
                    <span>{blog.viewCount.toLocaleString()} lượt xem</span>
                  </div>
                </div>

                <Separator className="mb-8" />

                {/* Article Content */}
                <article className="prose prose-lg max-w-none">
                  <p>{blog.content}</p>
                </article>

                <Separator className="my-8" />

                {/* Actions */}
                <div className="flex items-center gap-4">
                  <Button
                    variant="outline"
                    className={`gap-2 ${isLiked ? "text-red-600 border-red-600" : ""}`}
                    onClick={() => setIsLiked(!isLiked)}
                  >
                    <Heart
                      className={`w-4 h-4 ${isLiked ? "fill-current" : ""}`}
                    />
                    {isLiked ? 1 : 0}
                  </Button>
                  <Button variant="outline" className="gap-2">
                    <Share2 className="w-4 h-4" />
                    Chia sẻ
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-8 space-y-6">
              {/* Author Card */}
              <Card>
                <CardContent className="p-6">
                  <h3 className="font-bold text-lg mb-4">Tác giả</h3>
                  <div className="flex items-center gap-3 mb-4">
                    <Avatar className="w-12 h-12">
                      <AvatarImage
                        src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${blog.authorName}`}
                      />
                      <AvatarFallback className="bg-green-600 text-white text-lg">
                        {blog.authorName.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-semibold">{blog.authorName}</p>
                      <p className="text-sm text-gray-600">Biên tập viên</p>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600">
                    Chuyên viên tư vấn và chia sẻ kinh nghiệm thuê xe tự lái
                  </p>
                </CardContent>
              </Card>

              {/* Related Posts */}
              <Card>
                <CardContent className="p-6">
                  <h3 className="font-bold text-lg mb-4">Bài viết liên quan</h3>
                  <div className="space-y-4">
                    {relatedBlogs.length > 0 ? (
                      relatedBlogs.map((related) => (
                        <Link
                          key={related.id}
                          to={`/blog/${related.id}`}
                          className="flex gap-3 group"
                        >
                          <img
                            src={
                              related.thumbnailUrl || "/mocks/city/hanoi.webp"
                            }
                            alt={related.title}
                            className="w-20 h-20 object-cover rounded group-hover:opacity-80 transition"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src =
                                "/mocks/city/hanoi.webp";
                            }}
                          />
                          <div className="flex-1">
                            <p className="text-sm font-semibold text-gray-900 group-hover:text-green-600 transition line-clamp-2">
                              {related.title}
                            </p>
                            <p className="text-xs text-gray-500 mt-1">
                              {related.authorName}
                            </p>
                          </div>
                        </Link>
                      ))
                    ) : (
                      <p className="text-sm text-gray-500">
                        Không có bài viết liên quan
                      </p>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
