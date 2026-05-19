
// import React, { useEffect, useState } from "react";

// import {
//   View,
//   Text,
//   StyleSheet,
//   TouchableOpacity,
//   TextInput,
//   Alert,
//   Modal,
//   Image,
//   FlatList,
//   Animated,
//   PanResponder,
// } from "react-native";

// import * as Contacts from "expo-contacts";

// import AsyncStorage from "@react-native-async-storage/async-storage";

// import { Ionicons } from "@expo/vector-icons";

// // import { SwipeListView } from "react-native-swipe-list-view";

// import { useThemeContext } from "../theme/ThemeContext";

// export default function ContactsScreen() {
//   const { darkMode } = useThemeContext();

//   const [contacts, setContacts] = useState<any[]>([]);
//   const [search, setSearch] = useState("");

//   const [editingContact, setEditingContact] =
//     useState<any>(null);

//   const [editName, setEditName] = useState("");
//   const [editPhone, setEditPhone] = useState("");

//   const [editModal, setEditModal] = useState(false);

//   useEffect(() => {
//     loadContacts();
//   }, []);

//   const loadContacts = async () => {
//     try {
//       const { status } =
//         await Contacts.requestPermissionsAsync();

//       let deviceContacts: any[] = [];

//       if (status === "granted") {
//         const { data } =
//           await Contacts.getContactsAsync({
//             fields: [
//               Contacts.Fields.PhoneNumbers,
//             ],
//           });

//         // deviceContacts = data.map((item) => ({
//         //   id: item.id,
//         //   name: item.name,
//         //   phone:
//         //     item.phoneNumbers?.[0]?.number ||
//         //     "No number",
//         // }));

//         deviceContacts = data.map((item) => ({
//               id: item.id,
//               name: item.name,
//               phone:item.phoneNumbers?.[0]?.number ||"No number",
//               time: new Date().toLocaleTimeString([], {hour: "2-digit",minute: "2-digit",}),
//         }));

//       }

//       const savedContacts =
//         await AsyncStorage.getItem(
//           "appContacts"
//         );

//       const appContacts = savedContacts
//         ? JSON.parse(savedContacts)
//         : [];

//       const merged = [
//         ...appContacts,
//         ...deviceContacts,
//       ];

//       const uniqueContacts = merged.filter(
//         (contact, index, self) =>
//           index ===
//           self.findIndex(
//             (c) => c.phone === contact.phone
//           )
//       );

//       setContacts(uniqueContacts);
//     } catch (error) {
//       Alert.alert("Error loading contacts");
//     }
//   };

//       const deleteContact = async (id: string) => {
//         try {
//           const updated = contacts.filter(
//             (item) => item.id !== id
//           );

//           setContacts(updated);

//           await AsyncStorage.setItem(
//             "appContacts",
//             JSON.stringify(updated)
//           );

//           Alert.alert("Deleted", "Contact removed");
//         } catch (error) {
//           Alert.alert("Error deleting contact");
//         }
//       };

//       const openEdit = (item: any) => {
//         setEditingContact(item);

//         setEditName(item.name);

//         setEditPhone(item.phone);

//         setEditModal(true);
//       };

//         const updateContact = async () => {
//           try {
//             const updatedContacts = contacts.map(
//               (item) =>
//                 item.id === editingContact.id
//                   ? {
//                       ...item,
//                       name: editName,
//                       phone: editPhone,
//                     }
//                   : item
//             );

//       setContacts(updatedContacts);

//       await AsyncStorage.setItem(
//         "appContacts",
//         JSON.stringify(updatedContacts)
//       );

//       setEditModal(false);

//       Alert.alert("Updated", "Contact updated");
//     } catch (error) {
//       Alert.alert("Error updating contact");
//     }
//   };

//   const filteredContacts = contacts.filter(
//     (contact) =>
//       contact.name
//         ?.toLowerCase()
//         .includes(search.toLowerCase())
//   );

//   const renderItem = ({ item }: any) => (
//     <TouchableOpacity
//       activeOpacity={0.8}
//       style={[
//         styles.chatCard,
//         {
//           backgroundColor: darkMode
//             ? "#111B21"
//             : "#fff",
//         },
//       ]}
//     >
//       {/* Avatar */}
//       <View style={styles.avatar}>
//         <Text style={styles.avatarText}>
//           {item.name?.charAt(0)}
//         </Text>
//       </View>

