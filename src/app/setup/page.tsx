'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useQueryClient } from '@tanstack/react-query'
import { Container, Title, Paper, TextInput, Group, Button } from '@mantine/core'

import { useGetConfig } from '@/lib/client/query'
import { updateConnectionString } from '@/lib/client/localstorage'

export default function SetupPage() {
  const router = useRouter()
  const { data: appConfig } = useGetConfig()
  const [connectionString, setConnectionString] = useState(appConfig?.connectionString || '')

  useEffect(() => {
    if (appConfig != null && appConfig.connectionString) {
      setConnectionString(appConfig.connectionString)
    }
  }, [appConfig])

  const queryClient = useQueryClient()
  const connectButtonClicked = () => {
    updateConnectionString(connectionString)
    queryClient.setQueryData(['config'], { connectionString })
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
