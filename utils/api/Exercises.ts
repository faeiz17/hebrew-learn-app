import httpClient from "./HttpClient";

import { Exercise } from "@/types";

class ExercisesApi {
  static async fetchByStoryId(storyId: string): Promise<Exercise[]> {
    const response = await httpClient.get<Exercise[]>(`/exercises/story/${storyId}`);
    return response.data;
  }
}

export default ExercisesApi;
