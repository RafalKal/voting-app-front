import React from "react";
import { View, Text, StyleSheet } from "react-native";
import colors from "./colors";

const TextQuestionItem = ({ questionContent }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.questionText}>{questionContent}</Text>
      <View style={styles.dropdown}>
        <Text style={styles.dropdownText}>Wpisz odpowiedz...</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.white,
    borderRadius: 10,
    padding: 20,
    marginBottom: 10,
  },
  questionText: {
    fontWeight: "bold",
    fontSize: 18,
    marginBottom: 10,
  },
  dropdown: {
    borderWidth: 1,
    borderColor: colors.greyBorder,
    borderRadius: 5,
    padding: 15,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 10,
  },
  dropdownText: {
    fontSize: 16,
    color: colors.greyBorder,
  },
  dropdownIcon: {
    fontSize: 16,
    color: colors.greyBorder,
  },
});

export default TextQuestionItem;
