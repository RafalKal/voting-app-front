import * as React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { AuthProvider } from "./AuthContext";
import AppNav from "./AppNav";
import { RefreshProvider } from "./RefreshContext";

const Stack = createStackNavigator();

function App() {
  return (
    <RefreshProvider>
      <AuthProvider>
        <AppNav />
      </AuthProvider>
    </RefreshProvider>
  );
}

export default App;
