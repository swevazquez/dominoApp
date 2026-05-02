import { ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import { Badge } from "@app/components/Badge";
import { ScoreCard } from "@app/components/ScoreCard";
import { Button, Card, IconButton, ListRow, ScreenHeader, SegmentedControl, StatTile } from "@app/components/ui";
import { colors, sharedStyles, spacing } from "@app/components/theme";

function LabSection({ children, title }: { children: React.ReactNode; title: string }) {
  return (
    <Card style={styles.section}>
      <Text style={styles.sectionTitle}>{title}</Text>
      {children}
    </Card>
  );
}

export function UILabScreen() {
  const insets = useSafeAreaInsets();
  return (
    <SafeAreaView edges={["top"]} style={sharedStyles.screen}>
      <ScrollView contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + spacing.xl }]}>
        <ScreenHeader left={<IconButton label="UI" />} right={<IconButton label="DEV" />} title="UI Lab" />

      <LabSection title="Score States">
        <ScoreCard target={200} themScore={80} usScore={125} />
        <ScoreCard target={500} themScore={410} usScore={500} />
      </LabSection>

      <LabSection title="Badges">
        <View style={styles.wrap}>
          <Badge tone="blue">US WON +25</Badge>
          <Badge tone="red">THEM WON +40</Badge>
          <Badge tone="purple">CAPICU +100</Badge>
          <Badge tone="gold">CHUCHAZO +100</Badge>
          <Badge tone="green">CHIVA</Badge>
        </View>
      </LabSection>

      <LabSection title="Actions">
        <Button>Primary Action</Button>
        <Button variant="secondary">Secondary Action</Button>
        <Button variant="danger">Destructive Action</Button>
        <Button disabled>Disabled Action</Button>
      </LabSection>

      <LabSection title="Inputs And Stats">
        <SegmentedControl
          onChange={() => undefined}
          options={[
            { label: "US", value: "US" },
            { label: "THEM", value: "THEM" }
          ]}
          value="US"
        />
        <View style={styles.statRow}>
          <StatTile label="Hands Played" value={5} />
        </View>
      </LabSection>

        <LabSection title="Rows">
          <ListRow accessory={<Badge tone="green">Active</Badge>} meta="Target: 200 · No prizes" title="To 200 (No Prize)" />
          <ListRow accessory={<Badge tone="gold">Prize</Badge>} meta="Target: 500 · Prizes 100, 75, 50, 25" title="Con Premio (500)" />
        </LabSection>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  content: {
    gap: spacing.lg,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.sm
  },
  section: {
    gap: spacing.md
  },
  sectionTitle: {
    color: colors.muted,
    fontSize: 12,
    fontWeight: "900"
  },
  wrap: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.sm
  },
  statRow: {
    flexDirection: "row",
    gap: spacing.sm
  }
});
