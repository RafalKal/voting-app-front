import React, { useState, useEffect, useContext } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  TextInput,
  Alert,
  SafeAreaView,
} from "react-native";
import { useRoute, useNavigation } from "@react-navigation/native";
import HeaderWithoutPlus from "./HeaderWithoutPlus";
import { apiService } from "./apiService";
import { decodeJWT } from "./jwtUtils";
import { AuthContext } from "./AuthContext";
import { Picker } from "@react-native-picker/picker";
import colors from "./colors";

const SubmitSurveyResponseView = () => {
  const navigation = useNavigation();
  const { params } = useRoute();
  const { userToken } = useContext(AuthContext);

  const [responses, setResponses] = useState(
    params.questions
      ? params.questions.map((question) => ({
          questionId: question.questionId,
          response: "",
        }))
      : []
  );

  useEffect(() => {
    if (params.questions) {
      setResponses(
        params.questions.map((question) => ({
          questionId: question.questionId,
          response: "",
        }))
      );
    }
  }, [params.questions]);

  const handleInputChange = (text, questionId) => {
    setResponses((currentResponses) =>
      currentResponses.map((resp) =>
        resp.questionId === questionId ? { ...resp, response: text } : resp
      )
    );
  };

  const handleBack = () => {
    navigation.goBack();
  };

  const handleSubmit = async () => {
    const allRequiredAnswered = params.questions.every((question) => {
      if (!question.isAnswerRequired) {
        return true;
      }
      const response = responses.find((r) => r.questionId === question.questionId);
      return response && response.response.trim() !== "";
    });
  
    if (!allRequiredAnswered) {
      Alert.alert("Uwaga", "Proszę odpowiedzieć na wszystkie wymagane pytania.");
      return;
    }
  
    const filteredResponses = responses.filter((response) => {
      const correspondingQuestion = params.questions.find(q => q.questionId === response.questionId);
      return correspondingQuestion.isAnswerRequired || response.response.trim() !== "";
    });
  
    try {
      const decodedToken = decodeJWT(userToken);
      const userId = decodedToken.id;
  
      const surveyId = params.id;
      const requestBody = {
        surveyId,
        userId,
        questionResponses: filteredResponses,
      };
  
      await apiService.post(`/surveys/surveys/${surveyId}/responses`, requestBody);
      Alert.alert("Odpowiedź wysłana", "Twoje odpowiedzi zostały zapisane.");
      navigation.goBack();
    } catch (error) {
      console.error("Error submitting survey response:", error);
      Alert.alert("Błąd", "Nie udało się wysłać odpowiedzi.");
    }
  };
  

  return (
    <SafeAreaView style={styles.container}>
      <HeaderWithoutPlus title="Odpowiedz na ankietę" />
      <View style={styles.buttons}>
        <TouchableOpacity onPress={handleBack} style={styles.button1}>
          <Text style={styles.buttonText1}>{"<"}</Text>
        </TouchableOpacity>
      </View>
      <ScrollView>
        {params.questions
          ? params.questions.map((question, index) => (
              <View key={question.questionId} style={styles.questionContainer}>
                <Text style={styles.questionText}>
                  {question.questionContent}
                </Text>
                {question.questionType === "TEXT_QUESTION" && (
                  <TextInput
                    style={styles.input}
                    onChangeText={(text) =>
                      handleInputChange(text, question.questionId)
                    }
                    value={
                      responses.find(
                        (resp) => resp.questionId === question.questionId
                      )?.response
                    }
                    placeholder="Twoja odpowiedź"
                  />
                )}
                {question.questionType === "MULTIPLE_CHOICE" &&
                  question.choices &&
                  question.choices.map((choice, choiceIndex) => {
                    const isSelected =
                      responses.find(
                        (resp) => resp.questionId === question.questionId
                      )?.response === choice;
                    return (
                      <TouchableOpacity
                        key={choiceIndex}
                        style={
                          isSelected
                            ? styles.selectedChoiceButton
                            : styles.choiceButton
                        }
                        onPress={() =>
                          handleInputChange(choice, question.questionId)
                        }
                      >
                        <Text style={styles.choiceText}>{choice}</Text>
                      </TouchableOpacity>
                    );
                  })}
                {question.questionType === "DROPDOWN_MENU_CHOICE" && (
                  <View style={styles.dropdownContainer}>
                    <Picker
                      selectedValue={
                        responses.find(
                          (resp) => resp.questionId === question.questionId
                        )?.response
                      }
                      onValueChange={(itemValue) =>
                        handleInputChange(itemValue, question.questionId)
                      }
                      style={styles.dropdown}
                    >
                      {question.choices &&
                        question.choices.map((choice, choiceIndex) => (
                          <Picker.Item
                            label={choice}
                            value={choice}
                            key={choiceIndex}
                          />
                        ))}
                    </Picker>
                  </View>
                )}
              </View>
            ))
          : null}
      </ScrollView>

      <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
        <Text style={styles.submitButtonText}>Prześlij</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  questionContainer: {
    marginBottom: 20,
  },
  questionText: {
    fontSize: 18,
    marginBottom: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: "gray",
    paddingHorizontal: 10,
    paddingVertical: 5,
    marginBottom: 10,
  },
  choiceButton: {
    marginBottom: 5,
    padding: 10,
    backgroundColor: "lightgray",
    borderRadius: 5,
  },
  selectedChoiceButton: {
    marginBottom: 5,
    padding: 10,
    backgroundColor: colors.blue,
    borderRadius: 5,
  },
  choiceText: {
    fontSize: 16,
  },
  submitButton: {
    backgroundColor: colors.blue,
    padding: 15,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 5,
    marginTop: 10,
  },
  submitButtonText: {
    color: colors.white,
    fontSize: 18,
    fontWeight: "bold",
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
});

export default SubmitSurveyResponseView;
