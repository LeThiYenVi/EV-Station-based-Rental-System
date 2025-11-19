import React, { useState } from "react";
import { View, StyleSheet, Image, Alert, Platform } from "react-native";
import { Button, IconButton, Portal, Modal, Text } from "react-native-paper";
import * as ImagePicker from "expo-image-picker";
import * as ImageManipulator from "expo-image-manipulator";
import { Ionicons } from "@expo/vector-icons";

interface ImagePickerButtonProps {
  onImageSelected: (uri: string) => void;
  currentImage?: string;
  aspectRatio?: [number, number];
  quality?: number;
  maxWidth?: number;
  maxHeight?: number;
  allowsEditing?: boolean;
  buttonLabel?: string;
  buttonIcon?: keyof typeof Ionicons.glyphMap;
}

export function ImagePickerButton({
  onImageSelected,
  currentImage,
  aspectRatio = [4, 3],
  quality = 0.8,
  maxWidth = 1920,
  maxHeight = 1080,
  allowsEditing = true,
  buttonLabel = "Chọn ảnh",
  buttonIcon = "image",
}: ImagePickerButtonProps) {
  const [visible, setVisible] = useState(false);
  const [uploading, setUploading] = useState(false);

  const requestPermissions = async (type: "camera" | "library") => {
    try {
      if (type === "camera") {
        const { status } = await ImagePicker.requestCameraPermissionsAsync();
        if (status !== "granted") {
          Alert.alert(
            "Quyền truy cập",
            "Ứng dụng cần quyền truy cập camera để chụp ảnh.",
            [{ text: "OK" }]
          );
          return false;
        }
      } else {
        const { status } =
          await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== "granted") {
          Alert.alert(
            "Quyền truy cập",
            "Ứng dụng cần quyền truy cập thư viện ảnh để chọn ảnh.",
            [{ text: "OK" }]
          );
          return false;
        }
      }
      return true;
    } catch (error) {
      console.error("Permission error:", error);
      return false;
    }
  };

  const compressImage = async (uri: string) => {
    try {
      const manipResult = await ImageManipulator.manipulateAsync(
        uri,
        [{ resize: { width: maxWidth, height: maxHeight } }],
        { compress: quality, format: ImageManipulator.SaveFormat.JPEG }
      );
      return manipResult.uri;
    } catch (error) {
      console.error("Image compression error:", error);
      return uri;
    }
  };

  const handleTakePhoto = async () => {
    setVisible(false);
    const hasPermission = await requestPermissions("camera");
    if (!hasPermission) return;

    try {
      setUploading(true);
      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing,
        aspect: aspectRatio,
        quality,
      });

      if (!result.canceled && result.assets[0]) {
        const compressedUri = await compressImage(result.assets[0].uri);
        onImageSelected(compressedUri);
      }
    } catch (error) {
      console.error("Camera error:", error);
      Alert.alert("Lỗi", "Không thể chụp ảnh. Vui lòng thử lại.");
    } finally {
      setUploading(false);
    }
  };

  const handlePickImage = async () => {
    setVisible(false);
    const hasPermission = await requestPermissions("library");
    if (!hasPermission) return;

    try {
      setUploading(true);
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing,
        aspect: aspectRatio,
        quality,
        allowsMultipleSelection: false,
      });

      if (!result.canceled && result.assets[0]) {
        const compressedUri = await compressImage(result.assets[0].uri);
        onImageSelected(compressedUri);
      }
    } catch (error) {
      console.error("Image picker error:", error);
      Alert.alert("Lỗi", "Không thể chọn ảnh. Vui lòng thử lại.");
    } finally {
      setUploading(false);
    }
  };

  const handleRemoveImage = () => {
    Alert.alert("Xác nhận", "Bạn có chắc muốn xóa ảnh này?", [
      { text: "Hủy", style: "cancel" },
      {
        text: "Xóa",
        style: "destructive",
        onPress: () => onImageSelected(""),
      },
    ]);
  };

  return (
    <View style={styles.container}>
      {currentImage ? (
        <View style={styles.imageContainer}>
          <Image source={{ uri: currentImage }} style={styles.image} />
          <View style={styles.imageActions}>
            <IconButton
              icon="camera"
              size={20}
              iconColor="#fff"
              containerColor="rgba(0,0,0,0.6)"
              onPress={() => setVisible(true)}
            />
            <IconButton
              icon="trash-can-outline"
              size={20}
              iconColor="#fff"
              containerColor="rgba(244,67,54,0.8)"
              onPress={handleRemoveImage}
            />
          </View>
        </View>
      ) : (
        <Button
          mode="outlined"
          icon={buttonIcon}
          onPress={() => setVisible(true)}
          loading={uploading}
          disabled={uploading}
          style={styles.button}
        >
          {buttonLabel}
        </Button>
      )}

      <Portal>
        <Modal
          visible={visible}
          onDismiss={() => setVisible(false)}
          contentContainerStyle={styles.modal}
        >
          <Text variant="titleLarge" style={styles.modalTitle}>
            Chọn ảnh
          </Text>

          <Button
            mode="contained"
            icon="camera"
            onPress={handleTakePhoto}
            style={styles.modalButton}
          >
            Chụp ảnh
          </Button>

          <Button
            mode="outlined"
            icon="image"
            onPress={handlePickImage}
            style={styles.modalButton}
          >
            Chọn từ thư viện
          </Button>

          <Button
            mode="text"
            onPress={() => setVisible(false)}
            style={styles.modalButton}
          >
            Hủy
          </Button>
        </Modal>
      </Portal>
    </View>
  );
}

