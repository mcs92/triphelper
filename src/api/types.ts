// WMATA Rail Station
export interface Station {
  Code: string;
  Name: string;
  StationTogether1: string;
  StationTogether2: string;
  LineCode1: string | null;
  LineCode2: string | null;
  LineCode3: string | null;
  LineCode4: string | null;
  Lat: number;
  Lon: number;
  Address: {
    Street: string;
    City: string;
    State: string;
    Zip: string;
  };
}

export interface StationsResponse {
  Stations: Station[];
}

// WMATA Bus Stop
export interface BusStop {
  StopID: string;
  Name: string;
  Lat: number;
  Lon: number;
  Routes: string[];
}

export interface BusStopsResponse {
  Stops: BusStop[];
}

// WMATA Rail Prediction
export interface RailPrediction {
  Car: string | null;
  Destination: string;
  DestinationCode: string;
  DestinationName: string;
  Group: string;
  Line: string;
  LocationCode: string;
  LocationName: string;
  Min: string; // "ARR", "BRD", "---", or numeric string
}

export interface RailPredictionsResponse {
  Trains: RailPrediction[];
}

// WMATA Bus Prediction
export interface BusPrediction {
  DirectionNum: string;
  DirectionText: string;
  Minutes: number;
  RouteID: string;
  TripID: string;
  VehicleID: string;
}

export interface BusPredictionsResponse {
  Predictions: BusPrediction[];
  StopName: string;
}

// Capital Bikeshare (GBFS)
export interface BikeStation {
  station_id: string;
  name: string;
  short_name: string;
  lat: number;
  lon: number;
  capacity: number;
  has_kiosk: boolean;
  region_id: string;
}

export interface BikeStationInfoResponse {
  data: { stations: BikeStation[] };
  last_updated: number;
  ttl: number;
}

export interface BikeStationStatus {
  station_id: string;
  num_bikes_available: number;
  num_ebikes_available: number;
  num_docks_available: number;
  num_bikes_disabled: number;
  num_docks_disabled: number;
  is_installed: number;
  is_renting: number;
  is_returning: number;
  last_reported: number;
}

export interface BikeStationStatusResponse {
  data: { stations: BikeStationStatus[] };
  last_updated: number;
  ttl: number;
}

export interface BikeDock extends BikeStation {
  status: BikeStationStatus | null;
}

// App-specific types
export interface FavoriteStop {
  id: string;
  type: 'rail' | 'bus' | 'bike';
  name: string;
  meta: {
    lines?: string[];
    routes?: string[];
    stationTogether1?: string;
  };
}
