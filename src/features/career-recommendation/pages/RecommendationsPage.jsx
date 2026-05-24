import {
  CheckCircle2Icon,
  AlertTriangleIcon,
  ArrowRightIcon,
} from 'lucide-react';
import { Link, useNavigate } from 'react-router';
import { useCareerRecommendations } from '../hooks/useRecommendations';
import { useUser } from '../../authentication/hooks/useUser';
import Spinner from '../../../components/Spinner';

export default function RecommendationsPage() {
  const navigate = useNavigate();
  const { user, profile } = useUser();

  // Fetch from our new smart background-saving hook
  const { data, isLoading, error } = useCareerRecommendations(user?.id);

  if (isLoading) {
    return (
      <div className='bg-canvas-default flex min-h-[calc(100vh-4rem)] flex-col items-center justify-center font-sans'>
        <Spinner />
        <p className='text-brand-muted mt-2 animate-pulse text-sm'>
          SkillBridge AI parsing your profiles and matching career tracks...
        </p>
      </div>
    );
  }

  if (
    error ||
    !data ||
    !data.recommendations ||
    data.recommendations.length === 0
  ) {
    return (
      <div className='bg-canvas-default flex min-h-[calc(100vh-4rem)] flex-col items-center justify-center p-4 text-center font-sans'>
        <h2 className='text-brand-dark text-xl font-bold'>
          No Active Career Blueprints Found
        </h2>
        <p className='text-brand-muted mt-1 max-w-md text-sm'>
          Complete an evaluation assessment first to generate your technical
          profile data.
        </p>
        <button
          onClick={() => navigate('/skill-selector')}
          className='bg-brand-primary hover:bg-brand-primary/90 mt-6 cursor-pointer rounded-lg px-5 py-2.5 font-medium text-white transition-colors'
        >
          Take Assessment Quiz
        </button>
      </div>
    );
  }

  const { assessment, recommendations } = data;
  const studentName = profile?.full_name
    ? profile.full_name.split(' ')[0]
    : 'Scholar';

  return (
    <div className='bg-canvas-default mx-auto max-w-7xl space-y-8 p-4 font-sans md:p-8'>
      <div className='bg-canvas-panel border-border-subtle rounded-2xl border p-6 shadow-sm md:p-8'>
        <h1 className='text-brand-dark mb-2 text-2xl font-bold'>
          Assessment Results for {studentName}
        </h1>
        <p className='text-brand-muted max-w-3xl text-sm leading-relaxed'>
          Based on your recent quiz evaluation session where you scored a
          verified{' '}
          <span className='text-brand-primary font-bold'>
            {assessment?.verified_match_score}% accuracy
          </span>{' '}
          across your skills matrix, your tailored pathways are ready.
        </p>
      </div>

      <div className='grid grid-cols-1 gap-6 md:grid-cols-3'>
        {recommendations.map(rec => (
          <div
            key={rec.id}
            className='bg-canvas-panel border-border-subtle hover:border-brand-primary/40 flex h-full flex-col rounded-2xl border p-6 shadow-sm transition-all duration-200'
          >
            <div className='mb-4 flex items-start justify-between gap-2'>
              <h2 className='text-brand-dark text-lg leading-tight font-bold tracking-tight'>
                {rec.title}
              </h2>
              <div
                className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-semibold ${rec.match_percentage >= 80 ? 'bg-feedback-success/10 text-feedback-success' : 'bg-brand-primary/10 text-brand-primary'}`}
              >
                {rec.match_percentage}% Match
              </div>
            </div>

            <p className='text-brand-muted mb-6 flex-1 text-xs leading-relaxed'>
              {rec.description}
            </p>

            <div className='mb-8 space-y-5'>
              <div>
                <h3 className='text-brand-secondary mb-3 text-xs font-bold tracking-wider uppercase'>
                  Verified Strengths
                </h3>
                <ul className='space-y-2'>
                  {rec.strengths.map((str, i) => (
                    <li
                      key={i}
                      className='text-brand-dark flex items-start gap-2 text-xs'
                    >
                      <CheckCircle2Icon
                        size={14}
                        className='text-feedback-success mt-0.5 shrink-0'
                      />
                      {str}
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h3 className='text-brand-secondary mb-3 text-xs font-bold tracking-wider uppercase'>
                  Identified Gaps
                </h3>
                <ul className='space-y-2'>
                  {rec.gaps.map((gap, i) => (
                    <li
                      key={i}
                      className='text-brand-dark flex items-start gap-2 text-xs'
                    >
                      <AlertTriangleIcon
                        size={14}
                        className='text-feedback-warning mt-0.5 shrink-0'
                      />
                      {gap}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* We now pass the title via modern URL search parameters for pure navigation stability! */}
            <Link
              to={`/roadmap?job=${encodeURIComponent(rec.title)}`}
              className='bg-canvas-inset border-border-subtle text-brand-dark hover:bg-canvas-default hover:border-brand-primary/50 mt-auto inline-flex w-full items-center justify-center gap-2 rounded-lg border px-4 py-2.5 text-sm font-medium transition-colors'
            >
              View Personalized Roadmap <ArrowRightIcon size={14} />
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
