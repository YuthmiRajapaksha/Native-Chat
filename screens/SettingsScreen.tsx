import React from "react";
import {
  View,
  Text,
  StyleSheet,
  Switch,
} from "react-native";

import { useThemeContext } from "../theme/ThemeContext";

export default function SettingsScreen() {
  const { darkMode, toggleTheme } = useThemeContext();

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: darkMode ? "#121212" : "#fff",
        },
      ]}
    >
      <Text
        style={[
          styles.title,
          { color: darkMode ? "#fff" : "#000" },
        ]}
      >
        Settings
      </Text>

      <View style={styles.row}>
        <Text
          style={{
            color: darkMode ? "#fff" : "#000",
            fontSize: 18,
          }}
        >
          Dark Mode
        </Text>

        <Switch
          value={darkMode}
          onValueChange={toggleTheme}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 70,
    paddingHorizontal: 20,
  },

  title: {
    fontSize: 28,
    fontWeight: "700",
    marginBottom: 30,
  },

  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
});