---
name: reusable-design
description: Structure Dota Wrap features with clear component, service, event, data, and design-token boundaries.
---

# Reusable Design

Compose pages from small single-purpose custom elements. A page arranges sections, a list maps items to cards, and a card renders one item. Keep rendering and CSS in the component, loading in services, cross-component messaging in typed events, authored content in data modules, and shared visuals in tokens.

Use the smallest design that meets the present requirement. Extract an abstraction only when two callers share the same behavior for the same reason; do not create generic utilities or configuration for hypothetical uses. Give each shared fact one home and reuse components by embedding their selector rather than duplicating markup.
