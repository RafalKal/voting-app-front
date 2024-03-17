import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import React, { createContext, useState, useEffect } from "react";
import { apiService } from "./apiService";
import { Alert } from "react-native";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [userToken, setUserToken] = useState(null);

  const loginAction = (login, password) => {
    setIsLoading(true);

    apiService
      .post("/auth/authenticate", { login, password })
      .then((userInfoFromRes) => {
        setUserToken(userInfoFromRes.token);
        AsyncStorage.setItem("userInfo", JSON.stringify(userInfoFromRes));
        AsyncStorage.setItem("userToken", userInfoFromRes.token);
      })
      .catch((e) => {
        console.log(`Login error ${e}`);
        if (e.response && e.response.status === 403) {
          Alert.alert("Błąd logowania", "Niepoprawny login lub hasło.");
        } else {
          Alert.alert(
            "Błąd logowania",
            "Wystąpił nieoczekiwany błąd podczas logowania."
          );
        }
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const register = (email, login, password) => {
    setIsLoading(true);

    axios
      .post("https://voting-app-kczk.onrender.com/api/auth/register", {
        email,
        login,
        password,
      })
      .then((res) => {
        let userInfoFromRes = res.data;

        setUserToken(userInfoFromRes.token);

        AsyncStorage.setItem("userInfo", JSON.stringify(userInfoFromRes));
        AsyncStorage.setItem("userToken", userInfoFromRes.token);
      })
      .catch((e) => {
        console.log(`Register error ${e}`);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const logout = () => {
    setIsLoading(true);
    setUserToken(null);
    AsyncStorage.removeItem("userToken");
  };

  const isLoggedIn = async () => {
    try {
      setIsLoading(true);
      let userInfo = await AsyncStorage.getItem("userInfo");
      let userToken = await AsyncStorage.getItem("userToken");
      userInfo = JSON.parse(userInfo);

      if (userInfo) {
        setUserToken(userToken);
      }
      setIsLoading(false);
    } catch (e) {
      console.log(`isLogged in error ${e}`);
    }
  };

  useEffect(() => {
    isLoggedIn();
  }, []);

  return (
    <AuthContext.Provider
      value={{ loginAction, logout, register, isLoading, userToken }}
    >
      {children}
    </AuthContext.Provider>
  );
};
