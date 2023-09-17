export function getConfig() {
  return JSON.parse(window.localStorage.getItem('vector-ui-config'))
}

export function updateConfig(config) {
  const stringValue = JSON.stringify(config)
  return window.localStorage.setItem('vector-ui-config', stringValue)
}

export function updateConnectionString(connectionString) {
  const config = getConfig() || {connectionString: '', currentCollection: ''}
  const newConfig = {
    ...config,
    connectionString
  }
  return updateConfig(newConfig)
}
