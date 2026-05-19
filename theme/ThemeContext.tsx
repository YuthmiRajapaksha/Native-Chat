// import React, { createContext, useContext, useState } from "react";

// const ThemeContext = createContext<any>(null);

// export const ThemeProvider = ({ children }: any) => {
//   const [darkMode, setDarkMode] = useState(false);

//   const toggleTheme = () => {
//     setDarkMode(!darkMode);
//   };

//   return (
//     <ThemeContext.Provider value={{ darkMode, toggleTheme }}>
//       {children}
//     </ThemeContext.Provider>
//   );
// };

// export const useThemeContext = () => useContext(ThemeContext);



// import React, {
//   createContext,
//   useContext,
//   useEffect,
//   useState,
//   ReactNode,
// } from "react";

// import AsyncStorage from "@react-native-async-storage/async-storage";

// type ThemeContextType = {
//   darkMode: boolean;
//   toggleTheme: () => void;
//   setDarkMode: (value: boolean) => void;
// };

// const ThemeContext = createContext<ThemeContextType>({
//   darkMode: false,
//   toggleTheme: () => {},
//   setDarkMode: () => {},
// });

// export const ThemeProvider = ({ children }: { children: ReactNode }) => {
//   const [darkMode, setDarkModeState] = useState(false);
//   const [loading, setLoading] = useState(true);

//   // 🔥 Load saved theme on app start
//   useEffect(() => {
//     const loadTheme = async () => {
//       try {
//         const saved = await AsyncStorage.getItem("theme");

//         if (saved !== null) {
//           setDarkModeState(saved === "dark");
//         }
//       } catch (e) {
//         console.log("Failed to load theme", e);
//       } finally {
//         setLoading(false);
//       }
//     };

//     loadTheme();
//   }, []);

//   // 🔥 Save theme whenever it changes
//   const setDarkMode = async (value: boolean) => {
//     setDarkModeState(value);

//     try {
//       await AsyncStorage.setItem("theme", value ? "dark" : "light");
//     } catch (e) {
//       console.log("Failed to save theme", e);
//     }
//   };

//   const toggleTheme = () => {
//     setDarkMode(!darkMode);
//   };

//   if (loading) return null;

//   return (
//     <ThemeContext.Provider
//       value={{
//         darkMode,
//         toggleTheme,
//         setDarkMode,
//       }}
//     >
//       {children}
//     </ThemeContext.Provider>
//   );
// };

// export const useThemeContext = () => useContext(ThemeContext);


import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";

import AsyncStorage from "@react-native-async-storage/async-storage";

type ThemeContextType = {
  darkMode: boolean;
  toggleTheme: () => void;
  setDarkMode: (value: boolean) => void;
};

const ThemeContext = createContext<ThemeContextType>({
  darkMode: false,
  toggleTheme: () => {},
  setDarkMode: () => {},
});

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const [darkMode, setDarkModeState] = useState(false);
  const [loading, setLoading] = useState(true);

  // ✅ Load saved theme
  useEffect(() => {
    const loadTheme = async () => {
      try {
        const saved = await AsyncStorage.getItem("theme");
        if (saved) {
          setDarkModeState(saved === "dark");
        }
      } catch (e) {
        console.log(e);
      } finally {
        setLoading(false);
      }
    };

    loadTheme();
  }, []);

  // ✅ FIXED: safe state update + persistence
  const setDarkMode = async (value: boolean) => {
    setDarkModeState(value);
    await AsyncStorage.setItem("theme", value ? "dark" : "light");
  };

  // ❗ FIXED toggle (NO stale state bug)
  const toggleTheme = () => {
    setDarkModeState((prev) => {
      const next = !prev;
      AsyncStorage.setItem("theme", next ? "dark" : "light");
      return next;
    });
  };

  if (loading) return null;

  return (
    <ThemeContext.Provider
      value={{
        darkMode,
        toggleTheme,
        setDarkMode,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

export const useThemeContext = () => useContext(ThemeContext);