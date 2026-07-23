---
name: svg-api-flow-diagrams
description: Use when creating, revising, or repairing SVG flow diagrams for this Dota Web Components project. Covers UI interaction, routing, component lifecycle, application events, async loading, and API/service behavior in `docs/flows/*.svg`, especially when code must determine the true branches, a connector is hidden, cards overlap, or a diagram needs a clearer layout.
---

# SVG API Flow Diagrams

Create diagrams from the behavior enforced by the current code. Treat an SVG flow as technical documentation: a clean layout is not useful if it invents a branch, omits an early return, or turns independent event listeners into a sequence.

This repository is a Vite app built with `@ayu-sh-kr/dota-wrap`. Its primary flow is often browser/UI behavior rather than a backend endpoint. Model the rendered custom elements, route transitions, delegated DOM events, lifecycle hooks, application events, and async work as first-class flow nodes.

## Project Map and Source-of-Truth Order

Start at the smallest public UI entry point named by the flow, then follow the actual Dota wrapper boundaries:

```text
src/main.ts
  ├─ virtual:dota-components → decorated src/components/**/*.component.ts
  ├─ virtual:dota-routes → decorated src/pages/*.page.ts
  └─ AppComponent → page/component host

src/pages/<page>.page.ts
  └─ src/components/<component>/<component>.component.ts
       ├─ <component>.component.css (presentation only)
       ├─ @BindEvent / @HostListener / @WindowListener
       ├─ @AfterInit / @OnEvent
       └─ services, fetch, or ApplicationEventService
```

Use this repository-specific reading order:

1. Read `src/main.ts`, the relevant page in `src/pages`, and the component's `render()` output. Record route paths, custom-element selectors, and child components.
2. Read the component's lifecycle and decorators from `@ayu-sh-kr/dota-wrap/core` or its event/router surfaces. Record when the action is possible: initial render, `@AfterInit`, `@OnEvent`, or after a property/attribute update.
3. Trace UI inputs through `@BindEvent`, `@HostListener`, `@WindowListener`, and native `CustomEvent`/`ApplicationEventService` publishers. A re-render from `updateHTML()` is a state transition, not a new user action.
4. For routing, read the `@Route` declarations and `src/pages/index.ts`; confirm fallback/sentinel routes such as `/blog/:slug` and any route-derived values.
5. For async behavior, read the fetch/service call, `AbortController` cleanup, response checks, and every event listener consuming the result. Mark independent listeners as fan-out, not a serial chain.
6. Read relevant config/data files (`src/configs`, `src/data`, `src/events`) and tests when they define user-visible states, labels, defaults, or error behavior.

Use `rg` with selectors, route paths, event constants, decorator names, `fetch(`, `publishAsync`, `updateHTML`, and `render()`. Do not infer a UI branch from a component name or CSS class alone.

## Establish the Behavior First

Trace the named flow before editing the SVG.

For a UI flow, record: user gesture or route entry → rendered component → handler/decorator → state/event transition → async work (if any) → resulting render or route. For an API flow, also record auth, service, repository, persistence, response status, and post-commit listeners.

For either kind of flow, record every guard, early return, lookup, mutation, optional value, loading/error/empty state, and response-producing branch. For async code, record cancellation and unmount/disconnect behavior when it changes visible behavior or prevents stale updates.

Make a short flow model before drawing:

```text
request → authenticate → guard A?
  yes → error response
  no  → lookup B?
           yes → reuse → enrich → success
           no  → validate C? → search/create → optional result → success or empty success
```

UI example from this app:

```text
route /blog or /blog/:slug → BlogPage/BlogSlugPage → blog-view @AfterInit
  /blog → publish blog:index-data → blog-index renders catalog
  /blog/:slug → resolve post?
                  no → publish article-data(post: null) → empty/not-found article state
                  yes → publish article-data → fetch markdown
                           aborted → stop silently
                           failed → publish article-error → error state
                           loaded → publish markdown-source → markdown view renders → md:render
```

## Choose the Diagram Content

Include only behavior that changes the request result, persisted state, or a meaningful after-effect.

- Show auth-derived values when they replace or constrain client input.
- Show guards in their actual order, including explicit error code or user-visible stop when useful.
- Show an `Optional`/empty lookup as a decision only when it changes the next operation or response.
- Combine implementation-only steps that belong together, such as a SQL candidate search and its persistence, if splitting them hides the domain flow.
- Show no-result success explicitly when code returns an empty collection rather than an error.
- Do not add generic database/network failure branches unless the code gives them distinct behavior worth documenting.
- For event flows, show one event card and fan out to its independent listeners. Do not chain listeners merely because they consume the same event.
- For UI flows, show the user-visible state (`loading`, `empty`, `error`, `rendered`, or `updated`) when code has a distinct branch or DOM output. Do not diagram CSS-only styling or every markup node.
- Show a custom element as a component card using its selector (for example, `<blog-view>`), and show its Dota decorator/lifecycle as a smaller subtitle when that explains timing.
- Distinguish route composition (`<app-home>` renders sections) from runtime communication (`ApplicationEventService` or browser events). Child composition is not an event.

## Lay Out the Flow

