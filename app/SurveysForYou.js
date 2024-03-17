import React, { useState, useEffect, useContext, useCallback } from "react";
import {
  StyleSheet,
  ScrollView,
  View,
  SafeAreaView,
  Text,
  TouchableOpacity,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import ExpandableListView from "./ExpandableListView";
import SearchBar from "./SearchBar";
import HeaderWithoutPlus from "./HeaderWithoutPlus";
import NewSurveyModal from "./NewSurveyModal";
import PasswordModal from "./PasswordModal";
import colors from "./colors";
import { AuthContext } from "./AuthContext";
import { decodeJWT } from "./jwtUtils";
import { useFocusEffect } from "@react-navigation/native";
import { useRefresh } from "./RefreshContext";
import { apiService } from "./apiService";

const SurveysForYou = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedState, setExpandedState] = useState({});
  const [isModalVisible, setModalVisible] = useState(false);
  const [isPasswordModalVisible, setPasswordModalVisible] = useState(false);
  const [selectedSurvey, setSelectedSurvey] = useState(null);
  const [password, setPassword] = useState("");
  const [data, setData] = useState([]);
  const { userToken } = useContext(AuthContext);
  const { needsRefresh3, setNeedsRefresh3 } = useRefresh();

  const navigation = useNavigation();

  const fetchData = useCallback(async () => {
    if (!userToken) return;

    const decodedToken = decodeJWT(userToken);
    const userId = decodedToken.id;

    try {
      const response = await apiService.get(
        `/surveys/user/${userId}/organisations`
      );

      if (response.status === 204) {
        setData([]);
        return;
      }

      const queryData = response.data;

      const processedData = queryData.reduce((acc, survey) => {
        const {
          id,
          responderInformationScope, 
          name,
          questions,
          active,
          surveyResponses,
          organisationId,
          organisationName,
          passwordRestriction,
          password,
        } = survey;
        const foundOrg = acc.find(
          (item) => item.organisationId === organisationId
        );

        if (foundOrg) {
          foundOrg.surveys.push({
            id,
            responderInformationScope, 
            name,
            state: active ? "active" : "inactive",
            surveyResponses,
            organisationName,
            passwordRestriction,
            password,
            questionsQuantity: questions.length,
            questions: questions,
          });
        } else {
          acc.push({
            organisationId,
            organisationName,
            surveys: [
              {
                id,
                responderInformationScope, 
                name,
                state: active ? "active" : "inactive",
                surveyResponses,
                organisationName,
                passwordRestriction,
                password,
                questionsQuantity: questions.length,
                questions: questions,
              },
            ],
          });
        }

        return acc;
      }, []);

      setData(processedData);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  }, [userToken]);

  useFocusEffect(
    useCallback(() => {
      if (needsRefresh3) {
        fetchData();
        setNeedsRefresh3(false);
      }
    }, [needsRefresh3])
  );

  useEffect(() => {
    fetchData();
  }, [userToken]);

  const handleSearch = (query) => {
    setSearchQuery(query.toLowerCase());
  };

  const toggleExpand = (organisationName) => {
    setExpandedState((prevState) => ({
      ...prevState,
      [organisationName]: !prevState[organisationName],
    }));
  };

  const filteredData = data.map((group) => {
    const isExpanded = searchQuery
      ? group.surveys.some(
          (survey) =>
            survey.name.toLowerCase().includes(searchQuery) &&
            survey.state === "active"
        )
      : expandedState[group.organisationName];

    return {
      ...group,
      surveys: group.surveys.filter(
        (survey) =>
          survey.name.toLowerCase().includes(searchQuery) &&
          survey.state === "active"
      ),
      isExpanded,
    };
  });

  const checkIfUserHasResponded = async (surveyId) => {
    const decodedToken = decodeJWT(userToken);
    const userId = decodedToken.id;
    try {
      const response = await apiService.get(
        `/surveys/${surveyId}/user/${userId}/hasResponded`
      );
      return response.data;
    } catch (error) {
      console.error(
        "Błąd podczas sprawdzania czy użytkownik zagłosował już na tę ankietę:",
        error
      );
      throw error;
    }
  };

  const openModal = () => {
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
  };

  const getSurveyInfoById = (surveyId) => {
    let surveyInfo = null;
    for (const group of data) {
      for (const survey of group.surveys) {
        if (survey.id === surveyId) {
          surveyInfo = survey;
          break;
        }
      }
      if (surveyInfo) break;
    }

    return surveyInfo;
  };

  const handleSurveySelect = async (surveyId) => {
    try {
      const hasResponded = await checkIfUserHasResponded(surveyId);
      if (hasResponded) {
        alert("Już odpowiedziałeś/aś na tę ankietę.");
      } else {
        const survey = getSurveyInfoById(surveyId);
        if (survey) {
          if (survey.passwordRestriction) {
            setSelectedSurvey(survey);
            setPasswordModalVisible(true);
          } else {
            navigation.navigate("SubmitSurveyResponseView", {
              id: surveyId,
              questions: survey.questions,
              responderInformationScope: survey.responderInformationScope
            });
          }
        }
      }
    } catch (error) {
      console.error(
        "Nie udało się sprawdzić, czy użytkownik odpowiedział na ankietę:",
        error
      );
      alert("Wystąpił problem przy sprawdzaniu odpowiedzi na ankietę.");
    }
  };

  const confirmPassword = (inputPassword) => {
    if (inputPassword === selectedSurvey.password) {
      navigation.navigate("SubmitSurveyResponseView", {
        id: selectedSurvey.id,
        questions: selectedSurvey.questions,
      });
    } else {
      alert("Niepoprawne hasło");
    }
    setPasswordModalVisible(false);
    setSelectedSurvey(null);
    setPassword("");
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <HeaderWithoutPlus title="Ankiety dla Ciebie" onAddPress={openModal} />
        <SearchBar onSearch={handleSearch} />
        <ScrollView style={styles.operationArea}>
          {filteredData.map((item, index) => (
            <ExpandableListView
              key={index}
              organisationName={item.organisationName}
              surveys={item.surveys}
              isExpanded={
                item.isExpanded !== undefined
                  ? item.isExpanded
                  : expandedState[item.organisationName]
              }
              onToggleExpand={() => toggleExpand(item.organisationName)}
              onPressSurvey={handleSurveySelect}
              type="v2"
            />
          ))}
        </ScrollView>
        <NewSurveyModal isVisible={isModalVisible} onClose={closeModal} />
        <PasswordModal
          isVisible={isPasswordModalVisible}
          onClose={() => setPasswordModalVisible(false)}
          onConfirm={confirmPassword}
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
  operationArea: {
    flex: 1,
    padding: 10,
  },
});

export default SurveysForYou;
