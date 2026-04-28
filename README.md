# CaptionForge — Multi-Platform Caption Formatter

CaptionForge is a web app for writing one caption and formatting it for multiple social media platforms instantly.

The goal of this project is to help content creators, marketers, social media managers, and small businesses create platform-ready captions faster.

Users can write a caption once, add a footer, manage hashtags, preview how the caption looks on each platform, copy platform-specific versions, and optionally share an editable caption link with others.

---

## Project Goal

The MVP goal is:

> Write once → format for multiple platforms → preview → copy/share editable link

This project should not be just a text formatter. It should feel like a lightweight caption workspace.

---

## Current Project Status

### Already Implemented

- React + Vite + TypeScript setup
- Basic caption input using textarea
- Basic footer input using textarea
- Local draft saving using `localStorage`
- Debounced saving after typing
- Output cards for:
  - WhatsApp
  - Telegram
  - YouTube
- Basic platform formatting:
  - Telegram converts `*bold*` to `**bold**`
  - Telegram converts `_italic_` to `__italic__`
  - YouTube removes `*`, `_`, and `~`
- Copy button per output card
- Simple copied feedback
- Basic shadcn-style UI components:
  - Button
  - Card
  - Input
  - Textarea

### Not Implemented Yet

- TipTap rich text editor
- Editor toolbar
- Bold/italic/list controls
- Editor JSON storage
- Instagram output
- LinkedIn output
- Character count
- Platform-style preview UI
- Footer toggle
- Hashtag input
- Hashtag cleanup
- Duplicate hashtag removal
- Attach hashtags toggle
- Clean formatting button
- Copy all formatted captions
- Shareable links
- Supabase/Firebase database
- Shared caption auto-save
- Save status
- Clear local draft button
- Proper route structure
- Production deployment

---

## MVP Feature List

The MVP should include the following features.

---

## 1. Main Caption Editor

The main editor is where the user writes the caption.

### MVP Version

Start with a textarea.

### Final MVP Version

Replace the textarea with TipTap rich text editor.

### Required Features

- Write main caption
- Bold formatting
- Italic formatting
- Strikethrough formatting
- Underline formatting
- Inline code formatting
- Code block formatting
- Quote formatting
- Bullet list
- Numbered list
- Line breaks
- Keyboard shortcuts:
  - `Ctrl + B` for bold
  - `Ctrl + I` for italic
- Clean toolbar above editor

### Recommended Library

Use TipTap.

```bash
npm install @tiptap/react @tiptap/starter-kit @tiptap/extension-underline @tiptap/extension-link
```

### Why TipTap?

TipTap stores editor content as structured JSON. This makes it easier to convert the same caption into platform-specific formats.

Example pipeline:

```text
Editor content
    ↓
TipTap JSON
    ↓
Formatter engine
    ↓
WhatsApp / Telegram / YouTube / Instagram / LinkedIn output
```

Important rule:

The editor should stay rich and structured. Do not insert WhatsApp or Telegram
markdown directly into the editor. Exporters should decide the final platform
syntax.

---

## 2. Footer Support

Users should be able to add an optional footer.

### Examples

```text
Follow for more updates.
DM us for details.
Subscribe for more.
```

### Required Features

- Footer textarea/input
- Toggle: `Include Footer`
- Footer should be appended only when the toggle is enabled
- Footer should be included in copy output
- Footer should be saved in local draft and shared document

### Behavior

If footer is enabled:

```text
Main caption

Footer text
```

If footer is disabled:

```text
Main caption
```

---

## 3. Hashtag System

Users should be able to add hashtags separately from the caption.

### Required Features

- Hashtag input
- Press `Enter`, `Space`, or comma to add a hashtag
- Hashtag chips
- Remove hashtag chip
- Auto-format hashtags
- Remove duplicate hashtags
- Toggle: `Attach hashtags to caption`

### Hashtag Cleanup Rules

Input:

```text
social media #content, creator creator
```

Output:

```text
#social #media #content #creator
```

### Rules

- Remove extra spaces
- Remove duplicate hashtags
- Add `#` if missing
- Convert to lowercase if needed
- Ignore empty values

---

## 4. Platform Outputs

The app should generate formatted captions for these platforms:

- WhatsApp
- Telegram
- YouTube
- Instagram
- LinkedIn

Each platform output should include:

- Platform name
- Platform badge
- Character count
- Character limit
- Formatted caption output
- Copy button
- Optional platform-specific preview
- Optional custom platform override