Use a stable visual grammar rather than fitting every branch into the first empty space.

1. Put route entry or user gesture on one top row. For API diagrams, use request setup instead.
2. Put the primary continuation on one centered vertical spine.
3. Leave deliberate vertical gaps (roughly 60–90px) between spine cards so each arrow has a visible tail before its arrowhead.
4. For a decision with a terminal outcome, send the terminal branch horizontally into a reserved side lane and continue the non-terminal branch downward.
5. Keep a side lane's vertical ranges exclusive. Never place a response card in the same vertical span as an error card or another branch card.
6. Reserve lanes by meaning when possible: errors/stops on the right, reusable/cache-hit branches on the left, and new-result enrichment in a separate lower lane.
7. Let parallel event listeners fan out symmetrically from the event, then give each listener its own vertical sub-flow. In this project, use this for `ApplicationEventService` events such as `blog:*`; do not draw the publisher and subscribers as direct DOM nesting.
8. Move explanatory notes to a footer or small label. Do not give a secondary implementation detail a large card that competes with the main flow.

For a decision, prefer this shape:

```text
                    yes ───→ [stop / alternate result]
[condition card]
        │
        no
        ▼
[continuing step]
```

Reverse the label names only when the code requires it; preserve the layout convention of side exit versus downward continuation.

## SVG Construction Rules

- Keep a meaningful `<title>` and `<desc>` synchronized with the rendered behavior.
- Use a `viewBox` large enough for the entire diagram and footer. Check the background, content, and footer use the same height.
- Use `marker-end` arrows with `refX="10"` for a 10px marker so the tip meets the target border instead of disappearing inside it.
- Draw an incoming connector after its destination card when an arrowhead must remain visible; end it exactly at the card boundary.
- Use the same card width and height within a lane. Align card centers on the spine and side-lane grid.
- For a side interaction, start the connector at the source card's side midpoint, route through a reserved gutter, make at most the needed 90-degree turns, and enter the target at its side midpoint. Never start at a source corner or bottom edge when the semantic relationship is lateral, and never run a connector along a card edge.
- When two related interaction/state cards are adjacent, align their vertical centers and use the shortest direct side-to-side connector; do not add an ornamental turn.
- Keep the complete connector corridor clear: inspect every horizontal and vertical segment against all card bounding boxes, labels, and legend items, not only the final arrowhead.
- For multi-outcome cards, reserve an outer gutter for long branches before drawing them. A branch may travel around a lane, but it must never cross a sibling card to reach an upper or side outcome.
- Label a branch close to its connector, not inside either card. Use concise `yes`/`no` labels.
- Use dashed connectors only for genuinely asynchronous/post-commit work; explain that meaning in the legend.
- Keep colors semantic and stable: API/response, processing, saved state/event, and error/stop.
- Add a compact legend for UI-specific shapes: route/user input, custom element, lifecycle/handler, application event, async operation, rendered state, and error/stop. Keep the palette compatible with the portfolio tokens (`--primary-color`, `--background-color`, `--foreground-color`) while using explicit SVG fallback colors so the file renders standalone.
- Use `<g>` groups with stable `id`s such as `route-entry`, `blog-view`, `blog-events`, and `rendered-state`; this makes diagrams easier to inspect and revise without changing behavior.
- Treat HTML custom-element names as code identifiers and preserve their exact kebab case. Treat decorator names and event constants as labels, not invented framework APIs.
- If a flow documents a component tree, prefer a small nesting diagram or a separate composition lane; do not connect every child with a control-flow arrow.
- Keep text readable at the intended display size: short card titles, a smaller code-style subtitle for selectors/events, and explanatory detail in `<desc>` or a footer.

## Repair an Existing Diagram

When a chart feels crowded or an arrow is hidden, repair the structure rather than nudging coordinates blindly.

1. List every card's bounding box: `x`, `y`, `width`, and `height`.
2. Identify lane conflicts: overlapping boxes, overlapping vertical ranges in one lane, or connectors that pass through a card.
3. Reassign whole branches to a free lane or convert the request path to a vertical spine. Do not stack unrelated branches in the same column.
4. Increase the distance between connected cards before changing arrow styling; tails establish direction.
5. Recheck that decision labels still describe the correct code branch after moving a card.
6. Demote non-flow commentary to the footer if it distracts from the request path.
7. For a UI diagram, check for a more subtle conflict: a component tree edge accidentally implying event order, or a lifecycle edge implying that `render()` waits for async data when the code actually publishes an event and re-renders later.

## Verify

1. Validate syntax with `xmllint --noout <diagram>.svg`.
2. Run the project type/build check when the diagram is tied to changed source: `npm run build`.
3. Inspect the SVG at its rendered size when a renderer is available. Check arrowheads, card bounds, labels, footer bounds, lane separation, and dark/light contrast.
4. Re-read the source flow against the final diagram: every shown branch must exist, and every branch leading to a different rendered state, route, persisted state, or after-effect must be represented.
5. For Dota components, verify selector spelling, route spelling, decorator timing, event names, and whether `updateHTML()` is required after state changes.
6. Preserve unrelated SVGs and existing working-tree changes.
