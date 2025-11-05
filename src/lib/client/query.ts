import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'

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
        `/api/collections?connectionString=${config?.connectionString}${authParamsString(config)}&tenant=${config?.tenant}&database=${config?.database}`
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
          `/api/collections/${collectionName}/records?connectionString=${config?.connectionString}&tenant=${config?.tenant}&database=${config?.database}&page=${page}&query=${query}${authParamsString(config)}`
        )
        return response.json()
      } else {
        const response = await fetch(
          `/api/collections/${collectionName}/records?connectionString=${config?.connectionString}&tenant=${config?.tenant}&database=${config?.database}&authType=${config?.authType}${authParamsString(config)}`,
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

export function useDeleteRecord(collectionName: string) {
  const queryClient = useQueryClient()
  const config = getConfig()

  return useMutation({
    mutationFn: async (recordId: string) => {
      const response = await fetch(
        `/api/collections/${collectionName}/records?connectionString=${config?.connectionString}&tenant=${config?.tenant}&database=${config?.database}${authParamsString(config)}`,
        {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ id: recordId }),
        }
      )

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Failed to delete record')
      }

      return response.json()
    },
    onSuccess: () => {
      // Invalidate queries to refetch data
      queryClient.invalidateQueries({ queryKey: ['collections', collectionName, 'records'] })
    },
  })
}

export function useGetEmbedding() {
  return useMutation({
    mutationFn: async ({ text, modelUrl, model }: { text: string; modelUrl: string; model?: string }) => {
      const response = await fetch('/api/embedding', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text, modelUrl, model }),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Failed to get embedding')
      }

      return response.json()
    },
  })
}

export function useDeleteCollection() {
  const queryClient = useQueryClient()
  const config = getConfig()

  return useMutation({
    mutationFn: async (collectionName: string) => {
      const response = await fetch(
        `/api/collections?connectionString=${config?.connectionString}&tenant=${config?.tenant}&database=${config?.database}${authParamsString(config)}`,
        {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ name: collectionName }),
        }
      )

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Failed to delete collection')
      }

      return response.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['config', config?.connectionString, 'collections'] })
    },
  })
}

export function useRenameCollection() {
  const queryClient = useQueryClient()
  const config = getConfig()

  return useMutation({
    mutationFn: async ({ oldName, newName }: { oldName: string; newName: string }) => {
      const response = await fetch(
        `/api/collections?connectionString=${config?.connectionString}&tenant=${config?.tenant}&database=${config?.database}${authParamsString(config)}`,
        {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ oldName, newName }),
        }
      )

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Failed to rename collection')
      }

      return response.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['config', config?.connectionString, 'collections'] })
    },
  })
}
