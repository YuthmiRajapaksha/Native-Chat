
import React, {
  useEffect,
  useState,
} from "react";

import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Alert,
  Modal,
  FlatList,
} from "react-native";

import * as Contacts from "expo-contacts";

import AsyncStorage from "@react-native-async-storage/async-storage";

import { Ionicons } from "@expo/vector-icons";

import { SwipeListView } from "react-native-swipe-list-view";

import { useThemeContext } from "../theme/ThemeContext";

export default function ContactsScreen() {
  const { darkMode } =
    useThemeContext();

  const [contacts, setContacts] =
    useState<any[]>([]);

  const [search, setSearch] =
    useState("");

  const [editingContact, setEditingContact] =
    useState<any>(null);

  const [editName, setEditName] =
    useState("");

  const [editPhone, setEditPhone] =
    useState("");

  const [editModal, setEditModal] =
    useState(false);

  useEffect(() => {
    loadContacts();
  }, []);

  const loadContacts = async () => {
    try {
      const { status } =
        await Contacts.requestPermissionsAsync();

      let deviceContacts: any[] = [];

      if (status === "granted") {
        const { data } =
          await Contacts.getContactsAsync({
            fields: [
              Contacts.Fields.PhoneNumbers,
            ],
          });

        deviceContacts = data.map(
          (item) => ({
            id: item.id,
            name: item.name,
            phone:
              item.phoneNumbers?.[0]
                ?.number || "No number",
          })
        );
      }

      const savedContacts =
        await AsyncStorage.getItem(
          "appContacts"
        );

      const appContacts =
        savedContacts
          ? JSON.parse(savedContacts)
          : [];

  

      const merged = [
        ...appContacts,
        ...deviceContacts,
      ];

      const uniqueContacts =
        merged.filter(
          (
            contact,
            index,
            self
          ) =>
            index ===
            self.findIndex(
              (c) =>
                c.phone ===
                contact.phone
            )
        );

      setContacts(uniqueContacts);

    } catch (error) {
      Alert.alert(
        "Error loading contacts"
      );
    }
  };

  const deleteContact = async (
    id: string
  ) => {
    try {
      const updated =
        contacts.filter(
          (item) => item.id !== id
        );

      setContacts(updated);

      await AsyncStorage.setItem(
        "appContacts",
        JSON.stringify(updated)
      );

      Alert.alert(
        "Deleted",
        "Contact removed"
      );

    } catch (error) {
      Alert.alert(
        "Error deleting contact"
      );
    }
  };

  const openEdit = (item: any) => {
    setEditingContact(item);

    setEditName(item.name);

    setEditPhone(item.phone);

    setEditModal(true);
  };

  const updateContact = async () => {
    try {
      const updatedContacts =
        contacts.map((item) =>
          item.id ===
          editingContact.id
            ? {
                ...item,
                name: editName,
                phone: editPhone,
              }
            : item
        );

      setContacts(updatedContacts);

      await AsyncStorage.setItem(
        "appContacts",
        JSON.stringify(updatedContacts)
      );

      setEditModal(false);

      Alert.alert(
        "Updated",
        "Contact updated"
      );

    } catch (error) {
      Alert.alert(
        "Error updating contact"
      );
    }
  };

  const filteredContacts =
    contacts.filter((contact) =>
      contact.name
        ?.toLowerCase()
        .includes(search.toLowerCase())
    );

  const renderItem = ({
    item,
  }: any) => (
    <TouchableOpacity
      style={[
        styles.card,
        {
          backgroundColor: darkMode
            ? "#1E1E1E"
            : "#fff",
        },
      ]}
    >
      <View style={styles.avatar}>
        <Text style={styles.avatarText}>
          {item.name?.charAt(0)}
        </Text>
      </View>

      <View style={{ flex: 1 }}>
        <Text
          style={[
            styles.name,
            {
              color: darkMode
                ? "#fff"
                : "#000",
            },
          ]}
        >
          {item.name}
        </Text>

        <Text style={styles.phone}>
          {item.phone}
        </Text>
      </View>

      <Ionicons
        name="call"
        size={22}
        color="#25D366"
      />
    </TouchableOpacity>
  );

  const renderHiddenItem = ({
    item,
  }: any) => (
    <View style={styles.rowBack}>
      <TouchableOpacity
        style={styles.editBtn}
        onPress={() => openEdit(item)}
      >
        <Text style={styles.actionText}>
          Edit
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.deleteBtn}
        onPress={() =>
          deleteContact(item.id)
        }
      >
        <Text style={styles.actionText}>
          Delete
        </Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: darkMode
            ? "#121212"
            : "#F2F2F2",
        },
      ]}
    >
      <Text
        style={[
          styles.title,
          {
            color: darkMode
              ? "#fff"
              : "#000",
          },
        ]}
      >
        Contacts
      </Text>

      {/* SEARCH */}

      <View
        style={[
          styles.searchContainer,
          {
            backgroundColor: darkMode
              ? "#1E1E1E"
              : "#fff",
          },
        ]}
      >
        <Ionicons
          name="search"
          size={20}
          color="gray"
        />

        <TextInput
          placeholder="Search contacts"
          placeholderTextColor="gray"
          value={search}
          onChangeText={setSearch}
          style={[
            styles.searchInput,
            {
              color: darkMode
                ? "#fff"
                : "#000",
            },
          ]}
        />
      </View>


      <SwipeListView
        data={filteredContacts}
        keyExtractor={(item) =>
          item.id
        }
        renderItem={renderItem}
        renderHiddenItem={
          renderHiddenItem
        }
        rightOpenValue={-160}
        disableRightSwipe
        showsVerticalScrollIndicator={
          false
        }
      />


      <Modal
        visible={editModal}
        transparent
        animationType="slide"
      >
        <View
          style={styles.modalOverlay}
        >
          <View
            style={[
              styles.modalContent,
              {
                backgroundColor:
                  darkMode
                    ? "#1E1E1E"
                    : "#fff",
              },
            ]}
          >
            <Text
              style={[
                styles.modalTitle,
                {
                  color: darkMode
                    ? "#fff"
                    : "#000",
                },
              ]}
            >
              Edit Contact
            </Text>

            <TextInput
              value={editName}
              onChangeText={
                setEditName
              }
              placeholder="Name"
              placeholderTextColor="gray"
              style={[
                styles.modalInput,
                {
                  color: darkMode
                    ? "#fff"
                    : "#000",
                },
              ]}
            />

            <TextInput
              value={editPhone}
              onChangeText={
                setEditPhone
              }
              placeholder="Phone"
              placeholderTextColor="gray"
              style={[
                styles.modalInput,
                {
                  color: darkMode
                    ? "#fff"
                    : "#000",
                },
              ]}
            />

            <TouchableOpacity
              style={styles.saveBtn}
              onPress={updateContact}
            >
              <Text
                style={
                  styles.actionText
                }
              >
                Save
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.cancelBtn}
              onPress={() =>
                setEditModal(false)
              }
            >
              <Text
                style={
                  styles.actionText
                }
              >
                Cancel
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 60,
    paddingHorizontal: 16,
  },

  title: {
    fontSize: 32,
    fontWeight: "700",
    marginBottom: 20,
  },

  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 14,
    paddingHorizontal: 14,
    marginBottom: 20,
    height: 52,
  },

  searchInput: {
    marginLeft: 10,
    flex: 1,
    fontSize: 16,
  },

  card: {
    flexDirection: "row",
    alignItems: "center",
    padding: 14,
    borderRadius: 16,
    marginBottom: 12,
  },

  avatar: {
    width: 55,
    height: 55,
    borderRadius: 28,
    backgroundColor: "#25D366",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 14,
  },

  avatarText: {
    color: "#fff",
    fontSize: 22,
    fontWeight: "700",
  },

  name: {
    fontSize: 17,
    fontWeight: "600",
  },

  phone: {
    color: "gray",
    marginTop: 4,
  },

  rowBack: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "flex-end",
    marginBottom: 12,
  },

  editBtn: {
    backgroundColor: "#007AFF",
    width: 75,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 12,
    marginRight: 10,
  },

  deleteBtn: {
    backgroundColor: "red",
    width: 75,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 12,
  },

  actionText: {
    color: "#fff",
    fontWeight: "700",
  },

  modalOverlay: {
    flex: 1,
    backgroundColor:
      "rgba(0,0,0,0.5)",
    justifyContent: "center",
    padding: 20,
  },

  modalContent: {
    borderRadius: 20,
    padding: 20,
  },

  modalTitle: {
    fontSize: 22,
    fontWeight: "700",
    marginBottom: 20,
  },

  modalInput: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 12,
    padding: 14,
    marginBottom: 15,
    fontSize: 16,
  },

  saveBtn: {
    backgroundColor: "#25D366",
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
    marginBottom: 10,
  },

  cancelBtn: {
    backgroundColor: "#999",
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
  },
});