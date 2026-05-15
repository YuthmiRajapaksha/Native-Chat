

import "react-native-gesture-handler";

import React from "react";

import { GestureHandlerRootView } from "react-native-gesture-handler";

import { NavigationContainer } from "@react-navigation/native";

import BottomTabs from "./navigation/BottomTabs";

import { ThemeProvider } from "./theme/ThemeContext";

export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <ThemeProvider>
        <NavigationContainer>
          <BottomTabs />
        </NavigationContainer>
      </ThemeProvider>
    </GestureHandlerRootView>
  );
}