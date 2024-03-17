import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  StyleSheet,
  TouchableWithoutFeedback,
} from "react-native";

const QuestionTypeModal = ({ modalVisible, setModalVisible, onSelect }) => {
  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={modalVisible}
      onRequestClose={() => setModalVisible(false)}
    >
      <TouchableWithoutFeedback onPress={() => setModalVisible(false)}>
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Text style={styles.modalHeadText}>Wybierz typ pytania</Text>
            <TouchableOpacity
              style={styles.modalButton}
              onPress={() => onSelect("MultipleChoiceScreenAdd")}
            >
              <Text style={styles.modalButtonText}>
                Pytanie wielokrotnego wyboru
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.modalButton}
              onPress={() => onSelect("DropdownQuestionScreenAdd")}
            >
              <Text style={styles.modalButtonText}>
                Wysuwana lista odpowiedzi
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.modalButton}
              onPress={() => onSelect("TextQuestionScreenAdd")}
            >
              <Text style={styles.modalButtonText}>Odpowiedź tekstowa</Text>
            </TouchableOpacity>
          </View>
        </View>
      </TouchableWithoutFeedback>
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
    borderColor: "black",
    borderWidth: 1,
  },
  modalHeadText: {
    marginBottom: 15,
    textAlign: "center",
    fontWeight: "bold",
    fontSize: 25,
  },
  modalButtonText: {
    color: "#000",
    textAlign: "center",
    fontSize: 16,
    paddingVertical: 10,
  },
  modalButton: {
    backgroundColor: "#E8E8E8",
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 20,
    width: "100%",
    marginVertical: 5,
    alignItems: "center",
  },
});

export default QuestionTypeModal;
