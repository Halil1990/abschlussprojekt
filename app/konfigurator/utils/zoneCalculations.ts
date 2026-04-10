import {
  getZoneTemplatesForImage,
} from "../constants";
import type { ZoneRectangle } from "../types";

/**
 * Clamps a value between a minimum and maximum value
 */
export function clamp(value: number, min: number, max: number) {
  return Math.max(min, Math.min(max, value));
}

/**
 * Creates a new zone at a grid position with 2-column layout
 */
export function createZone(index: number, imageIndex: number): ZoneRectangle {
  const zoneTemplate = getZoneTemplatesForImage(imageIndex)[index - 1];
  if (zoneTemplate) {
    const clampedWidth = Number(clamp(zoneTemplate.w, 0.5, 100).toFixed(1));
    const clampedHeight = Number(clamp(zoneTemplate.h, 0.5, 100).toFixed(1));

    return {
      id: "zone-" + index,
      label: "Zone " + index,
      x: clamp(zoneTemplate.x, 0, 100 - clampedWidth),
      y: clamp(zoneTemplate.y, 0, 100 - clampedHeight),
      w: clampedWidth,
      h: clampedHeight,
      scale: 1,
      rotation: 0,
      assetId: null,
      artworkOffset: { x: 0, y: 0 },
    };
  }

  return {
    id: "zone-" + index,
    label: "Zone " + index,
    x: 0,
    y: 0,
    w: 10,
    h: 6,
    scale: 1,
    rotation: 0,
    assetId: null,
    artworkOffset: { x: 0, y: 0 },
  };
}
