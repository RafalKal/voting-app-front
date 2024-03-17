import React, { useState, useEffect, useContext } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
} from "react-native";
import { useRoute } from "@react-navigation/native";
import { apiService } from "./apiService";
import { AuthContext } from "./AuthContext";
import { decodeJWT } from "./jwtUtils";
import colors from "./colors";
import HeaderWithoutPlus from "./HeaderWithoutPlus";
import { useNavigation } from "@react-navigation/native";

const SurveyResponseDetailsView = () => {
  const route = useRoute();
  const { surveyId } = route.params;
  const [surveyDetails, setSurveyDetails] = useState(null);
  const { userToken } = useContext(AuthContext);
  const navigation = useNavigation();

  useEffect(() => {
    const fetchSurveyDetails = async () => {
      try {
        const decodedToken = decodeJWT(userToken);
        const userId = decodedToken.id;

        const response = await apiService.get(
          `surveys/user/${userId}/responses`
        );
        const surveys = response.data;

        const specificSurveyDetails = surveys.find(
          (survey) => survey.id === parseInt(surveyId, 10)
        );
        setSurveyDetails(specificSurveyDetails);
      } catch (error) {
        console.error("Error fetching survey details:", error);
      }
    };

    if (userToken) {
      fetchSurveyDetails();
    }
  }, [surveyId, userToken]);

  const renderResponses = (questionId) => {
    const responses = surveyDetails.surveyResponses.flatMap((response) =>
      response.questionResponses.filter((qr) => qr.questionId === questionId)
    );

    return responses.map((resp, index) => (
      <Text key={index} style={styles.answerText}>
        {resp.response}
      </Text>
    ));
  };

  const handleBack = () => {
    navigation.goBack();
  };

  return (
    <SafeAreaView style={styles.container}>
      <HeaderWithoutPlus title="Twoja odpowiedź" />
      <View style={styles.buttons}>
        <TouchableOpacity onPress={handleBack} style={styles.button1}>
          <Text style={styles.buttonText1}>{"<"}</Text>
        </TouchableOpacity>
      </View>
      <ScrollView contentContainerStyle={styles.scrollViewContent}>
        {surveyDetails?.questions.map((question, index) => (
          <View key={index} style={styles.responseContainer}>
            <Text style={styles.questionText}>{question.questionContent}</Text>
            {renderResponses(question.questionId)}
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  scrollViewContent: {
    padding: 15,
  },
  responseContainer: {
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "gray",
    padding: 10,
    borderRadius: 5,
  },
  questionText: {
    fontSize: 18,
    marginBottom: 10,
    fontWeight: "bold",
  },
  answerText: {
    fontSize: 16,
    color: colors.darkGrey,
    backgroundColor: "lightgray",
    padding: 10,
    borderRadius: 5,
    marginBottom: 5,
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

export default SurveyResponseDetailsView;
