import {useEffect, useState} from 'react'
import './App.css'
import Papa from 'papaparse';
import playlistUrl from './assets/sample-playlist.csv?url';

function App() {

    const [tracks, setTracks] = useState([]);
    const [sortField, setSortField] = useState(null);

    useEffect(() => {
        async function fetchPlaylist() {
            try {
                const response = await fetch(playlistUrl);

                if (!response.ok) {
                    throw new Error(`Kon playlist niet laden (status ${response.status})`);
                }
                const csvText = await response.text();

                Papa.parse(csvText, {
                    header: true,
                    skipEmptyLines: true,
                    complete: (results) => {
                        setTracks(results.data);
                        console.log('Eerste nummer uit CSV:', results.data[0]);
                    },
                });
            } catch (err) {
                console.error(err);
            }
        }
        fetchPlaylist();
    }, []);

    function sortData(type) {
        setSortField((prev) => (prev === type ? null : type));
    }

    const displayedTracks = [...tracks].sort((a, b) => {
        if (!sortField) return 0;

        const valueA = (a[sortField] || '').toString();
        const valueB = (b[sortField] || '').toString();

        return valueA.localeCompare(valueB, 'nl', { sensitivity: 'base' });
    });

    return (
        <>
            <header>
                <h1>Spotify Playlist Overview</h1>
                <p>Aantal nummers in de playlist: {tracks.length}</p>
            </header>
            <main>
                <div className="playlist-filters">
                    <button type="button" className="filter-button" onClick={() => sortData('Naam van artiest')}>Sorteer op artiest</button>
                    <button type="button" className="filter-button" onClick={() => sortData('Nummernaam')}>Sorteer op nummer</button>
                    <button type="button" className="filter-button">Filter niet gekochte nummers</button>
                    <button type="button" className="filter-button">Filter gekochte muziek</button>
                </div>
                <div className="playlist">
                    {displayedTracks.map((track, index) => (
                        <article key={track['Nummer URI'] || index} className="track-card">
                            <h3> {track['Nummernaam']} </h3>
                            <p>Artiest: {track['Naam van artiest']}</p>

                            {track['Naam van artiest op het album'] !== track['Naam van artiest'] &&  <p>Album artiest: {track['Naam van artiest op het album']}</p>}
                            <select name="numberState">
                                <option value="nog niet gekocht">Nog niet gekocht</option>
                                <option value="nummer gekocht">Nummer gekocht</option>
                                <option value="album gekocht">Album gekocht</option>
                                <option value="nummer al in bezit">Nummer al in bezit</option>
                            </select>
                        </article>
                    ))}
                </div>
            </main>

        </>
    )
}

export default App
