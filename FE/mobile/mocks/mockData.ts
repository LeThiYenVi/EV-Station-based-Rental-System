/**
 * Mock Data for Development
 *
 * This file contains all mock data used throughout the app.
 * When ready to use real APIs, simply remove or replace this file.
 */

// ==================== MESSAGES MOCK DATA ====================
export interface MockMessage {
  id: number;
  name: string;
  avatar: string;
  lastMessage: string;
  time: string;
  unread: number;
}

export const mockMessages: MockMessage[] = [
  {
    id: 1,
    name: "Chủ xe Nguyễn Văn A",
    avatar: "https://i.pravatar.cc/150?img=12",
    lastMessage: "Xe đã sẵn sàng cho chuyến đi của bạn",
    time: "10 phút trước",
    unread: 2,
  },
  {
    id: 2,
    name: "Hỗ trợ khách hàng",
    avatar: "https://i.pravatar.cc/150?img=5",
    lastMessage: "Cảm ơn bạn đã liên hệ, chúng tôi sẽ hỗ trợ bạn ngay",
    time: "1 giờ trước",
    unread: 0,
  },
  {
    id: 3,
    name: "Chủ xe Trần Thị B",
    avatar: "https://i.pravatar.cc/150?img=20",
    lastMessage: "Bạn có thể nhận xe lúc 9h sáng mai",
    time: "2 giờ trước",
    unread: 1,
  },
  {
    id: 4,
    name: "Chủ xe Lê Văn C",
    avatar: "https://i.pravatar.cc/150?img=33",
    lastMessage: "Cảm ơn bạn đã thuê xe. Chúc bạn một chuyến đi vui vẻ!",
    time: "1 ngày trước",
    unread: 0,
  },
];

// ==================== INSURANCE COMPANIES MOCK DATA ====================
export interface MockInsurance {
  id: number;
  name: string;
  logo: any;
  hotline: string;
}

export const mockInsuranceCompanies: MockInsurance[] = [
  {
    id: 1,
    name: "MIC",
    logo: require("@/assets/images/favicon.png"),
    hotline: "1900-5555",
  },
  {
    id: 2,
    name: "PVI",
    logo: require("@/assets/images/favicon.png"),
    hotline: "1900-6666",
  },
  {
    id: 3,
    name: "DBV",
    logo: require("@/assets/images/favicon.png"),
    hotline: "1900-7777",
  },
];

// ==================== INFO CARDS MOCK DATA ====================
export interface MockInfoCard {
  id: number;
  icon: string;
  title: string;
  color: string;
}

export const mockInfoCards: MockInfoCard[] = [
  {
    id: 1,
    icon: "office-building",
    title: "Thông tin\ncông ty",
    color: "#10B981",
  },
  {
    id: 2,
    icon: "clipboard-check-outline",
    title: "Chính sách\nvà quy định",
    color: "#10B981",
  },
  {
    id: 3,
    icon: "phone",
    title: "Liên hệ\nhỗ trợ",
    color: "#10B981",
  },
  {
    id: 4,
    icon: "shield-check",
    title: "Bảo mật\nthông tin",
    color: "#10B981",
  },
];

// ==================== PROFILE MENU MOCK DATA ====================
export interface MockMenuItem {
  id: number;
  icon: string;
  label: string;
  iconLib: "MaterialCommunityIcons" | "AntDesign" | "FontAwesome";
}

export interface MockMenuSection {
  items: MockMenuItem[];
}

