---
name: clean-code
description: Keep TypeScript Dota Wrap components direct, readable, and easy to verify.
---

# Clean Code

Keep each method focused and names intent-revealing. Prefer guards over nested conditionals and direct expressions over ceremony. Keep `render()` pure: derive markup from component state only; place loading, DOM work, and events in lifecycle handlers or services.

Order classes as properties, constructor, lifecycle handlers, event handlers, then `render()`. Do not extract a single-use two-line helper unless its name genuinely explains complex logic. Remove unused imports, dead branches, and stale comments.

Use kebab-case selectors and attributes, camelCase fields and methods, PascalCase component/page/service classes, and `SCREAMING_SNAKE_CASE` event constants. Extract shared logic only for genuine reuse or a clear side-effect boundary.
