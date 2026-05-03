# Chiva Android Release Checklist

## One-Time Setup

- Confirm Google Play Console access.
- Confirm Expo account access.
- Create the Play Console app record for `Chiva`.
- Confirm Android package name is `com.swevazquez.chiva`.
- Enable GitHub Pages for the `docs` folder.
- Copy the published Privacy Policy URL into Play Console: `https://swevazquez.github.io/dominoApp/privacy.html`.
- Copy the published Support URL into Play Console: `https://swevazquez.github.io/dominoApp/support.html`.

## Local Validation

Run:

```sh
npm run typecheck
npm test -- --runInBand
npx expo config --type public
npx expo-doctor
```

## Build

Run:

```sh
npx eas-cli login
npx eas-cli build --platform android --profile production
```

The production profile is configured for store distribution. EAS will produce an Android release artifact suitable for Play Console upload.

## Submit

Run:

```sh
npx eas-cli submit --platform android --profile production
```

If EAS Submit is not configured with Google Play service account credentials, either follow the interactive prompts or upload the release artifact manually in Play Console.

## Play Console Smoke Test

- Install the release through internal testing.
- Start a 200-point game.
- Start a 500-point game.
- Add a normal hand.
- Add Capicu and Chuchazo hands.
- Complete a game.
- Confirm Add Hand and Undo are hidden after completion.
- Open summary and history.
- Change preset from Settings.
- Force-close and reopen to verify local persistence.

## Play Console Listing

- Select category: Tools.
- Set content rating for all ages, consistent with no user-generated content or online interaction.
- Set price: Free.
- Add screenshots.
- Add metadata from `docs/play-store-metadata.md`.
- Complete Data Safety as no data collected or shared.
