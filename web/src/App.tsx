import { useState } from 'react';
import { TrackList } from './components/TrackList/TrackList';
import { TrackForm } from './components/TrackForm/TrackForm';

function App() {
  const [refreshKey, setRefreshKey] = useState(0);

  return (
    <>
      <TrackForm onCreated={() => setRefreshKey((k) => k + 1)} />
      <TrackList key={refreshKey} />
    </>
  )
}

export default App
