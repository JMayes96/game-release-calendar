// src/app/page.tsx
import CalendarView from '@/components/CalendarView'; // Import our new interactive component

async function getGameReleases() {
  const res = await fetch('http://localhost:3000/api/releases', {
    cache: 'no-store'
  });
  if (!res.ok) throw new Error('Failed to fetch data');
  const data = await res.json();
  return data.releases;
}

export default async function HomePage() {
  const releases = await getGameReleases();

  return (
    <main className="flex min-h-screen flex-col items-center p-4 md:p-8">
      <div className="w-full max-w-7xl mx-auto">
        <h1 className="text-4xl md:text-5xl font-bold mb-8 text-center text-accent">
          Game Release Calendar
        </h1>
        <div className="calendar-container">
          <CalendarView releases={releases} />
        </div>
      </div>
    </main>
  );
}