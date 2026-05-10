import { NavigationContainer } from "@react-navigation/native";
import { StatusBar } from "expo-status-bar";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { AppNavigator } from "./app/navigation/AppNavigator";
import { GameProvider } from "./features/gameplay/GameContext";

export default function App() {
  return (
    <SafeAreaProvider>
      <GameProvider>
        <NavigationContainer>
          <AppNavigator />
          <StatusBar style="light" />
        </NavigationContainer>
      </GameProvider>
    </SafeAreaProvider>
  );
}
