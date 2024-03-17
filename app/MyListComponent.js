import React from "react";
import { FlatList, TouchableOpacity } from "react-native";
import MultipleChoiceQuestionItem from "./MultipleChoiceQuestionItem";
import DropdownListChoiceQuestionItem from "./DropdownListChoiceQuestionItem";
import TextQuestionItem from "./TextQuestionItem";

const MyListComponent = ({ items, onQuestionPress }) => {
  const renderItem = ({ item, index }) => {
    const handlePress = () => {
      let name;
      switch (item.questionType) {
        case "MULTIPLE_CHOICE":
          name = "MultipleChoiceScreenEdit";
          break;
        case "DROPDOWN_MENU_CHOICE":
          name = "DropdownQuestionScreenEdit";
          break;
        case "TEXT_QUESTION":
          name = "TextQuestionScreenEdit";
          break;
        default:
          return;
      }

      onQuestionPress(name, item, index);
    };

    let Component;
    switch (item.questionType) {
      case "MULTIPLE_CHOICE":
        Component = (
          <MultipleChoiceQuestionItem
            questionContent={item.questionContent}
            choices={item.choices}
            number={index + 1}
          />
        );
        break;
      case "DROPDOWN_MENU_CHOICE":
        Component = (
          <DropdownListChoiceQuestionItem
            questionContent={item.questionContent}
            choices={item.choices}
            number={index + 1}
          />
        );
        break;
      case "TEXT_QUESTION":
        Component = (
          <TextQuestionItem
            questionContent={item.questionContent}
            choices={item.choices}
            number={index + 1}
          />
        );
        break;
      default:
        return null;
    }

    return (
      <TouchableOpacity onPress={handlePress}>{Component}</TouchableOpacity>
    );
  };

  return (
    <FlatList
      data={items}
      keyExtractor={(item, index) => index.toString()}
      renderItem={renderItem}
    />
  );
};

export default MyListComponent;
