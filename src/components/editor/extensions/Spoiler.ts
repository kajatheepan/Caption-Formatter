import { Mark, mergeAttributes } from "@tiptap/core";

export const Spoiler = Mark.create({
    name: "spoiler",

    parseHTML() {
        return [{ tag: "span[data-spoiler]" }];
    },

    renderHTML({ HTMLAttributes }) {
        return [
            "span",
            mergeAttributes(HTMLAttributes, {
                "data-spoiler": "true",
                class: "rounded bg-zinc-900 text-zinc-900 selection:bg-zinc-700",
            }),
            0,
        ];
    },
});
