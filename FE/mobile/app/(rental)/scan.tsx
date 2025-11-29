import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  ActivityIndicator,
  Linking,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { CameraView, Camera } from "expo-camera";
import { useRouter } from "expo-router";
import { X, Flashlight, FlashlightOff } from "lucide-react-native";
import Toast from "react-native-toast-message";

export default function ScanScreen() {
  const router = useRouter();
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [scanned, setScanned] = useState(false);
  const [flashOn, setFlashOn] = useState(false);

  useEffect(() => {
    requestCameraPermission();
  }, []);

  const requestCameraPermission = async () => {
    const { status } = await Camera.requestCameraPermissionsAsync();
    setHasPermission(status === "granted");
  };

  const handleBarCodeScanned = ({
    type,
    data,
  }: {
    type: string;
    data: string;
  }) => {
    setScanned(true);

    // Validate QR code format (expect vehicle ID or booking code)
    if (data.startsWith("EV-") || data.match(/^[0-9a-f-]{36}$/i)) {
      Toast.show({
        type: "success",
        text1: "Quét Thành Công",
        text2: `Mã: ${data}`,
      });

      // Navigate to vehicle unlock/confirmation screen
      router.push(`/(rental)/unlock/${data}`);
    } else {
      Toast.show({
        type: "error",
        text1: "Mã QR Không Hợp Lệ",
        text2: "Vui lòng quét mã QR của xe",
      });

      // Allow re-scan after 2 seconds
      setTimeout(() => setScanned(false), 2000);
    }
  };

  if (hasPermission === null) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#10b981" />
          <Text style={styles.loadingText}>Đang yêu cầu quyền camera...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (hasPermission === false) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.permissionContainer}>
          <Text style={styles.permissionTitle}>Cần Quyền Camera</Text>
          <Text style={styles.permissionText}>
            Ứng dụng cần quyền truy cập camera để quét mã QR trên xe.
          </Text>
          <Pressable
            style={styles.settingsButton}
            onPress={() => Linking.openSettings()}
          >
            <Text style={styles.settingsButtonText}>Mở Cài Đặt</Text>
          </Pressable>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <View style={styles.container}>
      <CameraView
        style={styles.camera}
        facing="back"
        onBarcodeScanned={scanned ? undefined : handleBarCodeScanned}
        barcodeScannerSettings={{
          barcodeTypes: ["qr"],
        }}
        enableTorch={flashOn}
      >
        {/* Overlay */}
        <View style={styles.overlay}>
          {/* Top Bar */}
          <View style={styles.topBar}>
            <Pressable style={styles.closeButton} onPress={() => router.back()}>
              <X size={28} color="#ffffff" />
            </Pressable>
            <Pressable
              style={styles.flashButton}
              onPress={() => setFlashOn(!flashOn)}
            >
              {flashOn ? (
                <FlashlightOff size={24} color="#ffffff" />
              ) : (
                <Flashlight size={24} color="#ffffff" />
              )}
            </Pressable>
          </View>

          {/* Scanning Frame */}
          <View style={styles.centerContainer}>
            <View style={styles.scanFrame}>
              {/* Corner borders */}
              <View style={[styles.corner, styles.cornerTopLeft]} />
              <View style={[styles.corner, styles.cornerTopRight]} />
              <View style={[styles.corner, styles.cornerBottomLeft]} />
              <View style={[styles.corner, styles.cornerBottomRight]} />

              {/* Scanning line animation could be added here */}
            </View>
            <Text style={styles.instructionText}>
              Đưa mã QR vào khung để quét
            </Text>
          </View>

          {/* Bottom Instructions */}
          <View style={styles.bottomBar}>
            <Text style={styles.bottomText}>
              Mã QR nằm trên tay lái hoặc yên xe
            </Text>
          </View>
        </View>
      </CameraView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000000",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    marginTop: 12,
    fontSize: 14,
    color: "#6b7280",
  },
  permissionContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },
  permissionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#111827",
    marginBottom: 12,
  },
  permissionText: {
    fontSize: 15,
    color: "#6b7280",
    textAlign: "center",
    lineHeight: 22,
    marginBottom: 24,
  },
  settingsButton: {
    backgroundColor: "#10b981",
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  settingsButtonText: {
    color: "#ffffff",
    fontWeight: "600",
    fontSize: 15,
  },
  camera: {
    flex: 1,
  },
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  topBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 16,
    paddingTop: 50,
  },
  closeButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  flashButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  centerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  scanFrame: {
    width: 250,
    height: 250,
    backgroundColor: "transparent",
    position: "relative",
  },
  corner: {
    position: "absolute",
    width: 40,
    height: 40,
    borderColor: "#10b981",
  },
  cornerTopLeft: {
    top: 0,
    left: 0,
    borderTopWidth: 4,
    borderLeftWidth: 4,
  },
  cornerTopRight: {
    top: 0,
    right: 0,
    borderTopWidth: 4,
    borderRightWidth: 4,
  },
  cornerBottomLeft: {
    bottom: 0,
    left: 0,
    borderBottomWidth: 4,
    borderLeftWidth: 4,
  },
  cornerBottomRight: {
    bottom: 0,
    right: 0,
    borderBottomWidth: 4,
    borderRightWidth: 4,
  },
  instructionText: {
    color: "#ffffff",
    fontSize: 16,
    marginTop: 24,
    textAlign: "center",
    paddingHorizontal: 24,
  },
  bottomBar: {
    padding: 24,
    paddingBottom: 40,
  },
  bottomText: {
    color: "#ffffff",
    fontSize: 14,
    textAlign: "center",
    opacity: 0.8,
  },
});
