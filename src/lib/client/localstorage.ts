import type { AppConfig } from '@/lib/types'

const localStorageItemKey = 'chromadb-admin-config'

export function getConfig(): AppConfig {
  const config = window.localStorage.getItem(localStorageItemKey)
  if (config) {
    return JSON.parse(config)
  } else {
    return {
      connectionString: '',
      currentCollection: '',
      authType: 'no_auth',
      token: '',
      username: '',
      password: '',
      tenant: 'default_tenant',
      database: 'default_database',
      embeddingModelUrl: '',
      embeddingModel: 'text-embedding-3-small',
    }
  }
}

export function updateConfig(config: AppConfig) {
  const stringValue = JSON.stringify(config)
  return window.localStorage.setItem(localStorageItemKey, stringValue)
}

export function updateConnectionString(connectionString: string) {
  const config = getConfig() || {
    connectionString: '',
    currentCollection: '',
    authType: '',
    token: '',
    username: '',
    password: '',
    tenant: '',
    database: '',
    embeddingModelUrl: '',
    embeddingModel: '',
  }
  const newConfig = {
    ...config,
    connectionString,
  }
  return updateConfig(newConfig)
}
