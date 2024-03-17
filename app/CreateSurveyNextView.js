import React, { useState, useEffect, useContext } from "react";
import {
  View,
  Text,
  Switch,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  Alert,
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { useNavigation, useRoute } from "@react-navigation/native";
import HeaderWithoutPlusCentered from "./HeaderWithoutPlusCentered";
import { AuthContext } from "./AuthContext";
import RNPickerSelect from "react-native-picker-select";
import colors from "./colors";
import moment from "moment";
import { apiService } from "./apiService";
import { useRefresh } from "./RefreshContext";
import { decodeJWT } from "./jwtUtils";

const CreateSurveyNextView = () => {
  const { userToken } = useContext(AuthContext);

  const navigation = useNavigation();
  const route = useRoute();
  const [name, setSurveyName] = useState("");
  const [authorId, setAuthorId] = useState(null);
  const [organisationId, setOrganizationId] = useState("");
  const [passwordRestriction, setPasswordRestriction] = useState(false);
  const [password, setPassword] = useState("");
  const [passwordVisibility, setPasswordVisibility] = useState(true);
  const [responderInformationScope, setResponderInformationScope] =
    useState(null);
  const [isDeadlined, setIsDeadlined] = useState(false);
  const [deadline, setDeadline] = useState(false);
  const [questions, setQuestions] = useState([]);

  const [organisations, setOrganisations] = useState([]);

  const [date, setDate] = useState(new Date());
  const [mode, setMode] = useState("date");
  const [show, setShow] = useState(false);

  const [dateDisplay, setDateDisplay] = useState("Wybierz datę");
  const [timeDisplay, setTimeDisplay] = useState("Wybierz godzinę");

  const { setNeedsRefresh1 } = useRefresh();
  const { setNeedsRefresh3 } = useRefresh();

  useEffect(() => {
    if (userToken) {
      const decodedToken = decodeJWT(userToken);
      const userId = decodedToken.id;
      setAuthorId(userId);
      fetchOrganisations(userId);
    }
  }, [userToken]);

  const fetchOrganisations = async (userId) => {
    try {
      const response = await apiService.get(`/organisations/user/${userId}`);
      const organisationsData = response.data || [];
      setOrganisations(organisationsData);

      if (organisationsData.length === 0) {
        Alert.alert(
          "Brak organizacji",
          "Nie możesz utworzyć ankiety, ponieważ nie należysz do żadnej organizacji.",
          [
            {
              text: "OK",
              onPress: () => navigation.popToTop(),
            },
          ]
        );
      }
    } catch (error) {
      console.error("Error fetching organisations:", error);
    }
  };

  const createSurvey = async () => {
    const trimmedPassword = password.trim();

    if (!responderInformationScope) {
      Alert.alert("Błąd", "Proszę wybrać widoczność głosujących.");
      return;
    }

    if (!organisationId) {
      Alert.alert("Błąd", "Proszę wybrać organizację.");
      return;
    }

    if (passwordRestriction && !trimmedPassword) {
      Alert.alert("Błąd", "Proszę podać hasło dla ankiety.");
      return;
    }

    const formattedDeadline = isDeadlined
      ? `${dateDisplay}T${timeDisplay}`
      : null;
    const requestData = {
      name: name,
      authorId: authorId,
      organisationId: organisationId,
      passwordRestriction: passwordRestriction,
      password: password,
      responderInformationScope: responderInformationScope,
      isDeadlined: isDeadlined,
      deadline: formattedDeadline,
      questions: questions,
    };

    try {
      const response = await apiService.post("/surveys", requestData);
      console.log("Survey created successfully:", response);
      setNeedsRefresh1(true);
      setNeedsRefresh3(true);
      navigation.popToTop();
    } catch (error) {
      console.error("Failed to create survey:", error);
    }
  };

  const toggleSwitch1 = () =>
    setPasswordRestriction((previousState) => !previousState);

  const toggleSwitch4 = () => setIsDeadlined((previousState) => !previousState);

  useEffect(() => {
    if (route.params?.name) {
      setSurveyName(route.params.name);
    }

    if (route.params?.resetQuestions) {
      setQuestions([]);
      navigation.setParams({ resetQuestions: false });
    } else if (route.params?.questions) {
      setQuestions(route.params.questions);
    }
  }, [route.params, navigation]);

  const handleBack = () => {
    navigation.goBack();
  };

  const handlePasswordVisibilityToggle = () => {
    setPasswordVisibility(!passwordVisibility);
  };

  const onChange = (event, selectedDate) => {
    const currentDate = selectedDate || date;
    setShow(Platform.OS === "ios");
    setDate(currentDate);

    const newDateDisplay = moment(currentDate).format("YYYY-MM-DD");
    const newTimeDisplay = moment(currentDate).format("HH:mm:ss");
    setDateDisplay(newDateDisplay);
    setTimeDisplay(newTimeDisplay);
  };

  const showMode = (currentMode) => {
    setShow(true);
    setMode(currentMode);
  };

  const showDatepicker = () => {
    showMode("date");
  };

  const showTimepicker = () => {
    showMode("time");
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <HeaderWithoutPlusCentered title="Tworzenie ankiety 2/2" />
        <View style={styles.buttons}>
          <TouchableOpacity onPress={handleBack} style={styles.button1}>
            <Text style={styles.buttonText1}>{"<"}</Text>
          </TouchableOpacity>
        </View>
        <ScrollView contentContainerStyle={styles.scrollViewContainer}>
          <Text style={styles.surveyTitle}>{name} - ustawienia</Text>

          <View style={styles.settingOption}>
            <Text>Czy ankieta zabezpieczona hasłem</Text>
            <Switch onValueChange={toggleSwitch1} value={passwordRestriction} />
          </View>

          {passwordRestriction && (
            <View style={styles.passwordInputContainer}>
              <TextInput
                style={styles.passwordInput}
                value={password}
                onChangeText={setPassword}
                secureTextEntry={passwordVisibility}
                placeholder="Wprowadź hasło..."
              />
              <TouchableOpacity onPress={handlePasswordVisibilityToggle}>
                <Text style={styles.showPasswordToggle}>
                  {passwordVisibility ? "Pokaż" : "Ukryj"}
                </Text>
              </TouchableOpacity>
            </View>
          )}

          <View style={styles.organizationPickerContainer}>
            <Text style={styles.organizationPickerLabel}>
              Wybierz widoczność głosujących:{" "}
            </Text>
            <RNPickerSelect
              onValueChange={(value) => setResponderInformationScope(value)}
              items={[
                { label: "Anonimowa ankieta", value: "ANONYMOUS" },
                { label: "Ograniczone info", value: "PARTIAL" },
                { label: "Pełne info", value: "FULL" },
              ]}
              style={pickerSelectStyles}
            />
          </View>

          <View style={styles.settingOption}>
            <Text>Ograniczony czas / deadline</Text>
            <Switch onValueChange={toggleSwitch4} value={isDeadlined} />
          </View>

          {isDeadlined && (
            <View>
              <TouchableOpacity
                onPress={showDatepicker}
                style={styles.datePickerButton}
              >
                <Text>{dateDisplay}</Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={showTimepicker}
                style={styles.datePickerButton}
              >
                <Text>{timeDisplay}</Text>
              </TouchableOpacity>
              {show && (
                <DateTimePicker
                  testID="dateTimePicker"
                  value={date}
                  mode={mode}
                  is24Hour={true}
                  display="default"
                  onChange={onChange}
                />
              )}
            </View>
          )}

          <View style={styles.organizationPickerContainer}>
            <Text style={styles.organizationPickerLabel}>
              Wybierz organizację:{" "}
            </Text>

            <RNPickerSelect
              onValueChange={(value) => setOrganizationId(value)}
              items={organisations.map((org) => ({
                label: org.name,
                value: org.id.toString(),
              }))}
              placeholder={{ label: "Select an Organization", value: null }}
              style={pickerSelectStyles}
            />
          </View>
        </ScrollView>

        <TouchableOpacity style={styles.nextButton} onPress={createSurvey}>
          <Text style={styles.nextButtonText}>UTWÓRZ</Text>
        </TouchableOpacity>
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
  buttonText1: {
    color: colors.greyBorder,
  },
  scrollViewContainer: {
    backgroundColor: colors.white,
    margin: 10,
  },
  surveyTitle: {
    fontSize: 27,
    fontWeight: "bold",
    color: colors.blue,
    textAlign: "left",
    paddingVertical: 20,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: colors.greyBorder,
  },
  content: {
    padding: 20,
  },
  settingOption: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  passwordInputContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderWidth: 1,
    borderColor: colors.greyBorder,
    borderRadius: 5,
    padding: 15,
    marginBottom: 20,
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
  passwordInput: {
    flex: 1,
    fontSize: 16,
    color: colors.black,
  },
  showPasswordToggle: {
    color: colors.blue,
    marginLeft: 10,
  },
  datePickerButton: {
    backgroundColor: "lightgrey",
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
  },
  pickerContainer: {
    padding: 10,
    borderWidth: 1,
    borderColor: "grey",
    borderRadius: 4,
    marginBottom: 10,
  },
  organizationPickerContainer: {
    marginBottom: 20,
    padding: 10,
    borderWidth: 1,
    borderColor: colors.greyBorder,
    borderRadius: 5,
  },
  organizationPickerLabel: {
    fontSize: 16,
    color: colors.black,
    marginBottom: 5,
  },
  voterInfoOptions: {
    flexDirection: "column",
    justifyContent: "space-around",
    marginTop: 10,
  },
  option: {
    padding: 10,
    borderWidth: 1,
    borderColor: colors.greyBorder,
    borderRadius: 5,
    marginTop: 5,
  },
  optionSelected: {
    padding: 10,
    borderWidth: 1,
    borderColor: colors.blue,
    borderRadius: 5,
    backgroundColor: colors.lightBlue,
    marginTop: 5,
  },
});

const pickerSelectStyles = StyleSheet.create({
  inputIOS: {},
  inputAndroid: {},
});

export default CreateSurveyNextView;
