import {useApplicationStore} from "@/lib/store";
import {useEffect, useState} from "react";
import {RecordGrid} from "@/app/componenets/record_grid";

interface CollectionType {
  id: string
  name: string
}

export function DatabasePanel() {
  const [collections, setCollections] = useState<CollectionType[]>([]);

  const connectionString = useApplicationStore((state) => state.connectionString);

  useEffect(() => {
    const fetchCollections = async () => {
      const data = await fetch(`/api/collections?connectionString=${connectionString}`)
      const json = await data.json()
      const collections = json.data
      setCollections(collections)
    }
    if (connectionString) {
      fetchCollections()
    }
  }, [])

  return (
    <div>
      <h2>Database Panel</h2>
      {collections.map((collection) => (
        <div key={collection.id}>
          <h3>{collection.name}</h3>
        </div>
      ))}
      {collections.length !== 0 && (
        <RecordGrid collectionName={collections[0].name}></RecordGrid>
      )}
    </div>
  )
}
