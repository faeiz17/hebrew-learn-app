import httpClient from "./HttpClient";
import { Story } from "@/types";

class StoriesApi {
    static async fetchAll(): Promise<Story[]> {
        const response = await httpClient.get<Story[]>("/stories");
        return response.data;
    }

    static async fetchByLevel(level: string): Promise<Story[]> {
        const response = await httpClient.get<Story[]>(`/stories/level/${level}`);
        return response.data;
    }

    static async fetchById(id: string): Promise<Story> {
        const response = await httpClient.get<Story>(`/stories/${id}`);
        return response.data;
    }
}

export default StoriesApi;
