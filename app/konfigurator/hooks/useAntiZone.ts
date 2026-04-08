import { useCallback } from "react";

export type ForbiddenZone = {
  x: number;
  y: number;
  w: number;
  h: number;
};

// Antizonen - Bereiche wo keine Zonen platziert werden dürfen (z.B. Reißverschlüsse)
// Format: { x, y, w, h } als Prozentangaben
const FORBIDDEN_ZONES: readonly (readonly ForbiddenZone[])[] = [
  // Bild 0 (Jacke vorne)
  [{ x: 45, y: 32, w: 10, h: 45 }, { x: 12, y: 32, w: 10, h: 45 } , { x: 78, y: 32, w: 16, h: 45 } ],
  // Bild 1 (Jacke hinten)
  [],
  // ... weitere Bilder
];

export function useAntiZone() {
  const getForbiddenZonesForImage = useCallback(
    (imageIndex: number): readonly ForbiddenZone[] => {
      return FORBIDDEN_ZONES[imageIndex] ?? [];
    },
    []
  );

  const isZoneOverlappingForbiddenZone = useCallback(
    (
      zoneX: number,
      zoneY: number,
      zoneW: number,
      zoneH: number,
      imageIndex: number
    ): boolean => {
      const forbiddenZones = getForbiddenZonesForImage(imageIndex);

      for (const forbidden of forbiddenZones) {
        if (
          zoneX < forbidden.x + forbidden.w &&
          zoneX + zoneW > forbidden.x &&
          zoneY < forbidden.y + forbidden.h &&
          zoneY + zoneH > forbidden.y
        ) {
          return true;
        }
      }

      return false;
    },
    [getForbiddenZonesForImage]
  );

  return {
    getForbiddenZonesForImage,
    isZoneOverlappingForbiddenZone,
  };
}