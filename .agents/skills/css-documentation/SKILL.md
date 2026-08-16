---
name: css-documentation
description: Document component CSS with concise, factual ownership and behavior notes.
---

# CSS Documentation

When a stylesheet needs documentation, begin with a short comment naming its component or route, the visual responsibility it owns, and any shared layout, safe-area, or stacking contract it consumes. Add section comments only for non-obvious interactions such as fixed controls, animation states, responsive reflow, or cross-component custom properties.

Document active behavior and token names, not intended future work or obvious declarations. Remove comments that no longer match the implementation.