//       {/* Chat Details */}
//       <View style={styles.chatContent}>
//         <View style={styles.topRow}>
//           <Text
//             style={[
//               styles.name,
//               {
//                 color: darkMode
//                   ? "#fff"
//                   : "#000",
//               },
//             ]}
//             numberOfLines={1}
//           >
//             {item.name}
//           </Text>

//         {/* 
//           <Text style={styles.time}>
//             11:20 AM
//           </Text> */}

//           <Text style={styles.time}>
//               {item.time || ""}
//           </Text>

//         </View>

//         <View style={styles.bottomRow}>
//           <View style={styles.messageRow}>
//             <Ionicons
//               name="checkmark-done"
//               size={16}
//               color="#4FC3F7"
//             />

//             <Text
//               style={styles.message}
//               numberOfLines={1}
//             >
//               {item.phone}
//             </Text>
//           </View>

//           <Ionicons
//             name="chevron-forward"
//             size={18}
//             color="gray"
//           />
//         </View>
//       </View>
//     </TouchableOpacity>
//   );

//   const renderHiddenItem = ({ item }: any) => (
//     <View style={styles.rowBack}>
//       <TouchableOpacity
//         style={styles.moreBtn}
//         onPress={() => openEdit(item)}
//       >
//         <Ionicons
//           name="create-outline"
//           size={22}
//           color="#fff"
//         />

//         <Text style={styles.actionText}>
//           Edit
//         </Text>
//       </TouchableOpacity>

//       <TouchableOpacity
//         style={styles.archiveBtn}
//         onPress={() => deleteContact(item.id)}
//       >
//         <Ionicons
//           name="trash-outline"
//           size={22}
//           color="#fff"
//         />

//         <Text style={styles.actionText}>
//           Delete
//         </Text>
//       </TouchableOpacity>
//     </View>
//   );

//   return (
//     <View
//       style={[
//         styles.container,
//         {
//           backgroundColor: darkMode
//             ? "#0B141A"
//             : "#F6F6F6",
//         },
//       ]}
//     >
//       {/* HEADER */}
//       <View style={styles.header}>
//         <Text
//           style={[
//             styles.headerTitle,
//             {
//               color: darkMode
//                 ? "#fff"
//                 : "#000",
//             },
//           ]}
//         >
//           Chats
//         </Text>

//         {/* <TouchableOpacity>
//           <Ionicons
//             name="create-outline"
//             size={28}
//             color="#007AFF"
//           />
//         </TouchableOpacity> */}
        
//       </View>

//       {/* SEARCH */}
//       <View
//         style={[
//           styles.searchContainer,
//           {
//             backgroundColor: darkMode
//               ? "#202C33"
//               : "#fff",
//           },
//         ]}
//       >
//         <Ionicons
//           name="search"
//           size={18}
//           color="gray"
//         />

//         <TextInput
//           placeholder="Search"
//           placeholderTextColor="gray"
//           value={search}
//           onChangeText={setSearch}
//           style={[
//             styles.searchInput,
//             {
//               color: darkMode
//                 ? "#fff"
//                 : "#000",
//             },
//           ]}
//         />
//       </View>

//       {/* LIST */}
//       <SwipeListView
//         data={filteredContacts}
//         keyExtractor={(item) => item.id}
//         renderItem={renderItem}
//         renderHiddenItem={renderHiddenItem}
//         rightOpenValue={-160}
//         disableRightSwipe
//         showsVerticalScrollIndicator={false}
//         contentContainerStyle={{
//           paddingBottom: 30,
//         }}
//       />

//       {/* MODAL */}
//       <Modal
//         visible={editModal}
//         transparent
//         animationType="slide"
//       >
//         <View style={styles.modalOverlay}>
//           <View
//             style={[
//               styles.modalContent,
//               {
//                 backgroundColor: darkMode
//                   ? "#1E1E1E"
//                   : "#fff",
//               },
//             ]}
//           >
//             <Text
//               style={[
//                 styles.modalTitle,
//                 {
//                   color: darkMode
//                     ? "#fff"
//                     : "#000",
//                 },
//               ]}
//             >
//               Edit Contact
//             </Text>

//             <TextInput
//               value={editName}
//               onChangeText={setEditName}
//               placeholder="Name"
//               placeholderTextColor="gray"
//               style={[
//                 styles.modalInput,
//                 {
//                   color: darkMode
//                     ? "#fff"
//                     : "#000",
//                 },
//               ]}
//             />

