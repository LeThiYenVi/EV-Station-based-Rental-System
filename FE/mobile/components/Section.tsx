import React, { ReactNode, useEffect, useRef, useState } from "react";
import { theme } from "@/utils";
import {
  FlatList,
  ListRenderItem,
  StyleProp,
  Text,
  TouchableOpacity,
  View,
  ViewStyle,
  StyleSheet,
} from "react-native";

type Layout = "horizontal" | "vertical" | "grid";

export type SectionProps<T = any> = {
  title: string;
  subtitle?: string | ReactNode;
  data?: T[];
  renderItem?: ListRenderItem<T>;
  keyExtractor?: (item: T, index: number) => string;
  layout?: Layout;
  numColumns?: number;
  contentPadding?: number;
  loading?: boolean;
  skeletonCount?: number;
  error?: string | null;
  onRetry?: () => void;
  emptyText?: string | ReactNode;
  onPressSeeAll?: () => void;
  headerRight?: ReactNode;
  style?: StyleProp<ViewStyle>;
  contentContainerStyle?: StyleProp<ViewStyle>;
  ListHeaderComponent?: ReactNode;
  ListFooterComponent?: ReactNode;
  // Horizontal auto-scroll options
  autoScroll?: boolean;
  autoScrollInterval?: number; // default 5000ms
  itemWidth?: number; // for precise snapping/scrollToOffset
  children?: ReactNode;
  testID?: string;
};

