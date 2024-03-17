import React, { useState, useContext } from "react";
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from "react-native";
import AuthTextInput from "./AuthTextInput";
import colors from "./colors";
import { AuthContext } from "./AuthContext";

const AuthScreen = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [login, setLogin] = useState("");
  const { loginAction, register } = useContext(AuthContext);

  const handleAuth = async () => {
    if (isLogin) {
      loginAction(email, password);
    } else {
      const registrationSuccess = await register(email, login, password);
      if (registrationSuccess) {
        loginAction(email, password);
      }
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        style={styles.flexContainer}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        enabled
      >
        <ScrollView contentContainerStyle={styles.container}>
          <Text style={styles.title}>
            {isLogin ? "Logowanie" : "Rejestracja"}
          </Text>
          <Text style={styles.label}>Email: </Text>
          <AuthTextInput
            placeholder="Email"
            value={email}
            setValue={setEmail}
            style={styles.input}
          />
          {!isLogin && (
            <>
              <Text style={styles.label}>Nazwa użytkownika: </Text>
              <AuthTextInput
                placeholder="Nazwa użytkownika"
                value={login}
                setValue={setLogin}
                style={styles.input}
              />
            </>
          )}
          <Text style={styles.label}>Hasło: </Text>
          <AuthTextInput
            placeholder="Hasło"
            value={password}
            setValue={setPassword}
            secureTextEntry={true}
            style={styles.input}
          />
          <TouchableOpacity style={styles.button} onPress={handleAuth}>
            <Text style={styles.buttonText}>
              {isLogin ? "Zaloguj się" : "Zarejestruj się"}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => setIsLogin(!isLogin)}>
            <Text>
              {isLogin
                ? "Nie masz konta? Zarejestruj się"
                : "Masz już konto? Zaloguj się"}
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.greyBackground,
  },
  flexContainer: {
    flex: 1,
  },
  container: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
  },
  label: {
    alignSelf: "flex-start",
    marginLeft: 55,
    marginBottom: 3,
    fontWeight: "bold",
  },
  input: {
    width: 250,
    marginBottom: 20,
  },
  button: {
    backgroundColor: colors.blue,
    padding: 10,
    borderRadius: 5,
    marginBottom: 20,
  },
  buttonText: {
    color: colors.white,
  },
});

export default AuthScreen;
