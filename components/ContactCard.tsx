import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { useThemeContext } from "../theme/ThemeContext";

export default function ContactCard({ item }: any) {
  const { darkMode } = useThemeContext();

  return (
    <View
      style={[
        styles.card,
        {
          backgroundColor: darkMode ? "#1E1E1E" : "#fff",
        },
      ]}
    >
      <View style={styles.avatar}>
        <Text style={styles.avatarText}>
          {item.name.charAt(0)}
        </Text>
      </View>

      <View>
        <Text
          style={[
            styles.name,
            { color: darkMode ? "#fff" : "#000" },
          ]}
        >
          {item.name}
        </Text>

        <Text style={styles.phone}>{item.phone}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderRadius: 14,
    marginBottom: 12,
  },

  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "#007AFF",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 14,
  },

  avatarText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 20,
  },

  name: {
    fontSize: 16,
    fontWeight: "600",
  },

  phone: {
    color: "#777",
    marginTop: 4,
  },
});