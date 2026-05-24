import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

import { supabase } from '../../../services/supabase';
import {
  generateAiCareerRecommendations,
  generateAiTimelineRoadmap,
} from '../../../services/apiRecommendations';

/**
 * 1. Hook to grab the user's latest assessment and its generated career options
 */
export function useCareerRecommendations(userId) {
  return useQuery({
    queryKey: ['latestAssessment', userId],
    queryFn: async () => {
      if (!userId) return null;

      // Pull latest assessment row
      const { data, error } = await supabase
        .from('assessments')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(1);

      if (error) throw new Error(error.message);
      const assessment = data[0] || null;
      if (!assessment) return null;

      // If recommendations have already been generated and saved, return them immediately!
      if (assessment.generated_recommendations) {
        return {
          assessment,
          recommendations: assessment.generated_recommendations,
        };
      }

      // If not, fetch them fresh from Gemini
      const recommendations = await generateAiCareerRecommendations(assessment);

      // Save them to the database instantly in the background so it never repeats
      await supabase
        .from('assessments')
        .update({ generated_recommendations: recommendations })
        .eq('id', assessment.id);

      return { assessment, recommendations };
    },
    enabled: Boolean(userId),
    staleTime: 1000 * 60 * 30, // 30 Minute local cache lock
  });
}

/**
 * 2. Hook to fetch or build a personalized learning roadmap from the database
 */
export function useTimelineRoadmap(userId, targetCareer) {
  return useQuery({
    queryKey: ['activeRoadmap', userId, targetCareer],
    queryFn: async () => {
      if (!userId || !targetCareer) return null;

      // A. Check if this specific roadmap row already exists in Supabase
      const { data: existingRoadmap } = await supabase
        .from('roadmaps')
        .select('*')
        .eq('user_id', userId)
        .eq('target_career_title', targetCareer)
        .limit(1);

      if (existingRoadmap && existingRoadmap.length > 0) {
        return existingRoadmap[0];
      }

      // B. If it doesn't exist, fetch the parent assessment details to find gaps
      const { data: assessmentData } = await supabase
        .from('assessments')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(1);

      const latestAssessment = assessmentData?.[0];
      const identifiedGaps = latestAssessment?.selected_skills || [
        'General Core Skills',
      ];

      // C. Trigger Gemini to construct the 6-month milestones
      const generatedMilestones = await generateAiTimelineRoadmap({
        targetCareer,
        identifiedGaps,
      });

      // D. Save it directly to the database row so it persists permanently
      const { data: newRoadmap, error: saveError } = await supabase
        .from('roadmaps')
        .insert([
          {
            user_id: userId,
            assessment_id:
              latestAssessment?.id || '00000000-0000-0000-0000-000000000000',
            target_career_title: targetCareer,
            suitability_percentage: 85,
            verified_strengths: latestAssessment?.selected_skills || [],
            identified_gaps: [],
            timeline_milestones_json: generatedMilestones,
          },
        ])
        .select()
        .single();

      if (saveError) throw new Error(saveError.message);
      return newRoadmap;
    },
    enabled: Boolean(userId) && Boolean(targetCareer),
    staleTime: 1000 * 60 * 60, // 1 hour data stability cache
  });
}

/**
 * 3. Mutation hook to update completion checkboxes in real time
 */
export function useUpdateRoadmapProgress() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ roadmapId, updatedMilestones }) => {
      const { data, error } = await supabase
        .from('roadmaps')
        .update({ timeline_milestones_json: updatedMilestones })
        .eq('id', roadmapId)
        .select()
        .single();

      if (error) throw new Error(error.message);
      return data;
    },
    onSuccess: data => {
      // Invalidate the cache line to reflect updates everywhere instantly
      queryClient.invalidateQueries({
        queryKey: ['activeRoadmap', data.user_id, data.target_career_title],
      });
    },
  });
}
