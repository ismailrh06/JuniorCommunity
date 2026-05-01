"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getSupabaseBrowserClient } from "@juniorcode/db";
import type { UserProgress, LearnerProfile } from "@/types";

export function useLearnerProgress(userId: string | undefined) {
  const supabase = getSupabaseBrowserClient();

  return useQuery({
    queryKey: ["learner-progress", userId],
    queryFn: async () => {
      if (!userId) return null;
      const { data, error } = await supabase
        .from("user_progress")
        .select("*, lesson:lessons(*)")
        .eq("user_id", userId);
      if (error) throw error;
      return data as UserProgress[];
    },
    enabled: !!userId,
  });
}

export function useLearnerProfile(userId: string | undefined) {
  const supabase = getSupabaseBrowserClient();

  return useQuery({
    queryKey: ["learner-profile", userId],
    queryFn: async () => {
      if (!userId) return null;
      const { data, error } = await supabase
        .from("learner_profiles")
        .select("*, current_path:learning_paths(*)")
        .eq("user_id", userId)
        .single();
      if (error) throw error;
      return data as LearnerProfile;
    },
    enabled: !!userId,
  });
}

export function useCompleteLesson() {
  const supabase = getSupabaseBrowserClient();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ userId, lessonId }: { userId: string; lessonId: string }) => {
      const { error } = await supabase
        .from("user_progress")
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        .upsert({
          user_id: userId,
          lesson_id: lessonId,
          status: "completed",
          completed_at: new Date().toISOString(),
        } as any);
      if (error) throw error;
    },
    onSuccess: (_, { userId }) => {
      queryClient.invalidateQueries({ queryKey: ["learner-progress", userId] });
      queryClient.invalidateQueries({ queryKey: ["learner-profile", userId] });
    },
  });
}

export function useUserBadges(userId: string | undefined) {
  const supabase = getSupabaseBrowserClient();

  return useQuery({
    queryKey: ["user-badges", userId],
    queryFn: async () => {
      if (!userId) return [];
      const { data, error } = await supabase
        .from("user_badges")
        .select("*, badge:badges(*)")
        .eq("user_id", userId);
      if (error) throw error;
      return data;
    },
    enabled: !!userId,
  });
}
