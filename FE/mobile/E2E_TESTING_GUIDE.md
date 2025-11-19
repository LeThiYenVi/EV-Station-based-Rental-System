# E2E Testing Guide

## Overview

This document outlines the E2E testing strategy for the EV Station mobile application.

## Recommended Tool: Detox

Detox is the recommended E2E testing framework for React Native applications.

### Installation

```bash
npm install --save-dev detox detox-cli
```

### Configuration

Create `.detoxrc.js`:

```javascript
module.exports = {
  testRunner: {
    args: {
      $0: "jest",
      config: "e2e/jest.config.js",
    },
    jest: {
      setupTimeout: 120000,
    },
  },
  apps: {
    "ios.debug": {
      type: "ios.app",
      binaryPath: "ios/build/Build/Products/Debug-iphonesimulator/YourApp.app",
      build:
        "xcodebuild -workspace ios/YourApp.xcworkspace -scheme YourApp -configuration Debug -sdk iphonesimulator -derivedDataPath ios/build",
    },
    "android.debug": {
      type: "android.apk",
      binaryPath: "android/app/build/outputs/apk/debug/app-debug.apk",
      build:
        "cd android && ./gradlew assembleDebug assembleAndroidTest -DtestBuildType=debug",
      reversePorts: [8081],
    },
  },
  devices: {
    simulator: {
      type: "ios.simulator",
      device: {
        type: "iPhone 14",
      },
    },
    emulator: {
      type: "android.emulator",
      device: {
        avdName: "Pixel_5_API_31",
      },
    },
  },
  configurations: {
    "ios.sim.debug": {
      device: "simulator",
      app: "ios.debug",
    },
    "android.emu.debug": {
      device: "emulator",
      app: "android.debug",
    },
  },
};
```

## Test Cases

### 1. Authentication Flow

```javascript
// e2e/auth.e2e.js
describe("Authentication", () => {
  beforeAll(async () => {
    await device.launchApp();
  });

  beforeEach(async () => {
    await device.reloadReactNative();
  });

  it("should show login screen on first launch", async () => {
    await expect(element(by.id("login-email"))).toBeVisible();
    await expect(element(by.id("login-password"))).toBeVisible();
  });

  it("should login with valid credentials", async () => {
    await element(by.id("login-email")).typeText("test@example.com");
    await element(by.id("login-password")).typeText("password123");
    await element(by.id("login-button")).tap();

    await expect(element(by.id("dashboard-screen"))).toBeVisible();
  });

  it("should show error with invalid credentials", async () => {
    await element(by.id("login-email")).typeText("wrong@example.com");
    await element(by.id("login-password")).typeText("wrongpass");
    await element(by.id("login-button")).tap();

    await expect(element(by.text("Invalid credentials"))).toBeVisible();
  });
});
```

### 2. Booking Flow

```javascript
// e2e/booking.e2e.js
describe("Booking", () => {
  beforeAll(async () => {
    await device.launchApp();
    // Login first
    await element(by.id("login-email")).typeText("test@example.com");
    await element(by.id("login-password")).typeText("password123");
    await element(by.id("login-button")).tap();
  });

  it("should complete full booking flow", async () => {
    // 1. Select station
    await element(by.id("station-list")).scrollTo("bottom");
    await element(by.id("station-item-1")).tap();

    // 2. View station details
    await expect(element(by.id("station-detail"))).toBeVisible();
    await element(by.id("book-button")).tap();

    // 3. Select time
    await expect(element(by.id("select-time-screen"))).toBeVisible();
    await element(by.id("start-date-picker")).tap();
    // Select date...
    await element(by.id("continue-button")).tap();

    // 4. Select vehicle
    await expect(element(by.id("select-vehicle-screen"))).toBeVisible();
    await element(by.id("vehicle-item-1")).tap();
    await element(by.id("continue-button")).tap();

    // 5. Review and confirm
    await expect(element(by.id("review-screen"))).toBeVisible();
    await element(by.id("terms-checkbox")).tap();
    await element(by.id("confirm-button")).tap();

    // 6. Payment
    await expect(element(by.id("payment-screen"))).toBeVisible();
    await element(by.id("payment-method-momo")).tap();
    await element(by.id("pay-button")).tap();

    // 7. Success
    await expect(element(by.id("payment-success"))).toBeVisible();
  });
});
```

