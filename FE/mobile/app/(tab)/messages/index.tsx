import RerquiredLoginButton from "@/components/RequireLoginButton";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Image,
  Alert,
} from "react-native";
import { theme } from "@/utils";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { mockMessages } from "@/mocks/mockData";

export default function Messages() {
  const handleMessagePress = (name: string, lastMessage: string) => {
    Alert.alert(name, lastMessage + "\n\nChức năng chat đang phát triển");
  };

  // Using mock data from centralized file
  const messages = mockMessages;

  return (
    <RerquiredLoginButton>
      <ScrollView style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Tin nhắn</Text>
        </View>

        <View style={styles.messagesList}>
          {mockMessages.map((message) => (
            <TouchableOpacity
              key={message.id}
              style={styles.messageItem}
              activeOpacity={0.7}
              onPress={() =>
                handleMessagePress(message.name, message.lastMessage)
              }
            >
              <Image source={{ uri: message.avatar }} style={styles.avatar} />
              <View style={styles.messageContent}>
                <View style={styles.messageHeader}>
                  <Text style={styles.messageName}>{message.name}</Text>
                  <Text style={styles.messageTime}>{message.time}</Text>
                </View>
                <View style={styles.messageFooter}>
                  <Text
                    style={[
                      styles.messageText,
                      message.unread > 0 && styles.messageTextUnread,
                    ]}
                    numberOfLines={1}
                  >
                    {message.lastMessage}
                  </Text>
                  {message.unread > 0 && (
                    <View style={styles.unreadBadge}>
                      <Text style={styles.unreadText}>{message.unread}</Text>
                    </View>
                  )}
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </View>

        {/* Empty State if no messages */}
        {mockMessages.length === 0 && (
          <View style={styles.emptyState}>
            <MaterialCommunityIcons
              name="message-outline"
              size={64}
              color="#ccc"
            />
            <Text style={styles.emptyText}>Chưa có tin nhắn nào</Text>
          </View>
        )}
      </ScrollView>
    </RerquiredLoginButton>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F5F5",
  },
  header: {
    backgroundColor: "#fff",
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: "#E0E0E0",
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "700",
    color: "#000",
  },
  messagesList: {
    backgroundColor: "#fff",
    marginTop: theme.spacing.sm,
  },
  messageItem: {
    flexDirection: "row",
    padding: theme.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: "#F0F0F0",
    backgroundColor: "#fff",
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "#ddd",
  },
  messageContent: {
    flex: 1,
    marginLeft: theme.spacing.md,
  },
  messageHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 4,
  },
  messageName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#000",
    flex: 1,
  },
  messageTime: {
    fontSize: 12,
    color: "#999",
  },
  messageFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  messageText: {
    fontSize: 14,
    color: "#666",
    flex: 1,
  },
  messageTextUnread: {
    fontWeight: "600",
    color: "#000",
  },
  unreadBadge: {
    backgroundColor: theme.colors.primary,
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 6,
    marginLeft: 8,
  },
  unreadText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "700",
  },
  emptyState: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 80,
  },
  emptyText: {
    fontSize: 16,
    color: "#999",
    marginTop: theme.spacing.md,
  },
});
