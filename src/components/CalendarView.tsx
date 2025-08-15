// src/components/CalendarView.tsx
"use client";

import { useState, useMemo } from 'react';
import GameCalendar from './GameCalendar'; // We'll use our existing calendar

// Define the shape of our game data, including the new genres array
interface Release {
  id: number;
  title: string;
  releaseDate: string;
  platform: string;
  genres: string[];
}

interface CalendarViewProps {
  releases: Release[];
}

export default function CalendarView({ releases }: CalendarViewProps) {
  // State for our filters
  const [platformFilter, setPlatformFilter] = useState('All');
  const [genreFilter, setGenreFilter] = useState('All');

  // Create unique lists for filter dropdowns. useMemo prevents recalculating on every render.
  const platforms = useMemo(() => ['All', ...new Set(releases.map(r => r.platform.split(', ')).flat())], [releases]);
  const genres = useMemo(() => ['All', ...new Set(releases.map(r => r.genres).flat())], [releases]);

  // Filter the releases based on the current state of the filters
  const filteredReleases = useMemo(() => {
    return releases.filter(release => {
      const platformMatch = platformFilter === 'All' || release.platform.includes(platformFilter);
      const genreMatch = genreFilter === 'All' || release.genres.includes(genreFilter);
      return platformMatch && genreMatch;
    });
  }, [releases, platformFilter, genreFilter]);

  return (
    <div>
      {/* Filter UI */}
      <div className="flex flex-col md:flex-row gap-4 mb-6 bg-gray-900 p-4 rounded-lg">
        <div className="flex-1">
          <label htmlFor="platform-filter" className="block text-sm font-medium text-gray-300 mb-1">Filter by Platform</label>
          <select
            id="platform-filter"
            className="w-full bg-gray-700 border-gray-600 rounded-md p-2 text-white"
            value={platformFilter}
            onChange={(e) => setPlatformFilter(e.target.value)}
          >
            {platforms.map(p => <option key={p} value={p}>{p}</option>)}
          </select>
        </div>
        <div className="flex-1">
          <label htmlFor="genre-filter" className="block text-sm font-medium text-gray-300 mb-1">Filter by Genre</label>
          <select
            id="genre-filter"
            className="w-full bg-gray-700 border-gray-600 rounded-md p-2 text-white"
            value={genreFilter}
            onChange={(e) => setGenreFilter(e.target.value)}
          >
            {genres.map(g => <option key={g} value={g}>{g}</option>)}
          </select>
        </div>
      </div>

      {/* The Calendar (passing the *filtered* list) */}
      <div className="bg-gray-800 text-white p-4 rounded-lg shadow-lg">
        <GameCalendar releases={filteredReleases} />
      </div>
    </div>
  );
}