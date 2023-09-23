import type { AppConfig } from '@/lib/types'

export function getConfig(): AppConfig {
  const config = window.localStorage.getItem('vector-ui-config')
  if (config) {
    return JSON.parse(config)
  } else {
    return { connectionString: '', currentCollection: '' }
  }
}

export function updateConfig(config: AppConfig) {
  const stringValue = JSON.stringify(config)
  return window.localStorage.setItem('vector-ui-config', stringValue)
}

export function updateConnectionString(connectionString: string) {
  const config = getConfig() || { connectionString: '', currentCollection: '' }
  const newConfig = {
    ...config,
    connectionString,
  }
  return updateConfig(newConfig)
}
