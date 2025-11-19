import React, { useState } from "react";
import {
  View,
  Text,
  SafeAreaView,
  ScrollView,
  Pressable,
  StyleSheet,
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
import { ListItem, Badge, InfoRow, Card } from "@/components/common";

export default function SupportScreen() {
  const [expandedFaq, setExpandedFaq] = useState<string | null>(null);

  const supportOptions = [
    {
      id: "1",
      icon: MessageCircle,
      title: "Trò Chuyện Trực Tiếp",
      description: "Chat với đội ngũ hỗ trợ",
      badge: "Online",
    },
    {
      id: "2",
      icon: Phone,
      title: "Gọi Điện",
      description: "+84 (028) 123-4567",
      badge: null,
    },
    {
      id: "3",
      icon: Mail,
      title: "Email Hỗ Trợ",
      description: "support@evrental.vn",
      badge: null,
    },
  ];

  const faqs = [
    {
      id: "1",
      question: "Làm sao để thuê xe?",
      answer:
        "Mở ứng dụng, tìm trạm gần bạn, quét mã QR trên xe để mở khóa và bắt đầu chuyến đi.",
    },
    {
      id: "2",
      question: "Phí thuê xe là bao nhiêu?",
      answer:
        "Phí thuê là 10.000đ/phút hoặc 200.000đ/ngày. Phí mở khóa ban đầu là 5.000đ.",
    },
    {
      id: "3",
      question: "Nếu xe hết pin giữa đường thì sao?",
      answer:
        "Hãy liên hệ hỗ trợ ngay lập tức. Chúng tôi sẽ hỗ trợ đổi xe miễn phí nếu xe hết pin trong quá trình thuê.",
    },
    {
      id: "4",
      question: "Tôi có thể đỗ xe ở đâu?",
      answer:
        "Bạn chỉ có thể đỗ xe tại các trạm được chỉ định. Đỗ xe ngoài trạm sẽ bị tính phí phạt.",
    },
    {
      id: "5",
      question: "Làm thế nào để hủy chuyến đi?",
      answer:
        "Bạn có thể hủy chuyến đi trong vòng 5 phút đầu tiên mà không mất phí. Sau 5 phút sẽ tính phí bình thường.",
    },
  ];

  const safetyTips = [
    {
      id: "1",
      icon: Shield,
      text: "Đeo mũ bảo hiểm khi đi xe",
    },
    {
      id: "2",
      icon: Clock,
      text: "Kiểm tra mức pin trước khi xuất phát",
    },
    {
      id: "3",
      icon: DollarSign,
      text: "Đỗ xe đúng trạm để tránh phí phạt",
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
          <View style={styles.optionsContainer}>
            {supportOptions.map((option) => (
              <ListItem
                key={option.id}
                icon={option.icon}
                title={option.title}
                subtitle={option.description}
                badge={
                  option.badge ? (
                    <Badge variant="success" text={option.badge} />
                  ) : undefined
                }
                onPress={() => {}}
              />
            ))}
          </View>
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
          <ListItem
            icon={FileText}
            title="Hướng Dẫn Sử Dụng Chi Tiết"
            onPress={() => {}}
          />
          <ListItem
            icon={AlertCircle}
            title="Báo Cáo Sự Cố Hoặc Vấn Đề"
            onPress={() => {}}
          />
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
