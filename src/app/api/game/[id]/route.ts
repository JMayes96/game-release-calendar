// src/app/api/game/[id]/route.ts
import { NextResponse } from 'next/server';

// ✨ REMOVED 'default' from the export here
export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const apiKey = process.env.RAWG_API_KEY;
  const resolvedParams = await params;
  const gameId = resolvedParams.id;

  console.log(`Fetching details for game ID: ${gameId}`);

  if (!apiKey) {
    console.error('API key is missing');
    return NextResponse.json({ error: 'API key is missing' }, { status: 500 });
  }

  try {
    const detailRes = await fetch(`https://api.rawg.io/api/games/${gameId}?key=${apiKey}`);
    
    if (!detailRes.ok) {
      console.error(`RAWG API Error (Details): Status ${detailRes.status}`);
      const errorBody = await detailRes.text();
      console.error('Error Body:', errorBody);
      throw new Error(`Failed to fetch main details: ${detailRes.statusText}`);
    }
    const gameDetails = await detailRes.json();

    const screenshotRes = await fetch(`https://api.rawg.io/api/games/${gameId}/screenshots?key=${apiKey}`);
    
    if (!screenshotRes.ok) {
      console.error(`RAWG API Error (Screenshots): Status ${screenshotRes.status}`);
      throw new Error(`Failed to fetch screenshots: ${screenshotRes.statusText}`);
    }
    const screenshotData = await screenshotRes.json();

    const responseData = {
      ...gameDetails,
      screenshots: screenshotData.results,
    };

    return NextResponse.json(responseData);

  } catch (error) {
    console.error('Caught an error in the API route:', error);
    return NextResponse.json(
      { error: `Failed to fetch details for game ${gameId}` },
      { status: 500 }
    );
  }
}