export function Section<T = any>({
  title,
  subtitle,
  data = [],
  renderItem,
  keyExtractor,
  layout = "horizontal",
  numColumns = 2,
  contentPadding = theme.spacing.md,
  loading = false,
  skeletonCount = 4,
  error = null,
  onRetry,
  emptyText = "Không có dữ liệu",
  onPressSeeAll,
  headerRight,
  style,
  contentContainerStyle,
  ListHeaderComponent,
  ListFooterComponent,
  children,
  testID,
  autoScroll,
  autoScrollInterval,
  itemWidth,
}: SectionProps<T>) {
  const isGird = layout === "grid";
  const isHorizontal = layout === "horizontal";
  const Separator =
    layout === "horizontal"
      ? () => <View style={{ width: theme.spacing.sm }} />
      : () => <View style={{ height: theme.spacing.sm }} />;
  const effectiveKeyExtractor = keyExtractor ?? ((_, index) => String(index));

  // Auto-scroll for horizontal lists
  const listRef = useRef<FlatList<T>>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const intervalMs = autoScrollInterval ?? 5000;

  useEffect(() => {
    if (!isHorizontal || !autoScroll || !data || data.length <= 1) return;
    const id = setInterval(() => {
      setCurrentIndex((prev) => {
        const next = (prev + 1) % data.length;
        const SPACING = theme.spacing.sm;
        if (itemWidth && listRef.current) {
          const offset = next * (itemWidth + SPACING);
          listRef.current.scrollToOffset({ offset, animated: true });
        } else if (listRef.current) {
          try {
            listRef.current.scrollToIndex({
              index: next,
              animated: true,
              viewPosition: 0,
            });
          } catch {}
        }
        return next;
      });
    }, Math.max(1500, intervalMs));
    return () => clearInterval(id);
  }, [autoScroll, intervalMs, isHorizontal, data?.length, itemWidth]);

  const renderSkeleton = () => {
    if (children) return null;

    const items = Array.from({ length: skeletonCount });
    const boxStyle = [
      styles.skeletonBox,
      isHorizontal
        ? { width: 160, height: 100 }
        : isGird
        ? { height: 120 }
        : { height: 72 },
    ];
    if (isHorizontal) {
      return (
        <FlatList
          horizontal
          data={items}
          keyExtractor={(_, i) => `sk-${i}`}
          ItemSeparatorComponent={Separator}
          contentContainerStyle={[
            { paddingHorizontal: contentPadding, paddingBottom: 8 },
            contentContainerStyle,
          ]}
          renderItem={() => <View style={boxStyle} />}
          showsHorizontalScrollIndicator={false}
        />
      );
    }
    // vertical / grid
    return (
      <View
        style={[
          { paddingHorizontal: contentPadding, paddingBottom: 8 },
          contentContainerStyle,
        ]}
      >
        <View
          style={{
            flexDirection: isGird ? "row" : "column",
            flexWrap: isGird ? "wrap" : "nowrap",
            gap: 12,
          }}
        >
          {items.map((_, i) => (
            <View
              key={`sk-${i}`}
              style={[
                boxStyle,
                isGird && {
                  flexBasis: `${100 / numColumns - 2}%`,
                  flexGrow: 1,
                },
              ]}
            />
          ))}
        </View>
      </View>
    );
  };

  const renderEmpty = () => {
    if (children) return null;
    return (
      <View style={[styles.emptyWrap, { paddingHorizontal: contentPadding }]}>
        {typeof emptyText === "string" ? (
          <Text style={styles.emptyText}>{emptyText}</Text>
        ) : (
          emptyText
        )}
      </View>
    );
  };

  const renderError = () => {
    return (
      <View style={[styles.errorWrap, { paddingHorizontal: contentPadding }]}>
        <Text style={styles.errorText}>{error}</Text>
        {onRetry && (
          <TouchableOpacity style={styles.retryBtn} onPress={onRetry}>
            <Text style={styles.retryText}>Thử lại</Text>
          </TouchableOpacity>
        )}
      </View>
    );
  };

  const renderHeader = () => (
    <View style={[styles.header, { paddingHorizontal: contentPadding }]}>
      <View style={{ flex: 1 }}>
        <Text style={styles.title}>{title}</Text>
        {subtitle ? (
          typeof subtitle === "string" ? (
            <Text style={styles.subtitle}>{subtitle}</Text>
          ) : (
            subtitle
          )
        ) : null}
      </View>

      {headerRight ? (
        <View>{headerRight}</View>
      ) : onPressSeeAll ? (
        <TouchableOpacity
          onPress={onPressSeeAll}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        >
          <Text style={styles.seeAll}>Xem tất cả</Text>
        </TouchableOpacity>
      ) : null}
    </View>
  );

  const list = children ? (
    <View
      style={[{ paddingHorizontal: contentPadding }, contentContainerStyle]}
    >
      {children}
    </View>
  ) : (
    <FlatList
      ref={listRef}
      key={numColumns}
      data={data}
      keyExtractor={effectiveKeyExtractor}
      renderItem={renderItem}
      horizontal={isHorizontal}
      numColumns={isGird ? numColumns : 1}
      ItemSeparatorComponent={Separator}
      ListHeaderComponent={ListHeaderComponent as any}
      ListFooterComponent={ListFooterComponent as any}
      ListEmptyComponent={!loading && !error ? renderEmpty : null}
      contentContainerStyle={[
        { paddingHorizontal: contentPadding, paddingBottom: 8 },
        contentContainerStyle,
      ]}
      showsHorizontalScrollIndicator={false}
      showsVerticalScrollIndicator={false}
      removeClippedSubviews
      windowSize={5}
      maxToRenderPerBatch={6}
      updateCellsBatchingPeriod={50}
      initialNumToRender={isHorizontal ? 3 : 6}
      snapToInterval={
        isHorizontal && itemWidth ? itemWidth + theme.spacing.sm : undefined
      }
      decelerationRate={isHorizontal && itemWidth ? "fast" : undefined}
      disableIntervalMomentum={isHorizontal && !!itemWidth}
      getItemLayout={
        isHorizontal && itemWidth
          ? (_data, index) => ({
              length: itemWidth + theme.spacing.sm,
              offset: (itemWidth + theme.spacing.sm) * index,
              index,
            })
          : undefined
      }
      onScrollToIndexFailed={(info) => {
        if (itemWidth && listRef.current) {
          const offset = info.index * (itemWidth + theme.spacing.sm);
          listRef.current.scrollToOffset({ offset, animated: true });
        }
      }}
    />
  );

  return (
    <View style={[styles.section, style]} testID={testID}>
      {renderHeader()}

      {loading ? renderSkeleton() : error ? renderError() : list}
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
    paddingTop: theme.spacing.sm,
    paddingBottom: theme.spacing.xs,
  },
  header: {
    marginBottom: theme.spacing.sm,
    flexDirection: "row",
    alignItems: "flex-end",
    gap: theme.spacing.sm,
  },
  title: {
    fontSize: theme.typography.h4.fontSize,
    lineHeight: theme.typography.h4.lineHeight,
    fontWeight: "700",
    color: theme.colors.foreground,
  },
  subtitle: {
    marginTop: theme.spacing.xs,
    color: theme.colors.mutedForeground,
    fontSize: theme.typography.caption.fontSize,
    lineHeight: theme.typography.caption.lineHeight,
  },
  seeAll: {
    color: theme.colors.info,
    fontWeight: "600",
  },
  skeletonBox: {
    backgroundColor: theme.colors.muted,
    borderRadius: theme.radius.xl,
  },
  emptyWrap: {
    paddingVertical: theme.spacing.lg,
    alignItems: "center",
  },
  emptyText: {
    color: theme.colors.mutedForeground,
  },
  errorWrap: {
    paddingVertical: theme.spacing.md,
    alignItems: "center",
    gap: theme.spacing.sm,
  },
  errorText: {
    color: theme.colors.error,
  },
  retryBtn: {
    backgroundColor: theme.colors.primary,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    borderRadius: theme.radius.lg,
  },
  retryText: {
    color: theme.colors.background,
    fontWeight: "600",
  },
});
