---
name: css-documentation
description: Document stylesheets with concise ownership and behavior notes, especially for fixed chrome, responsive states, animations, and shared layout offsets.
---

# CSS Documentation

When a stylesheet needs documentation, begin with a short comment naming its component or route, the visual responsibility it owns, and any shared layout, safe-area, stacking, or cross-component custom-property contract it consumes. Add section comments only for non-obvious interactions such as fixed controls, animation states, responsive reflow, or published custom properties.

Document active behavior and token names, not intended future work or obvious declarations. Remove comments that no longer match the implementation.
