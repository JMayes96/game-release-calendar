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
import type { Release, GameDetails } from '@/app/type'; // ✨ Import shared types

interface GameCalendarProps {
  releases: Release[];
  trackedGames: Set<number>;
  onTrackGame: (gameId: number) => void;
}

const getPlatformColor = (platform: string): string => {
  if (platform.includes('PlayStation')) return '#0070d1';
  if (platform.includes('Xbox')) return '#107c10';
  if (platform.includes('PC')) return '#d3d3d3';
  if (platform.includes('Nintendo')) return '#e60012';
  return '#808080';
};

export default function GameCalendar({ releases, trackedGames, onTrackGame }: GameCalendarProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [gameDetails, setGameDetails] = useState<GameDetails | null>(null); // ✨ Use the shared type

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
    setIsModalOpen(true);
    setGameDetails({ name: clickInfo.event.title, id: Number(clickInfo.event.id), background_image: '' });
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

  const handleEventDidMount = (info: EventMountArg) => {
    const { title, platform, backgroundImage } = info.event.extendedProps;
    tippy(info.el, {
      content: `<div class="p-1 max-w-xs"><img src="${backgroundImage}" alt="${title}" class="tippy-image rounded-md mb-2" /><h4 class="font-bold">${title}</h4><p class="text-xs">${platform}</p></div>`,
      allowHTML: true,
      theme: 'translucent',
      placement: 'top',
      animation: 'shift-away-subtle',
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
        // ✨ Pass the tracking props down to the modal
        onTrackGame={onTrackGame}
        isTracked={gameDetails ? trackedGames.has(gameDetails.id) : false}
      />
    </div>
  );
}