//             <TextInput
//               value={editPhone}
//               onChangeText={setEditPhone}
//               placeholder="Phone"
//               placeholderTextColor="gray"
//               style={[
//                 styles.modalInput,
//                 {
//                   color: darkMode
//                     ? "#fff"
//                     : "#000",
//                 },
//               ]}
//             />

//             <TouchableOpacity
//               style={styles.saveBtn}
//               onPress={updateContact}
//             >
//               <Text style={styles.btnText}>
//                 Save
//               </Text>
//             </TouchableOpacity>

//             <TouchableOpacity
//               style={styles.cancelBtn}
//               onPress={() =>
//                 setEditModal(false)
//               }
//             >
//               <Text style={styles.btnText}>
//                 Cancel
//               </Text>
//             </TouchableOpacity>
//           </View>
//         </View>
//       </Modal>
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     paddingTop: 60,
//   },

//   header: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     alignItems: "center",
//     paddingHorizontal: 18,
//     marginBottom: 18,
//   },

//   headerTitle: {
//     fontSize: 30,
//     fontWeight: "700",
//   },

//   searchContainer: {
//     flexDirection: "row",
//     alignItems: "center",
//     marginHorizontal: 16,
//     borderRadius: 12,
//     paddingHorizontal: 14,
//     height: 45,
//     marginBottom: 14,
//   },

//   searchInput: {
//     flex: 1,
//     marginLeft: 10,
//     fontSize: 15,
//   },

//   chatCard: {
//     flexDirection: "row",
//     alignItems: "center",
//     paddingHorizontal: 16,
//     paddingVertical: 12,
//     borderBottomWidth: 0.5,
//     borderBottomColor: "#ddd",
//   },

//   avatar: {
//     width: 56,
//     height: 56,
//     borderRadius: 28,
//     backgroundColor: "#0b8987",
//     justifyContent: "center",
//     alignItems: "center",
//     marginRight: 14,
//   },

//   avatarText: {
//     color: "#fff",
//     fontSize: 22,
//     fontWeight: "700",
//   },

//   chatContent: {
//     flex: 1,
//   },

//   topRow: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     alignItems: "center",
//   },

//   name: {
//     fontSize: 17,
//     fontWeight: "600",
//     flex: 1,
//   },

//   time: {
//     fontSize: 12,
//     color: "gray",
//     marginLeft: 10,
//   },

//   bottomRow: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     alignItems: "center",
//     marginTop: 6,
//   },

//   messageRow: {
//     flexDirection: "row",
//     alignItems: "center",
//     flex: 1,
//   },

//   message: {
//     color: "gray",
//     marginLeft: 6,
//     fontSize: 14,
//     flex: 1,
//   },

//   rowBack: {
//     flex: 1,
//     flexDirection: "row",
//     justifyContent: "flex-end",
//     alignItems: "center",
//     marginBottom: 1,
//   },

//   moreBtn: {
//     width: 80,
//     backgroundColor: "#7E8A97",
//     justifyContent: "center",
//     alignItems: "center",
//     height: "100%",
//   },

//   archiveBtn: {
//     width: 80,
//     backgroundColor: "#3B82F6",
//     justifyContent: "center",
//     alignItems: "center",
//     height: "100%",
//   },

//   actionText: {
//     color: "#fff",
//     fontSize: 12,
//     marginTop: 4,
//     fontWeight: "600",
//   },

//   modalOverlay: {
//     flex: 1,
//     backgroundColor: "rgba(0,0,0,0.5)",
//     justifyContent: "center",
//     padding: 20,
//   },

//   modalContent: {
//     borderRadius: 20,
//     padding: 20,
//   },

//   modalTitle: {
//     fontSize: 22,
//     fontWeight: "700",
//     marginBottom: 20,
//   },

//   modalInput: {
//     borderWidth: 1,
//     borderColor: "#ccc",
//     borderRadius: 12,
//     padding: 14,
//     marginBottom: 15,
//     fontSize: 16,
//   },

//   saveBtn: {
//     backgroundColor: "#25D366",
//     padding: 15,
//     borderRadius: 12,
//     alignItems: "center",
//     marginBottom: 10,
//   },

//   cancelBtn: {
//     backgroundColor: "#999",
//     padding: 15,
//     borderRadius: 12,
//     alignItems: "center",
//   },

