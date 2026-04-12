export type Point = {
  x: number;
  y: number;
};

export type Asset = {
  id: string;
  name: string;
  src: string;
};

export type ZoneRectangle = {
  id: string;
  label: string;
  x: number;
  y: number;
  w: number;
  h: number;
  scale: number;
  rotation: number;
  assetId: string | null;
  artworkOffset: Point;
};

export type PrintMaterial = "druck" | "stick";
