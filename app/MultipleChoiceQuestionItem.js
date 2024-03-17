import React from "react";
import { View, Text, StyleSheet } from "react-native";
import colors from "./colors";

const MultipleChoiceQuestionItem = ({ questionContent, choices }) => {
  return (
    <View style={questionStyles.container}>
      <Text style={questionStyles.questionText}>{questionContent}</Text>
      {choices.map((option, index) => (
        <View key={index} style={questionStyles.optionContainer}>
          <Text style={questionStyles.optionText}>{option}</Text>
        </View>
      ))}
    </View>
  );
};

const questionStyles = StyleSheet.create({
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
  optionContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 5,
  },
  optionText: {
    fontSize: 16,
    marginLeft: 10,
  },
});

export default MultipleChoiceQuestionItem;
