import { useAuthApi } from "@/api/useAuthApi";
import { theme } from "@/utils";
import { Ionicons } from "@expo/vector-icons";
import { useMemo, useState } from "react";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import AntDesign from "@expo/vector-icons/AntDesign";

import {
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Icon, TextInput } from "react-native-paper";
import { useAuth } from "@/context/authContext";
import { useRouter } from "expo-router";
import { useNavigation } from "@react-navigation/native";

export default function loginPage({ navigation }: any) {
  const { login, user } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();
  const nav = useNavigation();

  const handleLogin = async () => {
    try {
      await login(email, password);
      // If Login was opened from a tab press, go back to the previous tab.
      // Otherwise, fall back to opening the Profile tab.
      if ((nav as any)?.canGoBack?.()) {
        (nav as any).goBack();
      } else {
        router.replace("/profile");
      }
    } catch (err) {
      alert("Sai tài khoản hoặc mật khẩu!");
    }
  };

  const platFormData = useMemo(
    () => [
      {
        id: "p1",
        title: "FaceBook",
        icon: <FontAwesome5 name="facebook" size={24} color="blue" />,
      },
      {
        id: "p2",
        title: "Google",
        icon: <AntDesign name="google" size={24} color="red" />,
      },
    ],
    []
  );
  const [showPassword, setShowPassword] = useState(false);
  return (
    <View style={style.container}>
      <Text style={style.title}>Số điện thoại của bạn</Text>
      <TextInput
        style={style.textInput}
        placeholder="Số điện thoại của bạn"
        value={email}
        onChangeText={setEmail}
      ></TextInput>
      <Text style={style.title}>Mật Khẩu</Text>
      <TextInput
        style={style.textInput}
        placeholder="Nhập Mật khẩu"
        secureTextEntry={!showPassword}
        value={password}
        onChangeText={setPassword}
        right={
          <TextInput.Icon
            icon={showPassword ? "eye" : "eye-off"}
            onPress={() => setShowPassword(!showPassword)}
          />
        }
      ></TextInput>
      <TouchableOpacity activeOpacity={0.7}>
        <Text style={style.forgetButton}>Quên Mật Khẩu</Text>
      </TouchableOpacity>
      <View>
        <FlatList
          data={platFormData}
          keyExtractor={(item) => item.id}
          horizontal
          showsHorizontalScrollIndicator={false}
          renderItem={({ item }: any) => (
            <TouchableOpacity activeOpacity={0.7} style={style.platform}>
              {item.icon}
            </TouchableOpacity>
          )}
          contentContainerStyle={style.platContainer}
        ></FlatList>
      </View>
      <View style={style.registerContainer}>
        <Text>Bạn chưa là thành viên?</Text>
        <TouchableOpacity>
          <Text style={style.registerText}>Hãy đăng ký ngay</Text>
        </TouchableOpacity>
      </View>
      <View style={{ paddingTop: 300 }}>
        <TouchableOpacity
          style={style.LoginButton}
          activeOpacity={0.7}
          onPress={handleLogin}
        >
          <Text>Đăng nhập</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
const style = StyleSheet.create({
  container: {
    flex: 1,
  },
  title: {
    paddingTop: theme.spacing.md,
    paddingBottom: theme.spacing.xs,
    paddingLeft: theme.spacing.lg,
    fontWeight: "600",
    color: "#615151ff",
    fontStyle: "italic",
  },
  textInput: {
    backgroundColor: theme.colors.background,
    borderWidth: 1,
    borderRadius: theme.radius.md,
    marginHorizontal: 20,
  },
  forgetButton: {
    paddingTop: 20,
    paddingBottom: 10,
    paddingLeft: 20,
    textAlign: "left",
    fontWeight: "600",
    color: "#0a0a0aff",
    textDecorationLine: "underline",
  },
  platContainer: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
    gap: 20,
    paddingVertical: 10,
  },
  platform: {
    width: 180,
    height: 50,
    backgroundColor: "#fff",
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  registerContainer: {
    flexDirection: "row",

    paddingLeft: 20,
  },
  registerText: {
    paddingLeft: 10,
    textDecorationLine: "underline",
    fontWeight: "600",
    color: "#0a0a0aff",
  },
  LoginButton: {
    backgroundColor: theme.colors.primary,
    borderRadius: 10,
    paddingVertical: 12,
    alignItems: "center",
    justifyContent: "center",
    marginHorizontal: 20,
    marginTop: 20,
  },
});
