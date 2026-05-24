import { useLocation, useNavigate } from 'react-router';
import { ExternalLinkIcon, CheckIcon, ArrowLeftIcon } from 'lucide-react';
import toast from 'react-hot-toast';

import {
  useTimelineRoadmap,
  useUpdateRoadmapProgress,
} from '../hooks/useRecommendations';
import Spinner from '../../../components/Spinner';
import { useUser } from '../../authentication/hooks/useUser';

export default function RoadmapView() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useUser();

  // Extract the target job name directly out of the browser's native URL search bar
  const searchParams = new URLSearchParams(location.search);
  const chosenJob = searchParams.get('job');

  // Trigger our unified database-first hook
  const {
    data: roadmapInstance,
    isLoading,
    error,
  } = useTimelineRoadmap(user?.id, chosenJob);
  const { mutate: syncProgress } = useUpdateRoadmapProgress();

  if (isLoading) {
    return (
      <div className='bg-canvas-default flex min-h-[calc(100vh-4rem)] flex-col items-center justify-center font-sans'>
        <Spinner />
        <p className='text-brand-muted mt-2 animate-pulse text-sm'>
          SkillBridge AI sync loading your persistent roadmap tracking
          profile...
        </p>
      </div>
    );
  }

  if (error || !roadmapInstance) {
    return (
      <div className='bg-canvas-default flex min-h-[calc(100vh-4rem)] flex-col items-center justify-center p-4 text-center font-sans'>
        <p className='text-feedback-danger font-medium'>
          Failed to load the active timeline profile row parameters.
        </p>
        <button
          onClick={() => navigate('/recommendations')}
          className='text-brand-primary mt-4 text-sm font-semibold hover:underline'
        >
          Go Back to Recommendations
        </button>
      </div>
    );
  }

  // Read the milestones array directly out of our PostgreSQL JSONB cell
  const milestones = roadmapInstance.timeline_milestones_json || [];

  const toggleStepComplete = id => {
    const updatedMilestones = milestones.map(step => {
      if (step.id === id) {
        return { ...step, completed: !step.completed };
      }
      return step;
    });

    // Fire mutation patch directly to database row
    syncProgress(
      {
        roadmapId: roadmapInstance.id,
        updatedMilestones,
      },
      {
        onSuccess: () => {
          toast.success('Progress saved online!');
        },
        onError: err => {
          toast.error('Sync failed: ' + err.message);
        },
      },
    );
  };

  return (
    <div className='bg-canvas-default mx-auto min-h-[calc(100vh-4rem)] max-w-5xl p-4 font-sans md:p-8'>
      <div className='mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-center'>
        <div>
          <h1 className='text-brand-dark text-2xl font-bold'>
            Learning Roadmap
          </h1>
          <p className='text-brand-muted mt-1 text-sm'>
            Persistent curriculum tracker for your role as a{' '}
            <span className='text-brand-primary font-bold'>{chosenJob}</span>.
          </p>
        </div>
        <button
          onClick={() => navigate('/recommendations')}
          className='text-brand-muted hover:text-brand-dark border-border-subtle bg-canvas-panel inline-flex cursor-pointer items-center gap-2 rounded-lg border px-4 py-2 text-sm shadow-sm transition-colors'
        >
          <ArrowLeftIcon size={16} /> Back to Results
        </button>
      </div>

      <div className='bg-canvas-panel border-border-subtle relative rounded-2xl border p-6 shadow-sm md:p-10'>
        <div className='bg-border-subtle absolute top-12 bottom-12 left-10.75 z-0 w-0.5' />

        <div className='relative z-10 space-y-12'>
          {milestones.map(step => {
            const isStepDone = step.completed;
            return (
              <div key={step.id} className='relative flex items-start gap-6'>
                <div className='mt-1 shrink-0'>
                  <div
                    onClick={() => toggleStepComplete(step.id)}
                    className={`flex h-10 w-10 cursor-pointer items-center justify-center rounded-full border-2 transition-all duration-200 ${
                      isStepDone
                        ? 'bg-feedback-success border-feedback-success text-white shadow-sm'
                        : 'bg-canvas-inset border-border-subtle hover:border-brand-primary text-transparent'
                    }`}
                  >
                    <CheckIcon
                      size={18}
                      className={isStepDone ? 'block' : 'hidden'}
                    />
                  </div>
                </div>

                <div
                  className={`bg-canvas-panel flex-1 rounded-xl border p-5 transition-all duration-200 ${isStepDone ? 'border-feedback-success/40 bg-feedback-success/5' : 'border-border-subtle'}`}
                >
                  <div className='mb-4 flex flex-col justify-between gap-4 md:flex-row md:items-center'>
                    <div>
                      <span className='text-brand-secondary mb-1 block text-xs font-bold tracking-wider uppercase'>
                        {step.month}
                      </span>
                      <h3
                        className={`text-brand-dark text-base font-bold ${isStepDone ? 'text-brand-muted line-through' : ''}`}
                      >
                        {step.title}
                      </h3>
                    </div>

                    <label className='group flex shrink-0 cursor-pointer items-center gap-2 select-none'>
                      <input
                        type='checkbox'
                        checked={isStepDone}
                        onChange={() => toggleStepComplete(step.id)}
                        className='hidden'
                      />
                      <div
                        className={`flex h-5 w-5 items-center justify-center rounded border transition-colors ${isStepDone ? 'bg-brand-primary border-brand-primary text-white' : 'border-border-subtle bg-canvas-inset group-hover:border-brand-primary'}`}
                      >
                        {isStepDone && <CheckIcon size={14} />}
                      </div>
                      <span className='text-brand-muted group-hover:text-brand-dark text-xs font-semibold'>
                        Mark month complete
                      </span>
                    </label>
                  </div>

                  <div className='border-border-subtle/50 mt-4 flex flex-wrap gap-y-2 border-t pt-4'>
                    {step.links.map((link, i) => (
                      <a
                        key={i}
                        href={link.url}
                        target='_blank'
                        rel='noopener noreferrer'
                        className='text-brand-primary mr-6 inline-flex items-center gap-1.5 text-xs font-semibold hover:underline'
                      >
                        {link.text} <ExternalLinkIcon size={12} />
                      </a>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
