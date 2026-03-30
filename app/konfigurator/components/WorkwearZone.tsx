/* eslint-disable @next/next/no-img-element */

import { useDroppable } from '@dnd-kit/core';
import type { PointerEvent as ReactPointerEvent } from 'react';

import type { Asset, ZoneRect } from '../types';

type WorkwearZoneProps = {
  zone: ZoneRect;
  asset: Asset | undefined;
  isSelected: boolean;
  previewIsOver: boolean;
  zoneDropPrefix: string;
  onSelect: (zoneId: string) => void;
  onZoneDragStart: (event: ReactPointerEvent<HTMLDivElement>, zoneId: string) => void;
  onZoneDragMove: (event: ReactPointerEvent<HTMLDivElement>) => void;
  onZoneDragEnd: (event: ReactPointerEvent<HTMLDivElement>) => void;
};

export default function WorkwearZone({
  zone,
  asset,
  isSelected,
  previewIsOver,
  zoneDropPrefix,
  onSelect,
  onZoneDragStart,
  onZoneDragMove,
  onZoneDragEnd,
}: WorkwearZoneProps) {
  const { isOver, setNodeRef } = useDroppable({ id: zoneDropPrefix + zone.id });

  return (
    <div
      ref={(node) => {
        setNodeRef(node);
      }}
      onClick={() => onSelect(zone.id)}
      onPointerDown={(event) => onZoneDragStart(event, zone.id)}
      onPointerMove={onZoneDragMove}
      onPointerUp={onZoneDragEnd}
      onPointerCancel={onZoneDragEnd}
      style={{
        left: zone.x + '%',
        top: zone.y + '%',
        width: zone.w + '%',
        height: zone.h + '%',
      }}
      className={
        'absolute touch-none rounded-md border transition ' +
        (isOver || previewIsOver
          ? 'border-nordwerk-orange bg-nordwerk-orange/20 shadow-[0_0_0_1px_rgba(0,0,0,0.95),0_0_0_2px_rgba(255,255,255,0.95),0_0_0_4px_rgba(245,130,32,0.55)]'
          : isSelected
          ? 'border-cyan-300 bg-cyan-300/12 shadow-[0_0_0_1px_rgba(0,0,0,0.95),0_0_0_2px_rgba(255,255,255,0.95),0_0_0_4px_rgba(34,211,238,0.45)]'
          : 'border-black/85 bg-black/12 shadow-[0_0_0_1px_rgba(0,0,0,0.9),0_0_0_2px_rgba(255,255,255,0.9)]')
      }
    >
      <div className="relative h-full w-full overflow-hidden rounded-[inherit]">

      {!asset ? (
        <div className="absolute inset-0 flex items-center justify-center px-1 text-center">
          <span className="rounded bg-black/75 px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.08em] text-white sm:text-[11px]">
            {zone.label}
          </span>
        </div>
      ) : (
        <div className="absolute inset-0 z-20">
          <img
            src={asset.src}
            alt={asset.name}
            className="pointer-events-none absolute inset-0 h-full w-full select-none object-contain"
            style={{
              transform: `translate(${zone.artworkOffset.x}px, ${zone.artworkOffset.y}px) rotate(${zone.rotation}deg) scale(${zone.scale})`,
              transformOrigin: 'center',
            }}
          />
        </div>
      )}
      </div>
    </div>
  );
}
