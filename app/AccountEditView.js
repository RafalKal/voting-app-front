import React, { useState, useEffect, useContext } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  SafeAreaView,
  ScrollView,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { AuthContext } from "./AuthContext";
import { apiService } from "./apiService";
import { decodeJWT } from "./jwtUtils";
import colors from "./colors";
import HeaderWithoutPlusCentered from "./HeaderWithoutPlusCentered";

const AccountEditView = () => {
  const navigation = useNavigation();
  const { userToken } = useContext(AuthContext);
  const [userInfo, setUserInfo] = useState({
    firstname: "",
    lastname: "",
    login: "",
    email: "",
  });

  const userId = userToken ? decodeJWT(userToken).id : null;

  useEffect(() => {
    if (userId) {
      fetchUserInfo(userId);
    }
  }, [userId]);

  const fetchUserInfo = async (userId) => {
    try {
      const response = await apiService.get(`/users/${userId}`);
      if (response.data) {
        setUserInfo({
          firstname: response.data.firstname,
          lastname: response.data.lastname,
          login: response.data.login,
          email: response.data.email,
        });
      }
    } catch (error) {
      console.error("Failed to fetch user info:", error);
      Alert.alert("Error", "Failed to fetch user information");
    }
  };

  const containsNumbers = (str) => {
    return /\d/.test(str);
  };

  const handleChange = (name, value) => {
    if (
      (name === "firstname" || name === "lastname") &&
      containsNumbers(value)
    ) {
      Alert.alert("Błąd", "Pole nie może zawierać cyfr.");
      return;
    }

    setUserInfo((prev) => ({ ...prev, [name]: value }));
  };

  const handleUpdate = async () => {
    try {
      // await apiService.put(`/users/${userId}`, userInfo);
      await apiService.put(`/users/me`, userInfo);
      Alert.alert("Sukces!", "Pomyślnie zaktualizowano dane użytkownika");
    } catch (error) {
      console.error("Failed to update user info:", error);
      Alert.alert("Błąd", "Nie udało się edytować danych użytkownika");
    }
  };

  const handleBack = () => {
    navigation.goBack();
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <HeaderWithoutPlusCentered title="Twoje konto" style={styles.header} />
      <ScrollView contentContainerStyle={styles.scrollViewAdjustment}>
        <View style={styles.buttons}>
          <TouchableOpacity onPress={handleBack} style={styles.button1}>
            <Text style={styles.buttonText1}>{"<"}</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.formContainer}>
          <Text style={styles.label}>Imię</Text>
          <TextInput
            style={styles.input}
            value={userInfo.firstname}
            onChangeText={(text) => handleChange("firstname", text)}
            placeholder="Imię"
          />
          <Text style={styles.label}>Nazwisko</Text>
          <TextInput
            style={styles.input}
            value={userInfo.lastname}
            onChangeText={(text) => handleChange("lastname", text)}
            placeholder="Nazwisko"
          />

          <Text style={styles.label}>Login</Text>
          <TextInput
            style={styles.disabledInput}
            value={userInfo.login}
            onChangeText={(text) => handleChange("login", text)}
            placeholder="Login"
            editable={false}
          />

          <Text style={styles.label}>Email</Text>
          <TextInput
            style={styles.disabledInput}
            value={userInfo.email}
            onChangeText={(text) => handleChange("email", text)}
            placeholder="Email"
            keyboardType="email-address"
            editable={false}
          />
        </View>
      </ScrollView>
      <TouchableOpacity onPress={handleUpdate} style={styles.editButton}>
        <Text style={styles.editButtonText}>Edytuj</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.greyBackground,
  },
  header: {
    width: "100%",
  },
  scrollView: {
    flexGrow: 1,
    justifyContent: "center",
    paddingHorizontal: 20,
  },
  formContainer: {
    width: "100%",
  },
  buttons: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 10,
  },
  button1: {
    width: 40,
    height: 30,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: colors.greyBorder,
  },
  buttonText1: {
    color: colors.greyBorder,
  },
  label: {
    fontSize: 16,
    color: colors.black,
    marginTop: 10,
    fontWeight: "bold",
  },
  input: {
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.greyBorder,
    borderRadius: 5,
    padding: 10,
    marginVertical: 5,
  },
  scrollViewAdjustment: {
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  editButton: {
    backgroundColor: colors.blue,
    padding: 15,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 5,
    marginHorizontal: 20,
    marginBottom: 20,
  },
  editButtonText: {
    color: colors.white,
    fontSize: 18,
  },
  backButton: {
    position: "absolute",
    top: 20,
    left: 20,
    backgroundColor: colors.blue,
    padding: 10,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
  },
  backButtonText: {
    fontSize: 24,
    color: colors.white,
  },
  disabledInput: {
    backgroundColor: colors.lightGrey,
    borderWidth: 1,
    borderColor: colors.greyBorder,
    borderRadius: 5,
    padding: 10,
    marginVertical: 5,
    color: "#A9A9A9",
  },
});

export default AccountEditView;
