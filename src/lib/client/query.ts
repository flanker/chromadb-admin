import {useQuery} from "@tanstack/react-query";
import {getConfig} from "@/lib/client/localstorage";
import {AppConfig, Collection, Record} from "@/lib/types";

export function useGetConfig() {
  return useQuery({
    queryKey: ['config'],
    queryFn: getConfig,
    retry: false
  })
}

export function useGetCollections(config: AppConfig) {
  return useQuery({
    queryKey: ['collections', config?.connectionString],
    queryFn: async () : Promise<Collection[]> => {
      const response = await fetch(`/api/collections?connectionString=${config?.connectionString}`)
      return response.json()
    },
    enabled: !!config?.connectionString,
  })
}

export function useGetCollectionRecords(config: AppConfig, collectionName: string) {
  return useQuery({
    queryKey: ['collections', collectionName],
    queryFn: async () : Promise<Record[]> => {
      const response = await fetch(`/api/collections/${collectionName}/records?connectionString=${config?.connectionString}`)
      return response.json()
    },
    enabled: !!config?.connectionString
  })
}
