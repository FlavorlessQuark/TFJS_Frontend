import { useCallback, useMemo, useState } from "react"
import { useMutation } from "convex/react";
import { api } from "@/../convex/_generated/api";
import { Id } from "@/../convex/_generated/dataModel";

interface Container {
    name: string;
    description?: string;
    tags?: string[];
    sharedWith?: Id<"users">[];
    public?: boolean;
}

type RequestType = {
    name: string;
    description?: string;
    tags?: string[];
    sharedWith?: Id<"users">[];
    public?: boolean;
};

type ResponseType = {
    message: string;
    status: number;
    container: Container;
} | null;

type Options = {
    onSuccess: (data: any) => void;
    onError: (error: any) => void;
    onFinally: () => void;
    throwError?: boolean;
}

export const useCreateContainer = () => {
  const [data, setData] = useState<ResponseType>(null)
  const [error, setError] = useState<Error | null>(null)
  const [status, setStatus] = useState<"loading" | "success" | "error" | "finally" | null>(null)
  
  const isLoading = useMemo(() => status === "loading", [status])
  const isSuccess = useMemo(() => status === "success", [status])
  const isError = useMemo(() => status === "error", [status])
  const isFinally = useMemo(() => status === "finally", [status])

  const mutation = useMutation(api.container.createContainer)

  const mutate = useCallback(async (values: RequestType, options?: Options) => {
    try {
      setData(null)
      setStatus("loading")
      const response = await mutation({
        ...values,
        public: values.public ?? false
      })
      options?.onSuccess?.(response)
    } catch (error) {
      options?.onError?.(error as Error)
      if (options?.throwError) {
        throw error
      }
    } finally {
      setStatus("finally")
      options?.onFinally?.()
    }
  }, [])

  return { 
    mutate,
    isLoading,
    isSuccess,
    isError,
    isFinally,
    data,
    error
  }
}