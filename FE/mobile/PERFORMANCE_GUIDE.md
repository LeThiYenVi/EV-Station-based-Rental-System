# Performance Optimization Guide

## Bundle Analysis

### Analyze Bundle Size

```bash
# Using expo
npx expo export --dump-sourcemap

# Analyze the bundle
npm install --save-dev source-map-explorer
npx source-map-explorer dist/**/*.map
```

### Common Optimizations

1. **Use Hermes Engine** (already enabled in Expo)

   - Faster app startup
   - Reduced memory usage
   - Smaller bundle size

2. **Code Splitting**

   - Lazy load screens with React.lazy
   - Dynamic imports for large components

3. **Remove unused dependencies**
   ```bash
   npx depcheck
   ```

## Image Optimization

### Use Expo Image

Already using `expo-image` which provides:

- Automatic caching
- Lazy loading
- Optimized rendering
- WebP support

### Optimize Image Assets

```bash
# Install image optimization tools
npm install --save-dev imagemin imagemin-mozjpeg imagemin-pngquant

# Compress images
npx imagemin assets/images/* --out-dir=assets/images-optimized
```

## Performance Monitoring

### Add Performance Tracking

```typescript
// utils/performance.ts
import { Performance } from "react-native";

export const trackScreenLoad = (screenName: string) => {
  const start = Performance.now();

  return () => {
    const end = Performance.now();
    const duration = end - start;
    console.log(`${screenName} loaded in ${duration}ms`);
    // Send to analytics
  };
};

// Usage in screens
const Screen = () => {
  useEffect(() => {
    const endTracking = trackScreenLoad("DashboardScreen");
    return endTracking;
  }, []);

  return <View>...</View>;
};
```

### Memory Profiling

Use React DevTools Profiler:

```bash
npx react-devtools
```

## Network Optimization

### Request Batching

```typescript
// api/batchRequests.ts
export const batchRequests = async <T>(
  requests: Array<() => Promise<T>>,
  batchSize = 3
): Promise<T[]> => {
  const results: T[] = [];

  for (let i = 0; i < requests.length; i += batchSize) {
    const batch = requests.slice(i, i + batchSize);
    const batchResults = await Promise.all(batch.map((req) => req()));
    results.push(...batchResults);
  }

  return results;
};
```

### Request Deduplication

```typescript
// utils/requestCache.ts
const pendingRequests = new Map<string, Promise<any>>();

export const dedupedRequest = async <T>(
  key: string,
  requestFn: () => Promise<T>
): Promise<T> => {
  if (pendingRequests.has(key)) {
    return pendingRequests.get(key);
  }

  const promise = requestFn().finally(() => {
    pendingRequests.delete(key);
  });

  pendingRequests.set(key, promise);
  return promise;
};
```

## List Optimization

### Use FlashList

```bash
npm install @shopify/flash-list
```

```typescript
import { FlashList } from "@shopify/flash-list";

// Replace FlatList with FlashList for better performance
<FlashList
  data={items}
  renderItem={({ item }) => <ItemComponent item={item} />}
  estimatedItemSize={100}
/>;
```

### Memoization

```typescript
import { memo, useMemo, useCallback } from "react";

// Memoize expensive components
const ExpensiveComponent = memo(({ data }) => {
  const processed = useMemo(() => processData(data), [data]);

  const handlePress = useCallback(() => {
    // Handle press
  }, []);

  return <View>...</View>;
});
```

## Map Performance

### Clustering for Many Markers

```bash
npm install react-native-map-clustering
```

```typescript
import MapView from "react-native-map-clustering";

<MapView
  clustering
  clusterColor="#4A90E2"
  clusterTextColor="#FFFFFF"
  radius={50}
>
  {stations.map((station) => (
    <Marker key={station.id} coordinate={station.location} />
  ))}
</MapView>;
```

## Animation Performance

### Use Reanimated

Already using `react-native-reanimated` which runs animations on the UI thread.

```typescript
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
} from "react-native-reanimated";

const Component = () => {
  const opacity = useSharedValue(0);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: withTiming(opacity.value, { duration: 300 }),
  }));

  return <Animated.View style={animatedStyle}>...</Animated.View>;
};
```

## Build Optimization

### Production Build

```bash
# Android
eas build --platform android --profile production

# iOS
eas build --platform ios --profile production
```

### EAS Build Configuration

```json
// eas.json
{
  "build": {
    "production": {
      "android": {
        "buildType": "apk",
        "gradleCommand": ":app:assembleRelease"
      },
      "ios": {
        "buildConfiguration": "Release"
      },
      "env": {
        "NODE_ENV": "production"
      }
    }
  }
}
```

## Runtime Performance

### Avoid Anonymous Functions in Render

```typescript
// ❌ Bad - creates new function on every render
<Button onPress={() => handlePress(item.id)} />;

// ✅ Good - use useCallback
const handleItemPress = useCallback((id) => {
  handlePress(id);
}, []);

<Button onPress={() => handleItemPress(item.id)} />;
```

### Use Keys Properly

```typescript
// ❌ Bad - using index as key
{
  items.map((item, index) => <Item key={index} {...item} />);
}

// ✅ Good - using stable ID
{
  items.map((item) => <Item key={item.id} {...item} />);
}
```

## Linting & Type Checking

### Run Checks

```bash
# Type check
npm run typecheck

# Lint
npm run lint

# Fix lint issues
npm run lint -- --fix
```

### Pre-commit Hook

```bash
npm install --save-dev husky lint-staged
npx husky install
```

```json
// package.json
{
  "lint-staged": {
    "**/*.{ts,tsx}": ["eslint --fix", "prettier --write"]
  }
}
```

## Monitoring in Production

### Add Sentry

```bash
npm install @sentry/react-native
```

```typescript
// app/_layout.tsx
import * as Sentry from "@sentry/react-native";

Sentry.init({
  dsn: "YOUR_DSN_HERE",
  tracesSampleRate: 1.0,
});
```

### Performance Metrics

Track key metrics:

- App startup time
- Screen load times
- API response times
- Cache hit rates
- Offline queue size

## Checklist

- [ ] Run bundle analyzer
- [ ] Optimize images
- [ ] Add performance tracking
- [ ] Use FlashList for long lists
- [ ] Implement map clustering
- [ ] Run typecheck
- [ ] Run lint and fix issues
- [ ] Set up production builds
- [ ] Add error tracking (Sentry)
- [ ] Monitor key metrics

## Results

Expected improvements:

- **Bundle size**: Reduced by ~30-40% with optimization
- **Startup time**: <2s on modern devices
- **List scrolling**: 60fps with FlashList
- **Map rendering**: Smooth with 100+ markers using clustering
- **Memory usage**: <200MB for typical usage

## Conclusion

Performance optimization is an ongoing process. Use the tools and techniques above to identify bottlenecks and improve the user experience. Monitor metrics in production and iterate based on real user data.
