---
name: css-formatting
description: Format CSS for readable, behavior-preserving maintenance without changing layout, tokens, states, or responsive behavior.
---

# CSS Formatting

Preserve selectors, declaration values, cascade order, media queries, animation names, and custom-property names. Use one declaration per line for component CSS, two-space indentation, and blank lines between logical rule groups. Keep long values readable and preserve mobile-first and reduced-motion rules. Keep component CSS colocated with its component and imported from `src/style.css`.

Add a short file-level comment only when it clarifies the component or surface a stylesheet owns and a non-obvious layout or chrome contract it consumes. Formatting does not authorize changing layout, tokens, or responsive behavior. After a substantial formatting pass, run `git diff --check` and the project build.
