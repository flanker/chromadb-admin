import { useQuery } from '@tanstack/react-query'

import { getConfig } from '@/lib/client/localstorage'

import type { AppConfig, Collection, Record } from '@/lib/types'

export function useGetConfig() {
  return useQuery({
    queryKey: ['config'],
    queryFn: getConfig,
    retry: false,
  })
}

export function useGetCollections(config: AppConfig) {
  return useQuery({
    queryKey: ['config', config?.connectionString, 'collections'],
    queryFn: async (): Promise<Collection[]> => {
      const response = await fetch(`/api/collections?connectionString=${config?.connectionString}`)
      return response.json()
    },
    enabled: !!config?.connectionString,
  })
}

export function useGetCollectionRecords(config: AppConfig, collectionName: string) {
  return useQuery({
    queryKey: ['collections', collectionName, 'records'],
    queryFn: async (): Promise<Record[]> => {
      const response = await fetch(
        `/api/collections/${collectionName}/records?connectionString=${config?.connectionString}`
      )
      return response.json()
    },
    enabled: !!config?.connectionString,
  })
}
