// import React, { useContext } from "react";
// import {
//   StyleSheet,
//   ScrollView,
//   View,
//   Text,
//   TouchableOpacity,
//   SafeAreaView,
//   Alert,
// } from "react-native";
// import { useNavigation } from "@react-navigation/native";
// import HeaderWithoutPlus from "./HeaderWithoutPlus";
// import { AuthContext } from "./AuthContext";
// import colors from "./colors";
// import { decodeJWT } from "./jwtUtils";
// import { apiService } from "./apiService";

// import colors from "./colors";

// const Settings = () => {
//   const { userToken } = useContext(AuthContext);

//   const navigation = useNavigation();

//   const { logout } = useContext(AuthContext);

//   const handleDeleteAccount = () => {
//     Alert.alert(
//       "Usuwanie konta",
//       "Czy na pewno chcesz usunąć swoje konto? Ta operacja jest nieodwracalna.",
//       [
//         {
//           text: "Anuluj",
//           onPress: () => console.log("Anulowano usuwanie konta"),
//           style: "cancel",
//         },
//         {
//           text: "Usuń konto",
//           onPress: () => {
//             console.log("Usunięto konto");
//             navigation.navigate("Login");
//           },
//         },
//       ]
//     );
//   };

//   const settingsOptions = [
//     {
//       title: "Konto",
//       onPress: () => navigation.navigate("AccountEditView"),
//     },
//     {
//       title: "Organizacje",
//       onPress: () => navigation.navigate("OrganisationListView"),
//     },
//     { title: "Wyloguj się", onPress: logout },
//   ];

//   return (
//     <SafeAreaView style={styles.safeArea}>
//       <View style={styles.container}>
//         <HeaderWithoutPlus title="Ustawienia" />
//         <ScrollView style={styles.operationArea}>
//           {settingsOptions.map((option, index) => (
//             <TouchableOpacity
//               key={index}
//               style={styles.optionItem}
//               onPress={option.onPress}
//             >
//               <Text style={styles.optionText}>{option.title}</Text>
//               <Text style={styles.optionArrow}>›</Text>
//             </TouchableOpacity>
//           ))}
//           <TouchableOpacity
//             style={styles.deleteAccount}
//             onPress={handleDeleteAccount}
//           >
//             <Text style={styles.deleteAccountText}>Usuń swoje konto</Text>
//           </TouchableOpacity>
//         </ScrollView>
//       </View>
//     </SafeAreaView>
//   );
// };

// const styles = StyleSheet.create({
//   safeArea: {
//     flex: 1,
//     backgroundColor: colors.greyBackground,
//   },
//   container: {
//     flex: 1,
//   },
//   operationArea: {
//     flex: 1,
//   },
//   optionItem: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     alignItems: "center",
//     paddingVertical: 15,
//     borderBottomWidth: 1,
//     borderBottomColor: colors.greyBorder,
//     paddingHorizontal: 20,
//   },
//   optionText: {
//     fontSize: 18,
//   },
//   optionArrow: {
//     fontSize: 18,
//     color: colors.greyBorder,
//   },
//   deleteAccount: {
//     paddingVertical: 15,
//     paddingHorizontal: 20,
//   },
//   deleteAccountText: {
//     fontSize: 18,
//     color: colors.red,
//   },
// });

// export default Settings;







import React, { useContext } from "react";
import {
  StyleSheet,
  ScrollView,
  View,
  Text,
  TouchableOpacity,
  SafeAreaView,
  Alert,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import HeaderWithoutPlus from "./HeaderWithoutPlus";
import { AuthContext } from "./AuthContext";
import colors from "./colors";
import { decodeJWT } from "./jwtUtils";
import { apiService } from "./apiService";

const Settings = () => {
  const navigation = useNavigation();
  const { userToken, logout } = useContext(AuthContext);

  const handleDeleteAccount = () => {
    Alert.alert(
      "Usuwanie konta",
      "Czy na pewno chcesz usunąć swoje konto? Ta operacja jest nieodwracalna.",
      [
        {
          text: "Anuluj",
          onPress: () => console.log("Anulowano usuwanie konta"),
          style: "cancel",
        },
        {
          text: "Usuń konto",
          onPress: async () => {
            try {
              // Dekodowanie tokena JWT, aby uzyskać id użytkownika
              const decodedToken = decodeJWT(userToken);
              const userId = decodedToken?.sub; // Zakładam, że identyfikator użytkownika jest przechowywany w claim 'sub'
              if (userId) {
                await apiService.delete(`/users/${userId}`);
                console.log("Konto zostało usunięte.");
                logout(); // Wylogowanie użytkownika i czyszczenie kontekstu/stanu
                navigation.navigate("Login"); // Przekierowuje do ekranu logowania
              } else {
                Alert.alert("Błąd", "Nie udało się zidentyfikować użytkownika.");
              }
            } catch (error) {
              console.error("Nie udało się usunąć konta", error);
              Alert.alert("Błąd", "Nie udało się usunąć konta. Spróbuj ponownie później.");
            }
          },
        },
      ]
    );
  };

  const settingsOptions = [
    {
      title: "Konto",
      onPress: () => navigation.navigate("AccountEditView"),
    },
    {
      title: "Organizacje",
      onPress: () => navigation.navigate("OrganisationListView"),
    },
    { title: "Wyloguj się", onPress: logout },
  ];

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <HeaderWithoutPlus title="Ustawienia" />
        <ScrollView style={styles.operationArea}>
          {settingsOptions.map((option, index) => (
            <TouchableOpacity
              key={index}
              style={styles.optionItem}
              onPress={option.onPress}
            >
              <Text style={styles.optionText}>{option.title}</Text>
              <Text style={styles.optionArrow}>›</Text>
            </TouchableOpacity>
          ))}
          <TouchableOpacity
            style={styles.deleteAccount}
            onPress={handleDeleteAccount}
          >
            <Text style={styles.deleteAccountText}>Usuń swoje konto</Text>
          </TouchableOpacity>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.greyBackground,
  },
  container: {
    flex: 1,
  },
  operationArea: {
    flex: 1,
  },
  optionItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: colors.greyBorder,
    paddingHorizontal: 20,
  },
  optionText: {
    fontSize: 18,
  },
  optionArrow: {
    fontSize: 18,
    color: colors.greyBorder,
  },
  deleteAccount: {
    paddingVertical: 15,
    paddingHorizontal: 20,
  },
  deleteAccountText: {
    fontSize: 18,
    color: colors.red,
  },
});

export default Settings;
