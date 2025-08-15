// src/components/GameDetailModal.tsx
"use client";

import { Dialog, Transition } from '@headlessui/react';
import { Fragment } from 'react';

// (Keep your GameDetails and GameDetailModalProps interfaces the same)
interface GameDetails {
  name: string;
  background_image: string;
  clip?: { clip: string };
  screenshots?: { id: number; image: string }[];
}

interface GameDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  game: GameDetails | null;
}

export default function GameDetailModal({ isOpen, onClose, game }: GameDetailModalProps) {
  if (!game) return null;

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/70" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              {/* ✨ UPDATED: Added max-height and overflow-y-auto */}
              <Dialog.Panel className="w-full max-w-4xl transform overflow-hidden rounded-2xl bg-[#1e1e1e] p-6 text-left align-middle shadow-xl transition-all flex flex-col max-h-[90vh]">
                <Dialog.Title as="h3" className="text-3xl font-bold leading-6 text-accent mb-4">
                  {game.name}
                </Dialog.Title>

                <div className="mt-2 space-y-6 overflow-y-auto pr-2">
                  {/* ... (Trailer and Gallery sections remain the same) ... */}
                  {game.clip?.clip ? (
                    <div>
                      <h4 className="text-xl font-semibold mb-2 text-white">Trailer</h4>
                      <video controls key={game.clip.clip} className="w-full rounded-lg aspect-video" preload="metadata">
                         <source src={game.clip.clip} type="video/mp4" />
                         Your browser does not support the video tag.
                      </video>
                    </div>
                  ) : (
                    <img src={game.background_image} alt={game.name} className="w-full h-auto object-cover rounded-lg" />
                  )}
                  {game.screenshots && game.screenshots.length > 0 && (
                     <div>
                       <h4 className="text-xl font-semibold mb-2 text-white">Gallery</h4>
                       <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                         {game.screenshots.map(ss => (
                           <img key={ss.id} src={ss.image} alt="Screenshot" className="rounded-md" />
                         ))}
                       </div>
                     </div>
                  )}
                </div>

                <div className="mt-6 flex-shrink-0">
                  <button
                    type="button"
                    className="inline-flex justify-center rounded-md border border-transparent bg-purple-800 px-4 py-2 text-sm font-medium text-purple-100 hover:bg-purple-700 focus:outline-none"
                    onClick={onClose}
                  >
                    Close
                  </button>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}