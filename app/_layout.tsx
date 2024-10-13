// app/index.tsx

import { Tabs } from "expo-router";
import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect, useState } from "react";
import "react-native-reanimated";
import { TabBarIcon } from "@/components/navigation/TabBarIcon";
import { Colors } from "@/constants/Colors";
import { useColorScheme } from "@/hooks/useColorScheme";

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [isAppReady, setIsAppReady] = useState(false); // State to track when the app is ready

  const [loaded] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
  });

  useEffect(() => {
    async function prepareApp() {
      try {
        // Simulate some async tasks (e.g., loading resources, API calls)
        await new Promise((resolve) => setTimeout(resolve, 1000)); // Example delay

        if (loaded) {
          setIsAppReady(true); // Mark the app as ready once the fonts are loaded
        }
      } catch (e) {
        console.warn(e);
      } finally {
        SplashScreen.hideAsync(); // Hide splash screen after everything is ready
      }
    }

    prepareApp();
  }, [loaded]);

  // If the app is not ready, we can show a loading spinner or splash screen here
  if (!isAppReady) {
    return null; // You can also return a loading screen component here
  }

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? "light"].tint,
        headerShown: false,
      }}
    >
      <Tabs.Screen
        name="budget/index"
        options={{
          title: "Budget",
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon
              name={focused ? "bar-chart" : "bar-chart-outline"}
              color={color}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon
              name={focused ? "home" : "home-outline"}
              color={color}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="+not-found"
        options={{
          title: "Oops!",
          tabBarButton: () => null,
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon
              name={focused ? "home" : "home-outline"}
              color={color}
            />
          ),
        }}
      />
    </Tabs>
  );
}
