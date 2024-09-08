import { api } from "@/../convex/_generated/api";
import { useQuery } from "convex/react";

export const useGetTags = () => {
  const tags = useQuery(api.tags.getTags) || [];
  const isLoading = tags === undefined;

  return { tags, isLoading };
};
