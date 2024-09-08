import { api } from "@/../convex/_generated/api";
import { useQuery } from "convex/react";

export const useGetCommunityContainers = () => {
  const data = useQuery(api.container.getCommunityContainers) || [];
  const isLoading = data === undefined;

  return { data, isLoading };
};
