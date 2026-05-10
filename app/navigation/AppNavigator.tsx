import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { Platform } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { GameScreen } from "@app/screens/GameScreen";
import { HistoryScreen } from "@app/screens/HistoryScreen";
import { SettingsScreen } from "@app/screens/SettingsScreen";
import { GameSummaryScreen } from "@app/screens/GameSummaryScreen";
import { colors, spacing } from "@app/components/theme";

export type RootStackParamList = {
  Tabs: undefined;
  Summary: { gameId?: string } | undefined;
};

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator<RootStackParamList>();

function Tabs() {
  const insets = useSafeAreaInsets();
  const bottomInset = Math.max(insets.bottom, Platform.OS === "android" ? 36 : 0);

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarHideOnKeyboard: true,
        tabBarStyle: {
          backgroundColor: colors.background,
          borderTopColor: colors.border,
          borderTopWidth: 1,
          height: 68 + bottomInset,
          paddingBottom: bottomInset + spacing.md,
          paddingTop: spacing.sm
        },
        tabBarItemStyle: {
          justifyContent: "center",
          paddingVertical: 0
        },
        tabBarIconStyle: {
          display: "none"
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: "800",
          lineHeight: 16,
          marginBottom: 0
        },
        tabBarActiveTintColor: colors.blue,
        tabBarInactiveTintColor: colors.muted
      }}
    >
      <Tab.Screen name="Game" component={GameScreen} options={{ tabBarIcon: () => null }} />
      <Tab.Screen name="History" component={HistoryScreen} options={{ tabBarIcon: () => null }} />
      <Tab.Screen name="Settings" component={SettingsScreen} options={{ tabBarIcon: () => null }} />
    </Tab.Navigator>
  );
}

export function AppNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Tabs" component={Tabs} />
      <Stack.Screen name="Summary" component={GameSummaryScreen} />
    </Stack.Navigator>
  );
}
