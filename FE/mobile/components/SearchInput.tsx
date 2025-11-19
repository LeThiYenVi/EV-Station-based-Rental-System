import React, { useState, useEffect, useRef } from "react";
import { View, StyleSheet } from "react-native";
import { Searchbar, Chip } from "react-native-paper";

interface SearchInputProps {
  value: string;
  onChangeText: (text: string) => void;
  onSearch?: (text: string) => void;
  placeholder?: string;
  debounceTime?: number;
  autoFocus?: boolean;
  disabled?: boolean;
}

export function SearchInput({
  value,
  onChangeText,
  onSearch,
  placeholder = "Tìm kiếm...",
  debounceTime = 500,
  autoFocus = false,
  disabled = false,
}: SearchInputProps) {
  const [localValue, setLocalValue] = useState(value);
  const debounceTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    setLocalValue(value);
  }, [value]);

  const handleChangeText = (text: string) => {
    setLocalValue(text);
    onChangeText(text);

    // Clear previous timeout
    if (debounceTimeout.current) {
      clearTimeout(debounceTimeout.current);
    }

    // Set new timeout for search
    if (onSearch) {
      debounceTimeout.current = setTimeout(() => {
        onSearch(text);
      }, debounceTime);
    }
  };

  const handleClear = () => {
    setLocalValue("");
    onChangeText("");
    if (onSearch) {
      onSearch("");
    }
  };

  useEffect(() => {
    return () => {
      if (debounceTimeout.current) {
        clearTimeout(debounceTimeout.current);
      }
    };
  }, []);

  return (
    <Searchbar
      placeholder={placeholder}
      value={localValue}
      onChangeText={handleChangeText}
      onClearIconPress={handleClear}
      autoFocus={autoFocus}
      editable={!disabled}
      style={[styles.searchbar, disabled && styles.disabled]}
    />
  );
}

interface FilterChip {
  id: string;
  label: string;
}

interface SearchWithFiltersProps {
  searchValue: string;
  onSearchChange: (text: string) => void;
  filters: FilterChip[];
  selectedFilters: string[];
  onFilterToggle: (filterId: string) => void;
  placeholder?: string;
  debounceTime?: number;
}

export function SearchWithFilters({
  searchValue,
  onSearchChange,
  filters,
  selectedFilters,
  onFilterToggle,
  placeholder = "Tìm kiếm...",
  debounceTime = 500,
}: SearchWithFiltersProps) {
  return (
    <View style={styles.container}>
      <SearchInput
        value={searchValue}
        onChangeText={onSearchChange}
        placeholder={placeholder}
        debounceTime={debounceTime}
      />

      {filters.length > 0 && (
        <View style={styles.filtersContainer}>
          {filters.map((filter) => {
            const isSelected = selectedFilters.includes(filter.id);
            return (
              <Chip
                key={filter.id}
                selected={isSelected}
                onPress={() => onFilterToggle(filter.id)}
                mode={isSelected ? "flat" : "outlined"}
                style={styles.chip}
              >
                {filter.label}
              </Chip>
            );
          })}
        </View>
      )}
    </View>
  );
}

interface SearchHistoryProps {
  history: string[];
  onSelectHistory: (query: string) => void;
  onClearHistory: () => void;
  maxItems?: number;
}

export function SearchHistory({
  history,
  onSelectHistory,
  onClearHistory,
  maxItems = 5,
}: SearchHistoryProps) {
  const displayHistory = history.slice(0, maxItems);

  if (displayHistory.length === 0) {
    return null;
  }

  return (
    <View style={styles.historyContainer}>
      <View style={styles.historyHeader}>
        <Chip icon="history" compact>
          Tìm kiếm gần đây
        </Chip>
        <Chip icon="close" compact onPress={onClearHistory}>
          Xóa
        </Chip>
      </View>

      <View style={styles.historyItems}>
        {displayHistory.map((item, index) => (
          <Chip
            key={index}
            icon="magnify"
            onPress={() => onSelectHistory(item)}
            style={styles.historyChip}
          >
            {item}
          </Chip>
        ))}
      </View>
    </View>
  );
}

interface SearchSuggestionsProps {
  suggestions: string[];
  onSelectSuggestion: (suggestion: string) => void;
  loading?: boolean;
}

export function SearchSuggestions({
  suggestions,
  onSelectSuggestion,
  loading = false,
}: SearchSuggestionsProps) {
  if (loading) {
    return (
      <View style={styles.suggestionsContainer}>
        <Chip icon="loading" compact disabled>
          Đang tải gợi ý...
        </Chip>
      </View>
    );
  }

  if (suggestions.length === 0) {
    return null;
  }

  return (
    <View style={styles.suggestionsContainer}>
      {suggestions.map((suggestion, index) => (
        <Chip
          key={index}
          icon="magnify"
          onPress={() => onSelectSuggestion(suggestion)}
          style={styles.suggestionChip}
        >
          {suggestion}
        </Chip>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  searchbar: {
    elevation: 2,
    backgroundColor: "#fff",
  },
  disabled: {
    opacity: 0.6,
  },
  container: {
    marginBottom: 16,
  },
  filtersContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginTop: 12,
  },
  chip: {
    marginBottom: 4,
  },
  historyContainer: {
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 8,
    marginBottom: 16,
  },
  historyHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  historyItems: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  historyChip: {
    marginBottom: 4,
  },
  suggestionsContainer: {
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 8,
    marginBottom: 16,
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  suggestionChip: {
    marginBottom: 4,
  },
});
