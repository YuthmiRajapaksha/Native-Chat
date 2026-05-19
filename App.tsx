
// import "react-native-gesture-handler";

// import React from "react";

// import { GestureHandlerRootView } from "react-native-gesture-handler";

// import { NavigationContainer } from "@react-navigation/native";

// import BottomTabs from "./navigation/BottomTabs";

// import { ThemeProvider } from "./theme/ThemeContext";

// export default function App() {
//   return (
//     <GestureHandlerRootView style={{ flex: 1 }}>
//       <ThemeProvider>
//         <NavigationContainer>
//           <BottomTabs />
//         </NavigationContainer>
//       </ThemeProvider>
//     </GestureHandlerRootView>
//   );
// }





import "react-native-gesture-handler";
import React from "react";

import { GestureHandlerRootView } from "react-native-gesture-handler";
import { NavigationContainer, DarkTheme, DefaultTheme } from "@react-navigation/native";

import BottomTabs from "./navigation/BottomTabs";
import { ThemeProvider, useThemeContext } from "./theme/ThemeContext";

function AppNavigator() {
  const { darkMode } = useThemeContext();

  return (
    <NavigationContainer
      theme={darkMode ? DarkTheme : DefaultTheme}
    >
      <BottomTabs />
    </NavigationContainer>
  );
}

export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <ThemeProvider>
        <AppNavigator />
      </ThemeProvider>
    </GestureHandlerRootView>
  );
}