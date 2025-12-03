import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  Pressable,
  StyleSheet,
  Linking,
} from "react-native";
import {
  HelpCircle,
  MessageCircle,
  Phone,
  Mail,
  ChevronDown,
  ChevronUp,
  ExternalLink,
} from "lucide-react-native";

export default function HelpScreen() {
  const [expandedFaq, setExpandedFaq] = useState<string | null>(null);

  const faqs = [
    {
      id: "1",
      question: "Làm thế nào để thuê xe?",
      answer:
        "Bạn có thể thuê xe bằng cách quét mã QR trên xe hoặc chọn xe từ bản đồ. Sau đó làm theo hướng dẫn để mở khóa và bắt đầu chuyến đi.",
    },
    {
      id: "2",
      question: "Phí thuê xe được tính như thế nào?",
      answer:
        "Phí thuê bao gồm phí mở khóa cố định và phí theo thời gian/quãng đường. Chi tiết giá cả sẽ được hiển thị trước khi bạn xác nhận thuê xe.",
    },
    {
      id: "3",
      question: "Tôi có thể trả xe ở đâu?",
      answer:
        "Bạn có thể trả xe tại bất kỳ trạm nào trong hệ thống. Hãy đảm bảo xe được đỗ đúng vị trí và khóa lại trước khi kết thúc chuyến đi.",
    },
    {
      id: "4",
      question: "Nếu xe gặp sự cố thì sao?",
      answer:
        "Vui lòng liên hệ ngay với bộ phận hỗ trợ qua hotline hoặc chat trong app. Chúng tôi sẽ hỗ trợ bạn ngay lập tức.",
    },
    {
      id: "5",
      question: "Làm thế nào để báo cáo vấn đề về xe?",
      answer:
        "Bạn có thể báo cáo vấn đề qua mục 'Báo cáo sự cố' trong app hoặc liên hệ hotline. Hãy cung cấp thông tin chi tiết về vấn đề.",
    },
  ];

  const contactMethods = [
    {
      id: "1",
      icon: <Phone size={24} color="#10b981" />,
      title: "Hotline",
      subtitle: "1900 xxxx",
      action: () => Linking.openURL("tel:1900xxxx"),
    },
    {
      id: "2",
      icon: <MessageCircle size={24} color="#10b981" />,
      title: "Chat với chúng tôi",
      subtitle: "Trả lời trong vài phút",
      action: () => {},
    },
    {
      id: "3",
      icon: <Mail size={24} color="#10b981" />,
      title: "Email",
      subtitle: "support@evrental.com",
      action: () => Linking.openURL("mailto:support@evrental.com"),
    },
  ];

  const resources = [
    {
      id: "1",
      title: "Hướng dẫn sử dụng",
      url: "https://evrental.com/guide",
    },
    {
      id: "2",
      title: "Điều khoản dịch vụ",
      url: "https://evrental.com/terms",
    },
    {
      id: "3",
      title: "Chính sách bảo mật",
      url: "https://evrental.com/privacy",
    },
    {
      id: "4",
      title: "Câu hỏi thường gặp",
      url: "https://evrental.com/faq",
    },
  ];

  const toggleFaq = (id: string) => {
    setExpandedFaq(expandedFaq === id ? null : id);
  };

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView}>
        {/* Contact Methods */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Liên Hệ Hỗ Trợ</Text>
          {contactMethods.map((method) => (
            <Pressable
              key={method.id}
              style={({ pressed }) => [
                styles.contactItem,
                pressed && styles.contactItemPressed,
              ]}
              onPress={method.action}
            >
              <View style={styles.contactIcon}>{method.icon}</View>
              <View style={styles.contactContent}>
                <Text style={styles.contactTitle}>{method.title}</Text>
                <Text style={styles.contactSubtitle}>{method.subtitle}</Text>
              </View>
            </Pressable>
          ))}
        </View>

        {/* FAQs */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Câu Hỏi Thường Gặp</Text>
          {faqs.map((faq) => (
            <View key={faq.id} style={styles.faqItem}>
              <Pressable
                style={styles.faqQuestion}
                onPress={() => toggleFaq(faq.id)}
              >
                <View style={styles.questionIcon}>
                  <HelpCircle size={20} color="#6b7280" />
                </View>
                <Text style={styles.questionText}>{faq.question}</Text>
                {expandedFaq === faq.id ? (
                  <ChevronUp size={20} color="#6b7280" />
                ) : (
                  <ChevronDown size={20} color="#6b7280" />
                )}
              </Pressable>
              {expandedFaq === faq.id && (
                <View style={styles.faqAnswer}>
                  <Text style={styles.answerText}>{faq.answer}</Text>
                </View>
              )}
            </View>
          ))}
        </View>

        {/* Resources */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Tài Liệu Tham Khảo</Text>
          {resources.map((resource) => (
            <Pressable
              key={resource.id}
              style={({ pressed }) => [
                styles.resourceItem,
                pressed && styles.resourceItemPressed,
              ]}
              onPress={() => Linking.openURL(resource.url)}
            >
              <Text style={styles.resourceText}>{resource.title}</Text>
              <ExternalLink size={18} color="#9ca3af" />
            </Pressable>
          ))}
        </View>

        {/* Info Box */}
        <View style={styles.infoBox}>
          <Text style={styles.infoTitle}>💬 Cần Hỗ Trợ Thêm?</Text>
          <Text style={styles.infoText}>
            Đội ngũ hỗ trợ của chúng tôi luôn sẵn sàng giúp đỡ bạn 24/7. Đừng
            ngần ngại liên hệ nếu bạn có bất kỳ thắc mắc nào!
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f9fafb",
  },
  scrollView: {
    flex: 1,
  },
  section: {
    backgroundColor: "#ffffff",
    marginBottom: 12,
    paddingVertical: 8,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#111827",
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  contactItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#f3f4f6",
  },
  contactItemPressed: {
    backgroundColor: "#f9fafb",
  },
  contactIcon: {
    width: 48,
    height: 48,
    backgroundColor: "#d1fae5",
    borderRadius: 24,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  contactContent: {
    flex: 1,
  },
  contactTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#111827",
    marginBottom: 2,
  },
  contactSubtitle: {
    fontSize: 14,
    color: "#6b7280",
  },
  faqItem: {
    borderBottomWidth: 1,
    borderBottomColor: "#f3f4f6",
  },
  faqQuestion: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  questionIcon: {
    marginRight: 12,
  },
  questionText: {
    flex: 1,
    fontSize: 15,
    fontWeight: "500",
    color: "#111827",
  },
  faqAnswer: {
    paddingHorizontal: 16,
    paddingBottom: 16,
    paddingLeft: 56,
  },
  answerText: {
    fontSize: 14,
    color: "#6b7280",
    lineHeight: 20,
  },
  resourceItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#f3f4f6",
  },
  resourceItemPressed: {
    backgroundColor: "#f9fafb",
  },
  resourceText: {
    fontSize: 15,
    color: "#111827",
  },
  infoBox: {
    backgroundColor: "#eff6ff",
    padding: 16,
    margin: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#dbeafe",
  },
  infoTitle: {
    fontSize: 15,
    fontWeight: "600",
    color: "#1e40af",
    marginBottom: 8,
  },
  infoText: {
    fontSize: 13,
    color: "#1e3a8a",
    lineHeight: 20,
  },
});
