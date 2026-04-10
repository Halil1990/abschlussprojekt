import { useState, useRef, useCallback } from "react";
import type { ZoneRectangle } from "../types";

export function useZoneState(initialZones: ZoneRectangle[], initialSelectedZoneId: string) {
  const [zones, setZones] = useState<ZoneRectangle[]>(initialZones);
  const [selectedZoneId, setSelectedZoneId] = useState(initialSelectedZoneId);
  const zoneCounterRef = useRef(1);
  const previewFrameRef = useRef<HTMLDivElement | null>(null);

  const selectedZone = zones.find((zone) => zone.id === selectedZoneId) ?? zones[0] ?? null;

  const updateZone = useCallback(
    (zoneId: string, updater: (zone: ZoneRectangle) => ZoneRectangle) => {
      setZones((previous) =>
        previous.map((zone) => (zone.id === zoneId ? updater(zone) : zone))
      );
    },
    []
  );

  const updateSelectedZone = useCallback(
    (updater: (zone: ZoneRectangle) => ZoneRectangle) => {
      if (!selectedZone) return;
      updateZone(selectedZone.id, updater);
    },
    [selectedZone, updateZone]
  );

  const clearZone = useCallback(
    (zoneId: string) => {
      updateZone(zoneId, (zone) => ({
        ...zone,
        assetId: null,
        rotation: 0,
        artworkOffset: { x: 0, y: 0 },
      }));
    },
    [updateZone]
  );

  const rotateArtwork = useCallback(
    (degrees: number) => {
      updateSelectedZone((zone) => ({
        ...zone,
        rotation: (zone.rotation + degrees + 360) % 360,
      }));
    },
    [updateSelectedZone]
  );

  const rotateZoneById = useCallback(
    (zoneId: string, degrees: number) => {
      updateZone(zoneId, (zone) => ({
        ...zone,
        rotation: (zone.rotation + degrees + 360) % 360,
      }));
    },
    [updateZone]
  );

  return {
    zones,
    setZones,
    selectedZoneId,
    setSelectedZoneId,
    selectedZone,
    zoneCounterRef,
    previewFrameRef,
    updateZone,
    updateSelectedZone,
    clearZone,
    rotateArtwork,
    rotateZoneById,
  };
}
