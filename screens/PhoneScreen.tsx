
import React, { useState } from "react";

import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Modal,
  FlatList,
  SafeAreaView,
  Alert,
} from "react-native";

import rawCountries from "world-countries";

import * as Contacts from "expo-contacts";

import AsyncStorage from "@react-native-async-storage/async-storage";

import { useThemeContext } from "../theme/ThemeContext";

type Country = {
  name: string;
  code: string;
  callingCode: string;
  flag: string;
};

const COUNTRIES: Country[] = rawCountries
  .filter(
    (c) => c.idd?.root && c.idd?.suffixes?.length >= 1
  )
  .map((c) => ({
    name: c.name.common,
    code: c.cca2,
    callingCode: `${c.idd.root}${c.idd.suffixes![0]}`.replace(
      /\+/g,
      ""
    ),
    flag: c.flag,
  }))
  .sort((a, b) => a.name.localeCompare(b.name));

export default function PhoneScreen() {
  const { darkMode } = useThemeContext();

  const [phone, setPhone] = useState("");

  const [name, setName] = useState("");

  const [showNameInput, setShowNameInput] =
    useState(false);

  const [selected, setSelected] = useState<Country>(
    COUNTRIES.find((c) => c.code === "US")!
  );

  const [modalVisible, setModalVisible] =
    useState(false);

  const [search, setSearch] = useState("");

  const filtered = COUNTRIES.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase())
  );

  const bg = darkMode ? "#121212" : "#F2F2F2";

  const cardBg = darkMode ? "#1E1E1E" : "#fff";

  const textColor = darkMode ? "#fff" : "#000";

  const subtitleColor = darkMode ? "#ddd" : "#555";

  const modalBg = darkMode ? "#1E1E1E" : "#fff";

  const searchBg = darkMode ? "#2C2C2C" : "#F0F0F0";

  const borderColor = darkMode ? "#333" : "#eee";

  const saveContact = async () => {
    if (!showNameInput) {
      if (!phone) {
        Alert.alert(
          "Validation",
          "Please enter phone number"
        );

        return;
      }

      setShowNameInput(true);

      return;
    }

    if (!name) {
      Alert.alert(
        "Validation",
        "Please enter contact name"
      );

      return;
    }

    try {
      

      const { status } =
        await Contacts.requestPermissionsAsync();

      if (status !== "granted") {
        Alert.alert(
          "Permission denied"
        );

        return;
      }


      await Contacts.addContactAsync({
  firstName: name,

  phoneNumbers: [
    {
      number: `+${selected.callingCode}${phone}`,
      label: "mobile",
    },
  ],
} as any);


      const newContact = {
        id: Date.now().toString(),

        name: name,

        phone: `+${selected.callingCode}${phone}`,
      };

      const existingContacts =
        await AsyncStorage.getItem(
          "appContacts"
        );

      const parsedContacts =
        existingContacts
          ? JSON.parse(existingContacts)
          : [];

      parsedContacts.push(newContact);

      await AsyncStorage.setItem(
        "appContacts",
        JSON.stringify(parsedContacts)
      );

      Alert.alert(
        "Success",
        "Contact saved to device and app"
      );

      setPhone("");

      setName("");

      setShowNameInput(false);

    } catch (error) {
      Alert.alert(
        "Error",
        "Failed to save contact"
      );
    }
  };

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: bg,
        },
      ]}
    >
      <Text
        style={[
          styles.title,
          {
            color: textColor,
          },
        ]}
      >
        Phone number
      </Text>

      <View
        style={[
          styles.card,
          {
            backgroundColor: cardBg,
          },
        ]}
      >
        <Text
          style={[
            styles.subtitle,
            {
              color: subtitleColor,
            },
          ]}
        >
          Please confirm your country code
          and enter your phone number
        </Text>

     //country code

        <TouchableOpacity
          style={[
            styles.countryRow,
            {
              borderBottomColor: borderColor,
            },
          ]}
          onPress={() =>
            setModalVisible(true)
          }
        >
          <Text style={styles.flag}>
            {selected.flag}
          </Text>

          <Text
            style={[
              styles.countryName,
              {
                color: textColor,
              },
            ]}
          >
            {selected.name}
          </Text>

          <Text
            style={[
              styles.chevron,
              {
                color: subtitleColor,
              },
            ]}
          >
            ›
          </Text>
        </TouchableOpacity>

      

        <View style={styles.inputRow}>
          <Text
            style={[
              styles.callingCode,
              {
                color: textColor,
              },
            ]}
          >
            +{selected.callingCode}
          </Text>

          <TextInput
            placeholder="Phone number"
            placeholderTextColor="#999"
            style={[
              styles.input,
              {
                color: textColor,
              },
            ]}
            keyboardType="phone-pad"
            value={phone}
            onChangeText={setPhone}
          />
        </View>


        {showNameInput && (
          <TextInput
            placeholder="Enter contact name"
            placeholderTextColor="#999"
            value={name}
            onChangeText={setName}
            style={[
              styles.nameInput,
              {
                color: textColor,
                backgroundColor:
                  searchBg,
              },
            ]}
          />
        )}
      </View>


      <TouchableOpacity
        style={styles.button}
        onPress={saveContact}
      >
        <Text style={styles.buttonText}>
          {showNameInput
            ? "Save Contact"
            : "Continue"}
        </Text>
      </TouchableOpacity>


      <Modal
        visible={modalVisible}
        animationType="slide"
      >
        <SafeAreaView
          style={[
            styles.modal,
            {
              backgroundColor: modalBg,
            },
          ]}
        >
          <View
            style={[
              styles.modalHeader,
              {
                borderBottomColor:
                  borderColor,
              },
            ]}
          >
            <Text
              style={[
                styles.modalTitle,
                {
                  color: textColor,
                },
              ]}
            >
              Select Country
            </Text>

            <TouchableOpacity
              onPress={() => {
                setModalVisible(false);

                setSearch("");
              }}
            >
              <Text style={styles.closeBtn}>
                ✕
              </Text>
            </TouchableOpacity>
          </View>

     

          <View
            style={[
              styles.searchContainer,
              {
                backgroundColor:
                  searchBg,
              },
            ]}
          >
            <Text style={styles.searchIcon}>
              🔍
            </Text>

            <TextInput
              placeholder="Search country..."
              placeholderTextColor="#999"
              style={[
                styles.searchInput,
                {
                  color: textColor,
                },
              ]}
              value={search}
              onChangeText={setSearch}
            />
          </View>

         

          <FlatList
            data={filtered}
            keyExtractor={(item) =>
              item.code
            }
            renderItem={({ item }) => (
              <TouchableOpacity
                style={[
                  styles.countryItem,
                  {
                    borderBottomColor:
                      borderColor,
                  },
                ]}
                onPress={() => {
                  setSelected(item);

                  setModalVisible(false);

                  setSearch("");
                }}
              >
                <Text style={styles.itemFlag}>
                  {item.flag}
                </Text>

                <Text
                  style={[
                    styles.itemName,
                    {
                      color: textColor,
                    },
                  ]}
                >
                  {item.name}
                </Text>

                <Text
                  style={[
                    styles.itemCode,
                    {
                      color:
                        subtitleColor,
                    },
                  ]}
                >
                  +{item.callingCode}
                </Text>
              </TouchableOpacity>
            )}
          />
        </SafeAreaView>
      </Modal>
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

  card: {
    borderRadius: 16,
    padding: 20,
  },

  subtitle: {
    textAlign: "center",
    marginBottom: 20,
    lineHeight: 20,
  },

  countryRow: {
    flexDirection: "row",
    alignItems: "center",
    borderBottomWidth: 1,
    paddingBottom: 15,
    marginBottom: 15,
  },

  flag: {
    fontSize: 28,
    marginRight: 10,
  },

  countryName: {
    fontSize: 16,
    flex: 1,
    fontWeight: "500",
  },

  chevron: {
    fontSize: 22,
  },

  inputRow: {
    flexDirection: "row",
    alignItems: "center",
  },

  callingCode: {
    fontSize: 24,
    fontWeight: "500",
    marginRight: 10,
  },

  input: {
    flex: 1,
    fontSize: 22,
    marginLeft: 5,
  },

  nameInput: {
    marginTop: 20,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 18,
  },

  button: {
    marginTop: 40,
    backgroundColor: "#007AFF",
    padding: 18,
    borderRadius: 14,
    alignItems: "center",
  },

  buttonText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 16,
  },

  modal: {
    flex: 1,
  },

  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
  },

  modalTitle: {
    fontSize: 18,
    fontWeight: "700",
  },

  closeBtn: {
    fontSize: 18,
    color: "#007AFF",
    fontWeight: "600",
  },

  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    margin: 12,
    borderRadius: 10,
    paddingHorizontal: 12,
  },

  searchIcon: {
    fontSize: 16,
    marginRight: 8,
  },

  searchInput: {
    flex: 1,
    fontSize: 16,
    paddingVertical: 10,
  },

  countryItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderBottomWidth:
      StyleSheet.hairlineWidth,
  },

  itemFlag: {
    fontSize: 24,
    marginRight: 14,
  },

  itemName: {
    flex: 1,
    fontSize: 16,
  },

  itemCode: {
    fontSize: 14,
  },
});