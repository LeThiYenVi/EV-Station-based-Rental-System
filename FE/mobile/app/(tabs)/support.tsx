import React, { useState } from "react";
import {
  View,
  Text,
  SafeAreaView,
  ScrollView,
  Pressable,
  StyleSheet,
  Linking,
} from "react-native";
import {
  Phone,
  Mail,
  MessageCircle,
  HelpCircle,
  FileText,
  AlertCircle,
  ChevronDown,
  ChevronUp,
  Shield,
  Clock,
  DollarSign,
} from "lucide-react-native";
import { Card } from "@/components/common";
import Toast from "react-native-toast-message";

export default function SupportScreen() {
  const [expandedFaq, setExpandedFaq] = useState<string | null>(null);

  const handleCall = () => {
    Linking.openURL("tel:+842812345678").catch(() => {
      Toast.show({
        type: "error",
        text1: "Lỗi",
        text2: "Không thể mở ứng dụng điện thoại",
      });
    });
  };

  const handleEmail = () => {
    Linking.openURL("mailto:support@evrental.vn").catch(() => {
      Toast.show({
        type: "error",
        text1: "Lỗi",
        text2: "Không thể mở ứng dụng email",
      });
    });
  };

  const handleChat = () => {
    Toast.show({
      type: "info",
      text1: "Tính năng đang phát triển",
      text2: "Chat trực tiếp sẽ có trong phiên bản sau",
    });
  };

  const faqs = [
    {
      id: "1",
      question: "Làm sao để thuê xe?",
      answer:
        "Bước 1: Tìm trạm xe gần bạn trên bản đồ. Bước 2: Quét mã QR trên xe. Bước 3: Chọn thời gian thuê và thanh toán qua MoMo. Bước 4: Xe sẽ tự động mở khóa và bạn có thể bắt đầu chuyến đi.",
    },
    {
      id: "2",
      question: "Phương thức thanh toán nào được chấp nhận?",
      answer:
        "Hiện tại chúng tôi chấp nhận thanh toán qua MoMo. Các phương thức khác như Ví điện tử, Thẻ tín dụng sẽ được bổ sung trong tương lai.",
    },
    {
      id: "3",
      question: "Nếu xe gặp sự cố giữa đường thì sao?",
      answer:
        "Hãy liên hệ hỗ trợ ngay qua hotline: +84 (028) 123-4567. Chúng tôi sẽ hỗ trợ đổi xe miễn phí hoặc cứu hộ nếu cần thiết. Bạn sẽ không bị tính phí trong thời gian chờ đợi.",
    },
    {
      id: "4",
      question: "Tôi có thể trả xe ở trạm khác không?",
      answer:
        "Có, bạn có thể trả xe tại bất kỳ trạm nào trong hệ thống. Tuy nhiên, hãy đảm bảo trạm đó có chỗ trống. Nếu trạm đầy, vui lòng chọn trạm gần nhất.",
    },
    {
      id: "5",
      question: "Làm thế nào để hủy đặt xe?",
      answer:
        "Bạn có thể hủy đặt xe trong phần 'Chuyến Đi' trước khi bắt đầu chuyến. Nếu hủy trước 1 giờ, bạn sẽ được hoàn tiền 100%. Hủy trong vòng 1 giờ sẽ bị trừ 20% phí đặt cọc.",
    },
    {
      id: "6",
      question: "Yêu cầu bằng lái xe như thế nào?",
      answer:
        "Bạn cần có bằng lái xe hạng A1 trở lên và đã được xác minh trong hồ sơ. Để xác minh bằng lái, vào Hồ Sơ → Thông Tin Cá Nhân → Upload ảnh bằng lái mặt trước và sau.",
    },
  ];

  const safetyTips = [
    {
      id: "1",
      icon: Shield,
      text: "Luôn đeo mũ bảo hiểm và tuân thủ luật giao thông",
    },
    {
      id: "2",
      icon: Clock,
      text: "Kiểm tra mức pin và tình trạng xe trước khi khởi hành",
    },
    {
      id: "3",
      icon: DollarSign,
      text: "Trả xe đúng trạm để tránh phí phạt ngoài dự kiến",
    },
  ];

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Hỗ Trợ</Text>
        <Text style={styles.headerSubtitle}>
          Chúng tôi có thể giúp gì cho bạn?
        </Text>
      </View>

      {/* Support Options */}
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Contact Options */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Liên Hệ Hỗ Trợ</Text>

          {/* Chat Support - Coming Soon */}
          <Pressable style={styles.contactCard} onPress={handleChat}>
            <View style={styles.iconWrapper}>
              <MessageCircle size={24} color="#10b981" />
            </View>
            <View style={styles.contactContent}>
              <Text style={styles.contactTitle}>Trò Chuyện Trực Tiếp</Text>
              <Text style={styles.contactSubtitle}>
                Chat với đội ngũ hỗ trợ
              </Text>
            </View>
            <View style={styles.comingSoonBadge}>
              <Text style={styles.comingSoonText}>Sắp ra mắt</Text>
            </View>
          </Pressable>

          {/* Phone Support */}
          <Pressable style={styles.contactCard} onPress={handleCall}>
            <View style={styles.iconWrapper}>
              <Phone size={24} color="#10b981" />
            </View>
            <View style={styles.contactContent}>
              <Text style={styles.contactTitle}>Gọi Điện</Text>
              <Text style={styles.contactSubtitle}>+84 (028) 123-4567</Text>
            </View>
          </Pressable>

          {/* Email Support */}
          <Pressable style={styles.contactCard} onPress={handleEmail}>
            <View style={styles.iconWrapper}>
              <Mail size={24} color="#10b981" />
            </View>
            <View style={styles.contactContent}>
              <Text style={styles.contactTitle}>Email Hỗ Trợ</Text>
              <Text style={styles.contactSubtitle}>support@evrental.vn</Text>
            </View>
          </Pressable>
        </View>

        {/* FAQ Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeaderRow}>
            <HelpCircle size={22} color="#10b981" />
            <Text style={styles.sectionTitle}>Câu Hỏi Thường Gặp</Text>
          </View>
          <View style={styles.faqContainer}>
            {faqs.map((faq) => (
              <View key={faq.id} style={styles.faqItem}>
                <Pressable
                  style={styles.faqQuestion}
                  onPress={() =>
                    setExpandedFaq(expandedFaq === faq.id ? null : faq.id)
                  }
                >
                  <Text style={styles.faqQuestionText}>{faq.question}</Text>
                  {expandedFaq === faq.id ? (
                    <ChevronUp size={20} color="#10b981" />
                  ) : (
                    <ChevronDown size={20} color="#9ca3af" />
                  )}
                </Pressable>
                {expandedFaq === faq.id && (
                  <View style={styles.faqAnswer}>
                    <Text style={styles.faqAnswerText}>{faq.answer}</Text>
                  </View>
                )}
              </View>
            ))}
          </View>
        </View>

        {/* Safety Guidelines */}
        <View style={styles.section}>
          <View style={styles.sectionHeaderRow}>
            <Shield size={22} color="#10b981" />
            <Text style={styles.sectionTitle}>Hướng Dẫn An Toàn</Text>
          </View>
          <Card>
            {safetyTips.map((tip, index) => {
              const Icon = tip.icon;
              return (
                <View
                  key={tip.id}
                  style={[
                    styles.safetyTip,
                    index !== safetyTips.length - 1 && styles.safetyTipBorder,
                  ]}
                >
                  <Icon size={20} color="#10b981" />
                  <Text style={styles.safetyText}>{tip.text}</Text>
                </View>
              );
            })}
          </Card>
        </View>

        {/* Additional Resources */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Tài Liệu Thêm</Text>

          <Pressable style={styles.resourceCard}>
            <FileText size={20} color="#10b981" />
            <Text style={styles.resourceText}>Hướng Dẫn Sử Dụng Chi Tiết</Text>
          </Pressable>

          <Pressable style={styles.resourceCard}>
            <AlertCircle size={20} color="#10b981" />
            <Text style={styles.resourceText}>Báo Cáo Sự Cố Hoặc Vấn Đề</Text>
          </Pressable>
        </View>

        {/* Bottom Spacing */}
        <View style={styles.bottomSpacer} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
  },
  header: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#e5e7eb",
    backgroundColor: "#ffffff",
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#111827",
  },
  headerSubtitle: {
    fontSize: 16,
    color: "#6b7280",
    marginTop: 4,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 20,
  },
  section: {
    paddingHorizontal: 16,
    paddingTop: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#111827",
    marginBottom: 12,
  },
  sectionHeaderRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 12,
  },
  contactCard: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    backgroundColor: "#ffffff",
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#e5e7eb",
  },
  iconWrapper: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#ecfdf5",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  contactContent: {
    flex: 1,
  },
  contactTitle: {
    fontSize: 15,
    fontWeight: "600",
    color: "#111827",
    marginBottom: 2,
  },
  contactSubtitle: {
    fontSize: 13,
    color: "#6b7280",
  },
  comingSoonBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    backgroundColor: "#fef3c7",
  },
  comingSoonText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#92400e",
  },
  resourceCard: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    backgroundColor: "#ffffff",
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#e5e7eb",
    gap: 12,
  },
  resourceText: {
    fontSize: 15,
    fontWeight: "600",
    color: "#111827",
  },
  optionsContainer: {
    gap: 12,
  },
  faqContainer: {
    gap: 8,
  },
  faqItem: {
    borderWidth: 1,
    borderColor: "#e5e7eb",
    borderRadius: 8,
    overflow: "hidden",
  },
  faqQuestion: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    backgroundColor: "#ffffff",
  },
  faqQuestionText: {
    flex: 1,
    fontSize: 15,
    fontWeight: "600",
    color: "#111827",
    marginRight: 12,
  },
  faqAnswer: {
    padding: 16,
    paddingTop: 0,
    backgroundColor: "#f9fafb",
  },
  faqAnswerText: {
    fontSize: 14,
    color: "#4b5563",
    lineHeight: 20,
  },
  safetyTip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingVertical: 12,
  },
  safetyTipBorder: {
    borderBottomWidth: 1,
    borderBottomColor: "#d1fae5",
  },
  safetyText: {
    flex: 1,
    fontSize: 14,
    color: "#065f46",
    fontWeight: "500",
  },
  bottomSpacer: {
    height: 20,
  },
});
