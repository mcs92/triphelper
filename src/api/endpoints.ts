import { wmataFetch } from './client';
import type {
  StationsResponse,
  BusStopsResponse,
  RailPredictionsResponse,
  BusPredictionsResponse,
  BikeStationInfoResponse,
  BikeStationStatusResponse,
} from './types';

export function fetchStations() {
  return wmataFetch<StationsResponse>('/Rail.svc/json/jStations');
}

export function fetchBusStops() {
  return wmataFetch<BusStopsResponse>('/Bus.svc/json/jStops');
}

export function fetchRailPredictions(stationCodes: string) {
  return wmataFetch<RailPredictionsResponse>(
    `/StationPrediction.svc/json/GetPrediction/${stationCodes}`
  );
}

export function fetchBusPredictions(stopId: string) {
  return wmataFetch<BusPredictionsResponse>(
    `/NextBusService.svc/json/jPredictions?StopID=${stopId}`
  );
}

const GBFS_BASE = 'https://gbfs.lyft.com/gbfs/1.1/dca-cabi/en';

export async function fetchBikeStationInfo(): Promise<BikeStationInfoResponse> {
  const res = await fetch(`${GBFS_BASE}/station_information.json`);
  if (!res.ok) throw new Error(`Bikeshare API error: ${res.status}`);
  return res.json();
}

export async function fetchBikeStationStatus(): Promise<BikeStationStatusResponse> {
  const res = await fetch(`${GBFS_BASE}/station_status.json`);
  if (!res.ok) throw new Error(`Bikeshare API error: ${res.status}`);
  return res.json();
}
