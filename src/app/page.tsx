// src/app/page.tsx
import CalendarView from '@/components/CalendarView';
import type { Release } from './type';

// ✨ This function now contains the logic from your old API route
async function getGameReleases(): Promise<Release[]> {
  const apiKey = process.env.RAWG_API_KEY;

  if (!apiKey) {
    console.error('RAWG API key is missing');
    // In a real app, you might want to return an empty array or handle this differently
    return [];
  }

  // Helper to get the date range for the API call
  const getNext90Days = () => {
    const today = new Date();
    const futureDate = new Date();
    futureDate.setDate(today.getDate() + 90);
    const formatDate = (date: Date) => date.toISOString().split('T')[0];
    return `${formatDate(today)},${formatDate(futureDate)}`;
  };

  const dateRange = getNext90Days();
  const rawgUrl = `https://api.rawg.io/api/games?key=${apiKey}&dates=${dateRange}&ordering=released`;

  try {
    const apiResponse = await fetch(rawgUrl, {
      next: {
        // Re-fetch data once per day in production
        revalidate: 60 * 60 * 24,
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

    const relevantData = data.results.map((game: RawgGame): Release => ({
      id: game.id,
      title: game.name,
      releaseDate: game.released,
      platform: game.platforms?.map((p) => p.platform.name).join(', ') || 'TBA',
      genres: game.genres?.map((g) => g.name) || [],
      backgroundImage: game.background_image,
    }));

    return relevantData;
  } catch (error) {
    console.error("Failed to fetch game releases from RAWG:", error);
    return []; // Return an empty array on error to prevent the page from crashing
  }
}

export default async function HomePage() {
  const releases = await getGameReleases();

  return (
    <main className="flex min-h-screen flex-col items-center p-4 md:p-12">
      <div className="w-full max-w-6xl">
        <h1 className="text-4xl font-bold mb-8 text-center text-accent">
          Game Release Calendar
        </h1>
        <CalendarView releases={releases} />
      </div>
    </main>
  );
}