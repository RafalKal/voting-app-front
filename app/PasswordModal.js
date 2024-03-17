import React, { useState } from 'react';
import { Modal, View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';

const PasswordModal = ({ isVisible, onClose, onConfirm }) => {
  const [passwordInput, setPasswordInput] = useState('');

  return (
    <Modal
      visible={isVisible}
      transparent={true}
      animationType="slide"
    >
      <View style={styles.modalView}>
        <Text style={styles.modalText}>Wprowadź hasło do ankiety:</Text>
        <TextInput
          secureTextEntry
          style={styles.input}
          onChangeText={setPasswordInput}
          value={passwordInput}
          placeholder="Hasło"
        />
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[styles.button, styles.buttonConfirm]}
            onPress={() => onConfirm(passwordInput)}
          >
            <Text style={styles.buttonText}>Potwierdź</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.button, styles.buttonClose]}
            onPress={onClose}
          >
            <Text style={styles.buttonText}>Anuluj</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
    modalView: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      marginTop: 22,
      backgroundColor: 'white',
      borderRadius: 20,
      padding: 35,
      alignItems: 'center',
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.25,
      shadowRadius: 4,
      elevation: 5,
      width: '70%',
      height: 5, 
      height: '30%',
      height: 10,
      alignSelf: 'center',
    },
    modalText: {
      marginBottom: 15,
      textAlign: 'center',
    },
    input: {
      marginBottom: 20,
      paddingHorizontal: 10,
      paddingVertical: 10,
      borderBottomWidth: 1,
      borderBottomColor: 'grey',
      width: '100%',
    },
    buttonContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      width: '100%',
    },
    button: {
      borderRadius: 20,
      padding: 10,
      elevation: 2,
      justifyContent: 'center',
      alignItems: 'center',
      width: '48%',
    },
    buttonConfirm: {
      backgroundColor: '#2196F3',
    },
    buttonClose: {
      backgroundColor: '#CCCCCC',
    },
    buttonText: {
      color: 'white',
      fontWeight: 'bold',
      textAlign: 'center',
    },
  });
  
  

export default PasswordModal;
