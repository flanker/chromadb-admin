import { useQuery } from '@tanstack/react-query'

import { getConfig } from '@/lib/client/localstorage'

import type { AppConfig, Collection, QueryResult } from '@/lib/types'

export function useGetConfig() {
  return useQuery({
    queryKey: ['config'],
    queryFn: getConfig,
    retry: false,
  })
}

export function useGetCollections(config?: AppConfig) {
  return useQuery({
    queryKey: ['config', config?.connectionString, 'collections'],
    queryFn: async (): Promise<Collection[]> => {
      const response = await fetch(`/api/collections?connectionString=${config?.connectionString}`)
      return response.json()
    },
    enabled: !!config?.connectionString,
  })
}

export function useGetCollectionRecords(config?: AppConfig, collectionName?: string, page?: number, query?: string) {
  return useQuery({
    queryKey: ['collections', collectionName, 'records', query, page],
    queryFn: async (): Promise<QueryResult> => {
      if (query === undefined || query === '') {
        const response = await fetch(
          `/api/collections/${collectionName}/records?connectionString=${config?.connectionString}&page=${page}&query=${query}`
        )
        return response.json()
      } else {
        const response = await fetch(
          `/api/collections/${collectionName}/records?connectionString=${config?.connectionString}`,
          {
            method: 'POST',
            body: JSON.stringify({ query: query }),
          }
        )
        return response.json()
      }
    },
    enabled: !!config?.connectionString,
  })
}
