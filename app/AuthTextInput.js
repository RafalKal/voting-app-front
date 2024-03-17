import React from "react";
import { TextInput, StyleSheet } from "react-native";

const AuthTextInput = ({
  placeholder,
  value,
  setValue,
  secureTextEntry = false,
  style,
}) => {
  return (
    <TextInput
      style={[styles.input, style]}
      placeholder={placeholder}
      value={value}
      onChangeText={setValue}
      secureTextEntry={secureTextEntry}
    />
  );
};

const styles = StyleSheet.create({
  input: {
    height: 40,
    margin: 12,
    borderWidth: 1,
    padding: 10,
    borderRadius: 5,
  },
});

export default AuthTextInput;
