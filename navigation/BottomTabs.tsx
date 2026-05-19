// import React from "react";
// import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
// import { Ionicons } from "@expo/vector-icons";

// import PhoneScreen from "../screens/PhoneScreen";
// import ContactsScreen from "../screens/ContactsScreen";
// import SettingsScreen from "../screens/SettingsScreen";

// const Tab = createBottomTabNavigator();

// export default function BottomTabs() {
//   return (
//     <Tab.Navigator
//       screenOptions={({ route }) => ({
//         headerShown: false,
//         tabBarIcon: ({ color, size }) => {
//           let iconName: any;

//           if (route.name === "Phone") {
//             iconName = "call";
//           } else if (route.name === "Contacts") {
//             iconName = "people";
//           } else {
//             iconName = "settings";
//           }

//           return <Ionicons name={iconName} size={size} color={color} />;
//         },
//       })}
//     >
//       <Tab.Screen name="Phone" component={PhoneScreen} />
//       <Tab.Screen name="Contacts" component={ContactsScreen} />
//       <Tab.Screen name="Settings" component={SettingsScreen} />
//     </Tab.Navigator>
//   );
// }



import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";

import PhoneScreen from "../screens/PhoneScreen";
import ContactsScreen from "../screens/ContactsScreen";
import SettingsScreen from "../screens/SettingsScreen";

import { useThemeContext } from "../theme/ThemeContext";
import { lightColors, darkColors } from "../src/colors";

const Tab = createBottomTabNavigator();

export default function BottomTabs() {
  const { darkMode } = useThemeContext();

  const theme = darkMode ? darkColors : lightColors;

  return (
    <Tab.Navigator
      key={darkMode ? "dark" : "light"}
      screenOptions={({ route }) => ({
        headerShown: false,

        tabBarStyle: {
          backgroundColor: theme.card,
          borderTopColor: theme.border,
        },

        tabBarActiveTintColor: theme.primary,
        tabBarInactiveTintColor: theme.subtitle,

        tabBarIcon: ({ color, size }) => {
          let iconName: any;

          if (route.name === "Phone") iconName = "call";
          else if (route.name === "Contacts") iconName = "people";
          else iconName = "settings";

          return (
            <Ionicons
              name={iconName}
              size={size}
              color={color}
            />
          );
        },
      })}
    >
      <Tab.Screen name="Phone" component={PhoneScreen} />
      <Tab.Screen name="Contacts" component={ContactsScreen} />
      <Tab.Screen name="Settings" component={SettingsScreen} />
    </Tab.Navigator>
  );
}