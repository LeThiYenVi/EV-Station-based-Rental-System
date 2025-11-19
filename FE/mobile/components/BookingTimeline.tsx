import { View, StyleSheet } from "react-native";
import { Text } from "react-native-paper";
import { Ionicons } from "@expo/vector-icons";
import { BookingStatus } from "@/types";
import { theme } from "@/utils";

interface TimelineStep {
  status: BookingStatus;
  label: string;
  icon: keyof typeof Ionicons.glyphMap;
  timestamp?: string;
}

interface BookingTimelineProps {
  currentStatus: BookingStatus;
  createdAt: string;
  confirmedAt?: string;
  startedAt?: string;
  completedAt?: string;
  cancelledAt?: string;
}

export default function BookingTimeline({
  currentStatus,
  createdAt,
  confirmedAt,
  startedAt,
  completedAt,
  cancelledAt,
}: BookingTimelineProps) {
  const getSteps = (): TimelineStep[] => {
    if (currentStatus === BookingStatus.CANCELLED) {
      return [
        {
          status: BookingStatus.PENDING,
          label: "Đã đặt xe",
          icon: "document-text",
          timestamp: createdAt,
        },
        {
          status: BookingStatus.CANCELLED,
          label: "Đã hủy",
          icon: "close-circle",
          timestamp: cancelledAt,
        },
      ];
    }

    return [
      {
        status: BookingStatus.PENDING,
        label: "Đã đặt xe",
        icon: "document-text",
        timestamp: createdAt,
      },
      {
        status: BookingStatus.CONFIRMED,
        label: "Đã xác nhận",
        icon: "checkmark-circle",
        timestamp: confirmedAt,
      },
      {
        status: BookingStatus.STARTED,
        label: "Đang thuê",
        icon: "car",
        timestamp: startedAt,
      },
      {
        status: BookingStatus.COMPLETED,
        label: "Hoàn thành",
        icon: "flag",
        timestamp: completedAt,
      },
    ];
  };

  const steps = getSteps();

  const getStepIndex = (status: BookingStatus): number => {
    return steps.findIndex((step) => step.status === status);
  };

  const currentIndex = getStepIndex(currentStatus);

  const isStepCompleted = (index: number): boolean => {
    return index <= currentIndex;
  };

  const isStepActive = (index: number): boolean => {
    return index === currentIndex;
  };

  const getStepColor = (index: number): string => {
    if (currentStatus === BookingStatus.CANCELLED && index === 1) {
      return theme.colors.error;
    }
    if (isStepCompleted(index)) {
      return theme.colors.primary;
    }
    return theme.colors.mutedForeground;
  };

  const formatDate = (dateString: string | undefined): string => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <View style={styles.container}>
      {steps.map((step, index) => {
        const isCompleted = isStepCompleted(index);
        const isActive = isStepActive(index);
        const stepColor = getStepColor(index);
        const isLast = index === steps.length - 1;

        return (
          <View key={step.status} style={styles.stepContainer}>
            <View style={styles.stepLeft}>
              {/* Icon Circle */}
              <View
                style={[
                  styles.iconCircle,
                  {
                    backgroundColor: isCompleted ? stepColor : "transparent",
                    borderColor: stepColor,
                    borderWidth: isCompleted ? 0 : 2,
                  },
                ]}
              >
                <Ionicons
                  name={step.icon}
                  size={20}
                  color={isCompleted ? "#fff" : stepColor}
                />
              </View>

              {/* Vertical Line */}
              {!isLast && (
                <View
                  style={[
                    styles.verticalLine,
                    {
                      backgroundColor: isCompleted
                        ? stepColor
                        : theme.colors.border,
                    },
                  ]}
                />
              )}
            </View>

            <View
              style={[
                styles.stepContent,
                !isLast && styles.stepContentWithPadding,
              ]}
            >
              <Text
                style={[
                  styles.stepLabel,
                  {
                    color: isCompleted
                      ? theme.colors.foreground
                      : theme.colors.mutedForeground,
                    fontWeight: isActive ? "700" : "600",
                  },
                ]}
              >
                {step.label}
              </Text>
              {step.timestamp && isCompleted && (
                <Text style={styles.timestamp}>
                  {formatDate(step.timestamp)}
                </Text>
              )}
              {!step.timestamp && isActive && (
                <Text style={[styles.pendingText, { color: stepColor }]}>
                  Đang chờ
                </Text>
              )}
            </View>
          </View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: theme.spacing.sm,
  },
  stepContainer: {
    flexDirection: "row",
  },
  stepLeft: {
    alignItems: "center",
    marginRight: theme.spacing.md,
  },
  iconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  verticalLine: {
    width: 2,
    flex: 1,
    marginTop: theme.spacing.xs,
  },
  stepContent: {
    flex: 1,
    paddingTop: theme.spacing.xs,
  },
  stepContentWithPadding: {
    paddingBottom: theme.spacing.lg,
  },
  stepLabel: {
    fontSize: 16,
    marginBottom: 4,
  },
  timestamp: {
    fontSize: 13,
    color: theme.colors.mutedForeground,
  },
  pendingText: {
    fontSize: 13,
    fontStyle: "italic",
  },
});
