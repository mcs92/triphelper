const BASE_URL = 'https://api.wmata.com';

export async function wmataFetch<T>(path: string): Promise<T> {
  const apiKey = import.meta.env.VITE_WMATA_API_KEY;
  if (!apiKey || apiKey === 'your_api_key_here') {
    throw new Error(
      'WMATA API key not configured. Add your key to .env.local as VITE_WMATA_API_KEY'
    );
  }

  const res = await fetch(`${BASE_URL}${path}`, {
    headers: { api_key: apiKey },
  });

  if (!res.ok) {
    throw new Error(`WMATA API error: ${res.status} ${res.statusText}`);
  }

  return res.json();
}
