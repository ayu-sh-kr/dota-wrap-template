---
name: css-formatting
description: Format CSS for maintenance without changing its visual or cascade contract.
---

# CSS Formatting

Preserve selectors, declaration values, cascade order, media queries, animation names, and custom-property names. Use one declaration per line for component CSS, two-space indentation, and blank lines between logical rule groups. Keep long values readable and preserve mobile-first and reduced-motion rules.

Formatting does not authorize changing layout, tokens, or responsive behavior. After a substantial formatting pass, run `git diff --check` and the project build.
