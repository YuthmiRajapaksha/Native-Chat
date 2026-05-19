
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
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from "react-native";

import rawCountries from "world-countries";

import * as Contacts from "expo-contacts";

import AsyncStorage from "@react-native-async-storage/async-storage";

import { useThemeContext } from "../theme/ThemeContext";

import {
  lightColors,
  darkColors,
} from "../src/colors";

type Country = {
  name: string;
  code: string;
  callingCode: string;
  flag: string;
};

const COUNTRIES: Country[] =
  rawCountries
    .filter(
      (c) =>
        c.idd?.root &&
        c.idd?.suffixes?.length >= 1
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
    .sort((a, b) =>
      a.name.localeCompare(b.name)
    );

export default function PhoneScreen() {
  const { darkMode } =
    useThemeContext();

  const colors = darkMode
    ? darkColors
    : lightColors;

  const [phone, setPhone] =
    useState("");

  const [name, setName] =
    useState("");

  const [showNameInput,
    setShowNameInput,
  ] = useState(false);

  const [selected, setSelected] =
    useState<Country>(
      COUNTRIES.find(
        (c) => c.code === "US"
      )!
    );

  const [modalVisible,
    setModalVisible,
  ] = useState(false);

  const [search, setSearch] =
    useState("");

  // FILTER COUNTRIES
  const filtered =
    COUNTRIES.filter((c) => {
      const value =
        search.toLowerCase();

      return (
        c.name
          .toLowerCase()
          .includes(value) ||

        c.code
          .toLowerCase()
          .includes(value) ||

        c.callingCode.includes(
          value
        ) ||

        c.flag.includes(value)
      );
    });

  // SAVE CONTACT
  const saveContact = async () => {
    const cleanedPhone =
      phone.replace(/\s/g, "");

    if (!showNameInput) {
      if (!cleanedPhone) {
        Alert.alert(
          "Validation",
          "Please enter phone number"
        );
        return;
      }

      if (
        !/^[0-9]+$/.test(
          cleanedPhone
        )
      ) {
        Alert.alert(
          "Validation",
          "Only numbers are allowed"
        );
        return;
      }

      if (
        cleanedPhone.length !== 10
      ) {
        Alert.alert(
          "Validation",
          "Phone number must be exactly 10 digits"
        );
        return;
      }

      setShowNameInput(true);

      return;
    }

    if (!name.trim()) {
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
            number: `+${selected.callingCode}${cleanedPhone}`,

            label: "mobile",
          },
        ],
      } as any);

      const newContact = {
        id: Date.now().toString(),

        name,

        phone: `+${selected.callingCode}${cleanedPhone}`,

        country: selected.name,

        flag: selected.flag,

        time:
          new Date().toLocaleTimeString(
            [],
            {
              hour: "2-digit",
              minute: "2-digit",
            }
          ),
      };

      const existing =
        await AsyncStorage.getItem(
          "appContacts"
        );

      const parsed = existing
        ? JSON.parse(existing)
        : [];

      parsed.push(newContact);

      await AsyncStorage.setItem(
        "appContacts",
        JSON.stringify(parsed)
      );

      Alert.alert(
        "Success",
        "Contact saved successfully"
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
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={
        Platform.OS === "ios"
          ? "padding"
          : "height"
      }
    >
      <ScrollView
        contentContainerStyle={{
          flexGrow: 1,
        }}
        keyboardShouldPersistTaps="handled"
      >
        <View
          style={[
            styles.container,
            {
              backgroundColor:
                colors.background,
            },
          ]}
        >
          <Text
            style={[
              styles.title,
              {
                color: colors.text,
              },
            ]}
          >
            Phone Number 🔥
          </Text>

          <View
            style={[
              styles.card,
              {
                backgroundColor:
                  colors.card,
              },
            ]}
          >
            <Text
              style={[
                styles.subtitle,
                {
                  color:
                    colors.subtitle,
                },
              ]}
            >
              Please confirm your
              country code and enter
              your phone number
            </Text>

            {/* COUNTRY */}
            <TouchableOpacity
              style={[
                styles.countryRow,
                {
                  borderBottomColor:
                    colors.border,
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
                    color:
                      colors.text,
                  },
                ]}
              >
                {selected.name}
              </Text>

              <Text
                style={[
                  styles.chevron,
                  {
                    color:
                      colors.subtitle,
                  },
                ]}
              >
                ›
              </Text>
            </TouchableOpacity>

            {/* PHONE */}
            <View
              style={styles.inputRow}
            >
              <Text
                style={[
                  styles.callingCode,
                  {
                    color:
                      colors.text,
                  },
                ]}
              >
                +
                {
                  selected.callingCode
                }
              </Text>

              <TextInput
                placeholder="Phone number"
                placeholderTextColor="#999"
                keyboardType="number-pad"
                value={phone}
                onChangeText={(
                  text
                ) => {
                  let cleaned =
                    text
                      .replace(
                        /[^0-9]/g,
                        ""
                      )
                      .slice(
                        0,
                        10
                      );

                  setPhone(cleaned);
                }}
                style={[
                  styles.input,
                  {
                    color:
                      colors.text,
                  },
                ]}
              />
            </View>

            {/* NAME */}
            {showNameInput && (
              <TextInput
                placeholder="Enter contact name"
                placeholderTextColor="#999"
                value={name}
                onChangeText={
                  setName
                }
                style={[
                  styles.nameInput,
                  {
                    color:
                      colors.text,

                    backgroundColor:
                      colors.search,
                  },
                ]}
              />
            )}
          </View>

          {/* BUTTON */}
          <TouchableOpacity
            style={styles.button}
            onPress={saveContact}
          >
            <Text
              style={
                styles.buttonText
              }
            >
              {showNameInput
                ? "Save Contact"
                : "Continue"}
            </Text>
          </TouchableOpacity>

          {/* MODAL */}
          <Modal
            visible={modalVisible}
            animationType="slide"
          >
            <SafeAreaView
              style={[
                styles.modal,
                {
                  backgroundColor:
                    colors.background,
                },
              ]}
            >
              {/* HEADER */}
              <View
                style={[
                  styles.modalHeader,
                  {
                    borderBottomColor:
                      colors.border,
                  },
                ]}
              >
                <Text
                  style={[
                    styles.modalTitle,
                    {
                      color:
                        colors.text,
                    },
                  ]}
                >
                  Select Country
                </Text>

                <TouchableOpacity
                  onPress={() =>
                    setModalVisible(
                      false
                    )
                  }
                >
                  <Text
                    style={
                      styles.closeBtn
                    }
                  >
                    Close
                  </Text>
                </TouchableOpacity>
              </View>

              {/* SEARCH */}
              <View
                style={[
                  styles.searchContainer,
                  {
                    backgroundColor:
                      colors.search,
                  },
                ]}
              >
                <Text
                  style={
                    styles.searchIcon
                  }
                >
                  🔍
                </Text>

                <TextInput
                  placeholder="Search country"
                  placeholderTextColor="#999"
                  value={search}
                  onChangeText={
                    setSearch
                  }
                  style={[
                    styles.searchInput,
                    {
                      color:
                        colors.text,
                    },
                  ]}
                />
              </View>

              {/* COUNTRY LIST */}
              <FlatList
                data={filtered}
                keyExtractor={(
                  item
                ) => item.code}
                keyboardShouldPersistTaps="handled"
                renderItem={({
                  item,
                }) => (
                  <TouchableOpacity
                    style={[
                      styles.countryItem,
                      {
                        borderBottomColor:
                          colors.border,
                      },
                    ]}
                    onPress={() => {
                      setSelected(
                        item
                      );

                      setModalVisible(
                        false
                      );

                      setSearch(
                        ""
                      );
                    }}
                  >
                    <Text
                      style={
                        styles.itemFlag
                      }
                    >
                      {item.flag}
                    </Text>

                    <Text
                      style={[
                        styles.itemName,
                        {
                          color:
                            colors.text,
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
                            colors.subtitle,
                        },
                      ]}
                    >
                      +
                      {
                        item.callingCode
                      }
                    </Text>
                  </TouchableOpacity>
                )}
              />
            </SafeAreaView>
          </Modal>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
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
    justifyContent:
      "space-between",
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