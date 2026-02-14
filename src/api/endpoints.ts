import { wmataFetch } from './client';
import type {
  StationsResponse,
  BusStopsResponse,
  RailPredictionsResponse,
  BusPredictionsResponse,
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
