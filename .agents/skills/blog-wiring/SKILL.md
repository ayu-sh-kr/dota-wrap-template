---
name: blog-wiring
description: Use when adding or updating blog markdown in this workspace and wiring it into dota-web. Covers where blog files belong, how to register them in blogs.config.ts, and the path and category conventions the app expects.
---

# Blog Wiring

Use this skill when a markdown blog post already exists, or is being created, and needs to appear in the Dota Web blog listing and content pages.

## What To Wire

This workspace does not auto-discover blog markdown. Every post must be registered manually in [blogs.config.ts](/Volumes/project-workspace/dota/dota-workspace/packages/apps/dota-web/src/configs/blogs.config.ts).

The markdown file lives under:

```text
packages/apps/dota-web/public/blogs/<category-lowercase>/<File-Name>.md
```

The config entry provides the metadata used by the listing page and suggestions.

## Category Convention

The `category` field in `blogs.config.ts` must match one of the configured `BlogCategory` values:

- `Tutorial`
- `Tools`
- `News`
- `Rant`
- `Others`

The folder on disk should be the lowercase form of that category. This matters because blog loading uses:

```text
/blogs/${category.toLowerCase()}/${blog}
```

Example:

```text
category: "Tutorial"
path: "Chat-Memory.md"

-> loads from public/blogs/tutorial/Chat-Memory.md
```

## Required Config Fields

Add a new object to `blogPosts` with these fields:

- `date`
- `writer`
- `header`
- `description`
- `category`
- `path`

Use only the filename in `path`, not the full folder path.

## Wiring Steps

1. Confirm the markdown file exists in the matching category folder under `public/blogs/`.
2. Open [blogs.config.ts](/Volumes/project-workspace/dota/dota-workspace/packages/apps/dota-web/src/configs/blogs.config.ts).
3. Add a `blogPosts` entry with the display metadata.
4. Set `category` to the logical blog category and `path` to the markdown filename only.
5. Verify the route shape stays valid:

```text
/blogs/content?category=<Category>&blog=<File-Name>.md
```

## Common Mistakes

The most common failure here is mixing folder paths with filenames. Keep `path` as `My-Post.md`, not `tutorial/My-Post.md`.

Another common mistake is a category-folder mismatch. If the config says `Tutorial` but the file is stored under `public/blogs/tools/`, the content route will request the wrong file.

## Summary

To wire a blog in this repo, place the markdown file in the right `public/blogs/<category>/` folder, then add a matching metadata entry in `blogPosts`. The category controls the folder, and the `path` field should contain only the filename.
