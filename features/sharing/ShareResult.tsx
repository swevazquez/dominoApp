import { RefObject } from "react";
import { Alert, Pressable, Share, Text } from "react-native";
import { captureRef } from "react-native-view-shot";
import { sharedStyles } from "@app/components/theme";
import { Game } from "@domain/Game";
import { formatShareText } from "@domain/GameSummary";

export function ShareTextButton({ game }: { game: Game }) {
  return (
    <Pressable
      accessibilityRole="button"
      onPress={() => {
        Share.share({ message: formatShareText(game) });
      }}
      style={sharedStyles.outlineButton}
    >
      <Text style={sharedStyles.outlineButtonText}>Share Text Summary</Text>
    </Pressable>
  );
}

export function ShareImageButton({ targetRef }: { targetRef: RefObject<unknown> }) {
  return (
    <Pressable
      accessibilityRole="button"
      onPress={async () => {
        try {
          const uri = await captureRef(targetRef, {
            format: "png",
            quality: 1
          });
          await Share.share({ url: uri });
        } catch {
          Alert.alert("Share failed", "The result image could not be generated.");
        }
      }}
      style={sharedStyles.primaryButton}
    >
      <Text style={sharedStyles.primaryButtonText}>Share Result Image</Text>
    </Pressable>
  );
}
