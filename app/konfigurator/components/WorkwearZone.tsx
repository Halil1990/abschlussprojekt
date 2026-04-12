/* eslint-disable @next/next/no-img-element */

import { useRef } from 'react';
import { useDroppable } from '@dnd-kit/core';
import { Trash2, RotateCcw, RotateCw, ZoomOut, ZoomIn } from 'lucide-react';

import type { Asset, ZoneRectangle } from '../types';

function getCompactZoneLabel(label: string) {
  return label.replace(/^zone\s*/i, '').trim();
}

type WorkwearZoneProps = {
  zone: ZoneRectangle;
  asset: Asset | undefined;
  isSelected: boolean;
  previewIsOver: boolean;
  zoneDropPrefix: string;
  onSelect: (zoneId: string) => void;
  onClearAsset: (zoneId: string) => void;
  onRotate: (degrees: number) => void;
  onScale: (delta: number) => void;
  onArtworkOffsetChange: (zoneId: string, nextOffset: { x: number; y: number }) => void;
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
  onScale,
  onArtworkOffsetChange,
}: WorkwearZoneProps) {
  const { isOver, setNodeRef } = useDroppable({ id: zoneDropPrefix + zone.id });
  const dragStateRef = useRef<{
    pointerId: number;
    startX: number;
    startY: number;
    startOffsetX: number;
    startOffsetY: number;
    maxOffsetX: number;
    maxOffsetY: number;
  } | null>(null);
  const canMoveArtwork = Boolean(zone.artworkMovable && asset);
  const canScaleArtwork = Boolean(zone.artworkScalable && asset);

  const handleArtworkPointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
    if (!canMoveArtwork) return;

    const targetElement = event.currentTarget;
    const rect = targetElement.getBoundingClientRect();

    dragStateRef.current = {
      pointerId: event.pointerId,
      startX: event.clientX,
      startY: event.clientY,
      startOffsetX: zone.artworkOffset.x,
      startOffsetY: zone.artworkOffset.y,
      maxOffsetX: rect.width * 0.35,
      maxOffsetY: rect.height * 0.35,
    };

    targetElement.setPointerCapture(event.pointerId);
    event.preventDefault();
    event.stopPropagation();
  };

  const handleArtworkPointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    const dragState = dragStateRef.current;
    if (!dragState || event.pointerId !== dragState.pointerId) return;

    const deltaX = event.clientX - dragState.startX;
    const deltaY = event.clientY - dragState.startY;
    const nextOffsetX = Math.max(
      -dragState.maxOffsetX,
      Math.min(dragState.maxOffsetX, dragState.startOffsetX + deltaX),
    );
    const nextOffsetY = Math.max(
      -dragState.maxOffsetY,
      Math.min(dragState.maxOffsetY, dragState.startOffsetY + deltaY),
    );

    onArtworkOffsetChange(zone.id, { x: nextOffsetX, y: nextOffsetY });
    event.preventDefault();
    event.stopPropagation();
  };

  const handleArtworkPointerUp = (event: React.PointerEvent<HTMLDivElement>) => {
    const dragState = dragStateRef.current;
    if (!dragState || event.pointerId !== dragState.pointerId) return;

    dragStateRef.current = null;
    event.currentTarget.releasePointerCapture(event.pointerId);
    event.preventDefault();
    event.stopPropagation();
  };

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
        transform: `rotate(${zone.zoneRotation}deg)`,
        transformOrigin: 'center',
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
          {canScaleArtwork ? (
            <button
              type="button"
              onPointerDown={(e) => {
                e.preventDefault();
                e.stopPropagation();
                onScale(-0.05);
              }}
              className="text-white hover:text-white/80 transition"
              title="Logo verkleinern"
            >
              <ZoomOut size={20} />
            </button>
          ) : null}
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
          {canScaleArtwork ? (
            <button
              type="button"
              onPointerDown={(e) => {
                e.preventDefault();
                e.stopPropagation();
                onScale(0.05);
              }}
              className="text-white hover:text-white/80 transition"
              title="Logo vergrößern"
            >
              <ZoomIn size={20} />
            </button>
          ) : null}
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
            {getCompactZoneLabel(zone.label)}
          </span>
        </div>
      ) : (
        <div
          className={'absolute inset-0 z-20 ' + (canMoveArtwork ? 'cursor-grab active:cursor-grabbing' : '')}
          onPointerDown={handleArtworkPointerDown}
          onPointerMove={handleArtworkPointerMove}
          onPointerUp={handleArtworkPointerUp}
          onPointerCancel={handleArtworkPointerUp}
        >
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
