import {useApplicationStore} from "@/lib/store";
import {useState} from "react";

export function ConnectionPanel() {

  const [newConnectionString, setNewConnectionString] = useState('');
  const updateConnectionString = useApplicationStore((state) => state.updateConnectionString);

  return (
    <div>
      <h2>Chroma Connection</h2>
      <label>
        <input type='text'
               value={newConnectionString}
               placeholder='http://localhost:8000'
               onChange={(e) => setNewConnectionString(e.target.value)}
        />
        <button onClick={() => updateConnectionString(newConnectionString)}>
          Connect
        </button>
      </label>
    </div>
  )
}
