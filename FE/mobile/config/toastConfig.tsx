import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { CheckCircle, XCircle, AlertCircle, Info } from "lucide-react-native";
import type { ToastConfig } from "react-native-toast-message";

export const toastConfig: ToastConfig = {
  success: ({ text1, text2 }) => (
    <View style={styles.successContainer}>
      <View style={styles.iconContainer}>
        <CheckCircle size={24} color="#ffffff" strokeWidth={2.5} />
      </View>
      <View style={styles.textContainer}>
        {text1 && <Text style={styles.successTitle}>{text1}</Text>}
        {text2 && <Text style={styles.successMessage}>{text2}</Text>}
      </View>
    </View>
  ),

  error: ({ text1, text2 }) => (
    <View style={styles.errorContainer}>
      <View style={styles.iconContainerError}>
        <XCircle size={24} color="#ffffff" strokeWidth={2.5} />
      </View>
      <View style={styles.textContainer}>
        {text1 && <Text style={styles.errorTitle}>{text1}</Text>}
        {text2 && <Text style={styles.errorMessage}>{text2}</Text>}
      </View>
    </View>
  ),

  info: ({ text1, text2 }) => (
    <View style={styles.infoContainer}>
      <View style={styles.iconContainerInfo}>
        <Info size={24} color="#ffffff" strokeWidth={2.5} />
      </View>
      <View style={styles.textContainer}>
        {text1 && <Text style={styles.infoTitle}>{text1}</Text>}
        {text2 && <Text style={styles.infoMessage}>{text2}</Text>}
      </View>
    </View>
  ),

  warning: ({ text1, text2 }) => (
    <View style={styles.warningContainer}>
      <View style={styles.iconContainerWarning}>
        <AlertCircle size={24} color="#ffffff" strokeWidth={2.5} />
      </View>
      <View style={styles.textContainer}>
        {text1 && <Text style={styles.warningTitle}>{text1}</Text>}
        {text2 && <Text style={styles.warningMessage}>{text2}</Text>}
      </View>
    </View>
  ),
};

const styles = StyleSheet.create({
  // Success Toast
  successContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#ffffff",
    paddingVertical: 14,
    paddingHorizontal: 16,
    marginHorizontal: 16,
    borderRadius: 12,
    borderLeftWidth: 4,
    borderLeftColor: "#10b981",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 8,
    minHeight: 70,
    maxWidth: 400,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#10b981",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  textContainer: {
    flex: 1,
    gap: 2,
  },
  successTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: "#065f46",
    letterSpacing: 0.2,
  },
  successMessage: {
    fontSize: 14,
    color: "#6b7280",
    lineHeight: 18,
  },

  // Error Toast
  errorContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#ffffff",
    paddingVertical: 14,
    paddingHorizontal: 16,
    marginHorizontal: 16,
    borderRadius: 12,
    borderLeftWidth: 4,
    borderLeftColor: "#ef4444",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 8,
    minHeight: 70,
    maxWidth: 400,
  },
  iconContainerError: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#ef4444",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  errorTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: "#991b1b",
    letterSpacing: 0.2,
  },
  errorMessage: {
    fontSize: 14,
    color: "#6b7280",
    lineHeight: 18,
  },

  // Info Toast
  infoContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#ffffff",
    paddingVertical: 14,
    paddingHorizontal: 16,
    marginHorizontal: 16,
    borderRadius: 12,
    borderLeftWidth: 4,
    borderLeftColor: "#3b82f6",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 8,
    minHeight: 70,
    maxWidth: 400,
  },
  iconContainerInfo: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#3b82f6",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  infoTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: "#1e40af",
    letterSpacing: 0.2,
  },
  infoMessage: {
    fontSize: 14,
    color: "#6b7280",
    lineHeight: 18,
  },

  // Warning Toast
  warningContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#ffffff",
    paddingVertical: 14,
    paddingHorizontal: 16,
    marginHorizontal: 16,
    borderRadius: 12,
    borderLeftWidth: 4,
    borderLeftColor: "#f59e0b",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 8,
    minHeight: 70,
    maxWidth: 400,
  },
  iconContainerWarning: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#f59e0b",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  warningTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: "#92400e",
    letterSpacing: 0.2,
  },
  warningMessage: {
    fontSize: 14,
    color: "#6b7280",
    lineHeight: 18,
  },
});
