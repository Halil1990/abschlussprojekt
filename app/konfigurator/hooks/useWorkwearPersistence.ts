import { useEffect, useCallback } from "react";
import {
  WORKWEAR_IMAGES,
} from "../constants";
import type { ZoneRectangle } from "../types";
import {
  getOrCreateWorkwearZoneState,
  getValidSelectedZoneId,
  snapshotWorkwearZoneState,
  type WorkwearZoneState,
} from "../workwearState";
import { createConfiguredSnapshots } from "../submission";
import { KONFIGURATOR_SUBMISSION_DRAFT_KEY } from "../submissionDraft";
import type { Asset, PrintMaterial } from "../types";

export function useWorkwearPersistence(
  zones: ZoneRectangle[],
  selectedZoneId: string,
  activeWorkwearIndex: number,
  onSetZones: (zones: ZoneRectangle[]) => void,
  onSetSelectedZoneId: (id: string) => void,
  onSetAvailableImageIndexes: (indexes: Set<number> | null) => void,
  zoneCounterRef: React.MutableRefObject<number>,
  workwearStateRef: React.MutableRefObject<Record<number, WorkwearZoneState>>
) {
  // Keep in-memory state synced for the currently active image.
  useEffect(() => {
    workwearStateRef.current[activeWorkwearIndex] = snapshotWorkwearZoneState(
      zones,
      selectedZoneId,
      zoneCounterRef.current,
      activeWorkwearIndex
    );
  }, [activeWorkwearIndex, selectedZoneId, zones, zoneCounterRef, workwearStateRef]);

  // Check which images are available by attempting to load them
  useEffect(() => {
    let isMounted = true;
    const availableIndexes = new Set<number>();

    const checkImageAvailability = async () => {
      const checkPromises = WORKWEAR_IMAGES.map((imageUrl, index) => {
        return new Promise<void>((resolve) => {
          const img = new Image();
          img.onload = () => {
            if (isMounted) {
              availableIndexes.add(index);
            }
            resolve();
          };
          img.onerror = () => {
            resolve();
          };
          img.src = imageUrl;
        });
      });

      await Promise.all(checkPromises);
      if (isMounted) {
        onSetAvailableImageIndexes(availableIndexes.size > 0 ? availableIndexes : null);
      }
    };

    checkImageAvailability();

    return () => {
      isMounted = false;
    };
  }, [onSetAvailableImageIndexes]);

  const saveCurrentWorkwearState = useCallback(
    (index: number) => {
      workwearStateRef.current[index] = snapshotWorkwearZoneState(
        zones,
        selectedZoneId,
        zoneCounterRef.current,
        index
      );
    },
    [zones, selectedZoneId, zoneCounterRef, workwearStateRef]
  );

  const getSubmissionStateByIndex = useCallback(() => {
    const stateByIndex: Record<number, WorkwearZoneState> = {
      ...workwearStateRef.current,
    };

    stateByIndex[activeWorkwearIndex] = snapshotWorkwearZoneState(
      zones,
      selectedZoneId,
      zoneCounterRef.current,
      activeWorkwearIndex
    );

    return stateByIndex;
  }, [zones, selectedZoneId, activeWorkwearIndex, zoneCounterRef, workwearStateRef]);

  const loadWorkwearState = useCallback(
    (index: number) => {
      const savedState = getOrCreateWorkwearZoneState(workwearStateRef.current, index);

      const validSelectedZoneId = getValidSelectedZoneId(
        savedState.zones,
        savedState.selectedZoneId
      );

      onSetZones(savedState.zones);
      onSetSelectedZoneId(validSelectedZoneId);
      zoneCounterRef.current = savedState.nextZoneIndex;
    },
    [zoneCounterRef, workwearStateRef, onSetZones, onSetSelectedZoneId]
  );

  const prepareDraftAndSubmit = useCallback(
    async (
      assets: Asset[],
      printMaterial: PrintMaterial,
      activeWorkwearIndex: number
    ) => {
      const stateByIndex = getSubmissionStateByIndex();
      const snapshots = await createConfiguredSnapshots(stateByIndex, assets);

      if (snapshots.length === 0) {
        throw new Error("Bitte mindestens ein Logo auf einer Zone platzieren.");
      }

      sessionStorage.setItem(
        KONFIGURATOR_SUBMISSION_DRAFT_KEY,
        JSON.stringify({
          activeWorkwearIndex,
          workwearStateByIndex: stateByIndex,
          snapshots,
          printMaterial,
          createdAt: new Date().toISOString(),
        })
      );

      return snapshots;
    },
    [getSubmissionStateByIndex]
  );

  return {
    saveCurrentWorkwearState,
    getSubmissionStateByIndex,
    loadWorkwearState,
    prepareDraftAndSubmit,
  };
}
