// src/components/CalendarView.tsx
"use client";

import { useState, useMemo, useEffect } from 'react';
import GameCalendar from './GameCalendar';

// (Keep your Release and CalendarViewProps interfaces the same)
interface Release {
  id: number;
  title: string;
  releaseDate: string;
  platform: string;
  genres: string[];
  backgroundImage: string;
}

interface CalendarViewProps {
  releases: Release[];
}

export default function CalendarView({ releases }: CalendarViewProps) {
  // ✨ NEW: State for the search query
  const [searchQuery, setSearchQuery] = useState('');
  
  // ✨ NEW: State for tracked games (using a Set for efficiency)
  const [trackedGames, setTrackedGames] = useState<Set<number>>(new Set());
  
  const [platformFilter, setPlatformFilter] = useState('All');
  const [genreFilter, setGenreFilter] = useState('All');

  // ✨ NEW: Load tracked games from Local Storage when the component mounts
  useEffect(() => {
    const storedTrackedGames = localStorage.getItem('trackedGames');
    if (storedTrackedGames) {
      setTrackedGames(new Set(JSON.parse(storedTrackedGames)));
    }
  }, []);

  // ✨ NEW: Save tracked games to Local Storage whenever they change
  useEffect(() => {
    localStorage.setItem('trackedGames', JSON.stringify(Array.from(trackedGames)));
  }, [trackedGames]);

  // ✨ NEW: Function to add/remove a game from the tracked list
  const handleTrackGame = (gameId: number) => {
    setTrackedGames(prevTracked => {
      const newTracked = new Set(prevTracked);
      if (newTracked.has(gameId)) {
        newTracked.delete(gameId);
      } else {
        newTracked.add(gameId);
      }
      return newTracked;
    });
  };

  const platforms = useMemo(() => ['All', ...new Set(releases.map(r => r.platform.split(', ')).flat().sort())], [releases]);
  const genres = useMemo(() => ['All', ...new Set(releases.map(r => r.genres).flat().sort())], [releases]);

  // ✨ UPDATED: Filtering logic now includes the search query
  const filteredReleases = useMemo(() => {
    return releases.filter(release => {
      const platformMatch = platformFilter === 'All' || release.platform.includes(platformFilter);
      const genreMatch = genreFilter === 'All' || release.genres.includes(genreFilter);
      const searchMatch = searchQuery === '' || release.title.toLowerCase().includes(searchQuery.toLowerCase());
      return platformMatch && genreMatch && searchMatch;
    });
  }, [releases, platformFilter, genreFilter, searchQuery]);

  return (
    <div>
      {/* ✨ NEW: Search Bar */}
      <div className="mb-6">
        <label htmlFor="search-game" className="block text-sm font-medium text-gray-400 mb-1">Search Game</label>
        <input
          type="text"
          id="search-game"
          className="w-full bg-[#1e1e1e] border-[#2d2d2d] rounded-md p-2 text-white"
          placeholder="Search for a title..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {/* Filter UI (remains the same) */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        {/* ... platform and genre select dropdowns ... */}
        <div className="flex-1">
          <label htmlFor="platform-filter" className="block text-sm font-medium text-gray-400 mb-1">Platform</label>
          <select id="platform-filter" className="w-full bg-[#1e1e1e] border-[#2d2d2d] rounded-md p-2 text-white" value={platformFilter} onChange={(e) => setPlatformFilter(e.target.value)}>
            {platforms.map(p => <option key={p} value={p}>{p}</option>)}
          </select>
        </div>
        <div className="flex-1">
          <label htmlFor="genre-filter" className="block text-sm font-medium text-gray-400 mb-1">Genre</label>
          <select id="genre-filter" className="w-full bg-[#1e1e1e] border-[#2d2d2d] rounded-md p-2 text-white" value={genreFilter} onChange={(e) => setGenreFilter(e.target.value)}>
            {genres.map(g => <option key={g} value={g}>{g}</option>)}
          </select>
        </div>
      </div>

      {/* ✨ UPDATED: Pass tracked games state and handler to the calendar */}
      <GameCalendar
        releases={filteredReleases}
        trackedGames={trackedGames}
        onTrackGame={handleTrackGame}
      />
    </div>
  );
}