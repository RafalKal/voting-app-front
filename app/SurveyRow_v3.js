import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import colors from "./colors";

const SurveyRow_v3 = ({ survey, onPress }) => {
  const stateStyle =
    survey.state === "active" ? styles.activeState : styles.inactiveState;

  return (
    <TouchableOpacity onPress={onPress} style={styles.subItem}>
      <View style={styles.headerRow}>
        <Text style={styles.surveyName}>{survey.name}</Text>
        <Text style={[styles.surveyState, stateStyle]}>
          {survey.state === "active" ? "Aktywna" : "Nieaktywna"}
        </Text>
      </View>
      <View style={styles.detailRow}>
        <Text style={styles.surveyDetails}>
          {survey.surveyResponses.length} odpowiedzi
        </Text>
        <Text style={styles.surveyDetails}>{survey.organisationName}</Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  subItem: {
    padding: 10,
    backgroundColor: colors.white,
    borderBottomColor: colors.greyBorder,
    borderBottomWidth: 1,
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  surveyName: {
    color: colors.black,
    fontWeight: "bold",
    fontSize: 25,
    height: 40,
  },
  activeState: {
    color: colors.green,
    fontWeight: "bold",
    fontSize: 16,
  },
  inactiveState: {
    color: colors.red,
    fontWeight: "bold",
    fontSize: 16,
  },
  detailRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 4,
  },
  surveyDetails: {
    color: colors.greyBorder,
    fontSize: 14,
  },
});

export default SurveyRow_v3;
