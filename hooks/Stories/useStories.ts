import { useQuery } from "@tanstack/react-query";
import StoriesApi from "@/api/Stories";

export const useStories = () => {
    return useQuery({
        queryKey: ["stories"],
        queryFn: () => StoriesApi.fetchAll(),
    });
};

export const useStoriesByLevel = (level: string) => {
    return useQuery({
        queryKey: ["stories", level],
        queryFn: () => StoriesApi.fetchByLevel(level),
    });
};
