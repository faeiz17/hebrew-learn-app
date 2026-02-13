import httpClient from "./HttpClient";

import { Exercise } from "@/types";

class ExercisesApi {
  static async fetchByStoryId(storyId: string): Promise<Exercise[]> {
    // SIMULATION
    // const response = await httpClient.get(\`/exercises/story/\${storyId}\`);
    // return response.data;

    // MOCK DATA
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve([
          {
            _id: "ex_1",
            storyId,
            question: 'What does "Shalom" mean?',
            options: [
              {
                _id: "opt_1",
                hebrew: "שָׁלוֹם",
                english: "Hello/Peace",
                isCorrect: true,
              },
              {
                _id: "opt_2",
                hebrew: "תּוֹדָה",
                english: "Thank you",
                isCorrect: false,
              },
              {
                _id: "opt_3",
                hebrew: "בְּבַקָּשָׁה",
                english: "Please",
                isCorrect: false,
              },
              {
                _id: "opt_4",
                hebrew: "סְלִיחָה",
                english: "Sorry",
                isCorrect: false,
              },
            ],
          },
          {
            _id: "ex_2",
            storyId,
            question: 'How do you say "Thank you"?',
            options: [
              {
                _id: "opt_5",
                hebrew: "שָׁלוֹם",
                english: "Hello/Peace",
                isCorrect: false,
              },
              {
                _id: "opt_6",
                hebrew: "תּוֹדָה",
                english: "Thank you",
                isCorrect: true,
              },
              {
                _id: "opt_7",
                hebrew: "כֵּן",
                english: "Yes",
                isCorrect: false,
              },
              { _id: "opt_8", hebrew: "לֹא", english: "No", isCorrect: false },
            ],
          },
        ]);
      }, 800);
    });
  }
}

export default ExercisesApi;
