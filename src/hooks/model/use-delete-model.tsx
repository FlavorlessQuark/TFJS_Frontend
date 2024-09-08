import { useCallback, useMemo, useState } from "react"
import { useMutation } from "convex/react";
import { api } from "@/../convex/_generated/api";
import { Id } from "@/../convex/_generated/dataModel";

interface Model {
  name: string;
  layers: any[];
  logs: any;
}

type RequestType = {
    id: Id<"model">;
};

type ResponseType = {
    message: string;
    status: number;
    model: Model;
} | null;

type Options = {
    onSuccess: (data: any) => void;
    onError: (error: any) => void;
    onFinally: () => void;
    throwError?: boolean;
}

export const useDeleteModel = () => {
  const [data, setData] = useState<ResponseType>(null)
  const [error, _] = useState<Error | null>(null)
  const [status, setStatus] = useState<"loading" | "success" | "error" | "finally" | null>(null)
  
  const isLoading = useMemo(() => status === "loading", [status])
  const isSuccess = useMemo(() => status === "success", [status])
  const isError = useMemo(() => status === "error", [status])
  const isFinally = useMemo(() => status === "finally", [status])

  const mutation = useMutation(api.model.deleteModel)

  const mutate = useCallback(async (values: RequestType, options?: Options) => {
    try {
      setData(null)
      setStatus("loading")
      const response = await mutation(values)
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