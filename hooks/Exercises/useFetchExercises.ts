import { useQuery } from "@tanstack/react-query";

import { Exercise } from "@/types";
import ExercisesApi from "@/utils/api/Exercises";
import { QueryKeys } from "@/utils/queryKeys";

export const useFetchExercises = (storyId: string) => {
  return useQuery<Exercise[], Error>({
    queryKey: QueryKeys.exercises(storyId),
    queryFn: () => ExercisesApi.fetchByStoryId(storyId),
    enabled: !!storyId,
  });
};
