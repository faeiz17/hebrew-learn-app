export interface Story {
    _id: string;
    titleHebrew: string;
    titleEnglish: string;
    contentHebrew: string;
    contentEnglish: string;
    transliteration?: string;
    level: "easy" | "medium" | "hard";
}
