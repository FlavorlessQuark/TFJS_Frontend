import { api } from "@/../convex/_generated/api";
import { useQuery } from "convex/react";

export const useGetContainers = () => {
  const data = useQuery(api.container.getMyContainers) || [];
  const isLoading = data === undefined;

  return { data, isLoading };
};
