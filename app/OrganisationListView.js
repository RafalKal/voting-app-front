import React, { useState, useEffect, useContext, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Alert,
  SafeAreaView,
} from "react-native";
import { AuthContext } from "./AuthContext";
import { decodeJWT } from "./jwtUtils";
import { apiService } from "./apiService";
import { useFocusEffect } from "@react-navigation/native";
import { useRefresh } from "./RefreshContext";
import HeaderWithoutPlusCentered from "./HeaderWithoutPlusCentered";
import colors from "./colors";

const OrganisationListView = ({ navigation }) => {
  const { userToken } = useContext(AuthContext);
  const [organisations, setOrganisations] = useState([]);
  const { needsRefresh4, setNeedsRefresh4 } = useRefresh();

  const fetchOrganisations = useCallback(async () => {
    if (!userToken) {
      Alert.alert("Błąd", "Brak dostępu. Zaloguj się.");
      return;
    }

    const userId = decodeJWT(userToken).id;

    try {
      const response = await apiService.get(`/organisations/user/${userId}`);
      setOrganisations(response.data);
    } catch (error) {
      console.error("Error fetching organisations:", error);
      Alert.alert("Błąd", "Nie udało się pobrać listy organizacji.");
    }
  });

  useFocusEffect(
    useCallback(() => {
      if (needsRefresh4) {
        fetchOrganisations();

        setNeedsRefresh4(false);
      }
    }, [needsRefresh4, fetchOrganisations])
  );

  useEffect(() => {
    fetchOrganisations();
  }, [userToken]);

  const handleBack = () => {
    navigation.goBack();
  };

  const deleteOrganisation = async (organisationId) => {
    if (!userToken) {
      Alert.alert("Error", "Access denied. Please log in.");
      return;
    }

    try {
      console.log(`/organisations/${organisationId}`);
      await apiService.delete(`/organisations/${organisationId}`);
      Alert.alert("Success", "Organization deleted successfully.");
      fetchOrganisations();
    } catch (error) {
      console.error("Error deleting organization:", error);
      Alert.alert("Error", "Failed to delete the organization.");
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <HeaderWithoutPlusCentered title="Twoje organizacje" />
        <View style={styles.buttons}>
          <TouchableOpacity onPress={handleBack} style={styles.button1}>
            <Text style={styles.buttonText1}>{"<"}</Text>
          </TouchableOpacity>
        </View>
        <FlatList
          data={organisations}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <View style={styles.listItem}>
              <View style={styles.listItemContent}>
                <Text style={styles.listItemText}>{item.name}</Text>
                {item.authorId === decodeJWT(userToken).id && (
                  <View style={styles.buttonsContainer}>
                    <TouchableOpacity
                      onPress={() =>
                        navigation.navigate("EditOrganisationView", {
                          organisation: item,
                        })
                      }
                      style={[styles.button, styles.editButton]}
                    >
                      <Text style={styles.buttonText}>Edytuj</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={() => deleteOrganisation(item.id)}
                      style={[styles.button, styles.deleteButton]}
                    >
                      <Text style={styles.buttonText}>Delete</Text>
                    </TouchableOpacity>
                  </View>
                )}
              </View>
            </View>
          )}
        />
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => navigation.navigate("CreateOrganisationView")}
        >
          <Text style={styles.addButtonText}>DODAJ ORGANIZACJĘ</Text>
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
  listItem: {
    backgroundColor: colors.white,
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: colors.greyBorder,
  },
  listItemContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  listItemText: {
    fontSize: 18,
    color: colors.black,
  },
  addButton: {
    backgroundColor: colors.blue,
    padding: 15,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 5,
    marginHorizontal: 10,
    marginBottom: 10,
  },
  addButtonText: {
    color: colors.white,
    fontSize: 18,
    fontWeight: "bold",
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
  buttonsContainer: {
    flexDirection: "row",
  },
  button: {
    marginLeft: 10,
    padding: 5,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 5,
  },
  editButton: {
    backgroundColor: colors.blue,
  },
  deleteButton: {
    backgroundColor: colors.red,
  },
  buttonText: {
    color: colors.white,
    fontSize: 14,
  },
});

export default OrganisationListView;
