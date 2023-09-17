'use client'

import {useEffect, useState} from "react";
import {useRouter} from "next/navigation";
import {Container, Title, Paper, TextInput, Group, Button} from "@mantine/core";
import {updateConnectionString} from "@/lib/client/localstorage";
import {useGetConfig} from "@/lib/client/query";

export default function SetupPage() {

  const router = useRouter()
  const {data} = useGetConfig()
  const [connectionString, setConnectionString] = useState(data?.connectionString || '')

  useEffect(() => {
    if (data != null) {
      setConnectionString(data.connectionString)
    }
  }, [data]);

  const buttonClicked = () => {
    updateConnectionString(connectionString)
    router.push('/collections')
  }

  return (
    <Container size={460} my={30}>
      <Title ta="center">
        Connect to Chroma
      </Title>
      <Paper withBorder shadow="md" p={30} radius="md" mt="xl">
        <TextInput label="Enter your Chroma connection string. e.g. http://localhost:8000"
                   placeholder="http://localhost:8000"
                   value={connectionString}
                    onChange={(e) => setConnectionString(e.currentTarget.value)}
                   required />
        <Group mt="lg">
          <Button onClick={buttonClicked}>
            Connect
          </Button>
        </Group>
      </Paper>
    </Container>
  )
}
