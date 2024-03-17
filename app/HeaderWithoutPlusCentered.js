import React from "react";
import { View, Text, StyleSheet } from "react-native";
import colors from "./colors";

const HeaderWithoutPlus = ({ title }) => {
  return (
    <View style={styles.headerContainer}>
      <Text style={styles.headerTitle}>{title}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    backgroundColor: colors.blue,
    height: 70,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 10,
  },
  headerTitle: {
    color: colors.white,
    fontSize: 30,
    fontWeight: "bold",
  },
});

export default HeaderWithoutPlus;
