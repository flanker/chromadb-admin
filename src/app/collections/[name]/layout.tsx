import {AppShell, AppShellMain, AppShellHeader, Group} from "@mantine/core";

export default function Layout({children}) {
  return (
    <AppShell
      header={{height: 60}}
      padding="md"
    >
      <AppShellHeader>
        <Group h="100%" px="md">
          Vector UI
        </Group>
      </AppShellHeader>
      <AppShellMain>
        {children}
      </AppShellMain>
    </AppShell>
  )
}