---

## 5. Platform Formatting Rules

### WhatsApp

WhatsApp supports simple markdown-like formatting.

#### Rules

```text
Bold: *text*
Italic: _text_
Strikethrough: ~text~
Inline code: `text`
Monospace/code block: ```text```
Bullet list: - item
Numbered list: 1. item
Quote: > text
```

#### Output Example

```text
*Big update today*

_This is important._

Follow for more.
#update #social
```

---

### Telegram

Telegram supports markdown-style formatting.

#### Rules

For normal manual copy/paste into the Telegram app, export clean readable text.
Telegram does not automatically render pasted Markdown symbols in normal chats.

```text
Bold: text
Italic: text
Underline: text
Strikethrough: text
Spoiler: text
Inline code: text
Code block: text
Quote: > text
Link: text (url)
Bullet list: - item
Numbered list: 1. item
```

#### Output Example

```text
Big update today

This is important.

Follow for more.
#update #social
```

---

### YouTube

YouTube descriptions should be plain text.

#### Rules

- Remove markdown syntax
- Preserve line breaks
- Keep URLs
- Hashtags can be added at the bottom
- Footer can be added if enabled

#### Output Example

```text
Big update today

This is important.

Follow for more.
#update #social
```

---

### Instagram

Instagram captions should be readable and hashtag-friendly.

#### Rules

- Plain caption
- Footer optional
- Hashtags usually placed at the bottom
- Respect 2,200 character limit

#### Output Example

```text
Big update today

This is important.

Follow for more.

#update #social
```

---

### LinkedIn

LinkedIn captions should be structured and professional.

#### Rules

- Plain text
- Preserve line breaks
- Hashtags at the bottom
- Respect 3,000 character limit

#### Output Example

```text
Big update today

This is important for creators and small teams.

Follow for more insights.

#content #marketing
```

---

## 6. Character Count

Each platform output should show character usage.

### Required Features

- Current character count
- Platform limit
- Visual warning

### Suggested Limits

| Platform | Limit |
|---|---:|
| WhatsApp | 65,536 |
| Telegram | 4,096 |
| YouTube | 5,000 |
| Instagram | 2,200 |
| LinkedIn | 3,000 |

### Warning Rules

| Usage | State |
|---|---|
| Under 70% | Normal |
| 70%–90% | Warning |
| Over 90% | Danger |
| Over limit | Error |

---

## 7. Platform Preview Mode

The app should not only show plain output. It should preview how captions may look on platforms.

### Required Preview Types

#### WhatsApp

- Chat header
- Message bubble
- Timestamp
- Read ticks

#### Telegram

- Channel/message card
- Dark message background
- View count

#### YouTube

- Video preview block
- Title placeholder
- Description area

#### Instagram

- Post layout
- Caption section
- Hashtags visually separated

#### LinkedIn

- Professional post layout
- Name/title
- Action row

---

## 8. Copy Features

Users should be able to copy formatted output easily.

### Required Features

- Copy individual platform caption
- Copy all platform captions
- Copied feedback

### Copy Button States

```text
Copy
Copied!
```

### Copy All Format

```text
=== WhatsApp ===
...

=== Telegram ===
...

=== YouTube ===
...

=== Instagram ===
...

=== LinkedIn ===
...
```

---

## 9. Clean Formatting

Add a button to clean messy input text.

### Required Features

- Remove extra spaces
- Remove repeated blank lines
- Trim leading/trailing whitespace
- Normalize line breaks
- Clean footer
- Clean hashtags

### Example

Before:

```text
Hello     world



This is     a test.
```

After:

```text
Hello world

This is a test.
```

---

## 10. Local Draft Saving

The app should save user work locally so refresh does not erase content.

### Storage

Use `localStorage`.

### Suggested Key

```text
captionforge_draft
```

### Required Features

- Auto-save local draft
- Debounce saving
- Restore local draft on reload
- Clear local draft button

### Important Rule

If the user opens a shared caption link, shared data should take priority over local draft.

---

## 11. Sharing Feature

The sharing feature allows one person to write a caption and share an editable link with another person.

### MVP Behavior

- User writes caption
- User clicks `Share`
- App saves caption data to database
- App generates a shareable link
- Another user opens the link
- The caption loads
- The second user can edit and copy it
- Changes auto-save

### Example Route

```text
/c/:id
```

