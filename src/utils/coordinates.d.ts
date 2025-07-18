export interface ParsedCoordinate {
  latitude: number;
  longitude: number;
  isValid: boolean;
  error?: string;
}

export interface CoordinateConversions {
  dd: string;
  ddm: string;
  dms: string;
}

export type CoordinateFormatType = 'DD' | 'DDM' | 'DMS';

export declare const CoordinateFormat: {
  DECIMAL_DEGREES: 'DD';
  DEGREES_DECIMAL_MINUTES: 'DDM';
  DEGREES_MINUTES_SECONDS: 'DMS';
};

export declare function parseDecimalDegrees(input: string): ParsedCoordinate;
export declare function parseDegreesDecimalMinutes(input: string): ParsedCoordinate;
export declare function parseDegreesMinutesSeconds(input: string): ParsedCoordinate;
export declare function parseCoordinates(input: string): ParsedCoordinate;
export declare function convertToDecimalDegrees(latitude: number, longitude: number): string;
export declare function convertToDegreesDecimalMinutes(latitude: number, longitude: number): string;
export declare function convertToDegreesMinutesSeconds(latitude: number, longitude: number): string; 