<p align="center">
  <a href="https://captionforge.kajatheepan.dev/" target="_blank">
    <img src="https://capsule-render.vercel.app/api?type=blur&height=300&color=timeGradient&section=header&reversal=true&text=Caption+Forge+&textBg=false&fontColor=B8B8FF&fontSize=75&fontAlign=50&fontAlignY=50&animation=fadeIn&rotate=0&strokeWidth=0&desc=The+Caption+Formatter&descSize=30&descAlign=49&descAlignY=68" alt="Live Demo" />
  </a>
</p>
<p align="center">
  <b>Write your caption once — post it everywhere, formatted right.</b>
</p>

<p align="center">
  <img alt="Version" src="https://img.shields.io/badge/version-1.0.0-blue.svg?cacheSeconds=2592000" />
  <img alt="License: MIT" src="https://img.shields.io/badge/License-MIT-yellow.svg" />
  <img alt="React" src="https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=white" />
  <img alt="TypeScript" src="https://img.shields.io/badge/TypeScript-5.8-3178C6?logo=typescript&logoColor=white" />
  <img alt="Vite" src="https://img.shields.io/badge/Vite-7-646CFF?logo=vite&logoColor=white" />
</p>

<p align="center">
  <img alt="PRs welcome" src="https://img.shields.io/badge/PRs-welcome-ff69b4.svg" />
  <img alt="Made with love" src="https://img.shields.io/badge/made%20with-%E2%99%A5-red" />
  <a href="https://github.com/kajatheepan/Caption-Formatter/stargazers">
    <img alt="Stars" src="https://img.shields.io/github/stars/kajatheepan/Caption-Formatter?style=social" />
  </a>
</p>

Caption Formatter is a rich-text editor for writing a caption once and exporting it correctly formatted for **Instagram, LinkedIn, Telegram, WhatsApp, and YouTube** — each platform has its own quirks around bold/italic text, links, and hashtags, and this tool handles the conversion for you.

## Features

- **Rich text editor** (built on Tiptap) with bold, italic, underline, and link support
- **Per-platform formatting** — converts rich text into each platform's expected syntax (e.g. Unicode bold/italic for Instagram, Markdown links for Telegram)
- **Hashtag input** with cleanup/deduplication
- **Live platform previews** with character counters so you can see how a caption will render before posting
- **Copy to clipboard** per platform, or copy all at once
- **Shareable links** — save a caption and share it via URL
- **Light/dark friendly UI** built with Tailwind CSS and Radix primitives

## Tech Stack

- React 19 + TypeScript
- Vite
- Tailwind CSS v4
- Tiptap (rich text editing)
- Vitest + Testing Library

## Getting Started

**Install dependencies**

```sh
npm install
```

**Run the dev server**

```sh
npm run dev
```

**Run tests**

```sh
npm run test
```

**Lint**

```sh
npm run lint
```

**Build for production**

```sh
npm run build
```

**Preview the production build**

```sh
npm run preview
```

## Contributing

Contributions, issues, and feature requests are welcome!

1. Fork the repo and create your branch from `main`
2. Make your changes, adding tests where it makes sense
3. Run `npm run lint` and `npm run test` before submitting
4. Open a pull request describing what you changed and why

Feel free to check the [issues page](https://github.com/kajatheepan/Caption-Formatter/issues) if you want to contribute.

## Author

 <p align="left"> <a href="https://github.com/kajatheepan"> <img src="https://img.shields.io/badge/GitHub-kajatheepan-181717?style=for-the-badge&logo=github" alt="GitHub"> </a> </p>

## License

This project is licensed under the [MIT License](LICENSE).

---
