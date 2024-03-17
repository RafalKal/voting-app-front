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

const TextQuestionScreenAdd = () => {
  const [questionContent, setQuestionContent] = useState("");
  const [isAnswerRequired, setIsAnswerRequired] = useState(false);

  const route = useRoute();
  const questionsFromCreateSurvey = route.params?.questions || [];
  const surveyNameFromCreateSurvey = route.params?.name || "";

  const questionData = {
    questionContent: questionContent,
    questionType: "TEXT_QUESTION",
    isAnswerRequired: isAnswerRequired,
    answerTemplate: ".",
  };

  const navigation = useNavigation();

  const handleSave = () => {
    const trimmedQuestionContent = questionContent.trim();
  
    if (!trimmedQuestionContent) {
      alert("Pytanie musi zawierać treść.");
      return;
    }
  
    const updatedQuestionData = {
      ...questionData,
      questionContent: trimmedQuestionContent,
    };
  
    const updatedQuestions = [...questionsFromCreateSurvey, updatedQuestionData];
    navigation.navigate("CreateSurveyView", {
      questions: updatedQuestions,
      name: surveyNameFromCreateSurvey,
    });
  };
  

  const toggleSwitch = () =>
    setIsAnswerRequired((previousState) => !previousState);

  const handleGoBack = () => {
    navigation.goBack();
  };

  useEffect(() => {
    return () => {
      setQuestionContent("");
      setIsAnswerRequired(false);
    };
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={handleGoBack}>
          <Text style={styles.closeButton}>×</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Odpowiedź tekstowa</Text>
        <TouchableOpacity onPress={handleSave}>
          <Text style={styles.saveButton}>ZAPISZ</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content}>
        <Text style={styles.label}>TREŚĆ PYTANIA</Text>
        <TextInput
          style={styles.questionContentInput}
          value={questionContent}
          placeholder="Wprowadz pytanie..."
          placeholderTextColor={colors.greyBorder}
          onChangeText={setQuestionContent}
        />
        <View style={styles.switchContainer}>
          <Text>Czy pytanie wymaga odpowiedzi?</Text>
          <Switch onValueChange={toggleSwitch} value={isAnswerRequired} />
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
  switchContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginVertical: 20,
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
    color: colors.blue,
  },
  saveFooterButton: {
    fontSize: 18,
    color: colors.blue,
  },
});

export default TextQuestionScreenAdd;
