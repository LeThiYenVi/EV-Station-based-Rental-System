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
} from "lucide-react";
import { useState } from "react";

// Mock data for blog detail
const blogDetailData: Record<string, any> = {
  "1": {
    id: 1,
    title: "Top 10 xe tự lái được yêu thích nhất năm 2025",
    category: "Xu hướng",
    author: "Admin",
    date: "05/10/2025",
    readTime: "5 phút đọc",
    image: "/mocks/city/hanoi.webp",
    views: 1250,
    likes: 89,
    comments: 24,
    content: `
      <h2>Giới thiệu</h2>
      <p>Năm 2025 đánh dấu sự bùng nổ của thị trường thuê xe tự lái tại Việt Nam. Với sự phát triển của công nghệ và nhu cầu di chuyển linh hoạt ngày càng tăng, khách hàng có nhiều lựa chọn xe hơn bao giờ hết.</p>
      
      <h2>Top 10 mẫu xe được yêu thích</h2>
      
      <h3>1. Mazda 2 2024</h3>
      <p>Với thiết kế sang trọng, động cơ tiết kiệm nhiên liệu và giá thuê hợp lý, Mazda 2 là lựa chọn hàng đầu của nhiều khách hàng. Xe phù hợp cho cả di chuyển trong thành phố và du lịch đường dài.</p>
      
      <h3>2. Toyota Vios</h3>
      <p>Mẫu xe sedan bán chạy nhất Việt Nam với độ tin cậy cao, bền bỉ và chi phí vận hành thấp. Đây là lựa chọn lý tưởng cho các chuyến đi gia đình.</p>
      
      <h3>3. Honda City</h3>
      <p>Không gian rộng rãi, trang bị hiện đại và khả năng vận hành êm ái khiến Honda City trở thành "ông vua" phân khúc B-sedan trong dịch vụ cho thuê.</p>
      
      <h3>4. Hyundai Accent</h3>
      <p>Với thiết kế trẻ trung, động cơ mạnh mẽ và giá cả cạnh tranh, Hyundai Accent ngày càng được ưa chuộng trong phân khúc xe thuê tự lái.</p>
      
      <h3>5. VinFast VF 3</h3>
      <p>Đại diện cho làn sóng xe điện, VinFast VF 3 thu hút khách hàng yêu thích sự hiện đại và muốn đóng góp vào bảo vệ môi trường.</p>
      
      <h2>Tiêu chí đánh giá</h2>
      <p>Danh sách này được xếp hạng dựa trên:</p>
      <ul>
        <li>Số lượng đặt thuê trong năm 2024-2025</li>
        <li>Đánh giá của khách hàng (trung bình 4.5/5 sao trở lên)</li>
        <li>Tỷ lệ khách hàng quay lại thuê lần 2</li>
        <li>Chi phí vận hành và giá thuê hợp lý</li>
      </ul>
      
      <h2>Kết luận</h2>
      <p>Việc lựa chọn xe tự lái phù hợp phụ thuộc vào nhu cầu sử dụng, ngân sách và sở thích cá nhân. Tuy nhiên, những mẫu xe trong danh sách trên đều được đánh giá cao về chất lượng và dịch vụ.</p>
    `,
    tags: ["Xe tự lái", "Top 10", "Xu hướng 2025", "Mazda", "Toyota"],
  },
  "2": {
    id: 2,
    title: "Hướng dẫn thuê xe tự lái cho người mới",
    category: "Hướng dẫn",
    author: "Staff",
    date: "03/10/2025",
    readTime: "8 phút đọc",
    image: "/mocks/city/hcm.jpg",
    views: 2100,
    likes: 156,
    comments: 42,
    content: `
      <h2>Chuẩn bị giấy tờ</h2>
      <p>Để thuê xe tự lái, bạn cần chuẩn bị đầy đủ các giấy tờ sau:</p>
      <ul>
        <li>CMND/CCCD (bản gốc)</li>
        <li>Giấy phép lái xe (bản gốc, còn hạn)</li>
        <li>Hộ khẩu hoặc sao kê ngân hàng 3 tháng gần nhất</li>
      </ul>
      
      <h2>Quy trình thuê xe</h2>
      <ol>
        <li>Đăng ký tài khoản trên hệ thống</li>
        <li>Xác thực giấy phép lái xe (GPLX)</li>
        <li>Tìm kiếm và chọn xe phù hợp</li>
        <li>Đặt cọc và thanh toán</li>
        <li>Nhận xe và kiểm tra tình trạng</li>
      </ol>
      
      <h2>Lưu ý quan trọng</h2>
      <p>Một số điều cần lưu ý khi thuê xe lần đầu:</p>
      <ul>
        <li>Kiểm tra kỹ xe trước khi nhận</li>
        <li>Chụp ảnh/quay video tình trạng xe</li>
        <li>Đọc kỹ hợp đồng thuê xe</li>
        <li>Mua bảo hiểm để an toàn hơn</li>
      </ul>
    `,
    tags: ["Hướng dẫn", "Người mới", "Thuê xe", "Giấy tờ"],
  },
};

