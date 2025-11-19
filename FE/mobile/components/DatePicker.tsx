import React, { useState } from "react";
import { View, StyleSheet, Platform, TouchableOpacity } from "react-native";
import { Text, TextInput } from "react-native-paper";
import DateTimePicker from "@react-native-community/datetimepicker";
import { Ionicons } from "@expo/vector-icons";

interface DatePickerProps {
  label: string;
  value: Date;
  onChange: (date: Date) => void;
  mode?: "date" | "time" | "datetime";
  minimumDate?: Date;
  maximumDate?: Date;
  error?: string;
  disabled?: boolean;
}

export function DatePicker({
  label,
  value,
  onChange,
  mode = "date",
  minimumDate,
  maximumDate,
  error,
  disabled = false,
}: DatePickerProps) {
  const [show, setShow] = useState(false);

  const formatDate = (date: Date) => {
    if (mode === "time") {
      return date.toLocaleTimeString("vi-VN", {
        hour: "2-digit",
        minute: "2-digit",
      });
    } else if (mode === "datetime") {
      return date.toLocaleString("vi-VN", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } else {
      return date.toLocaleDateString("vi-VN", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      });
    }
  };

  const handleChange = (event: any, selectedDate?: Date) => {
    if (Platform.OS === "android") {
      setShow(false);
    }
    if (selectedDate) {
      onChange(selectedDate);
    }
  };

  const getIcon = () => {
    if (mode === "time") return "time-outline";
    if (mode === "datetime") return "calendar-outline";
    return "calendar-outline";
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        onPress={() => !disabled && setShow(true)}
        disabled={disabled}
      >
        <TextInput
          label={label}
          value={formatDate(value)}
          editable={false}
          mode="outlined"
          error={!!error}
          right={
            <TextInput.Icon
              icon={getIcon}
              onPress={() => !disabled && setShow(true)}
            />
          }
          style={[styles.input, disabled && styles.disabled]}
        />
      </TouchableOpacity>
      {error && (
        <Text variant="bodySmall" style={styles.errorText}>
          {error}
        </Text>
      )}

      {show && (
        <DateTimePicker
          value={value}
          mode={mode}
          display={Platform.OS === "ios" ? "spinner" : "default"}
          onChange={handleChange}
          minimumDate={minimumDate}
          maximumDate={maximumDate}
          locale="vi-VN"
        />
      )}

      {Platform.OS === "ios" && show && (
        <View style={styles.iosButtons}>
          <TouchableOpacity
            onPress={() => setShow(false)}
            style={styles.iosButton}
          >
            <Text style={styles.iosButtonText}>Xong</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

interface DateRangePickerProps {
  startLabel?: string;
  endLabel?: string;
  startDate: Date;
  endDate: Date;
  onStartDateChange: (date: Date) => void;
  onEndDateChange: (date: Date) => void;
  minimumDate?: Date;
  maximumDate?: Date;
  disabled?: boolean;
}

export function DateRangePicker({
  startLabel = "Ngày bắt đầu",
  endLabel = "Ngày kết thúc",
  startDate,
  endDate,
  onStartDateChange,
  onEndDateChange,
  minimumDate,
  maximumDate,
  disabled = false,
}: DateRangePickerProps) {
  const [startError, setStartError] = useState("");
  const [endError, setEndError] = useState("");

  const handleStartDateChange = (date: Date) => {
    if (date > endDate) {
      setStartError("Ngày bắt đầu phải trước ngày kết thúc");
    } else {
      setStartError("");
      onStartDateChange(date);
    }
  };

  const handleEndDateChange = (date: Date) => {
    if (date < startDate) {
      setEndError("Ngày kết thúc phải sau ngày bắt đầu");
    } else {
      setEndError("");
      onEndDateChange(date);
    }
  };

  return (
    <View style={styles.rangeContainer}>
      <View style={styles.rangeItem}>
        <DatePicker
          label={startLabel}
          value={startDate}
          onChange={handleStartDateChange}
          minimumDate={minimumDate}
          maximumDate={endDate}
          error={startError}
          disabled={disabled}
        />
      </View>

      <View style={styles.rangeSeparator}>
        <Ionicons name="arrow-forward" size={20} color="#757575" />
      </View>

      <View style={styles.rangeItem}>
        <DatePicker
          label={endLabel}
          value={endDate}
          onChange={handleEndDateChange}
          minimumDate={startDate}
          maximumDate={maximumDate}
          error={endError}
          disabled={disabled}
        />
      </View>
    </View>
  );
}

interface TimeSlotPickerProps {
  label: string;
  value: string;
  onChange: (time: string) => void;
  slots?: string[];
  error?: string;
  disabled?: boolean;
}

export function TimeSlotPicker({
  label,
  value,
  onChange,
  slots = [
    "08:00",
    "09:00",
    "10:00",
    "11:00",
    "12:00",
    "13:00",
    "14:00",
    "15:00",
    "16:00",
    "17:00",
    "18:00",
  ],
  error,
  disabled = false,
}: TimeSlotPickerProps) {
  return (
    <View style={styles.container}>
      <Text variant="labelLarge" style={styles.label}>
        {label}
      </Text>

      <View style={styles.slotsGrid}>
        {slots.map((slot) => (
          <TouchableOpacity
            key={slot}
            style={[
              styles.slot,
              value === slot && styles.slotSelected,
              disabled && styles.slotDisabled,
            ]}
            onPress={() => !disabled && onChange(slot)}
            disabled={disabled}
          >
            <Text
              style={[
                styles.slotText,
                value === slot && styles.slotTextSelected,
                disabled && styles.slotTextDisabled,
              ]}
            >
              {slot}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {error && (
        <Text variant="bodySmall" style={styles.errorText}>
          {error}
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 8,
  },
  input: {
    backgroundColor: "#fff",
  },
  disabled: {
    opacity: 0.6,
  },
  errorText: {
    color: "#B00020",
    marginTop: 4,
    marginLeft: 12,
  },
  iosButtons: {
    flexDirection: "row",
    justifyContent: "flex-end",
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  iosButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  iosButtonText: {
    color: "#2196F3",
    fontSize: 16,
    fontWeight: "600",
  },
  rangeContainer: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 8,
  },
  rangeItem: {
    flex: 1,
  },
  rangeSeparator: {
    marginTop: 24,
    paddingTop: 8,
  },
  label: {
    marginBottom: 12,
    color: "#424242",
  },
  slotsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  slot: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#E0E0E0",
    backgroundColor: "#fff",
    minWidth: 80,
    alignItems: "center",
  },
  slotSelected: {
    backgroundColor: "#2196F3",
    borderColor: "#2196F3",
  },
  slotDisabled: {
    backgroundColor: "#F5F5F5",
    borderColor: "#E0E0E0",
  },
  slotText: {
    fontSize: 14,
    fontWeight: "500",
    color: "#424242",
  },
  slotTextSelected: {
    color: "#fff",
  },
  slotTextDisabled: {
    color: "#BDBDBD",
  },
});
