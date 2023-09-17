import {useQuery} from "@tanstack/react-query";
import {getConfig} from "@/lib/client/localstorage";

export function useGetConfig() {
  return useQuery({
    queryKey: ['config'],
    queryFn: getConfig,
    retry: false
  })
}

export function useGetCollections(config) {
  return useQuery({
    queryKey: ['collections', config?.connectionString],
    queryFn: async () => {
      const response = await fetch(`/api/collections?connectionString=${config?.connectionString}`)
      return response.json()
    },
    enabled: !!config?.connectionString,
  })
}

export function useGetCollectionRecords(config, collectionName) {
  return useQuery({
    queryKey: ['collections', collectionName],
    queryFn: async () => {
      const response = await fetch(`/api/collections/${collectionName}/records?connectionString=${config?.connectionString}`)
      return response.json()
    },
    enabled: !!config?.connectionString
  })
}
