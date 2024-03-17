import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import colors from "./colors";

const HeaderWithPlus = ({ title, onAddPress }) => {
  return (
    <View style={styles.headerContainer}>
      <Text style={styles.headerTitle}>{title}</Text>
      <TouchableOpacity onPress={onAddPress} style={styles.addButton}>
        <Text style={styles.plusCharacter}>+</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    backgroundColor: colors.blue,
    height: 70,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 10,
  },
  headerTitle: {
    color: colors.white,
    fontSize: 30,
    fontWeight: "bold",
  },
  plusCharacter: {
    color: colors.white,
    fontSize: 30,
    fontWeight: "bold",
  },
  addButton: {
    color: "white",
    backgroundColor: colors.blue,
    width: 40,
    height: 40,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    borderColor: colors.greyBorder,
    borderWidth: 1,
  },
});

export default HeaderWithPlus;
