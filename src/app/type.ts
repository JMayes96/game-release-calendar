// src/types.ts
export interface Release {
    id: number;
    title: string;
    releaseDate: string;
    platform: string;
    genres: string[];
    backgroundImage: string;
  }
  
  export interface GameDetails {
    id: number;
    name: string;
    background_image: string;
    clip?: { clip: string };
    screenshots?: { id: number; image: string }[];
  }
  export interface Screenshot {
    id: number;
    image: string;
  }