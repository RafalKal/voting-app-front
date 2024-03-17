import React, { useContext } from "react";
import { View, ActivityIndicator } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import MainApp from "./MainApp";
import { AuthContext } from "./AuthContext";
import AuthScreen from "./AuthScreen";
import CreateSurveyView from "./CreateSurveyView";
import MultipleChoiceScreenAdd from "./MultipleChoiceScreenAdd";
import TextQuestionScreenAdd from "./TextQuestionScreenAdd";
import DropdownQuestionScreenAdd from "./DropdownQuestionScreenAdd";
import AuthTextInput from "./AuthTextInput";
import CreateSurveyNextView from "./CreateSurveyNextView";
import DropdownListChoiceQuestionItem from "./DropdownListChoiceQuestionItem";
import DropdownQuestionScreenEdit from "./DropdownQuestionScreenEdit";
import ExpandableListView from "./ExpandableListView";
import HeaderWithoutPlus from "./HeaderWithoutPlus";
import HeaderWithoutPlusCentered from "./HeaderWithoutPlusCentered";
import HeaderWithPlus from "./HeaderWithPlus";
import MultipleChoiceQuestionItem from "./MultipleChoiceQuestionItem";
import MultipleChoiceScreenEdit from "./MultipleChoiceScreenEdit";
import MyListComponent from "./MyListComponent";
import NewSurveyModal from "./NewSurveyModal";
import QuestionTypeModal from "./QuestionTypeModal";
import SearchBar from "./SearchBar";
import Settings from "./Settings";
import SurveyRow_v1 from "./SurveyRow_v1";
import SurveyRow_v2 from "./SurveyRow_v2";
import SurveysForYou from "./SurveysForYou";
import TextQuestionItem from "./TextQuestionItem";
import TextQuestionScreenEdit from "./TextQuestionScreenEdit";
import YourSurveys from "./YourSurveys";
import OrganisationListView from "./OrganisationListView";
import CreateOrganisationView from "./CreateOrganisationView";
import EditOrganisationView from "./EditOrganisationView";
import SurveyResultsAnonymous from "./SurveyResultsAnonymous";
import SurveyResultsWithPartialInfo from "./SurveyResultsWithPartialInfo";
import SurveyResultsWithFullInfo from "./SurveyResultsWithFullInfo";
import SubmitSurveyResponseView from "./SubmitSurveyResponseView";
import AccountEditView from "./AccountEditView";
import PasswordModal from "./PasswordModal";
import SurveyResponseDetailsView from "./SurveyResponseDetailsView";


const Stack = createStackNavigator();

const AppNav = () => {
  const { isLoading, userToken } = useContext(AuthContext);

  if (isLoading) {
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <ActivityIndicator size={"large"}></ActivityIndicator>
    </View>;
  }

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {userToken ? (
          <>
          
            <Stack.Screen name="MainApp" component={MainApp} />

            <Stack.Screen name="CreateSurveyView"component={CreateSurveyView} />
            <Stack.Screen name="AuthTextInput" component={AuthTextInput} />
            <Stack.Screen name="CreateSurveyNextView" component={CreateSurveyNextView} />
            <Stack.Screen name="DropdownListChoiceQuestionItem" component={DropdownListChoiceQuestionItem} />
            <Stack.Screen name="DropdownQuestionScreenAdd" component={DropdownQuestionScreenAdd} />
            <Stack.Screen name="DropdownQuestionScreenEdit" component={DropdownQuestionScreenEdit} />
            <Stack.Screen name="ExpandableListView" component={ExpandableListView} />
            <Stack.Screen name="HeaderWithoutPlus" component={HeaderWithoutPlus} />
            <Stack.Screen name="HeaderWithoutPlusCentered" component={HeaderWithoutPlusCentered} />
            <Stack.Screen name="HeaderWithPlus" component={HeaderWithPlus} />
            <Stack.Screen name="MultipleChoiceQuestionItem" component={MultipleChoiceQuestionItem} />
            <Stack.Screen name="MultipleChoiceScreenAdd" component={MultipleChoiceScreenAdd} />
            <Stack.Screen name="MultipleChoiceScreenEdit" component={MultipleChoiceScreenEdit} />
            <Stack.Screen name="MyListComponent" component={MyListComponent} />
            <Stack.Screen name="NewSurveyModal" component={NewSurveyModal} />
            <Stack.Screen name="QuestionTypeModal" component={QuestionTypeModal} />
            <Stack.Screen name="SearchBar" component={SearchBar} />
            <Stack.Screen name="Settings" component={Settings} />
            <Stack.Screen name="SurveyRow_v1" component={SurveyRow_v1} />
            <Stack.Screen name="SurveyRow_v2" component={SurveyRow_v2} />
            <Stack.Screen name="SurveysForYou" component={SurveysForYou} />
            <Stack.Screen name="TextQuestionItem" component={TextQuestionItem} />
            <Stack.Screen name="TextQuestionScreenAdd" component={TextQuestionScreenAdd} />
            <Stack.Screen name="TextQuestionScreenEdit" component={TextQuestionScreenEdit} />
            <Stack.Screen name="YourSurveys" component={YourSurveys} />
            <Stack.Screen name="OrganisationListView" component={OrganisationListView} />
            <Stack.Screen name="CreateOrganisationView" component={CreateOrganisationView} />
            <Stack.Screen name="EditOrganisationView" component={EditOrganisationView} />
            <Stack.Screen name="SurveyResultsAnonymous" component={SurveyResultsAnonymous} />
            <Stack.Screen name="SurveyResultsWithPartialInfo" component={SurveyResultsWithPartialInfo} />
            <Stack.Screen name="SurveyResultsWithFullInfo" component={SurveyResultsWithFullInfo} />
            <Stack.Screen name="SubmitSurveyResponseView" component={SubmitSurveyResponseView} />
            <Stack.Screen name="AccountEditView" component={AccountEditView} />
            <Stack.Screen name="PasswordModal" component={PasswordModal} />
            <Stack.Screen name="SurveyResponseDetailsView" component={SurveyResponseDetailsView} />
          </>
        ) : (
          <Stack.Screen name="AuthScreen" component={AuthScreen} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNav;

