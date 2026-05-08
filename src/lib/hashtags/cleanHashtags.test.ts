import { describe, expect, it } from "vitest";
import { cleanHashtags } from "./cleanHashtags";

describe("cleanHashtags", () => {
    it("cleans and formats hashtags correctly", () => {
        expect(cleanHashtags("social, #media creator!")).toEqual(["#social", "#media", "#creator"]);
    });

    it("removes duplicate hashtags regardless of casing", () => {
        expect(cleanHashtags(["#Marketing", "marketing", "MARKETING"])).toEqual(["#marketing"]);
    });

    it("handles hashtag arrays and strings with whitespace", () => {
        expect(cleanHashtags(["tech,   coding", "  #developer "])).toEqual(["#tech", "#coding", "#developer"]);
    });
});
