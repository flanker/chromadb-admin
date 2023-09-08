'use client'

import {useApplicationStore} from "@/lib/store";
import {DatabasePanel} from "@/app/componenets/database_panel";
import {ConnectionPanel} from "@/app/componenets/connection_panel";
import {useStore} from "@/lib/use-store";

export default function Home() {

  const connection_string = useStore(useApplicationStore, (state) => state.connectionString);

  return (
    <div>
      {connection_string ? (
        <DatabasePanel></DatabasePanel>
      ) : (
        <ConnectionPanel></ConnectionPanel>
      )}
    </div>
  )
}
