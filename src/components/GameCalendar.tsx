// src/components/GameCalendar.tsx
"use client";

import { useState } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import listPlugin from '@fullcalendar/list';
import { EventClickArg, EventContentArg, EventMountArg } from '@fullcalendar/core';
import GameDetailModal from './GameDetailModal';
import tippy from 'tippy.js';
import 'tippy.js/dist/tippy.css';
import 'tippy.js/themes/translucent.css';

// ✨ UPDATED: Add backgroundImage to the interface
interface Release {
  id: number;
  title: string;
  releaseDate: string;
  platform: string;
  genres:string[];
  backgroundImage: string;
}

interface GameCalendarProps {
  releases: Release[];
  trackedGames: Set<number>;
  onTrackGame: (gameId: number) => void;
}

const getPlatformColor = (platform: string): string => {
  // ... (this function remains the same)
  if (platform.includes('PlayStation')) return '#0070d1';
  if (platform.includes('Xbox')) return '#107c10';
  if (platform.includes('PC')) return '#d3d3d3';
  if (platform.includes('Nintendo')) return '#e60012';
  return '#808080';
};

export default function GameCalendar({ releases, trackedGames, onTrackGame }: GameCalendarProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [gameDetails, setGameDetails] = useState<any>(null);
  
  const events = releases.map(release => ({
    id: release.id.toString(),
    title: release.title,
    date: release.releaseDate,
    allDay: true,
    extendedProps: { ...release },
    backgroundColor: trackedGames.has(release.id) ? '#7c3aed' : '#282828',
    borderColor: trackedGames.has(release.id) ? '#a78bfa' : '#282828',
  }));

  const handleEventClick = async (clickInfo: EventClickArg) => {
    // ... (this function remains the same)
    setIsModalOpen(true);
    setGameDetails({ name: clickInfo.event.title });
    try {
      const res = await fetch(`/api/game/${clickInfo.event.id}`);
      const data = await res.json();
      setGameDetails(data);
    } catch (error) {
      console.error("Failed to fetch game details:", error);
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setGameDetails(null);
  };
  
  const renderEventContent = (eventInfo: EventContentArg) => {
    // ... (this function remains the same)
    const isTracked = trackedGames.has(Number(eventInfo.event.id));
    const firstPlatform = (eventInfo.event.extendedProps.platform as string).split(', ')[0];
    const platformColor = getPlatformColor(firstPlatform);
    return (
      <div className="flex items-center gap-2 w-full overflow-hidden">
        {isTracked && <span className="text-yellow-400">★</span>}
        <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: platformColor }}></span>
        <span className="truncate">{eventInfo.event.title}</span>
      </div>
    );
  };

// src/components/GameCalendar.tsx

  // ... (the rest of the component stays the same) ...

  const handleEventDidMount = (info: EventMountArg) => {
    const { title, platform, backgroundImage } = info.event.extendedProps;
    tippy(info.el, {
      // ✨ Brute-force styling applied directly in the HTML
      content: `
        <div style="width: 250px; text-align: left;">
          <img 
            src="${backgroundImage}" 
            alt="${title}" 
            style="width: 100%; height: 120px; object-fit: cover; border-radius: 3px; margin-bottom: 4px;" 
          />
          <h4 style="font-weight: bold;">${title}</h4>
          <p style="font-size: 12px;">${platform}</p>
        </div>
      `,
      allowHTML: true,
      theme: 'translucent',
      placement: 'top',
      animation: 'shift-away-subtle',
      // We will leave this JS config in as a fallback
      maxWidth: 250, 
    });
  };

  return (
    <div className="bg-[#1e1e1e] text-white p-4 rounded-lg shadow-lg">
      <FullCalendar
        plugins={[dayGridPlugin, timeGridPlugin, listPlugin]}
        initialView="dayGridMonth"
        events={events}
        eventClick={handleEventClick}
        headerToolbar={{
          left: 'prev,next today',
          center: 'title',
          right: 'dayGridMonth,timeGridWeek,listWeek'
        }}
        height="auto"
        eventContent={renderEventContent}
        eventDidMount={handleEventDidMount}
      />

      <GameDetailModal
        isOpen={isModalOpen}
        onClose={closeModal}
        game={gameDetails}
      />
    </div>
  );
}