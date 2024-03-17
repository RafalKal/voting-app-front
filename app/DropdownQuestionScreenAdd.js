import React, { useState, useEffect } from "react";
import {
  View,
  Switch,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  SafeAreaView
} from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import colors from "./colors";

const DropdownQuestionScreenAdd = () => {
  const [questionContent, setQuestionContent] = useState("");
  const [choices, setChoices] = useState([""]);
  const [isAnswerRequired, setIsAnswerRequired] = useState(false);

  const route = useRoute();
  const questionsFromCreateSurvey = route.params?.questions || [];
  const surveyNameFromCreateSurvey = route.params?.name || "";

  const questionData = {
    questionContent: questionContent,
    choices: choices,
    isAnswerRequired: isAnswerRequired,
    questionType: "DROPDOWN_MENU_CHOICE",
  };

  const navigation = useNavigation();

  const handleSave = () => {
    const trimmedQuestionContent = questionContent.trim();
  
    const nonEmptyChoices = choices.filter(choice => choice.trim() !== "");
  
    if (!trimmedQuestionContent || nonEmptyChoices.length === 0) {
      alert("Pytanie musi zawierać treść oraz przynajmniej jedną odpowiedź.");
      return;
    }
  
    const updatedQuestionData = {
      ...questionData,
      questionContent: trimmedQuestionContent,
      choices: nonEmptyChoices,
    };
  
    const updatedQuestions = [...questionsFromCreateSurvey, updatedQuestionData];
    navigation.navigate("CreateSurveyView", {
      questions: updatedQuestions,
      name: surveyNameFromCreateSurvey,
    });
  };
  

  const toggleSwitch3 = () =>
    setIsAnswerRequired((previousState) => !previousState);

  const handleGoBack = () => {
    navigation.goBack();
  };

  const updateChoice = (text, index) => {
    setChoices(choices.map((choice, i) => (i === index ? text : choice)));
  };

  const addChoice = () => {
    setChoices([...choices, ""]);
  };

  const removeChoice = (index) => {
    setChoices(choices.filter((_, i) => i !== index));
  };

  useEffect(() => {
    return () => {
      setQuestionContent("");
      setChoices(["", ""]);
      setIsAnswerRequired(false);
    };
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={handleGoBack}>
          <Text style={styles.closeButton}>×</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Wysuwana lista odpowiedzi</Text>
        <TouchableOpacity onPress={handleSave}>
          <Text style={styles.saveButton}>ZAPISZ</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content}>
        <Text style={styles.label}>TREŚĆ PYTANIA</Text>
        <TextInput
          style={styles.questionContentInput}
          value={questionContent}
          placeholder="treść pytania..."
          placeholderTextColor="grey"
          onChangeText={setQuestionContent}
        />

        <Text style={styles.label}>OPCJE ODPOWIEDZI</Text>
        {choices.map((choice, index) => (
          <View key={index} style={styles.choiceContainer}>
            <TextInput
              style={styles.choiceInput}
              value={choices}
              placeholder="treść odpowiedzi..."
              placeholderTextColor="grey"
              onChangeText={(text) => updateChoice(text, index)}
            />
            <TouchableOpacity onPress={() => removeChoice(index)}>
              <Text style={styles.deleteButton}>−</Text>
            </TouchableOpacity>
          </View>
        ))}
        <TouchableOpacity onPress={addChoice}>
          <Text style={styles.addChoiceButton}>Dodaj opcję odpowiedzi</Text>
        </TouchableOpacity>

        <View style={styles.settings}>
          <Text style={styles.label}>USTAWIENIA</Text>
          <View style={styles.settingOption}>
            <Text>Czy wymaga odpowiedzi?</Text>
            <Switch onValueChange={toggleSwitch3} value={isAnswerRequired} />
          </View>
        </View>
      </ScrollView>
      <View style={styles.footer}>
        <TouchableOpacity onPress={handleGoBack}>
          <Text style={styles.cancelButton}>ANULUJ</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={handleSave}>
          <Text style={styles.saveFooterButton}>ZAPISZ</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: colors.greyBorder,
  },
  closeButton: {
    fontSize: 18,
    color: colors.black,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: colors.blue,
  },
  saveButton: {
    fontSize: 18,
    color: colors.blue,
  },
  content: {
    padding: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: "bold",
    color: colors.black,
    marginBottom: 10,
  },
  questionContentInput: {
    fontSize: 16,
    borderWidth: 1,
    borderColor: colors.greyBorder,
    padding: 15,
    color: colors.black,
    borderRadius: 10,
    marginBottom: 20,
  },
  choiceContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  choiceInput: {
    flex: 1,
    fontSize: 16,
    borderWidth: 1,
    borderColor: colors.greyBorder,
    padding: 15,
    borderRadius: 10,
  },
  deleteButton: {
    marginLeft: 10,
    fontSize: 24,
    color: colors.red,
  },
  addChoiceButton: {
    fontSize: 16,
    color: colors.black,
    paddingVertical: 10,
  },
  settings: {
    marginTop: 20,
  },
  settingOption: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: colors.greyBorder,
  },
  cancelButton: {
    fontSize: 18,
    color: colors.black,
  },
  saveFooterButton: {
    fontSize: 18,
    color: colors.blue,
  },
});

export default DropdownQuestionScreenAdd;
