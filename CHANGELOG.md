# Changelog

All notable changes to this project will be documented in this file.

## Unreleased

### Added
- Accessibility: Enforce non-empty alt text for images across the app.
  - Introduced `eslint-plugin-jsx-a11y` and configured `jsx-a11y/alt-text` to treat custom components as images:
    - `LazyImage`, `ResponsiveImage`, and `AvatarImage`.
  - `LazyImage` now enforces meaningful `alt` at runtime; if an empty/whitespace value is passed in dev, a warning is logged and a safe fallback is derived from the `src`.

### Changed
- Updated components to comply with alt requirements:
  - Added `alt` to `AvatarImage` usages in ContentModeration, MobileChatInterface, AdminDashboard, UserRating, and Header/Profile where applicable.
  - Removed redundant `alt` wording where images are decorative (e.g., message attachments, full-screen gallery) by using `alt=""`.

### Notes for contributors
- New PRs should ensure all `<img>`, `LazyImage`, `ResponsiveImage`, and `AvatarImage` include a meaningful `alt` (or `alt=""` when purely decorative). The linter will flag violations.
- If you introduce new custom image components, add them to the `jsx-a11y/alt-text` rule configuration in `eslint.config.js` under `img: [...]`.

