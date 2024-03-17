import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
} from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import HeaderWithoutPlusCentered from "./HeaderWithoutPlusCentered";
import QuestionTypeModal from "./QuestionTypeModal";
import MyListComponent from "./MyListComponent";
import colors from "./colors";

const CreateSurveyView = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const [modalVisible, setModalVisible] = useState(false);
  const [questions, setQuestions] = useState([]);
  const [name, setSurveyName] = useState("");

  useEffect(() => {
    if (route.params?.name) {
      setSurveyName(route.params.name);
    }

    if (route.params?.resetQuestions) {
      setQuestions([]);
      navigation.setParams({ resetQuestions: false });
    } else if (route.params?.questions) {
      setQuestions(route.params.questions);
    } else if (route.params?.newQuestionData) {
      const newQuestionData = route.params.newQuestionData;
      addQuestion(newQuestionData);
      navigation.setParams({ newQuestionData: null });
    }
  }, [route.params, navigation]);

  const addQuestion = (newQuestionData) => {
    setQuestions((prevQuestions) => [...prevQuestions, newQuestionData]);
  };

  const handleBack = () => {
    navigation.goBack();
  };

  const handleAddQuestion = () => {
    setModalVisible(true);
  };

  const handleQuestionPress = (screenName, questionData, index) => {
    navigation.navigate(screenName, {
      questionData: questionData,
      questionIndex: index,
      questions: questions,
      name: name,
    });
  };

  const handleQuestionSelect = (questionType) => {
    setModalVisible(false);
    navigation.navigate(questionType, {
      questions: questions,
      name: name,
    });
  };

  const handleNext = () => {
    if (questions.length === 0) {
      alert(
        "Nie możesz przejść dalej bez dodania przynajmniej jednego pytania."
      );
    } else {
      navigation.navigate("CreateSurveyNextView", {
        questions: questions,
        name: name,
      });
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <HeaderWithoutPlusCentered title="Tworzenie ankiety 1/2" />
        <View style={styles.buttons}>
          <TouchableOpacity onPress={handleBack} style={styles.button1}>
            <Text style={styles.buttonText1}>{"<"}</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={handleAddQuestion} style={styles.button2}>
            <Text style={styles.buttonText2}>+</Text>
          </TouchableOpacity>
        </View>
        <Text style={styles.surveyTitle}>{name} - pytania</Text>
        <MyListComponent
          items={questions}
          onQuestionPress={handleQuestionPress}
        />
        <TouchableOpacity style={styles.nextButton} onPress={handleNext}>
          <Text style={styles.nextButtonText}>DALEJ</Text>
        </TouchableOpacity>
        <QuestionTypeModal
          modalVisible={modalVisible}
          setModalVisible={setModalVisible}
          onSelect={handleQuestionSelect}
        />
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
    backgroundColor: colors.greyBackground,
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
  button2: {
    width: 40,
    height: 30,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: colors.blue,
  },
  buttonText1: {
    color: colors.greyBorder,
  },
  buttonText2: {
    color: colors.blue,
  },
  surveyTitle: {
    fontSize: 27,
    fontWeight: "bold",
    color: colors.blue,
    textAlign: "center",
    paddingVertical: 20,
  },
  nextButton: {
    backgroundColor: colors.blue,
    padding: 15,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 5,
    marginHorizontal: 10,
    marginBottom: 10,
  },
  nextButtonText: {
    color: colors.white,
    fontSize: 18,
    fontWeight: "bold",
  },
});

export default CreateSurveyView;