Example:

```text
https://yourapp.com/c/abc123
```

---

## 12. Database

Use a third-party backend service to avoid building your own backend.

### Recommended

Supabase

### Reason

- No custom backend server required
- Simple database
- Easy CRUD operations
- Good for structured documents
- Can add auth later

---

## 13. Supabase Schema

Create a table named `captions`.

```sql
create table captions (
  id uuid primary key default gen_random_uuid(),
  title text default 'Untitled Caption',
  content jsonb not null,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);
```

### Optional Updated Timestamp Trigger

```sql
create or replace function update_updated_at_column()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger update_captions_updated_at
before update on captions
for each row
execute procedure update_updated_at_column();
```

---

## 14. Caption Document Shape

Internally, the app should use one document object.

```ts
export type CaptionDocument = {
  id?: string | null;
  title: string;
  editorContent: unknown;
  footer: string;
  hashtags: string[];
  customPlatformText: {
    whatsapp?: string;
    telegram?: string;
    youtube?: string;
    instagram?: string;
    linkedin?: string;
  };
  settings: {
    includeFooter: boolean;
    attachHashtags: boolean;
    optimizeForPlatform: boolean;
    previewMode: boolean;
  };
  createdAt?: string;
  updatedAt?: string;
};
```

---

## 15. Auto-Save for Shared Captions

Shared captions should auto-save after editing.

### Required Features

- Debounced saving
- Save status indicator
- Error handling

### Save Statuses

```text
Unsaved changes
Saving...
Saved
Save failed
```

### Debounce Delay

Recommended:

```text
800ms to 1200ms
```

---

## 16. Routing

Use a proper route structure.

### Routes

| Route | Purpose |
|---|---|
| `/` | New/local caption workspace |
| `/c/:id` | Shared editable caption |
| `*` | Not found page |

### Recommended Library

```bash
npm install react-router-dom
```

---

## 17. Recommended Folder Structure

```text
src/
  app/
    App.tsx
    router.tsx

  pages/
    HomePage.tsx
    SharedCaptionPage.tsx
    NotFoundPage.tsx

  components/
    layout/
      AppLayout.tsx
      TopBar.tsx
      Footer.tsx

    editor/
      CaptionEditor.tsx
      EditorToolbar.tsx

    inputs/
      FooterInput.tsx
      HashtagInput.tsx
      SettingsPanel.tsx

    output/
      PlatformTabs.tsx
      PlatformPreviewCard.tsx
      PlatformPreview.tsx
      CharacterCounter.tsx
      CopyButton.tsx

    sharing/
      ShareButton.tsx
      ShareModal.tsx
      SaveStatus.tsx

    ui/
      button.tsx
      card.tsx
      input.tsx
      textarea.tsx
      switch.tsx
      dialog.tsx

  hooks/
    useCaptionDocument.ts
    useLocalDraft.ts
    useAutoSave.ts
    useClipboard.ts
    useDebounce.ts

  lib/
    supabaseClient.ts
    constants.ts

    formatter/
      index.ts
      types.ts
      extractText.ts
      whatsappFormatter.ts
      telegramFormatter.ts
      youtubeFormatter.ts
      instagramFormatter.ts
      linkedinFormatter.ts

    hashtags/
      cleanHashtags.ts

    storage/
      localDraft.ts

    sharing/
      captionsApi.ts

  types/
    caption.ts
    platform.ts

  styles/
    globals.css
```

---

## 18. Formatter Architecture

The formatter should be separated from the UI.

### Main Formatter API

```ts
formatForPlatform({
  platform,
  document
});
```

### Example

```ts
const output = formatForPlatform({
  platform: "whatsapp",
  document: captionDocument
});
```

### Platform Type

```ts
export type Platform =
  | "whatsapp"
  | "telegram"
  | "youtube"
  | "instagram"
  | "linkedin";
```

### Formatter Output Type

```ts
export type FormattedOutput = {
  platform: Platform;
  label: string;
  text: string;
  characterCount: number;
  characterLimit: number;
  isOverLimit: boolean;
};
```

---

## 19. UI Layout

Use a professional split-screen workspace.

### Desktop Layout

```text
-----------------------------------------------------
Top Bar
Logo                         Save Status Share Clear
-----------------------------------------------------

Left Panel                   Right Panel
Editor                       Platform Preview
Footer                       Tabs
Hashtags                     Preview Card
Settings                     Copy Button
Clean Button                 Character Count
-----------------------------------------------------
```

