import React, { useState } from "react";
import {
  View,
  Text,
  SafeAreaView,
  ScrollView,
  Pressable,
  StyleSheet,
  Image,
} from "react-native";
import { useRouter } from "expo-router";
import {
  BookOpen,
  Clock,
  TrendingUp,
  Zap,
  Heart,
  Share2,
  Bookmark,
} from "lucide-react-native";
import { Badge } from "@/components/common";

export default function BlogScreen() {
  const router = useRouter();
  const [selectedCategory, setSelectedCategory] = useState("all");

  // Blog posts data
  const blogPosts = [
    {
      id: "1",
      title: "5 Lý Do Nên Chọn Xe Điện Cho Chuyến Đi Hàng Ngày",
      excerpt:
        "Xe điện không chỉ thân thiện với môi trường mà còn giúp bạn tiết kiệm chi phí đáng kể. Cùng khám phá ngay!",
      category: "tips",
      author: "Mai Anh",
      readTime: "5 phút",
      publishedAt: "2 ngày trước",
      likes: 234,
      image: null,
      featured: true,
    },
    {
      id: "2",
      title: "Cách Sạc Pin Xe Điện Đúng Cách Để Tăng Tuổi Thọ",
      excerpt:
        "Những mẹo nhỏ giúp bạn duy trì pin xe điện luôn trong tình trạng tốt nhất, kéo dài tuổi thọ và tối ưu hiệu suất.",
      category: "guide",
      author: "Minh Tuấn",
      readTime: "7 phút",
      publishedAt: "3 ngày trước",
      likes: 189,
      image: null,
      featured: false,
    },
    {
      id: "3",
      title: "🎉 Khuyến Mãi Tháng 12: Giảm 30% Cho Thuê Dài Hạn",
      excerpt:
        "Nhân dịp cuối năm, EV Rental tri ân khách hàng với ưu đãi thuê xe dài hạn siêu hời. Đặt ngay!",
      category: "promotion",
      author: "EV Team",
      readTime: "2 phút",
      publishedAt: "1 ngày trước",
      likes: 567,
      image: null,
      featured: true,
    },
    {
      id: "4",
      title: "Xe Điện VinFast Klara S: Đánh Giá Chi Tiết",
      excerpt:
        "Klara S là một trong những dòng xe điện phổ biến nhất tại Việt Nam. Hãy cùng tìm hiểu ưu nhược điểm của dòng xe này.",
      category: "review",
      author: "Hoàng Long",
      readTime: "10 phút",
      publishedAt: "5 ngày trước",
      likes: 423,
      image: null,
      featured: false,
    },
    {
      id: "5",
      title: "So Sánh Chi Phí: Xe Máy Xăng vs Xe Máy Điện",
      excerpt:
        "Phân tích chi tiết về chi phí sử dụng hàng tháng giữa xe xăng truyền thống và xe điện hiện đại.",
      category: "tips",
      author: "Thu Hà",
      readTime: "8 phút",
      publishedAt: "1 tuần trước",
      likes: 312,
      image: null,
      featured: false,
    },
  ];

<<<<<<< HEAD
  const categories = [
    { id: "all", label: "Tất Cả", icon: BookOpen },
    { id: "tips", label: "Mẹo Hay", icon: TrendingUp },
    { id: "guide", label: "Hướng Dẫn", icon: Zap },
    { id: "review", label: "Đánh Giá", icon: Heart },
    { id: "promotion", label: "Khuyến Mãi", icon: Share2 },
  ];
=======
  if (!isAuthenticated) {
    return (
      <SafeAreaView style={styles.container}>
        <EmptyState
          icon={MessageCircle}
          title="Chưa Có Tin Nhắn"
          description="Đăng nhập để xem tin nhắn và thông báo của bạn"
          action={
            <Button
              title="Đăng Nhập"
              onPress={() => router.push("/(auth)/login")}
            />
          }
        />
      </SafeAreaView>
    );
  }
>>>>>>> 7aaef75e6773ca6ab805ee29e3357b0ca31747c5

  const filteredPosts =
    selectedCategory === "all"
      ? blogPosts
      : blogPosts.filter((post) => post.category === selectedCategory);

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "tips":
        return "#3b82f6";
      case "guide":
        return "#10b981";
      case "review":
        return "#8b5cf6";
      case "promotion":
        return "#f59e0b";
      default:
        return "#6b7280";
    }
  };

  const getCategoryLabel = (category: string) => {
    switch (category) {
      case "tips":
        return "Mẹo Hay";
      case "guide":
        return "Hướng Dẫn";
      case "review":
        return "Đánh Giá";
      case "promotion":
        return "Khuyến Mãi";
      default:
        return "Blog";
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Blog & Tin Tức</Text>
        <Text style={styles.headerSubtitle}>Khám phá thế giới xe điện</Text>
      </View>

      {/* Categories Filter */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.categoriesContainer}
        contentContainerStyle={styles.categoriesContent}
      >
        {categories.map((category) => {
          const CategoryIcon = category.icon;
          const isActive = selectedCategory === category.id;
          return (
            <Pressable
              key={category.id}
              style={[
                styles.categoryChip,
                isActive && styles.categoryChipActive,
              ]}
              onPress={() => setSelectedCategory(category.id)}
            >
              <CategoryIcon
                size={14}
                color={isActive ? "#ffffff" : "#6b7280"}
              />
              <Text
                style={[
                  styles.categoryText,
                  isActive && styles.categoryTextActive,
                ]}
              >
                {category.label}
              </Text>
            </Pressable>
          );
        })}
      </ScrollView>

      {/* Blog Posts */}
      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        {filteredPosts.map((post, index) => (
          <Pressable
            key={post.id}
            style={[
              styles.postCard,
              post.featured && styles.postCardFeatured,
              index === 0 && styles.postCardFirst,
            ]}
            onPress={() => {}}
          >
            {/* Featured Badge */}
            {post.featured && (
              <View style={styles.featuredBadge}>
                <TrendingUp size={12} color="#ffffff" />
                <Text style={styles.featuredText}>Nổi Bật</Text>
              </View>
            )}

            {/* Post Image Placeholder */}
            <View
              style={[
                styles.postImage,
                { backgroundColor: getCategoryColor(post.category) + "20" },
              ]}
            >
              <Zap
                size={48}
                color={getCategoryColor(post.category)}
                opacity={0.5}
              />
            </View>

            {/* Post Content */}
            <View style={styles.postContent}>
              {/* Category Badge */}
              <View
                style={[
                  styles.categoryBadge,
                  { backgroundColor: getCategoryColor(post.category) + "15" },
                ]}
              >
                <Text
                  style={[
                    styles.categoryBadgeText,
                    { color: getCategoryColor(post.category) },
                  ]}
                >
                  {getCategoryLabel(post.category)}
                </Text>
              </View>

              {/* Title */}
              <Text style={styles.postTitle} numberOfLines={2}>
                {post.title}
              </Text>

              {/* Excerpt */}
              <Text style={styles.postExcerpt} numberOfLines={2}>
                {post.excerpt}
              </Text>

              {/* Meta Info */}
              <View style={styles.postMeta}>
                <View style={styles.metaLeft}>
                  <Text style={styles.authorName}>{post.author}</Text>
                  <View style={styles.metaDot} />
                  <Clock size={12} color="#9ca3af" />
                  <Text style={styles.readTime}>{post.readTime}</Text>
                </View>
                <View style={styles.metaRight}>
                  <Heart size={16} color="#ef4444" fill="#ef4444" />
                  <Text style={styles.likesCount}>{post.likes}</Text>
                </View>
              </View>
            </View>
          </Pressable>
        ))}

        {/* Empty State */}
        {filteredPosts.length === 0 && (
          <View style={styles.emptyState}>
            <BookOpen size={64} color="#d1d5db" />
            <Text style={styles.emptyTitle}>Chưa Có Bài Viết</Text>
            <Text style={styles.emptyDescription}>
              Không có bài viết nào trong danh mục này
            </Text>
          </View>
        )}

        <View style={styles.bottomSpacer} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f9fafb",
  },
  header: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 16,
    backgroundColor: "#ffffff",
    borderBottomWidth: 1,
    borderBottomColor: "#e5e7eb",
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#111827",
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 14,
    color: "#6b7280",
  },
  categoriesContainer: {
    backgroundColor: "#ffffff",
    borderBottomWidth: 1,
    borderBottomColor: "#e5e7eb",
  },
  categoriesContent: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    gap: 6,
  },
  categoryChip: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    backgroundColor: "#f3f4f6",
    gap: 4,
  },
  categoryChipActive: {
    backgroundColor: "#10b981",
  },
  categoryText: {
    fontSize: 11,
    fontWeight: "600",
    color: "#6b7280",
  },
  categoryTextActive: {
    color: "#ffffff",
  },
  scrollView: {
    flex: 1,
  },
  postCard: {
    backgroundColor: "#ffffff",
    marginHorizontal: 16,
    marginTop: 16,
    borderRadius: 16,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  postCardFirst: {
    marginTop: 16,
  },
  postCardFeatured: {
    borderWidth: 2,
    borderColor: "#fbbf24",
  },
  featuredBadge: {
    position: "absolute",
    top: 12,
    right: 12,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fbbf24",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
    gap: 4,
    zIndex: 10,
  },
  featuredText: {
    color: "#ffffff",
    fontSize: 11,
    fontWeight: "700",
  },
  postImage: {
    width: "100%",
    height: 180,
    alignItems: "center",
    justifyContent: "center",
  },
  postContent: {
    padding: 16,
  },
  categoryBadge: {
    alignSelf: "flex-start",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
    marginBottom: 10,
  },
  categoryBadgeText: {
    fontSize: 11,
    fontWeight: "700",
    textTransform: "uppercase",
  },
  postTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#111827",
    marginBottom: 8,
    lineHeight: 24,
  },
  postExcerpt: {
    fontSize: 14,
    color: "#6b7280",
    lineHeight: 20,
    marginBottom: 12,
  },
  postMeta: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: "#f3f4f6",
  },
  metaLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  authorName: {
    fontSize: 13,
    fontWeight: "600",
    color: "#374151",
  },
  metaDot: {
    width: 3,
    height: 3,
    borderRadius: 1.5,
    backgroundColor: "#d1d5db",
  },
  readTime: {
    fontSize: 12,
    color: "#9ca3af",
  },
  metaRight: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  likesCount: {
    fontSize: 13,
    fontWeight: "600",
    color: "#ef4444",
  },
  emptyState: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 80,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#111827",
    marginTop: 16,
    marginBottom: 8,
  },
  emptyDescription: {
    fontSize: 14,
    color: "#6b7280",
    textAlign: "center",
  },
  bottomSpacer: {
    height: 24,
  },
});
