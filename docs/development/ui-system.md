# UI System

The app uses a small internal UI system rather than a broad generic component kit.
This keeps the dominoes workflow fast, compact, and visually tailored.

## Rules

- Put shared colors, spacing, radii, and typography in `app/components/theme.ts`.
- Build repeated controls as primitives under `app/components/ui/`.
- Keep game-specific display components, such as `ScoreCard` and `Badge`, in `app/components/`.
- Avoid screen-local copies of buttons, cards, stat tiles, segmented controls, and list rows.
- Review new UI states in the development-only `UI Lab` tab before using them in gameplay screens.

## Current Primitives

- `Button`
- `Card`
- `IconButton`
- `ListRow`
- `ScreenHeader`
- `SegmentedControl`
- `StatTile`

## UI Lab Coverage

`app/screens/UILabScreen.tsx` previews the states most likely to regress visually:

- Live score cards
- Capicu, Chuchazo, Chiva, and winner badges
- Primary, secondary, danger, and disabled buttons
- Segmented team selection
- Stat tiles
- Preset/list rows

Full Storybook can be added later if the project needs browser-hosted review, screenshot testing, or design handoff. Until then, the in-app UI Lab avoids extra native dependencies while preserving isolated component review.
