/* eslint-disable @next/next/no-img-element */

import { useDroppable } from '@dnd-kit/core';
import { Trash2, RotateCcw, RotateCw } from 'lucide-react';

import type { Asset, ZoneRectangle } from '../types';

type WorkwearZoneProps = {
  zone: ZoneRectangle;
  asset: Asset | undefined;
  isSelected: boolean;
  previewIsOver: boolean;
  zoneDropPrefix: string;
  onSelect: (zoneId: string) => void;
  onClearAsset: (zoneId: string) => void;
  onRotate: (degrees: number) => void;
};

export default function WorkwearZone({
  zone,
  asset,
  isSelected,
  previewIsOver,
  zoneDropPrefix,
  onSelect,
  onClearAsset,
  onRotate,
}: WorkwearZoneProps) {
  const { isOver, setNodeRef } = useDroppable({ id: zoneDropPrefix + zone.id });

  return (
    <div
      ref={(node) => {
        setNodeRef(node);
      }}
      onClick={() => onSelect(zone.id)}
      style={{
        left: zone.x + '%',
        top: zone.y + '%',
        width: zone.w + '%',
        height: zone.h + '%',
      }}
      className={
        'absolute touch-none rounded-md border transition hover:border-nordwerk-orange ' +
        (isOver || previewIsOver
          ? 'border-nordwerk-orange bg-nordwerk-orange/20 shadow-[0_0_0_1px_rgba(0,0,0,0.95),0_0_0_2px_rgba(255,255,255,0.95),0_0_0_4px_rgba(245,130,32,0.55)]'
          : isSelected
          ? 'border-nordwerk-orange bg-nordwerk-orange/20 shadow-[0_0_0_1px_rgba(0,0,0,0.95),0_0_0_2px_rgba(255,255,255,0.95),0_0_0_4px_rgba(245,130,32,0.55)]'
          : 'border-white bg-black/12 shadow-[0_0_0_1px_rgba(0,0,0,0.9),0_0_0_2px_rgba(255,255,255,0.9)]')
      }
    >
      {asset && (
        <div className="absolute -top-10 left-1/2 z-40 -translate-x-1/2 flex items-center gap-2">
          <button
            type="button"
            onPointerDown={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onRotate(-5);
            }}
            className="text-white hover:text-white/80 transition"
            title="Nach links drehen"
          >
            <RotateCcw size={20} />
          </button>
          <button
            type="button"
            onPointerDown={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onClearAsset(zone.id);
            }}
            className="text-red-500 hover:text-red-600 transition"
            title="Bild aus dieser Zone löschen"
          >
            <Trash2 size={20} />
          </button>
          <button
            type="button"
            onPointerDown={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onRotate(5);
            }}
            className="text-white hover:text-white/80 transition"
            title="Nach rechts drehen"
          >
            <RotateCw size={20} />
          </button>
        </div>
      )}
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
