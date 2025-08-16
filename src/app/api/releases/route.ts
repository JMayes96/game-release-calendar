// src/app/api/releases/route.ts
import { NextResponse } from 'next/server';

function getNext90Days() {
  const today = new Date();
  const futureDate = new Date();
  futureDate.setDate(today.getDate() + 90);

  const formatDate = (date: Date) => date.toISOString().split('T')[0];

  return `${formatDate(today)},${formatDate(futureDate)}`;
}

export async function GET() {
  const apiKey = process.env.RAWG_API_KEY;

  if (!apiKey) {
    return NextResponse.json(
      { error: 'API key is missing' },
      { status: 500 }
    );
  }

  const dateRange = getNext90Days();
  const rawgUrl = `https://api.rawg.io/api/games?key=${apiKey}&dates=${dateRange}&ordering=released`;

  try {
    const apiResponse = await fetch(rawgUrl, {
      next: {
        revalidate: 60 * 60 * 24, // Re-fetch data once every 24 hours
      },
    });

    if (!apiResponse.ok) {
      throw new Error(`RAWG API responded with status: ${apiResponse.status}`);
    }

    const data = await apiResponse.json();

    // Define proper interfaces for the RAWG API response
    interface RawgGame {
      id: number;
      name: string;
      released: string;
      platforms?: Array<{ platform: { name: string } }>;
      genres?: Array<{ name: string }>;
      background_image: string;
    }

    // We only need a few fields for our calendar
    const relevantData = data.results.map((game: RawgGame) => ({
        id: game.id,
        title: game.name,
        releaseDate: game.released,
        platform: game.platforms?.map((p) => p.platform.name).join(', ') || 'TBA',
        genres: game.genres?.map((g) => g.name) || [],
        backgroundImage: game.background_image, 
    }));

    return NextResponse.json({ releases: relevantData });

  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: 'Failed to fetch data from RAWG API' },
      { status: 500 }
    );
  }
}