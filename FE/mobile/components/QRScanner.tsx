import React, { useState, useEffect } from "react";
import { View, StyleSheet, Alert } from "react-native";
import { BarCodeScanner, BarCodeScannerResult } from "expo-barcode-scanner";
import {
  Text,
  Button,
  ActivityIndicator,
  IconButton,
} from "react-native-paper";
import { Ionicons } from "@expo/vector-icons";

interface QRScannerProps {
  onScanSuccess: (bookingCode: string) => void;
  onCancel?: () => void;
  title?: string;
  subtitle?: string;
}

export default function QRScanner({
  onScanSuccess,
  onCancel,
  title = "Quét mã QR",
  subtitle = "Đưa mã QR của đơn thuê vào khung quét",
}: QRScannerProps) {
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [scanned, setScanned] = useState(false);

  useEffect(() => {
    requestCameraPermission();
  }, []);

  const requestCameraPermission = async () => {
    try {
      const { status } = await BarCodeScanner.requestPermissionsAsync();
      setHasPermission(status === "granted");

      if (status !== "granted") {
        Alert.alert(
          "Cần quyền truy cập camera",
          "Vui lòng cấp quyền truy cập camera để quét mã QR",
          [
            { text: "Hủy", style: "cancel", onPress: onCancel },
            {
              text: "Mở cài đặt",
              onPress: () => BarCodeScanner.requestPermissionsAsync(),
            },
          ]
        );
      }
    } catch (error) {
      console.error("Error requesting camera permission:", error);
      Alert.alert("Lỗi", "Không thể yêu cầu quyền truy cập camera");
    }
  };

  const handleBarcodeScanned = (result: BarCodeScannerResult) => {
    const { type, data } = result;
    if (scanned) return;

    setScanned(true);

    // Validate booking code format (e.g., BK123456)
    const bookingCodeRegex = /^BK\d{6}$/;
    if (!bookingCodeRegex.test(data)) {
      Alert.alert(
        "Mã không hợp lệ",
        "Mã QR không phải là mã đặt xe hợp lệ. Vui lòng thử lại.",
        [{ text: "Quét lại", onPress: () => setScanned(false) }]
      );
      return;
    }

    onScanSuccess(data);
  };

  const resetScanner = () => {
    setScanned(false);
  };

  if (hasPermission === null) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" />
        <Text style={styles.loadingText}>
          Đang yêu cầu quyền truy cập camera...
        </Text>
      </View>
    );
  }

  if (hasPermission === false) {
    return (
      <View style={styles.container}>
        <Ionicons name="camera" size={64} color="#999" />
        <Text style={styles.permissionText}>
          Không có quyền truy cập camera
        </Text>
        <Button
          mode="contained"
          onPress={requestCameraPermission}
          style={styles.button}
        >
          Yêu cầu quyền
        </Button>
        {onCancel && (
          <Button mode="text" onPress={onCancel} style={styles.button}>
            Hủy
          </Button>
        )}
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        {onCancel && (
          <IconButton
            icon="close"
            size={24}
            onPress={onCancel}
            iconColor="#fff"
          />
        )}
        <View style={styles.headerText}>
          <Text variant="headlineSmall" style={styles.title}>
            {title}
          </Text>
          <Text variant="bodyMedium" style={styles.subtitle}>
            {subtitle}
          </Text>
        </View>
        <View style={{ width: 48 }} />
      </View>

      {/* Camera View */}
      <View style={styles.cameraContainer}>
        <BarCodeScanner
          onBarCodeScanned={scanned ? undefined : handleBarcodeScanned}
          barCodeTypes={[BarCodeScanner.Constants.BarCodeType.qr]}
          style={StyleSheet.absoluteFillObject}
        >
          {/* Scanning Frame Overlay */}
          <View style={styles.overlay}>
            <View style={styles.unfocusedContainer}>
              <View style={styles.topOverlay} />
            </View>
            <View style={styles.middleContainer}>
              <View style={styles.leftOverlay} />
              <View style={styles.focusedContainer}>
                {/* Corner indicators */}
                <View style={[styles.corner, styles.topLeft]} />
                <View style={[styles.corner, styles.topRight]} />
                <View style={[styles.corner, styles.bottomLeft]} />
                <View style={[styles.corner, styles.bottomRight]} />

                {scanned && (
                  <View style={styles.scannedIndicator}>
                    <Ionicons
                      name="checkmark-circle"
                      size={48}
                      color="#4CAF50"
                    />
                    <Text style={styles.scannedText}>Đã quét!</Text>
                  </View>
                )}
              </View>
              <View style={styles.rightOverlay} />
            </View>
            <View style={styles.unfocusedContainer}>
              <View style={styles.bottomOverlay} />
            </View>
          </View>
        </BarCodeScanner>
      </View>

      {/* Instructions */}
      <View style={styles.instructions}>
        {!scanned ? (
          <>
            <Ionicons name="qr-code" size={32} color="#fff" />
            <Text style={styles.instructionText}>
              Đặt mã QR vào giữa khung hình
            </Text>
          </>
        ) : (
          <Button
            mode="contained"
            onPress={resetScanner}
            style={styles.rescanButton}
          >
            Quét lại
          </Button>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
    justifyContent: "center",
    alignItems: "center",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 8,
    paddingTop: 40,
    paddingBottom: 16,
    width: "100%",
    backgroundColor: "rgba(0,0,0,0.7)",
  },
  headerText: {
    flex: 1,
    alignItems: "center",
  },
  title: {
    color: "#fff",
    fontWeight: "bold",
  },
  subtitle: {
    color: "#ddd",
    textAlign: "center",
    marginTop: 4,
  },
  cameraContainer: {
    flex: 1,
    width: "100%",
  },
  camera: {
    flex: 1,
  },
  overlay: {
    flex: 1,
  },
  unfocusedContainer: {
    flex: 1,
  },
  middleContainer: {
    flexDirection: "row",
    height: 280,
  },
  topOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  bottomOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  leftOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  rightOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  focusedContainer: {
    width: 280,
    height: 280,
    borderWidth: 2,
    borderColor: "#fff",
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  corner: {
    position: "absolute",
    width: 24,
    height: 24,
    borderColor: "#4CAF50",
  },
  topLeft: {
    top: -2,
    left: -2,
    borderTopWidth: 4,
    borderLeftWidth: 4,
    borderTopLeftRadius: 12,
  },
  topRight: {
    top: -2,
    right: -2,
    borderTopWidth: 4,
    borderRightWidth: 4,
    borderTopRightRadius: 12,
  },
  bottomLeft: {
    bottom: -2,
    left: -2,
    borderBottomWidth: 4,
    borderLeftWidth: 4,
    borderBottomLeftRadius: 12,
  },
  bottomRight: {
    bottom: -2,
    right: -2,
    borderBottomWidth: 4,
    borderRightWidth: 4,
    borderBottomRightRadius: 12,
  },
  scannedIndicator: {
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.9)",
    padding: 16,
    borderRadius: 12,
  },
  scannedText: {
    marginTop: 8,
    fontSize: 16,
    fontWeight: "bold",
    color: "#4CAF50",
  },
  instructions: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 24,
    paddingHorizontal: 16,
    width: "100%",
    backgroundColor: "rgba(0,0,0,0.7)",
  },
  instructionText: {
    color: "#fff",
    fontSize: 14,
    marginTop: 8,
    textAlign: "center",
  },
  rescanButton: {
    minWidth: 150,
  },
  loadingText: {
    marginTop: 16,
    color: "#fff",
  },
  permissionText: {
    marginVertical: 16,
    color: "#fff",
    textAlign: "center",
    fontSize: 16,
  },
  button: {
    marginTop: 8,
  },
});
