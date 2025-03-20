export interface Row {
  [key: string]: string;
}

export interface ACMRow {
  "Device Name": string;
  Manufacturer: string;
}

export interface GooglePlayRow {
  Device: string;
  Manufacturer: string;
  "Model Name": string;
  "Android Version": string;
  "Screen Density": string;
  "Screen Size": string;
  Installations: string;
  "ANR Rate": string;
}

export interface MissingDevice {
  displayName: string;
  normalizedName: string;
  manufacturer: string;
  modelName: string;
  device: string;
  similarity: string
  // similar: string;
}

export interface Similarity {
  device: string;
  similarity: number;
}