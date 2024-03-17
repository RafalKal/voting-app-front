import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
} from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import { apiService } from "./apiService";
import color from "./colors";
import ProgressBar from "react-native-progress/Bar";
import HeaderWithoutPlusCentered from "./HeaderWithoutPlusCentered";

const SurveyResultsAnonymous = () => {
  const [surveyResults, setSurveyResults] = useState([]);
  const route = useRoute();
  const navigation = useNavigation();
  const { surveyId } = route.params;

  useEffect(() => {
    const fetchSurveyResults = async () => {
      try {
        const response = await apiService.get(`/surveys/${surveyId}/results`);
        setSurveyResults(response.data);
      } catch (error) {
        console.error("Error fetching survey results:", error);
      }
    };
    fetchSurveyResults();
  }, [surveyId]);

  const handleBack = () => {
    navigation.goBack();
  };

  const totalResponses = (question) =>
    Object.values(question.responses).reduce((acc, count) => acc + count, 0);

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <HeaderWithoutPlusCentered title="Wyniki ankiety" />
        <View style={styles.buttons}>
          <TouchableOpacity onPress={handleBack} style={styles.button1}>
            <Text style={styles.buttonText1}>{"<"}</Text>
          </TouchableOpacity>
        </View>
        <ScrollView style={styles.container}>
          {surveyResults.map((question, index) => (
            <View key={index} style={styles.questionContainer}>
              <Text style={styles.questionContent}>
                {question.questionContent}
              </Text>
              <View style={styles.responsesContainer}>
                {Object.entries(question.responses).map(
                  ([response, count], index) => {
                    const total = totalResponses(question);
                    const progress = total > 0 ? count / total : 0;
                    return (
                      <View key={index} style={styles.responseRow}>
                        <Text style={styles.responseText}>
                          {response}: {count}
                        </Text>
                        <ProgressBar
                          progress={progress}
                          width={null}
                          color={colors.blue}
                        />
                      </View>
                    );
                  }
                )}
              </View>
            </View>
          ))}
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

const colors = {
  background: "#F5F5F5",
  white: "#FFFFFF",
  text: "#333333",
  blue: color.blue,
  greyLight: "#e1e1e1",
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  container: {
    flex: 1,
    paddingVertical: 20,
    paddingHorizontal: 10,
  },
  questionContainer: {
    backgroundColor: colors.white,
    borderRadius: 10,
    padding: 20,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
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
    borderColor: color.greyBorder,
  },
  buttonText1: {
    color: color.greyBorder,
  },
  questionContent: {
    fontSize: 18,
    fontWeight: "bold",
    color: colors.text,
    marginBottom: 15,
  },
  responsesContainer: {
    marginTop: 10,
  },
  responseRow: {
    marginBottom: 10,
  },
  responseText: {
    fontSize: 16,
    color: colors.text,
    marginBottom: 5,
  },
  progressView: {
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.greyLight,
  },
});

export default SurveyResultsAnonymous;
