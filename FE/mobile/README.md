# EV Rental Mobile App

A React Native mobile application for EV (Electric Vehicle) rental system built with Expo.

## Tech Stack

- **Framework:** Expo (Managed Workflow)
- **Routing:** Expo Router (File-based routing)
- **Styling:** NativeWind (Tailwind CSS)
- **Icons:** Lucide React Native
- **State:** React Context (Auth)
- **Storage:** expo-secure-store

## Project Structure

````
├── app/
│   ├── (auth)/          # Authentication screens
│   │   ├── login.tsx
│   │   └── register.tsx
│   ├── (tabs)/          # Main tab navigation
│   │   ├── index.tsx    # Explore (Map & Stations)
│   │   ├── messages.tsx # Notifications
│   │   ├── trips.tsx    # Trip History
│   │   ├── support.tsx  # Help & Support
│   │   └── profile.tsx  # User Profile / Login
│   └── _layout.tsx      # Root layout
├── components/
│   └── common/          # Reusable UI components
│       ├── Button.tsx
│       └── Input.tsx
├── hooks/
│   └── useAuth.ts       # Authentication hook
├── types/
│   └── index.ts         # TypeScript interfaces
└── utils/
    └── storage.ts       # Platform-safe storage

## Features

### Authentication
- Login & Register screens
- Secure token storage (SecureStore on native, localStorage on web)
- Guest mode support

### Main Tabs
1. **Explore** - Browse nearby charging stations and available vehicles
2. **Messages** - System notifications and chat support
3. **Trips** - View rental history and active trips
4. **Support** - Help center, FAQ, and contact options
5. **Profile** - User profile or login prompt for guests

## Getting Started

### Prerequisites
- Node.js 18+
- Expo CLI
- iOS Simulator (Mac) or Android Emulator

### Installation

```bash
npm install
````

### Development

```bash
# Start Expo development server
npm start

# Run on iOS
npm run ios

# Run on Android
npm run android

# Run on Web
npm run web

# Clear cache and restart
npm run reset
```

## Styling

This project uses NativeWind (Tailwind CSS for React Native):

- Use `className` prop instead of `style`
- Only use React Native components (`View`, `Text`, `Pressable`)
- Never use HTML tags (`div`, `p`, `button`)

Example:

```tsx
<View className="flex-1 bg-white p-4">
  <Text className="text-xl font-bold text-gray-900">Hello</Text>
  <Pressable className="bg-primary p-4 rounded-lg">
    <Text className="text-white">Press me</Text>
  </Pressable>
</View>
```

## API Integration

Currently using mock data. To integrate with backend:

1. Create API service files in `services/`
2. Update authentication methods in `hooks/useAuth.ts`
3. Replace mock data in tab screens with API calls

## Design Reference

UI designs are located in the `design/` folder:

- `loginpage.jpeg` - Login screen design
- `khámpha.jpeg` - Explore screen
- `messagepagewithoutauth.jpeg` - Messages screen
- `tripwithoutauth.jpeg` - Trips screen
- `supportpage.jpeg` - Support screen

## Contributing

Follow the coding standards defined in the project rules:

- Use TypeScript with strict typing
- Define interfaces for all data models
- Use absolute imports with `@/` alias
- Handle loading and error states properly
- Use Toast for user notifications

## License

Private - EV Station-based Rental System
