import {useEffect, useState} from "react";
import {useApplicationStore} from "@/lib/store";

export function RecordGrid(props) {
  const [records, setRecords] = useState([]);
  const connectionString = useApplicationStore((state) => state.connectionString);

  useEffect(() =>{
    const fetchRecords = async () => {
      const data = await fetch(`/api/collections/${props.collectionName}/records?connectionString=${connectionString}`)
      const json = await data.json()
      const records = json.data
      setRecords(records)
    }
    if (connectionString) {
      fetchRecords()
    }
  }, [])

  return (
    <>
      <h2>Record Grid</h2>
      <table>
        <thead>
        <tr>
          <th>id</th>
          <th>document</th>
          <th>metadata</th>
          <th>embedding</th>
        </tr>
        </thead>
        <tbody>
        {records.map((record) => (
          <tr key={record.id}>
            <td>{record.id}</td>
            <td>{record.document}</td>
            <td>{record.metadata}</td>
            <td>{record.embedding}</td>
          </tr>
        ))}
        </tbody>
      </table>
    </>
  )
}
