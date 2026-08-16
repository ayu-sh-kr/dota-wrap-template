---
name: component-lifecycle
description: Implement Dota Wrap component lifecycle and event wiring without leaks or duplicate listeners.
---

# Component Lifecycle

Prefer scoped lifecycle events for setup and teardown:

```ts
@OnEvent("connected", true)
onConnected(): void {}

@OnEvent("disconnected", true)
onDisconnected(): void {}
```

Use `WindowListener`, `DocumentListener`, and `HostListener` for simple static targets. Reserve manual listeners for dynamic targets, nonstandard options, and APIs without a decorator; pair each with matching cleanup and preserve a stable callback reference. Do not do DOM setup in constructors or I/O in `render()`.

When changing a component, check reconnection safety, listener symmetry, observer/timer/frame cleanup, and build success.
