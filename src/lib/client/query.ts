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

function authParamsString(config?: AppConfig) {
  if (config?.authType === 'basic') {
    return `&authType=basic&&username=${config.username}&password=${config.password}`
  } else if (config?.authType === 'token') {
    return `&authType=token&&token=${config.token}`
  } else {
    return ''
  }
}

export function useGetCollections(config?: AppConfig) {
  return useQuery({
    queryKey: ['config', config?.connectionString, 'collections'],
    queryFn: async (): Promise<Collection[]> => {
      const response = await fetch(
        `/api/collections?connectionString=${config?.connectionString}${authParamsString(config)}`
      )
      if (!response.ok) {
        throw new Error(`API getCollections returns response code: ${response.status}, message: ${response.statusText}`)
      }
      return response.json()
    },
    enabled: !!config?.connectionString,
    retry: false,
  })
}

export function useGetCollectionRecords(config?: AppConfig, collectionName?: string, page?: number, query?: string) {
  return useQuery({
    queryKey: ['collections', collectionName, 'records', query, page],
    queryFn: async (): Promise<QueryResult> => {
      if (query === undefined || query === '') {
        const response = await fetch(
          `/api/collections/${collectionName}/records?connectionString=${config?.connectionString}&page=${page}&query=${query}${authParamsString(config)}`
        )
        return response.json()
      } else {
        const response = await fetch(
          `/api/collections/${collectionName}/records?connectionString=${config?.connectionString}&authType=${config?.authType}${authParamsString(config)}`,
          {
            method: 'POST',
            body: JSON.stringify({ query: query }),
          }
        )
        return response.json()
      }
    },
    enabled: !!config?.connectionString,
    retry: false,
  })
}
