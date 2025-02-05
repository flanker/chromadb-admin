export function extractConnectionString(request: Request) {
  const url = new URL(request.url)
  const searchParams = new URLSearchParams(url.search)
  return searchParams.get('connectionString') || ''
}

export function extractAuth(request: Request) {
  const url = new URL(request.url)
  const searchParams = new URLSearchParams(url.search)
  return {
    authType: searchParams.get('authType') || '',
    token: searchParams.get('token') || '',
    username: searchParams.get('username') || '',
    password: searchParams.get('password') || '',
  }
}

export function extractTenant(request: Request) {
  const url = new URL(request.url)
  const searchParams = new URLSearchParams(url.search)
  return searchParams.get('tenant') || ''
}

export function extractDatabase(request: Request) {
  const url = new URL(request.url)
  const searchParams = new URLSearchParams(url.search)
  return searchParams.get('database') || ''
}
