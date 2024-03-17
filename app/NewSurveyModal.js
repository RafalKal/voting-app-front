import React, { useState } from "react";
import {
  Modal,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { useNavigation } from "@react-navigation/native";

const NewSurveyModal = ({ isVisible, onClose }) => {
  const [name, setNewSurveyName] = useState("");
  const navigation = useNavigation();

  const handleCreate = () => {
    const trimmedName = name.trim();

    if (!trimmedName) {
      alert("Nazwa ankiety nie może być pusta!");
      return;
    }

    navigation.navigate("CreateSurveyView", {
      name: trimmedName,
      resetQuestions: true,
    });

    setNewSurveyName("");
    onClose();
  };

  const handleClose = () => {
    setNewSurveyName("");
    onClose();
  };

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={isVisible}
      onRequestClose={onClose}
    >
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          <Text style={styles.modalHeadText}>Nowa Ankieta</Text>
          <Text style={styles.modalDescriptionText}>
            Podaj nazwę dla nowo tworzonej ankiety
          </Text>
          <TextInput
            style={styles.modalInput}
            placeholder="Nazwa ankiety"
            placeholderTextColor="grey"
            onChangeText={setNewSurveyName}
            value={name}
          />
          <View style={styles.modalButtons}>
            <TouchableOpacity onPress={handleClose} style={styles.modalButton}>
              <Text>Zamknij</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={handleCreate} style={styles.modalButton}>
              <Text>Potwierdź</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 10,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    width: "80%",
    bordeColor: "black",
    borderWidth: 1,
  },
  modalHeadText: {
    marginBottom: 15,
    textAlign: "center",
    fontWeight: "bold",
    fontSize: 25,
  },
  modalDescriptionText: {
    marginBottom: 15,
    textAlign: "center",
    fontSize: 18,
    color: "grey",
  },
  modalInput: {
    borderBottomColor: "#000",
    borderBottomWidth: 1,
    width: "100%",
    textAlign: "center",
    fontSize: 16,
    paddingVertical: 10,
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "100%",
  },
  modalButton: {
    backgroundColor: "#E8E8E8",
    alignItems: "center",
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 20,
    elevation: 2,
    width: "45%",
    marginHorizontal: 10,
  },
});

export default NewSurveyModal;
