import RerquiredLoginButton from "@/components/RequireLoginButton";
import { View, Text } from "react-native";
export default function Profile() {
  return (
    <RerquiredLoginButton>
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text>This is Profile Page</Text>
      </View>
    </RerquiredLoginButton>
  );
}