### 3. Offline Support

```javascript
// e2e/offline.e2e.js
describe("Offline Support", () => {
  beforeAll(async () => {
    await device.launchApp();
  });

  it("should queue actions when offline", async () => {
    // Disable network
    await device.disableSynchronization();
    await device.setURLBlacklist([".*"]);

    // Perform action that would normally require network
    await element(by.id("booking-cancel-button")).tap();

    // Check offline indicator
    await expect(element(by.id("offline-indicator"))).toBeVisible();

    // Re-enable network
    await device.setURLBlacklist([]);
    await device.enableSynchronization();

    // Wait for sync
    await waitFor(element(by.id("offline-indicator")))
      .not.toBeVisible()
      .withTimeout(5000);
  });
});
```

## Running E2E Tests

### iOS

```bash
# Build the app
detox build --configuration ios.sim.debug

# Run tests
detox test --configuration ios.sim.debug
```

### Android

```bash
# Build the app
detox build --configuration android.emu.debug

# Run tests
detox test --configuration android.emu.debug
```

## CI Integration

Add to `.github/workflows/e2e.yml`:

```yaml
name: E2E Tests

on: [push, pull_request]

jobs:
  ios-e2e:
    runs-on: macos-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: 18
      - run: npm ci
      - run: brew tap wix/brew
      - run: brew install applesimutils
      - run: detox build --configuration ios.sim.debug
      - run: detox test --configuration ios.sim.debug --cleanup

  android-e2e:
    runs-on: macos-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: 18
      - uses: actions/setup-java@v3
        with:
          distribution: "temurin"
          java-version: "11"
      - run: npm ci
      - run: detox build --configuration android.emu.debug
      - run: detox test --configuration android.emu.debug --headless --cleanup
```

## Best Practices

1. **Use testID prop** - Always add `testID` to important UI elements for reliable selection
2. **Wait for elements** - Use `waitFor` to handle async operations
3. **Keep tests independent** - Each test should be able to run standalone
4. **Clean up state** - Reset app state between tests
5. **Test happy path first** - Focus on main user journeys
6. **Mock external dependencies** - Use mocks for payment gateways, etc.
7. **Run on CI** - Automate E2E tests in your CI/CD pipeline

## Troubleshooting

### Common Issues

1. **Element not visible**: Use `waitFor` with appropriate timeout
2. **Synchronization issues**: Try `device.disableSynchronization()` for specific scenarios
3. **Flaky tests**: Add explicit waits and assertions
4. **Build failures**: Ensure Metro bundler is stopped before building

## Alternative: Manual Testing Checklist

If E2E automation is not immediately feasible, use this manual testing checklist:

### Authentication

- [ ] Login with valid credentials
- [ ] Login with invalid credentials
- [ ] Register new account
- [ ] Reset password
- [ ] Verify email/phone

### Booking Flow

- [ ] Search and filter stations
- [ ] View station details
- [ ] Select booking dates
- [ ] Choose vehicle
- [ ] Review booking details
- [ ] Complete payment
- [ ] View booking confirmation

### Trip Management

- [ ] View active bookings
- [ ] View booking history
- [ ] Cancel booking
- [ ] View booking QR code

### Offline Mode

- [ ] View cached data offline
- [ ] Queue actions when offline
- [ ] Sync when back online
- [ ] Show offline indicator

### Staff Features

- [ ] Scan booking QR code
- [ ] Start rental
- [ ] Complete rental
- [ ] Offline queue for actions

## Conclusion

E2E testing ensures the application works correctly from the user's perspective. While implementation requires additional setup, it provides confidence in the entire user journey and catches integration issues that unit tests might miss.
