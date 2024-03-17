import React from "react";
import { Image } from "react-native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import YourSurveys from "./YourSurveys";
import SurveysForYou from "./SurveysForYou";
import AnswersHistory from "./AnswersHistory";
import Settings from "./Settings";
import colors from "./colors";

const Tab = createBottomTabNavigator();

const yourSurveysIcon = require("../assets/icons/yourSurvey.png");
const AnswersHistoryIcon = require("../assets/icons/history.png");
const SurveysForYouIcon = require("../assets/icons/forYou.png");
const SettingsIcon = require("../assets/icons/settings.png");

const MainApp = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.blue,
        tabBarInactiveTintColor: colors.greyBorder,
      }}
    >
      <Tab.Screen
        name={"Twoje ankiety"}
        component={YourSurveys}
        options={{
          tabBarIcon: ({ focused }) => (
            <Image
              source={yourSurveysIcon}
              style={{
                width: 25,
                height: 25,
                tintColor: focused ? colors.blue : colors.greyBorder,
              }}
            />
          ),
        }}
      />
      <Tab.Screen
        name={"Historia odpowiedzi"}
        component={AnswersHistory}
        options={{
          tabBarIcon: ({ focused }) => (
            <Image
              source={AnswersHistoryIcon}
              style={{
                width: 25,
                height: 25,
                tintColor: focused ? colors.blue : colors.greyBorder,
              }}
            />
          ),
        }}
      />
      <Tab.Screen
        name={"Ankiety dla Ciebie"}
        component={SurveysForYou}
        options={{
          tabBarIcon: ({ focused }) => (
            <Image
              source={SurveysForYouIcon}
              style={{
                width: 25,
                height: 25,
                tintColor: focused ? colors.blue : colors.greyBorder,
              }}
            />
          ),
        }}
      />
      <Tab.Screen
        name={"Ustawienia"}
        component={Settings}
        options={{
          tabBarIcon: ({ focused }) => (
            <Image
              source={SettingsIcon}
              style={{
                width: 25,
                height: 25,
                tintColor: focused ? colors.blue : colors.greyBorder,
              }}
            />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

export default MainApp;
