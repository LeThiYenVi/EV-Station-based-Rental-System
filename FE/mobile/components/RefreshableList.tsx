import React, { useState, useCallback } from "react";
import { RefreshControl, ScrollView, FlatList, StyleSheet } from "react-native";
import { ActivityIndicator } from "react-native-paper";

interface RefreshableScrollViewProps {
  children: React.ReactNode;
  onRefresh: () => Promise<void>;
  refreshing?: boolean;
  contentContainerStyle?: any;
}

export function RefreshableScrollView({
  children,
  onRefresh,
  refreshing: externalRefreshing,
  contentContainerStyle,
}: RefreshableScrollViewProps) {
  const [internalRefreshing, setInternalRefreshing] = useState(false);

  const refreshing = externalRefreshing ?? internalRefreshing;

  const handleRefresh = useCallback(async () => {
    if (externalRefreshing === undefined) {
      setInternalRefreshing(true);
    }
    try {
      await onRefresh();
    } finally {
      if (externalRefreshing === undefined) {
        setInternalRefreshing(false);
      }
    }
  }, [onRefresh, externalRefreshing]);

  return (
    <ScrollView
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={handleRefresh}
          colors={["#2196F3"]}
          tintColor="#2196F3"
        />
      }
      contentContainerStyle={contentContainerStyle}
      showsVerticalScrollIndicator={false}
    >
      {children}
    </ScrollView>
  );
}

interface RefreshableFlatListProps<T> {
  data: T[];
  renderItem: ({
    item,
    index,
  }: {
    item: T;
    index: number;
  }) => React.ReactElement | null;
  onRefresh: () => Promise<void>;
  refreshing?: boolean;
  keyExtractor?: (item: T, index: number) => string;
  ListEmptyComponent?: React.ReactElement | null;
  ListHeaderComponent?: React.ReactElement | null;
  ListFooterComponent?: React.ReactElement | null;
  contentContainerStyle?: any;
  onEndReached?: () => void;
  onEndReachedThreshold?: number;
}

export function RefreshableFlatList<T>({
  data,
  renderItem,
  onRefresh,
  refreshing: externalRefreshing,
  keyExtractor,
  ListEmptyComponent,
  ListHeaderComponent,
  ListFooterComponent,
  contentContainerStyle,
  onEndReached,
  onEndReachedThreshold = 0.5,
}: RefreshableFlatListProps<T>) {
  const [internalRefreshing, setInternalRefreshing] = useState(false);

  const refreshing = externalRefreshing ?? internalRefreshing;

  const handleRefresh = useCallback(async () => {
    if (externalRefreshing === undefined) {
      setInternalRefreshing(true);
    }
    try {
      await onRefresh();
    } finally {
      if (externalRefreshing === undefined) {
        setInternalRefreshing(false);
      }
    }
  }, [onRefresh, externalRefreshing]);

  return (
    <FlatList
      data={data}
      renderItem={renderItem}
      keyExtractor={keyExtractor}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={handleRefresh}
          colors={["#2196F3"]}
          tintColor="#2196F3"
        />
      }
      ListEmptyComponent={ListEmptyComponent}
      ListHeaderComponent={ListHeaderComponent}
      ListFooterComponent={ListFooterComponent}
      contentContainerStyle={contentContainerStyle}
      showsVerticalScrollIndicator={false}
      onEndReached={onEndReached}
      onEndReachedThreshold={onEndReachedThreshold}
    />
  );
}

interface InfiniteScrollListProps<T> {
  data: T[];
  renderItem: ({
    item,
    index,
  }: {
    item: T;
    index: number;
  }) => React.ReactElement | null;
  onRefresh: () => Promise<void>;
  onLoadMore: () => Promise<void>;
  hasMore: boolean;
  loading?: boolean;
  refreshing?: boolean;
  keyExtractor?: (item: T, index: number) => string;
  ListEmptyComponent?: React.ReactElement | null;
  ListHeaderComponent?: React.ReactElement | null;
  contentContainerStyle?: any;
}

export function InfiniteScrollList<T>({
  data,
  renderItem,
  onRefresh,
  onLoadMore,
  hasMore,
  loading = false,
  refreshing: externalRefreshing,
  keyExtractor,
  ListEmptyComponent,
  ListHeaderComponent,
  contentContainerStyle,
}: InfiniteScrollListProps<T>) {
  const [internalRefreshing, setInternalRefreshing] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);

  const refreshing = externalRefreshing ?? internalRefreshing;

  const handleRefresh = useCallback(async () => {
    if (externalRefreshing === undefined) {
      setInternalRefreshing(true);
    }
    try {
      await onRefresh();
    } finally {
      if (externalRefreshing === undefined) {
        setInternalRefreshing(false);
      }
    }
  }, [onRefresh, externalRefreshing]);

  const handleLoadMore = useCallback(async () => {
    if (loadingMore || !hasMore || refreshing) return;

    setLoadingMore(true);
    try {
      await onLoadMore();
    } finally {
      setLoadingMore(false);
    }
  }, [onLoadMore, hasMore, loadingMore, refreshing]);

  const renderFooter = () => {
    if (!loadingMore) return null;
    return (
      <ActivityIndicator
        animating
        size="small"
        color="#2196F3"
        style={styles.loadingFooter}
      />
    );
  };

  return (
    <FlatList
      data={data}
      renderItem={renderItem}
      keyExtractor={keyExtractor}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={handleRefresh}
          colors={["#2196F3"]}
          tintColor="#2196F3"
        />
      }
      ListEmptyComponent={ListEmptyComponent}
      ListHeaderComponent={ListHeaderComponent}
      ListFooterComponent={renderFooter}
      contentContainerStyle={contentContainerStyle}
      showsVerticalScrollIndicator={false}
      onEndReached={handleLoadMore}
      onEndReachedThreshold={0.5}
    />
  );
}

const styles = StyleSheet.create({
  loadingFooter: {
    paddingVertical: 20,
  },
});