//   btnText: {
//     color: "#fff",
//     fontWeight: "700",
//     fontSize: 16,
//   },
// });








import React, { useEffect, useRef, useState } from "react";

import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Alert,
  Modal,
  FlatList,
  Animated,
  PanResponder,
} from "react-native";

import * as Contacts from "expo-contacts";

import AsyncStorage from "@react-native-async-storage/async-storage";

import { Ionicons } from "@expo/vector-icons";

import { useThemeContext } from "../theme/ThemeContext";

export default function ContactsScreen() {
  const { darkMode } = useThemeContext();

  const [contacts, setContacts] = useState<any[]>([]);
  const [search, setSearch] = useState("");

  const [editingContact, setEditingContact] =
    useState<any>(null);

  const [editName, setEditName] = useState("");
  const [editPhone, setEditPhone] = useState("");

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

        deviceContacts = data.map((item) => ({
          id: item.id,
          name: item.name,
          phone:
            item.phoneNumbers?.[0]?.number ||
            "No number",
          time: new Date().toLocaleTimeString(
            [],
            {
              hour: "2-digit",
              minute: "2-digit",
            }
          ),
        }));
      }

      const savedContacts =
        await AsyncStorage.getItem(
          "appContacts"
        );

      const appContacts = savedContacts
        ? JSON.parse(savedContacts)
        : [];

      const merged = [
        ...appContacts,
        ...deviceContacts,
      ];

      const uniqueContacts = merged.filter(
        (contact, index, self) =>
          index ===
          self.findIndex(
            (c) => c.phone === contact.phone
          )
      );

      setContacts(uniqueContacts);
    } catch (error) {
      Alert.alert("Error loading contacts");
    }
  };

  const deleteContact = async (id: string) => {
    try {
      const updated = contacts.filter(
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
      Alert.alert("Error deleting contact");
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
      const updatedContacts = contacts.map(
        (item) =>
          item.id === editingContact.id
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
      Alert.alert("Error updating contact");
    }
  };

  const filteredContacts = contacts.filter(
    (contact) =>
      contact.name
        ?.toLowerCase()
        .includes(search.toLowerCase())
  );

  const renderItem = ({ item }: any) => (
    <TouchableOpacity
      activeOpacity={0.8}
      style={[
        styles.chatCard,
        {
          backgroundColor: darkMode
            ? "#111B21"
            : "#fff",
        },
      ]}
    >
      <View style={styles.avatar}>
        <Text style={styles.avatarText}>
          {item.name?.charAt(0)}
        </Text>
      </View>

      <View style={styles.chatContent}>
        <View style={styles.topRow}>
          <Text
            style={[
              styles.name,
              {
                color: darkMode
                  ? "#fff"
                  : "#000",
              },
            ]}
            numberOfLines={1}
          >
            {item.name}
          </Text>

          <Text style={styles.time}>
            {item.time || ""}
          </Text>
        </View>

        <View style={styles.bottomRow}>
          <View style={styles.messageRow}>
            <Ionicons
              name="checkmark-done"
              size={16}
              color="#4FC3F7"
            />

            <Text
              style={styles.message}
              numberOfLines={1}
            >
              {item.phone}
            </Text>
          </View>

          <Ionicons
            name="chevron-forward"
            size={18}
            color="gray"
          />
        </View>
      </View>
    </TouchableOpacity>
  );

  // SWIPEABLE ITEM
  const SwipeableItem = ({
    item,
  }: any) => {
    const translateX = useRef(
      new Animated.Value(0)
    ).current;

    const panResponder = useRef(
      PanResponder.create({
        onMoveShouldSetPanResponder: (
          _,
          gestureState
        ) => {
          return (
            Math.abs(gestureState.dx) > 10
          );
        },

        onPanResponderMove: (
          _,
          gestureState
        ) => {
          if (gestureState.dx < 0) {
            translateX.setValue(
              Math.max(
                gestureState.dx,
                -160
              )
            );
          }
        },

        onPanResponderRelease: (
          _,
          gestureState
        ) => {
          if (gestureState.dx < -80) {
            Animated.spring(
              translateX,
              {
                toValue: -160,
                useNativeDriver: true,
              }
            ).start();
          } else {
            Animated.spring(
              translateX,
              {
                toValue: 0,
                useNativeDriver: true,
              }
            ).start();
          }
        },
      })
    ).current;

    return (
      <View
        style={{ marginBottom: 1 }}
      >
        {/* BACK BUTTONS */}
        <View style={styles.rowBack}>
          <TouchableOpacity
            style={styles.moreBtn}
            onPress={() =>
              openEdit(item)
            }
          >
            <Ionicons
              name="create-outline"
              size={22}
              color="#fff"
            />

            <Text
              style={styles.actionText}
            >
              Edit
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.archiveBtn}
            onPress={() =>
              deleteContact(item.id)
            }
          >
            <Ionicons
              name="trash-outline"
              size={22}
              color="#fff"
            />

            <Text
              style={styles.actionText}
            >
              Delete
            </Text>
          </TouchableOpacity>
        </View>

        {/* FRONT CARD */}
        <Animated.View
          style={{
            transform: [
              { translateX },
            ],
          }}
          {...panResponder.panHandlers}
        >
          {renderItem({ item })}
        </Animated.View>
      </View>
    );
  };

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: darkMode
            ? "#0B141A"
            : "#F6F6F6",
        },
      ]}
    >
      {/* HEADER */}
      <View style={styles.header}>
        <Text
          style={[
            styles.headerTitle,
            {
              color: darkMode
                ? "#fff"
                : "#000",
            },
          ]}
        >
          Chats
        </Text>
      </View>

      {/* SEARCH */}
      <View
        style={[
          styles.searchContainer,
          {
            backgroundColor: darkMode
              ? "#202C33"
              : "#fff",
          },
        ]}
      >
        <Ionicons
          name="search"
          size={18}
          color="gray"
        />

        <TextInput
          placeholder="Search"
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

      {/* CONTACT LIST */}  
      {/* Replace SwipeListView */}
      <FlatList
        data={filteredContacts}
        keyExtractor={(item) =>
          item.id
        }
        renderItem={({ item }) => (
          <SwipeableItem item={item} />
        )}
        showsVerticalScrollIndicator={
          false
        }
        contentContainerStyle={{
          paddingBottom: 30,
        }}
      />

      {/* EDIT MODAL */}
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
                backgroundColor: darkMode
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
              onPress={
                updateContact
              }
            >
              <Text
                style={styles.btnText}
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
                style={styles.btnText}
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
  },

  header: {
    flexDirection: "row",
    justifyContent:
      "space-between",
    alignItems: "center",
    paddingHorizontal: 18,
    marginBottom: 18,
  },

  headerTitle: {
    fontSize: 30,
    fontWeight: "700",
  },

  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: 16,
    borderRadius: 12,
    paddingHorizontal: 14,
    height: 45,
    marginBottom: 14,
  },

  searchInput: {
    flex: 1,
    marginLeft: 10,
    fontSize: 15,
  },

  chatCard: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 0.5,
    borderBottomColor: "#ddd",
  },

  avatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "#0b8987",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 14,
  },

  avatarText: {
    color: "#fff",
    fontSize: 22,
    fontWeight: "700",
  },

  chatContent: {
    flex: 1,
  },

  topRow: {
    flexDirection: "row",
    justifyContent:
      "space-between",
    alignItems: "center",
  },

  name: {
    fontSize: 17,
    fontWeight: "600",
    flex: 1,
  },

  time: {
    fontSize: 12,
    color: "gray",
    marginLeft: 10,
  },

  bottomRow: {
    flexDirection: "row",
    justifyContent:
      "space-between",
    alignItems: "center",
    marginTop: 6,
  },

  messageRow: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },

  message: {
    color: "gray",
    marginLeft: 6,
    fontSize: 14,
    flex: 1,
  },

  rowBack: {
    position: "absolute",
    right: 0,
    top: 0,
    bottom: 0,
    flexDirection: "row",
  },

  moreBtn: {
    width: 80,
    backgroundColor: "#7E8A97",
    justifyContent: "center",
    alignItems: "center",
  },

  archiveBtn: {
    width: 80,
    backgroundColor: "#3B82F6",
    justifyContent: "center",
    alignItems: "center",
  },

  actionText: {
    color: "#fff",
    fontSize: 12,
    marginTop: 4,
    fontWeight: "600",
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
    padding: 15,
    borderRadius: 12,
    alignItems: "center",
    marginBottom: 10,
  },

  cancelBtn: {
    backgroundColor: "#999",
    padding: 15,
    borderRadius: 12,
    alignItems: "center",
  },

  btnText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 16,
  },
});