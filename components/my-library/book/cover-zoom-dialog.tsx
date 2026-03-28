"use client";

import { useState } from "react";
import Image from "next/image";
import {  ZoomIn, ZoomOut } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";

type CoverZoomDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  covers: string[];
  title: string;
};

export function CoverZoomDialog({
  open,
  onOpenChange,
  covers,
  title,
}: CoverZoomDialogProps) {
  const total = covers.length;
  const [currentIndex, setCurrentIndex] = useState(0);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [panOffset, setPanOffset] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const safeIndex = total === 0 ? 0 : ((currentIndex % total) + total) % total;
  const currentCover = covers[safeIndex];
  const thumbnailCovers = covers;

  function handleZoomOpenChange(nextOpen: boolean) {
    onOpenChange(nextOpen);
    if (!nextOpen) {
      setZoomLevel(1);
      setPanOffset({ x: 0, y: 0 });
      setIsDragging(false);
      setCurrentIndex(0);
    }
  }

  function clampPan(
    x: number,
    y: number,
    width: number,
    height: number,
    zoom: number,
  ) {
    const maxX = ((zoom - 1) * width) / 2;
    const maxY = ((zoom - 1) * height) / 2;
    return {
      x: Math.min(maxX, Math.max(-maxX, x)),
      y: Math.min(maxY, Math.max(-maxY, y)),
    };
  }

  function handleWheelZoom(event: React.WheelEvent<HTMLDivElement>) {
    event.preventDefault();
    const delta = -event.deltaY;
    const step = 0.1;
    const next = zoomLevel + (delta > 0 ? step : -step);
    const clamped = Math.min(4, Math.max(1, Number(next.toFixed(2))));
    setZoomLevel(clamped);
    const rect = event.currentTarget.getBoundingClientRect();
    const nextPan =
      clamped === 1
        ? { x: 0, y: 0 }
        : clampPan(panOffset.x, panOffset.y, rect.width, rect.height, clamped);
    setPanOffset(nextPan);
  }

  function handlePointerDown(event: React.PointerEvent<HTMLDivElement>) {
    if (zoomLevel <= 1) return;
    event.preventDefault();
    setIsDragging(true);
    setDragStart({
      x: event.clientX - panOffset.x,
      y: event.clientY - panOffset.y,
    });
    (event.currentTarget as HTMLDivElement).setPointerCapture(event.pointerId);
  }

  function handlePointerMove(event: React.PointerEvent<HTMLDivElement>) {
    if (!isDragging) return;
    const rect = event.currentTarget.getBoundingClientRect();
    const nextX = event.clientX - dragStart.x;
    const nextY = event.clientY - dragStart.y;
    setPanOffset(clampPan(nextX, nextY, rect.width, rect.height, zoomLevel));
  }

  function handlePointerUp(event: React.PointerEvent<HTMLDivElement>) {
    if (!isDragging) return;
    setIsDragging(false);
    (event.currentTarget as HTMLDivElement).releasePointerCapture(
      event.pointerId,
    );
  }

  function handleZoomIn() {
    setZoomLevel((prev) => Math.min(4, Number((prev + 0.2).toFixed(2))));
  }

  function handleZoomOut() {
    setZoomLevel((prev) => {
      const next = Math.max(1, Number((prev - 0.2).toFixed(2)));
      if (next <= 1) {
        setPanOffset({ x: 0, y: 0 });
      }
      return next;
    });
  }

  function handleResetView() {
    setZoomLevel(1);
    setPanOffset({ x: 0, y: 0 });
  }

  function handleDoubleClick(event: React.MouseEvent<HTMLDivElement>) {
    event.preventDefault();
    setZoomLevel(1);
    setPanOffset({ x: 0, y: 0 });
    setIsDragging(false);
  }

  return (
    <Dialog open={open} onOpenChange={handleZoomOpenChange}>
      <DialogContent
        className="min-w-[50vw] h-5/6 max-w-none max-h-none p-2  flex flex-col "
        showCloseButton={false}
      >
        {/* AREA IMMAGINE */}
        <div className="flex-1 flex items-center justify-center overflow-hidden">
          <div
            className="relative w-full h-full max-w-[95vw] max-h-[90vh]"
            onWheel={handleWheelZoom}
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            onPointerCancel={handlePointerUp}
            onDoubleClick={handleDoubleClick}
            style={{
              cursor:
                zoomLevel > 1 ? (isDragging ? "grabbing" : "grab") : "default",
            }}
          >
            {/* ZOOM LABEL */}
            <div className="absolute left-2 top-2 z-10 rounded-full bg-background/90 px-2 py-0.5 text-xs text-muted-foreground shadow-sm backdrop-blur">
              {zoomLevel.toFixed(1)}x
            </div>

            {/* IMMAGINE */}
            <div
              className="absolute inset-0"
              style={{
                transform: `translate(${panOffset.x}px, ${panOffset.y}px) scale(${zoomLevel})`,
              }}
            >
              {currentCover ? (
                <Image
                  src={currentCover}
                  alt={`Copertina di ${title}`}
                  fill
                  className="object-contain"
                  draggable={false}
                  sizes="100vw"
                />
              ) : null}
            </div>
          </div>
        </div>
        {/* CONTROLLI */}
        <div className="flex flex-col gap-3 p-3">
          {total > 1 ? (
            <div className="flex items-center gap-3 overflow-x-auto pb-1">
              {thumbnailCovers.map((cover, index) => {
                const isActive = index === safeIndex;
                return (
                  <button
                    key={`${cover}-${index}`}
                    type="button"
                    onClick={() => setCurrentIndex(index)}
                    className={`relative h-20 w-14 shrink-0 overflow-hidden rounded-lg border transition-all ${
                      isActive
                        ? "border-primary ring-2 ring-primary/40"
                        : "border-muted/70 hover:border-foreground/40"
                    }`}
                    aria-label={`Vai alla cover ${index + 1}`}
                  >
                    <Image
                      src={cover}
                      alt={`Anteprima cover ${index + 1}`}
                      fill
                      className="object-cover"
                      sizes="56px"
                    />
                  </button>
                );
              })}
            </div>
          ) : null}

          <div className="flex items-center justify-between">
            <p className="text-xs opacity-70">
              Usa la rotella per zoomare (1x - 4x)
            </p>

            <div className="flex items-center gap-2">
              <Button size="sm" variant="outline" onClick={handleZoomOut}>
                <ZoomOut />
              </Button>
              <Button size="sm" variant="outline" onClick={handleZoomIn}>
                <ZoomIn />
              </Button>
              <Button size="sm" variant="outline" onClick={handleResetView}>
                Reset
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
