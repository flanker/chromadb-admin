'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useQueryClient } from '@tanstack/react-query'
import { Container, Title, Paper, TextInput, Group, Button, Radio } from '@mantine/core'

import { useGetConfig } from '@/lib/client/query'
import { updateConfig } from '@/lib/client/localstorage'

export default function SetupPage() {
  const router = useRouter()
  const { data: appConfig } = useGetConfig()
  const [connectionString, setConnectionString] = useState(appConfig?.connectionString || '')
  const [tenant, setTenant] = useState(appConfig?.tenant || 'default_tenant')
  const [database, setDatabase] = useState(appConfig?.database || 'default_database')
  const [authType, setAuthType] = useState(appConfig?.authType || 'no_auth')
  const [username, setUsername] = useState(appConfig?.username || '')
  const [password, setPassword] = useState(appConfig?.password || '')
  const [token, setToken] = useState(appConfig?.token || '')

  useEffect(() => {
    if (appConfig != null && appConfig.connectionString) {
      setConnectionString(appConfig.connectionString)
    }
  }, [appConfig])

  const queryClient = useQueryClient()

  const connectButtonClicked = () => {
    updateConfig({ connectionString, authType, username, password, token, currentCollection: '', tenant, database })
    queryClient.setQueryData(['config'], { connectionString, tenant, database })
    router.push('/collections')
  }

  const backButtonClicked = () => {
    router.push('/collections')
  }

  return (
    <Container size={460} my={30}>
      <Title order={1} ta="center">
        Chromadb Admin
      </Title>
      <Paper withBorder shadow="md" p={30} radius="md" mt="xl">
        <TextInput
          label="Chroma connection string"
          description="For example, http://localhost:8000"
          placeholder="http://localhost:8000"
          value={connectionString}
          onChange={e => setConnectionString(e.currentTarget.value)}
        />
        <TextInput
          label="Tenant"
          description="The tenant to set."
          placeholder="default_tenant"
          value={tenant}
          onChange={e => setTenant(e.currentTarget.value)}
        />
        <TextInput
          label="Database"
          description="The database to set."
          placeholder="default_database"
          value={database}
          onChange={e => setDatabase(e.currentTarget.value)}
        />
        <Radio.Group label="Authentication Type" value={authType} onChange={setAuthType} mt="md">
          <Group mt="xs">
            <Radio value="no_auth" label="No Auth" />
            <Radio value="token" label="Token" />
            <Radio value="basic" label="Basic" />
          </Group>
        </Radio.Group>
        {authType === 'token' && (
          <TextInput
            label="Token"
            placeholder="Enter your token"
            mt="md"
            value={token}
            onChange={e => setToken(e.currentTarget.value)}
          />
        )}
        {authType === 'basic' && (
          <div>
            <TextInput
              label="Username"
              placeholder="Enter your username"
              mt="md"
              value={username}
              onChange={e => setUsername(e.currentTarget.value)}
            />
            <TextInput
              label="Password"
              placeholder="Enter your password"
              mt="md"
              value={password}
              onChange={e => setPassword(e.currentTarget.value)}
              type="password"
            />
          </div>
        )}
        <Group mt="lg" justify="flex-end">
          {appConfig?.connectionString && (
            <Button variant="default" onClick={backButtonClicked}>
              Back
            </Button>
          )}
          <Button onClick={connectButtonClicked}>Connect</Button>
        </Group>
      </Paper>
    </Container>
  )
}
