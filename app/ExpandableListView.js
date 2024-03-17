import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import SurveyRow_v1 from "./SurveyRow_v1";
import SurveyRow_v2 from "./SurveyRow_v2";
import SurveyRow_v3 from "./SurveyRow_v3";
import colors from "./colors";

const ExpandableListView = ({
  organisationName,
  surveys,
  isExpanded,
  onToggleExpand,
  onPressSurvey,
  type,
}) => {
  const renderSurveyRow = (survey, index) => {
    if (type === "v1") {
      return (
        <SurveyRow_v1 key={index} survey={survey} onPress={() => onPressSurvey(survey.id, survey.responderInformationScope)} />
        );
    } else if (type === "v2") {
      return <SurveyRow_v2 key={index} survey={survey} onPress={() => onPressSurvey(survey.id, survey.questions, survey.responderInformationScope)} />;
    } else if (type === "v3") {
      return <SurveyRow_v3 key={index} survey={survey} onPress={() => onPressSurvey(survey.id)} />;
    }
    <SurveyRow_v1 key={index} survey={survey} onPress={() => onPressSurvey(survey.id, survey.responderInformationScope)} />
  };

  return (
    <View>
      <TouchableOpacity style={styles.row} onPress={onToggleExpand}>
        <Text style={styles.title}>{organisationName}</Text>
        <Text style={styles.symbol}>{isExpanded ? "▲" : "▼"}</Text>
      </TouchableOpacity>
      {isExpanded && (
        <View style={styles.subItemContainer}>
          {surveys.map((survey, index) => renderSurveyRow(survey, index))}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: colors.white,
    borderColor: colors.greyBorder,
    borderWidth: 2,
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  title: {
    color: colors.blue,
    fontSize: 20,
  },
  symbol: {
    color: colors.blue,
    fontSize: 20,
  },
  subItemContainer: {
    backgroundColor: colors.white,
  },
  subItem: {
    padding: 10,
    backgroundColor: colors.white,
    borderBottomColor: colors.greyBorder,
    borderBottomWidth: 1,
  },
});

export default ExpandableListView;
