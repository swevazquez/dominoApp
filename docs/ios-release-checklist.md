# Chiva iOS Release Checklist

For Android release steps, see [Chiva Android Release Checklist](android-release-checklist.md).

## One-Time Setup

- Confirm Apple Developer Program access.
- Confirm Expo account access.
- Confirm App Store Connect app record exists for `Chiva`.
- Confirm Bundle ID is `com.swevazquez.chiva`.
- Enable GitHub Pages for the `docs` folder.
- Copy the published Privacy Policy URL into App Store Connect: `https://swevazquez.github.io/dominoApp/privacy.html`.
- Copy the published Support URL into App Store Connect: `https://swevazquez.github.io/dominoApp/support.html`.

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
npx eas-cli build --platform ios --profile production
```

## Submit

Run:

```sh
npx eas-cli submit --platform ios --profile production
```

If EAS Submit is not configured with App Store Connect API credentials, follow the interactive prompts.

## TestFlight Smoke Test

- Install the production build through TestFlight.
- Start a 200-point game.
- Start a 500-point game.
- Add a normal hand.
- Add Capicu and Chuchazo hands.
- Complete a game.
- Confirm Add Hand and Undo are hidden after completion.
- Open summary and history.
- Change preset from Settings.
- Force-close and reopen to verify local persistence.

## App Store Connect

- Select category: Utilities.
- Set age rating: 4+.
- Set price: Free.
- Add screenshots.
- Add metadata from `docs/app-store-metadata.md`.
- Complete privacy answers as Data Not Collected.
- Add review notes from `docs/app-store-metadata.md`.