interface MultiImagePickerProps {
  onImagesSelected: (uris: string[]) => void;
  currentImages?: string[];
  maxImages?: number;
  quality?: number;
  maxWidth?: number;
  maxHeight?: number;
}

export function MultiImagePicker({
  onImagesSelected,
  currentImages = [],
  maxImages = 5,
  quality = 0.8,
  maxWidth = 1920,
  maxHeight = 1080,
}: MultiImagePickerProps) {
  const [uploading, setUploading] = useState(false);

  const requestPermissions = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      Alert.alert(
        "Quyền truy cập",
        "Ứng dụng cần quyền truy cập thư viện ảnh để chọn ảnh.",
        [{ text: "OK" }]
      );
      return false;
    }
    return true;
  };

  const compressImage = async (uri: string) => {
    try {
      const manipResult = await ImageManipulator.manipulateAsync(
        uri,
        [{ resize: { width: maxWidth, height: maxHeight } }],
        { compress: quality, format: ImageManipulator.SaveFormat.JPEG }
      );
      return manipResult.uri;
    } catch (error) {
      console.error("Image compression error:", error);
      return uri;
    }
  };

  const handlePickImages = async () => {
    if (currentImages.length >= maxImages) {
      Alert.alert(
        "Giới hạn",
        `Bạn chỉ có thể tải lên tối đa ${maxImages} ảnh.`
      );
      return;
    }

    const hasPermission = await requestPermissions();
    if (!hasPermission) return;

    try {
      setUploading(true);
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: false,
        quality,
        allowsMultipleSelection: true,
        selectionLimit: maxImages - currentImages.length,
      });

      if (!result.canceled && result.assets.length > 0) {
        const compressedUris = await Promise.all(
          result.assets.map((asset) => compressImage(asset.uri))
        );
        onImagesSelected(
          [...currentImages, ...compressedUris].slice(0, maxImages)
        );
      }
    } catch (error) {
      console.error("Image picker error:", error);
      Alert.alert("Lỗi", "Không thể chọn ảnh. Vui lòng thử lại.");
    } finally {
      setUploading(false);
    }
  };

  const handleRemoveImage = (index: number) => {
    const newImages = [...currentImages];
    newImages.splice(index, 1);
    onImagesSelected(newImages);
  };

  return (
    <View style={styles.multiContainer}>
      <View style={styles.imagesGrid}>
        {currentImages.map((uri, index) => (
          <View key={index} style={styles.gridItem}>
            <Image source={{ uri }} style={styles.gridImage} />
            <IconButton
              icon="close-circle"
              size={24}
              iconColor="#F44336"
              containerColor="#fff"
              style={styles.removeButton}
              onPress={() => handleRemoveImage(index)}
            />
          </View>
        ))}

        {currentImages.length < maxImages && (
          <Button
            mode="outlined"
            icon="plus"
            onPress={handlePickImages}
            loading={uploading}
            disabled={uploading}
            style={styles.addButton}
            contentStyle={styles.addButtonContent}
          >
            Thêm ảnh
          </Button>
        )}
      </View>

      <Text variant="bodySmall" style={styles.hint}>
        {currentImages.length}/{maxImages} ảnh
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 8,
  },
  imageContainer: {
    position: "relative",
    borderRadius: 8,
    overflow: "hidden",
  },
  image: {
    width: "100%",
    height: 200,
    borderRadius: 8,
  },
  imageActions: {
    position: "absolute",
    top: 8,
    right: 8,
    flexDirection: "row",
    gap: 8,
  },
  button: {
    borderStyle: "dashed",
    borderWidth: 2,
    paddingVertical: 8,
  },
  modal: {
    backgroundColor: "#fff",
    padding: 24,
    margin: 20,
    borderRadius: 12,
  },
  modalTitle: {
    fontWeight: "bold",
    marginBottom: 24,
    textAlign: "center",
  },
  modalButton: {
    marginBottom: 12,
  },
  multiContainer: {
    marginVertical: 8,
  },
  imagesGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },
  gridItem: {
    position: "relative",
    width: 100,
    height: 100,
  },
  gridImage: {
    width: "100%",
    height: "100%",
    borderRadius: 8,
  },
  removeButton: {
    position: "absolute",
    top: -12,
    right: -12,
  },
  addButton: {
    width: 100,
    height: 100,
    borderStyle: "dashed",
    borderWidth: 2,
    justifyContent: "center",
    alignItems: "center",
  },
  addButtonContent: {
    height: "100%",
    flexDirection: "column",
  },
  hint: {
    marginTop: 8,
    color: "#757575",
  },
});
