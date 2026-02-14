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

// App-specific types
export interface FavoriteStop {
  id: string;
  type: 'rail' | 'bus';
  name: string;
  meta: {
    lines?: string[];
    routes?: string[];
    stationTogether1?: string;
  };
}
