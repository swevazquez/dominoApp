import { Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Card, ScreenHeader } from "@app/components/ui";
import { colors, sharedStyles, spacing } from "@app/components/theme";

export function PlayersScreen() {
  return (
    <SafeAreaView edges={["top"]} style={[sharedStyles.screen, styles.screen]}>
      <ScreenHeader title="Players" />
      <Card>
        <Text style={{ color: colors.text, fontSize: 18, fontWeight: "800" }}>Local-first MVP</Text>
        <Text style={[sharedStyles.subtitle, { marginTop: spacing.sm }]}>
          Player names can be attached to teams in a future pass. Accounts, contacts, friends, and usernames are intentionally outside the MVP scoring flow.
        </Text>
      </Card>
    </SafeAreaView>
  );
}

const styles = {
  screen: {
    gap: spacing.lg,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.sm
  }
};
