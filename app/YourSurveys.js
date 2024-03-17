import React, { useState, useEffect, useContext, useCallback } from "react";
import { StyleSheet, ScrollView, View, SafeAreaView } from "react-native";
import ExpandableListView from "./ExpandableListView";
import SearchBar from "./SearchBar";
import HeaderWithPlus from "./HeaderWithPlus";
import NewSurveyModal from "./NewSurveyModal";
import colors from "./colors";
import { AuthContext } from "./AuthContext";
import { apiService } from "./apiService";
import { decodeJWT } from "./jwtUtils";
import { useFocusEffect } from "@react-navigation/native";
import { useRefresh } from "./RefreshContext";
import { useNavigation } from "@react-navigation/native";

const YourSurveys = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedState, setExpandedState] = useState({});
  const [isModalVisible, setModalVisible] = useState(false);
  const [data, setData] = useState([]);
  const { userToken } = useContext(AuthContext);
  const { needsRefresh1, setNeedsRefresh1 } = useRefresh();
  const navigation = useNavigation();

  const fetchData = useCallback(async () => {
    if (!userToken) return;
    const { id: userId } = decodeJWT(userToken);
    try {
      const { data: queryData, status } = await apiService.get(
        `/surveys/author/${userId}`
      );
      if (status === 204) return setData([]);
      setData(
        queryData.reduce(
          (
            acc,
            {
              id,
              responderInformationScope,
              name,
              questions,
              active,
              surveyResponses,
              organisationId,
              organisationName,
            }
          ) => {
            const foundOrg = acc.find(
              (item) => item.organisationId === organisationId
            );
            const surveyDetails = {
              id,
              responderInformationScope,
              name,
              state: active ? "active" : "inactive",
              surveyResponses,
              organisationName,
              questionsQuantity: questions.length,
            };
            if (foundOrg) {
              foundOrg.surveys.push(surveyDetails);
            } else {
              acc.push({
                organisationId,
                organisationName,
                surveys: [surveyDetails],
              });
            }
            return acc;
          },
          []
        )
      );
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  }, [userToken]);

  useFocusEffect(
    useCallback(() => {
      if (needsRefresh1) {
        fetchData();
        setNeedsRefresh1(false);
      }
    }, [needsRefresh1, fetchData])
  );

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleSearch = (query) => setSearchQuery(query.toLowerCase());

  const toggleExpand = (organisationName) =>
    setExpandedState((prevState) => ({
      ...prevState,
      [organisationName]: !prevState[organisationName],
    }));

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

  const navigateToSurveyResults = (surveyId, responderInformationScope) => {
    const routeName =
      {
        ANONYMOUS: "SurveyResultsAnonymous",
        PARTIAL: "SurveyResultsWithPartialInfo",
        FULL: "SurveyResultsWithFullInfo",
      }[responderInformationScope] || console.error("Unknown responderInformationScope:", responderInformationScope);
    if (routeName) navigation.navigate(routeName, { surveyId });
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <HeaderWithPlus title="Your Surveys" onAddPress={() => setModalVisible(true)} />
        <SearchBar onSearch={handleSearch} />
        <ScrollView style={styles.operationArea}>
          {filteredData.map((item, index) => (
            <ExpandableListView
              key={index}
              {...item}
              onToggleExpand={() => toggleExpand(item.organisationName)}
              onPressSurvey={navigateToSurveyResults}
              type="v1"
            />
          ))}
        </ScrollView>
        <NewSurveyModal isVisible={isModalVisible} onClose={() => setModalVisible(false)} />
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

export default YourSurveys;
