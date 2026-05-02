import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { GameScreen } from "@app/screens/GameScreen";
import { HistoryScreen } from "@app/screens/HistoryScreen";
import { SettingsScreen } from "@app/screens/SettingsScreen";
import { GameSummaryScreen } from "@app/screens/GameSummaryScreen";
import { colors } from "@app/components/theme";

export type RootStackParamList = {
  Tabs: undefined;
  Summary: { gameId?: string } | undefined;
};

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator<RootStackParamList>();

function Tabs() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: colors.background,
          borderTopColor: colors.border,
          borderTopWidth: 1,
          minHeight: 72,
          paddingBottom: 12,
          paddingTop: 8
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: "800"
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
