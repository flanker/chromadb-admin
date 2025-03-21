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
  }
  const newConfig = {
    ...config,
    connectionString,
  }
  return updateConfig(newConfig)
}
