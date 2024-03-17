import React, { useState, useEffect, useContext, useCallback } from "react";
import { StyleSheet, ScrollView, View, SafeAreaView } from "react-native";
import ExpandableListView from "./ExpandableListView";
import SearchBar from "./SearchBar";
import HeaderWithoutPlus from "./HeaderWithoutPlus";
import NewSurveyModal from "./NewSurveyModal";
import colors from "./colors";
import { AuthContext } from "./AuthContext";
import { apiService } from "./apiService";
import { decodeJWT } from "./jwtUtils";
import { useFocusEffect } from "@react-navigation/native";
import { useRefresh } from "./RefreshContext";
import { useNavigation } from "@react-navigation/native";

const AnswersHistory = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedState, setExpandedState] = useState({});
  const [isModalVisible, setModalVisible] = useState(false);
  const [data, setData] = useState([]);
  const { userToken } = useContext(AuthContext);
  const { needsRefresh2, setNeedsRefresh2 } = useRefresh();

  const navigation = useNavigation();

  const fetchData = useCallback(async () => {
    if (!userToken) return;

    const decodedToken = decodeJWT(userToken);
    const userId = decodedToken.id;

    try {
      const response = await apiService.get(`surveys/user/${userId}/responses`);

      if (response.status === 204) {
        setData([]);
        return;
      }
      const queryData = response.data;

      const processedData = queryData.reduce((acc, survey) => {
        const {
          id,
          name,
          questions,
          active,
          surveyResponses,
          organisationId,
          organisationName,
        } = survey;
        const foundOrg = acc.find(
          (item) => item.organisationId === organisationId
        );

        if (foundOrg) {
          foundOrg.surveys.push({
            id,
            name,
            state: active ? "active" : "inactive",
            surveyResponses,
            organisationName,
            questionsQuantity: questions.length,
          });
        } else {
          acc.push({
            organisationId,
            organisationName,
            surveys: [
              {
                id,
                name,
                state: active ? "active" : "inactive",
                surveyResponses,
                organisationName,
                questionsQuantity: questions.length,
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
  });

  useFocusEffect(
    useCallback(() => {
      if (needsRefresh2) {
        fetchData();

        setNeedsRefresh2(false);
      }
    }, [needsRefresh2, fetchData])
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
      ? group.surveys.some((survey) =>
          survey.name.toLowerCase().includes(searchQuery)
        )
      : expandedState[group.organisationName];

    return {
      ...group,
      surveys: group.surveys.filter((survey) =>
        survey.name.toLowerCase().includes(searchQuery)
      ),
      isExpanded,
    };
  });

  const handlePressSurvey = (surveyId) => {
    navigation.navigate("SurveyResponseDetailsView", { surveyId });
  };

  const openModal = () => {
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
  };

  const handleCreateSurvey = () => {
    closeModal();
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <HeaderWithoutPlus title="Historia odpowiedzi" onAddPress={openModal} />
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
              onPressSurvey={handlePressSurvey}
              type="v3"
            />
          ))}
        </ScrollView>
        <NewSurveyModal isVisible={isModalVisible} onClose={closeModal} />
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

export default AnswersHistory;