### Mobile Layout

```text
Top Bar

Editor
Footer
Hashtags
Settings

Platform Tabs
Preview Card
Copy Buttons
```

---

## 20. Main UI Components

### TopBar

Responsibilities:

- Show logo/name
- Show save status
- Show Share button
- Show Copy All button
- Show Clear button

---

### CaptionEditor

Responsibilities:

- Render TipTap editor
- Sync editor JSON to app state
- Handle toolbar actions

---

### EditorToolbar

Responsibilities:

- Bold
- Italic
- Strikethrough
- Underline
- Bullet list
- Numbered list
- Quote
- Inline code
- Code block
- Clear formatting

---

### FooterInput

Responsibilities:

- Edit footer text
- Toggle include footer

---

### HashtagInput

Responsibilities:

- Add hashtags
- Render hashtag chips
- Remove hashtags
- Auto-format hashtags
- Toggle attach hashtags

---

### SettingsPanel

Responsibilities:

- Include footer
- Attach hashtags
- Optimize for platform
- Preview mode

---

### PlatformTabs

Responsibilities:

- Switch selected platform
- Show available platforms

---

### PlatformPreviewCard

Responsibilities:

- Show selected platform output
- Show badge
- Show copy button
- Show character count
- Render platform preview

---

### ShareModal

Responsibilities:

- Show generated share link
- Copy share link
- Show loading/error states

---

## 21. Environment Variables

Create `.env.local`.

```env
VITE_SUPABASE_URL=
VITE_SUPABASE_ANON_KEY=
```

Never commit `.env.local`.

Add this to `.gitignore`:

```text
.env
.env.local
.env.*.local
```

---

## 22. Installation

```bash
npm install
```

---

## 23. Run Locally

```bash
npm run dev
```

---

## 24. Build

```bash
npm run build
```

---

## 25. Preview Production Build

```bash
npm run preview
```

---

## 26. Development Roadmap

### Phase 1 — Stabilize Current App

Goal: Make the current simple version reliable.

Tasks:

- Install dependencies
- Make sure app builds
- Fix TypeScript errors
- Improve responsive layout
- Remove `h-screen` overflow issues
- Confirm local draft works
- Confirm copy buttons work

Estimated time:

```text
2–4 hours
```

---

### Phase 2 — Upgrade UI Layout

Goal: Move from simple form UI to workspace UI.

Tasks:

- Implement split layout
- Add top navigation bar
- Add platform tabs
- Add preview card layout
- Add mobile responsiveness
- Convert generated UI design into React components

Estimated time:

```text
5–8 hours
```

---

### Phase 3 — Add Missing Platform Outputs

Goal: Support all MVP platforms.

Tasks:

- Add Instagram output
- Add LinkedIn output
- Add platform constants
- Add platform limits
- Add platform formatter files

Estimated time:

```text
3–5 hours
```

---

### Phase 4 — Footer and Hashtags

Goal: Make footer and hashtags configurable.

Tasks:

- Add footer toggle
- Add hashtag input
- Add hashtag chips
- Add duplicate removal
- Add hashtag cleanup
- Add attach hashtags toggle

Estimated time:

```text
4–6 hours
```

---

### Phase 5 — Character Counts and Copy Features

Goal: Improve output usability.

Tasks:

- Add character counter per platform
- Add warning states
- Add copy all
- Improve copied feedback
- Add copy failure handling

Estimated time:

```text
2–4 hours
```

---

### Phase 6 — Clean Formatting

Goal: Help users clean messy captions.

Tasks:

- Add clean text button
- Normalize whitespace
- Remove repeated blank lines
- Clean footer
- Clean hashtags

Estimated time:

```text
2–3 hours
```

---

### Phase 7 — Platform Previews

Goal: Make the app feel like a real caption workspace.

Tasks:

- WhatsApp preview
- Telegram preview
- YouTube preview
- Instagram preview
- LinkedIn preview

Estimated time:

```text
5–10 hours
```

---

### Phase 8 — TipTap Editor

Goal: Replace plain textarea with rich text editor.

Tasks:

- Install TipTap
- Add editor component
- Add toolbar
- Add bold/italic support
- Add bullet and numbered list support
- Store editor content as JSON
- Update formatter engine to read editor JSON

Estimated time:

```text
6–10 hours
```

---

### Phase 9 — Supabase Sharing