export const mockProfileMenuSections: MockMenuSection[] = [
  {
    items: [
      {
        id: 1,
        icon: "file-document-outline",
        label: "Đăng ký cho thuê xe",
        iconLib: "MaterialCommunityIcons",
      },
      {
        id: 2,
        icon: "heart-outline",
        label: "Xe yêu thích",
        iconLib: "MaterialCommunityIcons",
      },
      {
        id: 3,
        icon: "map-marker-outline",
        label: "Địa chỉ của tôi",
        iconLib: "MaterialCommunityIcons",
      },
      {
        id: 4,
        icon: "file-document-outline",
        label: "Giấy phép lái xe",
        iconLib: "MaterialCommunityIcons",
      },
      {
        id: 5,
        icon: "credit-card-outline",
        label: "Thẻ thanh toán",
        iconLib: "MaterialCommunityIcons",
      },
      {
        id: 6,
        icon: "star-outline",
        label: "Đánh giá từ chủ xe",
        iconLib: "MaterialCommunityIcons",
      },
    ],
  },
  {
    items: [
      { id: 7, icon: "gift", label: "Quà tặng", iconLib: "AntDesign" },
      {
        id: 8,
        icon: "share-variant",
        label: "Giới thiệu bạn mới",
        iconLib: "MaterialCommunityIcons",
      },
    ],
  },
];

// ==================== ABOUT US MOCK DATA ====================
export interface MockAboutItem {
  id: string;
  title: string;
  description: string;
  icon: string;
}

export const mockAboutUsData: MockAboutItem[] = [
  {
    id: "mission",
    title: "Sứ mệnh",
    description: "Kết nối người dùng với trạm sạc EV nhanh và tiện lợi.",
    icon: "rocket-outline",
  },
  {
    id: "vision",
    title: "Tầm nhìn",
    description: "Hệ sinh thái thuê xe điện minh bạch, bền vững.",
    icon: "eye-outline",
  },
  {
    id: "team",
    title: "Đội ngũ",
    description: "Năng động, tận tâm và luôn đổi mới.",
    icon: "people-outline",
  },
  {
    id: "values",
    title: "Giá trị",
    description: "An toàn – Tốc độ – Trách nhiệm.",
    icon: "sparkles-outline",
  },
];

// ==================== INSURANCE PACKAGES MOCK DATA ====================
export interface MockInsurancePackage {
  id: string;
  title: string;
  description: string;
  icon: string;
}

export const mockInsuranceData: MockInsurancePackage[] = [
  {
    id: "ins-basic",
    title: "Gói cơ bản",
    description: "Bảo vệ thiệt hại nhẹ và hỗ trợ cơ bản.",
    icon: "shield-checkmark-outline",
  },
  {
    id: "ins-plus",
    title: "Gói Plus",
    description: "Bao gồm mất cắp, va quệt và cứu hộ 24/7.",
    icon: "shield-half-outline",
  },
  {
    id: "ins-premium",
    title: "Gói Premium",
    description: "Bảo vệ toàn diện với quyền lợi tối đa.",
    icon: "medal-outline",
  },
];

// ==================== MOCK API DELAYS (for realistic behavior) ====================
export const MOCK_API_DELAY = 500; // milliseconds

/**
 * Simulate API call delay
 * Usage: await simulateApiDelay();
 */
export const simulateApiDelay = () =>
  new Promise((resolve) => setTimeout(resolve, MOCK_API_DELAY));

// ==================== HELPER FUNCTIONS ====================

/**
 * Get mock messages with optional delay
 */
export const getMockMessages = async (): Promise<MockMessage[]> => {
  await simulateApiDelay();
  return mockMessages;
};

/**
 * Get mock insurance companies
 */
export const getMockInsuranceCompanies = async (): Promise<MockInsurance[]> => {
  await simulateApiDelay();
  return mockInsuranceCompanies;
};

/**
 * Get mock info cards
 */
export const getMockInfoCards = async (): Promise<MockInfoCard[]> => {
  await simulateApiDelay();
  return mockInfoCards;
};

/**
 * Get mock profile menu sections
 */
export const getMockProfileMenu = async (): Promise<MockMenuSection[]> => {
  await simulateApiDelay();
  return mockProfileMenuSections;
};

/**
 * Get mock about us data
 */
export const getMockAboutUs = async (): Promise<MockAboutItem[]> => {
  await simulateApiDelay();
  return mockAboutUsData;
};

/**
 * Get mock insurance packages
 */
export const getMockInsurancePackages = async (): Promise<
  MockInsurancePackage[]
> => {
  await simulateApiDelay();
  return mockInsuranceData;
};
