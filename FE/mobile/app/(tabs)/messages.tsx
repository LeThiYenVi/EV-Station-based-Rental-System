import React from "react";
import {
  View,
  Text,
  SafeAreaView,
  ScrollView,
  Pressable,
  StyleSheet,
} from "react-native";
import { useRouter } from "expo-router";
import { useAuth } from "@/hooks/useAuth";
import { MessageCircle } from "lucide-react-native";
import {
  EmptyState,
  Button,
  Avatar,
  ListItem,
  Badge,
} from "@/components/common";

export default function MessagesScreen() {
  const router = useRouter();
  const { isAuthenticated, user } = useAuth();

  // Mock conversations with users
  const conversations = [
    {
      id: "1",
      type: "support",
      sender: "Hỗ Trợ Khách Hàng",
      avatar: "HT",
      lastMessage:
        "Chúng tôi đã nhận được yêu cầu của bạn. Xin vui lòng chờ...",
      timestamp: "5 phút trước",
      unread: 2,
      online: true,
    },
    {
      id: "2",
      type: "notification",
      sender: "Hệ Thống",
      avatar: "HT",
      lastMessage: "Chuyến đi của bạn đã hoàn thành. Tổng: 45,000đ",
      timestamp: "1 giờ trước",
      unread: 0,
      online: false,
    },
    {
      id: "3",
      type: "promotion",
      sender: "Khuyến Mãi",
      avatar: "KM",
      lastMessage: "🎉 Giảm 20% cho chuyến đi tiếp theo! Mã: EVRENTAL20",
      timestamp: "2 giờ trước",
      unread: 1,
      online: false,
    },
    {
      id: "4",
      type: "notification",
      sender: "Thông Báo",
      avatar: "TB",
      lastMessage: "Xe của bạn đã được mở khóa thành công tại Trạm Trung Tâm",
      timestamp: "3 giờ trước",
      unread: 0,
      online: false,
    },
    {
      id: "5",
      type: "system",
      sender: "EV Rental",
      avatar: "EV",
      lastMessage: "Chào mừng bạn đến với EV Rental! Bắt đầu khám phá ngay.",
      timestamp: "1 ngày trước",
      unread: 0,
      online: false,
    },
  ];

  if (!isAuthenticated) {
    return (
      <SafeAreaView style={styles.container}>
        <EmptyState
          icon={<MessageCircle size={64} color="#d1d5db" />}
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

  const getAvatarColor = (type: string) => {
    switch (type) {
      case "support":
        return "#3b82f6";
      case "notification":
        return "#8b5cf6";
      case "promotion":
        return "#f97316";
      default:
        return "#10b981";
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Tin Nhắn</Text>
      </View>

      {/* Messages List */}
      <ScrollView style={styles.scrollView}>
        {conversations.map((conversation) => (
          <ListItem
            key={conversation.id}
            icon={
              <Avatar
                text={conversation.avatar}
                backgroundColor={getAvatarColor(conversation.type)}
                online={conversation.online}
              />
            }
            title={conversation.sender}
            subtitle={conversation.lastMessage}
            rightContent={
              <View style={styles.rightContent}>
                <Text style={styles.timestamp}>{conversation.timestamp}</Text>
                {conversation.unread > 0 && (
                  <Badge
                    text={conversation.unread.toString()}
                    variant="success"
                  />
                )}
              </View>
            }
            showChevron={false}
            onPress={() => {}}
          />
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
  },
  emptyContainer: {
    flex: 1,
    backgroundColor: "#ffffff",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 24,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#111827",
    marginTop: 24,
    marginBottom: 8,
  },
  emptyDescription: {
    fontSize: 16,
    color: "#6b7280",
    textAlign: "center",
    marginBottom: 24,
  },
  loginButton: {
    backgroundColor: "#10b981",
    paddingHorizontal: 32,
    paddingVertical: 12,
    borderRadius: 8,
  },
  loginButtonPressed: {
    opacity: 0.8,
  },
  loginButtonText: {
    color: "#ffffff",
    fontWeight: "600",
    fontSize: 16,
  },
  header: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#e5e7eb",
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#111827",
  },
  scrollView: {
    flex: 1,
  },
  rightContent: {
    alignItems: "flex-end",
    gap: 4,
  },
  timestamp: {
    fontSize: 12,
    color: "#9ca3af",
  },
  // New conversation item styles
  conversationItem: {
    flexDirection: "row",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#f3f4f6",
    backgroundColor: "#ffffff",
  },
  conversationPressed: {
    backgroundColor: "#f9fafb",
  },
  avatarContainer: {
    position: "relative",
    marginRight: 12,
  },
  conversationAvatar: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: "#10b981",
    alignItems: "center",
    justifyContent: "center",
  },
  avatarSupport: {
    backgroundColor: "#3b82f6",
  },
  avatarNotification: {
    backgroundColor: "#8b5cf6",
  },
  avatarPromotion: {
    backgroundColor: "#f59e0b",
  },
  avatarText: {
    color: "#ffffff",
    fontSize: 18,
    fontWeight: "bold",
  },
  onlineIndicator: {
    position: "absolute",
    bottom: 2,
    right: 2,
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: "#10b981",
    borderWidth: 2,
    borderColor: "#ffffff",
  },
  conversationContent: {
    flex: 1,
    justifyContent: "center",
  },
  conversationHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 4,
  },
  senderName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#111827",
    flex: 1,
  },
  messageRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  lastMessage: {
    fontSize: 14,
    color: "#6b7280",
    flex: 1,
    lineHeight: 20,
  },
  lastMessageUnread: {
    color: "#111827",
    fontWeight: "500",
  },
  unreadBadge: {
    backgroundColor: "#10b981",
    minWidth: 20,
    height: 20,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 6,
    marginLeft: 8,
  },
  unreadCount: {
    color: "#ffffff",
    fontSize: 12,
    fontWeight: "bold",
  },
});