Goal: Add editable share links.

Tasks:

- Create Supabase project
- Create captions table
- Add Supabase client
- Add create caption function
- Add load caption function
- Add update caption function
- Add `/c/:id` route
- Add share modal
- Add share link copy
- Add shared caption auto-save

Estimated time:

```text
8–14 hours
```

---

### Phase 10 — Save Status and Error Handling

Goal: Make sharing reliable and professional.

Tasks:

- Add save status
- Add loading state
- Add save failed state
- Add not found state
- Add network error handling
- Add invalid shared ID handling

Estimated time:

```text
3–5 hours
```

---

### Phase 11 — Testing and Polish

Goal: Make the MVP usable.

Tasks:

- Test all platforms
- Test copy buttons
- Test local draft
- Test clear draft
- Test share links
- Test shared auto-save
- Test mobile layout
- Test long captions
- Test empty captions
- Test invalid links

Estimated time:

```text
4–8 hours
```

---

## 27. Total Estimated Time

### Focused MVP

```text
35–60 hours
```

### Faster MVP Without TipTap and Advanced Previews

```text
25–35 hours
```

### Polished MVP With Sharing

```text
45–70 hours
```

---

## 28. Build Priority

Build in this order:

```text
1. Stabilize current app
2. Implement new layout
3. Add missing platforms
4. Add footer toggle
5. Add hashtag system
6. Add character counts
7. Add copy all
8. Add clean formatting
9. Add platform previews
10. Replace textarea with TipTap
11. Add Supabase sharing
12. Add auto-save and save status
13. Test and deploy
```

Do not start with Supabase sharing first. Sharing depends on the document structure being stable.

---

## 29. MVP Definition of Done

The MVP is complete when this full flow works:

1. User opens the app
2. User writes a caption
3. User adds formatting
4. User adds footer
5. User adds hashtags
6. User sees platform-specific versions
7. User previews captions for each platform
8. User copies individual platform output
9. User copies all outputs
10. User creates a share link
11. Another user opens the shared link
12. Shared caption loads correctly
13. Second user edits the caption
14. Changes auto-save
15. User can copy formatted output

---

## 30. Features Not Included in MVP

Do not build these in the first MVP:

- User login
- Teams
- Real-time cursor collaboration
- Version history
- Commenting
- AI caption generation
- AI hashtag generation
- Post scheduling
- Analytics
- Payment system
- Browser extension
- Mobile app

These can be added after the MVP is stable.

---

## 31. Future Features

After MVP, possible improvements:

### AI Features

- Rewrite caption
- Generate hooks
- Generate hashtags
- Convert tone:
  - professional
  - casual
  - funny
  - viral
  - minimal

### Collaboration

- Read-only share links
- Edit links
- Password-protected captions
- Version history
- Comments

### Productivity

- Caption templates
- Saved hashtag sets
- Bulk caption formatting
- Export to CSV/JSON/TXT

### Platform Expansion

- Facebook
- Threads
- Pinterest
- TikTok
- Reddit

---

## 32. Professional Notes

### Engineering Principles

- Keep formatter logic separate from UI
- Keep platform constants centralized
- Avoid hardcoding platform rules inside components
- Use TypeScript types for document structure
- Save editor content as structured data
- Add Supabase sharing only after local document state is stable
- Do not overbuild real-time collaboration in MVP

### Product Principle

The app should not feel like a simple form.

It should feel like:

```text
Editor workspace + live platform preview
```

---

## 33. Suggested Commit Plan

Use small commits.

```text
chore: setup project dependencies
fix: stabilize current build
feat: add split workspace layout
feat: add platform tabs
feat: add instagram formatter
feat: add linkedin formatter
feat: add footer toggle
feat: add hashtag input
feat: add character counts
feat: add copy all action
feat: add clean formatting
feat: add platform previews
feat: integrate tiptap editor
feat: add supabase client
feat: add share modal
feat: add shared caption route
feat: add autosave for shared captions
fix: handle loading and error states
chore: polish responsive layout
```

---

## 34. License

Choose one:

```text
MIT License
```

or keep private until MVP is ready.

---

## 35. Project Summary

CaptionForge is a multi-platform caption formatting workspace.

The first MVP should focus on:

- Writing captions
- Formatting per platform
- Managing footer and hashtags
- Previewing output
- Copying captions
- Sharing editable links

Once this is stable, AI features and advanced collaboration can be added.
