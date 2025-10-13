import { useAuth } from "@/context/authContext";
import { useRouter } from "expo-router";
import { Button, Text, View } from "react-native";

interface Props {
  children: React.ReactNode;
}

export default function RerquiredLoginButton({ children }: Props) {
  const { user } = useAuth();
  const router = useRouter();

  if (!user) {
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: "white",
          justifyContent: "center",
          alignItems: "center",
          padding: 20,
        }}
      >
        <Text
          style={{
            fontSize: 16,
            textAlign: "center",
            marginBottom: 16,
            color: "#333",
          }}
        >
          Bạn cần đăng nhập để xem nội dung này.
        </Text>
        <Button
          title="Đăng nhập ngay"
          color="#0d9488"
          onPress={() => router.push("/login")}
        />
      </View>
    );
  }
  return <>{children}</>;
}
