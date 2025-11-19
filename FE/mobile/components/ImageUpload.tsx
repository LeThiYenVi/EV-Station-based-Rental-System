import { useState } from "react";
import { View, StyleSheet, Image, TouchableOpacity, Alert } from "react-native";
import {
  Button,
  Text,
  ProgressBar,
  ActivityIndicator,
} from "react-native-paper";
import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import * as ImageManipulator from "expo-image-manipulator";
import { theme } from "@/utils";

interface ImageUploadProps {
  onImageSelected?: (uri: string) => void;
  onImageUploaded?: (url: string) => void;
  currentImageUrl?: string;
  aspectRatio?: [number, number];
  maxWidth?: number;
  quality?: number;
  allowCamera?: boolean;
  allowGallery?: boolean;
  placeholder?: string;
}

export default function ImageUpload({
  onImageSelected,
  onImageUploaded,
  currentImageUrl,
  aspectRatio = [4, 3],
  maxWidth = 1000,
  quality = 0.8,
  allowCamera = true,
  allowGallery = true,
  placeholder = "Tap to select image",
}: ImageUploadProps) {
  const [imageUri, setImageUri] = useState<string | null>(
    currentImageUrl || null
  );
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const requestPermissions = async () => {
    if (allowCamera) {
      const cameraStatus = await ImagePicker.requestCameraPermissionsAsync();
      if (cameraStatus.status !== "granted") {
        Alert.alert(
          "Permission Required",
          "Camera permission is required to take photos"
        );
        return false;
      }
    }

    if (allowGallery) {
      const galleryStatus =
        await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (galleryStatus.status !== "granted") {
        Alert.alert(
          "Permission Required",
          "Gallery permission is required to select photos"
        );
        return false;
      }
    }

    return true;
  };

  const compressImage = async (uri: string): Promise<string> => {
    try {
      const result = await ImageManipulator.manipulateAsync(
        uri,
        [{ resize: { width: maxWidth } }],
        {
          compress: quality,
          format: ImageManipulator.SaveFormat.JPEG,
        }
      );
      return result.uri;
    } catch (err) {
      console.error("Error compressing image:", err);
      return uri;
    }
  };

  const pickFromGallery = async () => {
    try {
      const hasPermission = await requestPermissions();
      if (!hasPermission) return;

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: aspectRatio,
        quality,
      });

      if (!result.canceled && result.assets[0]) {
        const compressedUri = await compressImage(result.assets[0].uri);
        setImageUri(compressedUri);
        onImageSelected?.(compressedUri);
      }
    } catch (err) {
      Alert.alert("Error", "Failed to select image from gallery");
    }
  };

  const takePhoto = async () => {
    try {
      const hasPermission = await requestPermissions();
      if (!hasPermission) return;

      const result = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        aspect: aspectRatio,
        quality,
      });

      if (!result.canceled && result.assets[0]) {
        const compressedUri = await compressImage(result.assets[0].uri);
        setImageUri(compressedUri);
        onImageSelected?.(compressedUri);
      }
    } catch (err) {
      Alert.alert("Error", "Failed to take photo");
    }
  };

  const showImageOptions = () => {
    const options = [];

    if (allowGallery) {
      options.push({ text: "Choose from Gallery", onPress: pickFromGallery });
    }

    if (allowCamera) {
      options.push({ text: "Take Photo", onPress: takePhoto });
    }

    if (imageUri) {
      options.push({
        text: "Remove Image",
        onPress: handleRemoveImage,
        style: "destructive" as const,
      });
    }

    options.push({ text: "Cancel", style: "cancel" as const });

    Alert.alert("Select Image", "Choose an option", options);
  };

  const handleRemoveImage = () => {
    Alert.alert("Remove Image", "Are you sure you want to remove this image?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Remove",
        style: "destructive",
        onPress: () => {
          setImageUri(null);
          onImageSelected?.("");
        },
      },
    ]);
  };

  // Simulate upload (replace with actual upload logic)
  const handleUpload = async () => {
    if (!imageUri) return;

    try {
      setIsUploading(true);
      setUploadProgress(0);

      // Simulate upload progress
      for (let i = 0; i <= 100; i += 10) {
        setUploadProgress(i / 100);
        await new Promise((resolve) => setTimeout(resolve, 100));
      }

      // TODO: Replace with actual upload to your backend
      // const uploadedUrl = await uploadToServer(imageUri);

      onImageUploaded?.(imageUri); // For now, use local URI
      Alert.alert("Success", "Image uploaded successfully");
    } catch (err) {
      Alert.alert("Error", "Failed to upload image");
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.imageContainer}
        onPress={showImageOptions}
        activeOpacity={0.7}
        disabled={isUploading}
      >
        {imageUri ? (
          <Image source={{ uri: imageUri }} style={styles.image} />
        ) : (
          <View style={styles.placeholder}>
            <Ionicons
              name="image"
              size={64}
              color={theme.colors.mutedForeground}
            />
            <Text style={styles.placeholderText}>{placeholder}</Text>
          </View>
        )}

        {imageUri && !isUploading && (
          <View style={styles.editOverlay}>
            <Ionicons name="camera" size={24} color="#fff" />
          </View>
        )}
      </TouchableOpacity>

      {isUploading && (
        <View style={styles.uploadingContainer}>
          <ActivityIndicator size="small" />
          <ProgressBar progress={uploadProgress} style={styles.progressBar} />
          <Text style={styles.uploadingText}>
            Uploading... {Math.round(uploadProgress * 100)}%
          </Text>
        </View>
      )}

      {imageUri && !isUploading && (
        <View style={styles.actions}>
          <Button
            mode="outlined"
            onPress={showImageOptions}
            icon="camera"
            style={styles.actionButton}
          >
            Change
          </Button>
          <Button
            mode="text"
            onPress={handleRemoveImage}
            textColor={theme.colors.error}
            style={styles.actionButton}
          >
            Remove
          </Button>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
  },
  imageContainer: {
    width: "100%",
    aspectRatio: 4 / 3,
    borderRadius: theme.radius.md,
    overflow: "hidden",
    backgroundColor: theme.colors.muted,
    borderWidth: 2,
    borderStyle: "dashed",
    borderColor: theme.colors.border,
    position: "relative",
  },
  image: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  placeholder: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: theme.spacing.xl,
  },
  placeholderText: {
    marginTop: theme.spacing.sm,
    fontSize: 14,
    color: theme.colors.mutedForeground,
    textAlign: "center",
  },
  editOverlay: {
    position: "absolute",
    bottom: 8,
    right: 8,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(0,0,0,0.6)",
    justifyContent: "center",
    alignItems: "center",
  },
  uploadingContainer: {
    marginTop: theme.spacing.md,
    alignItems: "center",
  },
  progressBar: {
    width: "100%",
    marginTop: theme.spacing.sm,
  },
  uploadingText: {
    marginTop: theme.spacing.xs,
    fontSize: 12,
    color: theme.colors.mutedForeground,
  },
  actions: {
    flexDirection: "row",
    marginTop: theme.spacing.md,
    gap: theme.spacing.sm,
  },
  actionButton: {
    flex: 1,
  },
});