// Related blogs
const relatedBlogs = [
  {
    id: 3,
    title: "5 địa điểm du lịch lý tưởng cùng xe tự lái",
    image: "/mocks/city/dalat.webp",
    category: "Du lịch",
  },
  {
    id: 4,
    title: "Bí quyết tiết kiệm chi phí thuê xe",
    image: "/mocks/city/danang.jpg",
    category: "Mẹo hay",
  },
  {
    id: 5,
    title: "Đánh giá Mazda 2 2024 - Xe thuê hot nhất",
    image: "/mocks/city/nhatrang.jpg",
    category: "Đánh giá",
  },
];

export default function In4Blog() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [isLiked, setIsLiked] = useState(false);

  const blog = blogDetailData[id || "1"];

  if (!blog) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Không tìm thấy bài viết
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
          src={blog.image}
          alt={blog.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-8">
          <div className="container mx-auto">
            <Badge className="bg-green-600 hover:bg-green-700 mb-4">
              {blog.category}
            </Badge>
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
                        src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${blog.author}`}
                      />
                      <AvatarFallback className="bg-green-600 text-white text-sm">
                        {blog.author.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <span>{blog.author}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    <span>{blog.date}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    <span>{blog.readTime}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Eye className="w-4 h-4" />
                    <span>{blog.views.toLocaleString()} lượt xem</span>
                  </div>
                </div>

                <Separator className="mb-8" />

                {/* Article Content */}
                <article
                  className="prose prose-lg max-w-none"
                  dangerouslySetInnerHTML={{ __html: blog.content }}
                />

                <Separator className="my-8" />

                {/* Tags */}
                <div className="flex flex-wrap gap-2 mb-6">
                  {blog.tags.map((tag: string) => (
                    <Badge
                      key={tag}
                      variant="outline"
                      className="text-green-600 border-green-600"
                    >
                      #{tag}
                    </Badge>
                  ))}
                </div>

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
                    {blog.likes + (isLiked ? 1 : 0)}
                  </Button>
                  <Button variant="outline" className="gap-2">
                    <MessageCircle className="w-4 h-4" />
                    {blog.comments}
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
                        src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${blog.author}`}
                      />
                      <AvatarFallback className="bg-green-600 text-white text-lg">
                        {blog.author.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-semibold">{blog.author}</p>
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
                    {relatedBlogs.map((related) => (
                      <Link
                        key={related.id}
                        to={`/blog/${related.id}`}
                        className="flex gap-3 group"
                      >
                        <img
                          src={related.image}
                          alt={related.title}
                          className="w-20 h-20 object-cover rounded group-hover:opacity-80 transition"
                        />
                        <div className="flex-1">
                          <Badge variant="outline" className="text-xs mb-1">
                            {related.category}
                          </Badge>
                          <p className="text-sm font-semibold text-gray-900 group-hover:text-green-600 transition line-clamp-2">
                            {related.title}
                          </p>
                        </div>
                      </Link>
                    ))}
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
