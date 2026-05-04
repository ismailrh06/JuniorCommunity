"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

type LearningProgressState = {
  completedMissions: string[];
  completedSteps: string[];
  claimedDailyChallenges: string[];
  xp: number;
  streakDays: number;
  lastActivityDate: string | null;
  syncedFromServer: boolean;
  syncFromServer: () => Promise<void>;
  completeStep: (stepId: string, xp?: number) => void;
  completeMission: (missionId: string, xp?: number) => Promise<void>;
  claimDailyChallenge: (challengeId: string, xp?: number) => void;
  isStepCompleted: (stepId: string) => boolean;
  isMissionCompleted: (missionId: string) => boolean;
  isDailyChallengeClaimed: (challengeId: string) => boolean;
};

function getTodayKey() {
  return new Date().toISOString().slice(0, 10);
}

function getYesterdayKey() {
  const date = new Date();
  date.setDate(date.getDate() - 1);
  return date.toISOString().slice(0, 10);
}

function nextStreak(lastActivityDate: string | null, currentStreak: number) {
  const today = getTodayKey();
  if (lastActivityDate === today) return currentStreak;
  if (lastActivityDate === getYesterdayKey()) return currentStreak + 1;
  return 1;
}

type ProgressItemType = "mission" | "step" | "daily";

async function persistItemToApi(
  itemId: string,
  itemType: ProgressItemType,
  xp: number,
) {
  try {
    await fetch("/api/progress", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        itemId,
        itemType,
        xp,
        status: "completed",
      }),
    });
  } catch {
    // Local persistence is the offline-safe source for demo mode.
  }
}

function unique(values: string[]) {
  return Array.from(new Set(values));
}

export const useLearningProgressStore = create<LearningProgressState>()(
  persist(
    (set, get) => ({
      completedMissions: [],
      completedSteps: [],
      claimedDailyChallenges: [],
      xp: 0,
      streakDays: 0,
      lastActivityDate: null,
      syncedFromServer: false,
      syncFromServer: async () => {
        if (get().syncedFromServer) return;

        try {
          const response = await fetch("/api/progress", {
            method: "GET",
            headers: { Accept: "application/json" },
          });
          if (!response.ok) {
            return;
          }

          const payload = (await response.json()) as {
            data?: Array<{
              item_id: string;
              item_type: ProgressItemType;
              status: "in_progress" | "completed";
            }>;
            profile?: {
              xp_points?: number;
              streak_days?: number;
              last_active_at?: string | null;
            } | null;
          };

          const completed = (payload.data ?? []).filter(
            (item) => item.status === "completed",
          );
          const state = get();
          set({
            completedMissions: unique([
              ...state.completedMissions,
              ...completed
                .filter((item) => item.item_type === "mission")
                .map((item) => item.item_id),
            ]),
            completedSteps: unique([
              ...state.completedSteps,
              ...completed
                .filter((item) => item.item_type === "step")
                .map((item) => item.item_id),
            ]),
            claimedDailyChallenges: unique([
              ...state.claimedDailyChallenges,
              ...completed
                .filter((item) => item.item_type === "daily")
                .map((item) => item.item_id),
            ]),
            xp: Math.max(state.xp, payload.profile?.xp_points ?? 0),
            streakDays: Math.max(
              state.streakDays,
              payload.profile?.streak_days ?? 0,
            ),
            lastActivityDate:
              payload.profile?.last_active_at?.slice(0, 10) ??
              state.lastActivityDate,
            syncedFromServer: true,
          });
        } catch {
          // Keep trying on future page mounts when the network/session recovers.
        }
      },
      completeStep: (stepId, xp = 25) => {
        const state = get();
        if (state.completedSteps.includes(stepId)) return;
        const today = getTodayKey();
        set({
          completedSteps: [...state.completedSteps, stepId],
          xp: state.xp + xp,
          streakDays: nextStreak(state.lastActivityDate, state.streakDays),
          lastActivityDate: today,
        });
        void persistItemToApi(stepId, "step", xp);
      },
      completeMission: async (missionId, xp = 50) => {
        const state = get();
        if (state.completedMissions.includes(missionId)) return;
        const today = getTodayKey();
        set({
          completedMissions: [...state.completedMissions, missionId],
          xp: state.xp + xp,
          streakDays: nextStreak(state.lastActivityDate, state.streakDays),
          lastActivityDate: today,
        });
        await persistItemToApi(missionId, "mission", xp);
      },
      claimDailyChallenge: (challengeId, xp = 15) => {
        const state = get();
        if (state.claimedDailyChallenges.includes(challengeId)) return;
        const today = getTodayKey();
        set({
          claimedDailyChallenges: [
            ...state.claimedDailyChallenges,
            challengeId,
          ],
          xp: state.xp + xp,
          streakDays: nextStreak(state.lastActivityDate, state.streakDays),
          lastActivityDate: today,
        });
        void persistItemToApi(challengeId, "daily", xp);
      },
      isStepCompleted: (stepId) => get().completedSteps.includes(stepId),
      isMissionCompleted: (missionId) =>
        get().completedMissions.includes(missionId),
      isDailyChallengeClaimed: (challengeId) =>
        get().claimedDailyChallenges.includes(challengeId),
    }),
    {
      name: "juniorcode-learning-progress-v1",
      partialize: (state) => ({
        completedMissions: state.completedMissions,
        completedSteps: state.completedSteps,
        claimedDailyChallenges: state.claimedDailyChallenges,
        xp: state.xp,
        streakDays: state.streakDays,
        lastActivityDate: state.lastActivityDate,
      }),
    },
  ),
);
