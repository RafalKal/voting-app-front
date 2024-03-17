import React, { useContext, useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  Alert,
  SafeAreaView,
  ScrollView,
} from "react-native";
import { AuthContext } from "./AuthContext";
import { decodeJWT } from "./jwtUtils";
import { apiService } from "./apiService";
import colors from "./colors";
import HeaderWithoutPlusCentered from "./HeaderWithoutPlusCentered";
import { useRefresh } from "./RefreshContext";

const CreateOrganisationView = ({ navigation }) => {
  const { userToken } = useContext(AuthContext);
  const [organisationName, setOrganisationName] = useState("");
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [users, setUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

  const { setNeedsRefresh4 } = useRefresh();

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await apiService.get("/users");
      const userId = decodeJWT(userToken).id;
      const filteredUsers = response.data.filter((user) => user.id !== userId);
      setUsers(filteredUsers);
    } catch (error) {
      console.error("Error fetching users:", error);
      Alert.alert("Błąd", "Nie udało się pobrać listy użytkowników.");
    }
  };

  const handleAddOrganisation = async () => {
    const authorId = decodeJWT(userToken).id;
    try {
      await apiService.post("/organisations", {
        name: organisationName,
        authorId,
        usersId: [...selectedUsers.map((user) => user.id), authorId],
      });
      Alert.alert("Sukces", "Organizacja została dodana.");
      setNeedsRefresh4(true);
      navigation.goBack();
    } catch (error) {
      console.error("Error creating organisation:", error);
      Alert.alert("Błąd", "Nie udało się dodać organizacji.");
    }
  };

  const toggleSelectUser = (user) => {
    const isSelected = selectedUsers.some(
      (selectedUser) => selectedUser.id === user.id
    );
    if (isSelected) {
      setSelectedUsers(
        selectedUsers.filter((selectedUser) => selectedUser.id !== user.id)
      );
      setUsers([...users, user]);
    } else {
      setSelectedUsers([...selectedUsers, user]);
      setUsers(users.filter((u) => u.id !== user.id));
    }
  };

  const renderUserItem = ({ item }) => (
    <TouchableOpacity
      onPress={() => toggleSelectUser(item)}
      style={styles.userItem}
    >
      <Text style={styles.userItemText}>
        {item.login} - {item.firstname} {item.lastname}
      </Text>
    </TouchableOpacity>
  );

  const handleBack = () => {
    navigation.goBack();
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <HeaderWithoutPlusCentered title="Dodawanie organizacji" />
        <View style={styles.buttons}>
          <TouchableOpacity onPress={handleBack} style={styles.button1}>
            <Text style={styles.buttonText1}>{"<"}</Text>
          </TouchableOpacity>
        </View>
        <ScrollView contentContainerStyle={styles.scrollView}>
          <Text style={styles.label}>Nazwa organizacji:</Text>
          <TextInput
            style={styles.input}
            placeholder="Podaj nazwę organizacji..."
            value={organisationName}
            onChangeText={setOrganisationName}
          />
          <Text style={styles.label}>Szukaj:</Text>
          <TextInput
            style={styles.input}
            placeholder="szukaj..."
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          <FlatList
            data={users.filter(
              (user) =>
                user.login.includes(searchQuery) ||
                user.firstname?.includes(searchQuery) ||
                user.lastname?.includes(searchQuery)
            )}
            keyExtractor={(item) => item.id.toString()}
            renderItem={renderUserItem}
            ListHeaderComponent={
              <Text style={styles.sectionTitle}>Dostępni użytkownicy:</Text>
            }
          />
          <Text style={styles.sectionTitle}>Wybrani użytkownicy:</Text>
          <FlatList
            data={selectedUsers}
            keyExtractor={(item) => item.id.toString()}
            renderItem={renderUserItem}
          />
        </ScrollView>

        <TouchableOpacity
          style={styles.addButton}
          onPress={handleAddOrganisation}
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
  scrollView: {
    padding: 20,
  },
  input: {
    backgroundColor: colors.white,
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
  },
  userItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: colors.greyBorder,
  },
  userItemText: {
    fontSize: 16,
  },
  addButton: {
    backgroundColor: colors.blue,
    padding: 15,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 5,
    marginTop: 10,
  },
  addButtonText: {
    color: colors.white,
    fontSize: 18,
    fontWeight: "bold",
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 10,
    marginBottom: 5,
  },
  label: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 5,
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
});

export default CreateOrganisationView;
