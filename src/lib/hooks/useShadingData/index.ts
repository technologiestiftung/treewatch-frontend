import { getShading } from "@lib/requests/getShading";
import useSWR from "swr";

export interface useShadingDataReturnType {
  isLoading: boolean;
  data: number | null;
  error: Error | null;
}

export const useShadingData = (
  treeId: string | undefined,
): useShadingDataReturnType => {
  const params = [`Shading - Tree ID - ${treeId || "nodata"}`];
  const { data, error } = useSWR<number | undefined, Error>(
    params,
    () => treeId ? getShading(treeId) : undefined,
  );

  return {
    isLoading: !data && !error,
    data: data || null,
    error: error || null,
  };
};
