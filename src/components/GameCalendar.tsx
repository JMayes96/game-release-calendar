// src/components/GameCalendar.tsx
"use client";

import { useState } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import { EventClickArg } from '@fullcalendar/core';

interface Release {
  id: number;
  title: string;
  releaseDate: string;
  platform: string;
  genres: string[];
}

interface GameCalendarProps {
  releases: Release[];
}

export default function GameCalendar({ releases }: GameCalendarProps) {
  // ✨ NEW: State to hold the currently selected game for the details view
  const [selectedGame, setSelectedGame] = useState<Release | null>(null);

  const events = releases.map(release => ({
    id: release.id.toString(),
    title: release.title,
    date: release.releaseDate,
    allDay: true,
    extendedProps: { ...release } // Pass the whole release object
  }));

  const handleEventClick = (clickInfo: EventClickArg) => {
    // Set the selected game from the event's extendedProps
    setSelectedGame(clickInfo.event.extendedProps as Release);
  };

  return (
    <div className="relative">
      {/* ✨ NEW: On-screen details panel */}
      {selectedGame && (
        <div className="bg-gray-900 border border-gray-700 p-4 rounded-lg mb-4 shadow-xl">
          <div className="flex justify-between items-center">
            <h3 className="text-2xl font-bold text-emerald-400">{selectedGame.title}</h3>
            <button onClick={() => setSelectedGame(null)} className="text-gray-400 hover:text-white text-2xl">&times;</button>
          </div>
          <p className="text-gray-300 mt-2"><strong>Release Date:</strong> {selectedGame.releaseDate}</p>
          <p className="text-gray-300"><strong>Platform(s):</strong> {selectedGame.platform}</p>
          <p className="text-gray-300"><strong>Genres:</strong> {selectedGame.genres.join(', ')}</p>
        </div>
      )}

      <FullCalendar
        plugins={[dayGridPlugin]}
        initialView="dayGridMonth"
        events={events}
        eventClick={handleEventClick}
        headerToolbar={{
          left: 'prev,next today',
          center: 'title',
          right: 'dayGridMonth'
        }}
        height="auto"
        eventColor="#10B981"
      />
    </div>
  );
}