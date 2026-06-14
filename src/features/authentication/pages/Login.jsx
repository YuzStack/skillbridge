import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router';
import { EyeIcon, EyeOffIcon } from 'lucide-react';
import toast from 'react-hot-toast';

import { useLogin } from '../hooks/useUser';

export default function Login() {
  const { login, isLoggingIn } = useLogin();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = data => {
    login(
      { email: data.email, password: data.password },
      {
        onSuccess: () => {
          toast.success('Logged in successfully!');
          navigate('/');
        },
        onError: err => {
          toast.error(err.message || 'Authentication credentials rejected.');
        },
      },
    );
  };

  const togglePasswordVisibility = () => {
    setShowPassword(prev => !prev);
  };

  return (
    <div className='bg-canvas-default flex min-h-screen items-center justify-center p-4 font-sans'>
      <div className='bg-canvas-panel border-border-subtle w-full max-w-md rounded-2xl border p-8 shadow-md'>
        <div className='mb-8 text-center select-none'>
          <div className='bg-brand-primary mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl text-2xl font-bold text-white shadow-sm'>
            S
          </div>
          <h1 className='text-brand-dark mb-2 text-2xl font-bold'>
            Welcome back
          </h1>
          <p className='text-brand-muted text-sm'>
            Enter your details to access your dashboard.
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className='space-y-5'>
          <div>
            <label className='text-brand-dark mb-1.5 block text-xs font-semibold'>
              Email
            </label>
            <input
              type='email'
              disabled={isLoggingIn}
              {...register('email', { required: 'Email is required' })}
              className={`bg-canvas-inset border-border-subtle text-brand-dark w-full rounded-lg border px-4 py-2.5 text-sm transition-colors focus:outline-none ${errors.email ? 'border-feedback-danger focus:border-feedback-danger' : 'focus:border-border-focus'}`}
              placeholder='Enter your email'
            />
            {errors.email && (
              <p className='text-feedback-danger text-xxs mt-1 font-bold'>
                {errors.email.message}
              </p>
            )}
          </div>

          <div>
            <div className='mb-1.5 flex items-center justify-between'>
              <label className='text-brand-dark block text-xs font-semibold'>
                Password
              </label>
              <Link
                to='/forgot-password'
                className='text-brand-primary text-xs font-semibold hover:underline'
              >
                Forgot password?
              </Link>
            </div>

            {/* Relative wrapper container to cleanly house the floating interactive eye token */}
            <div className='relative'>
              <input
                type={showPassword ? 'text' : 'password'}
                disabled={isLoggingIn}
                {...register('password', { required: 'Password is required' })}
                className={`bg-canvas-inset border-border-subtle text-brand-dark w-full rounded-lg border py-2.5 pr-11 pl-4 text-sm transition-colors focus:outline-none ${errors.password ? 'border-feedback-danger focus:border-feedback-danger' : 'focus:border-border-focus'}`}
                placeholder='••••••••'
              />

              <button
                type='button'
                onClick={togglePasswordVisibility}
                disabled={isLoggingIn}
                className='text-brand-muted hover:text-brand-dark focus:text-brand-dark absolute top-1/2 right-3 -translate-y-1/2 cursor-pointer rounded-md p-1 transition-colors outline-none'
                title={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? (
                  <EyeOffIcon size={18} />
                ) : (
                  <EyeIcon size={18} />
                )}
              </button>
            </div>

            {errors.password && (
              <p className='text-feedback-danger text-xxs mt-1 font-bold'>
                {errors.password.message}
              </p>
            )}
          </div>

          <button
            type='submit'
            disabled={isLoggingIn}
            className='bg-brand-primary hover:bg-brand-primary/90 w-full cursor-pointer rounded-lg px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors disabled:cursor-not-allowed disabled:opacity-50'
          >
            {isLoggingIn ? 'Signing In...' : 'Sign In'}
          </button>
        </form>

        <p className='text-brand-muted mt-8 text-center text-xs font-medium'>
          Don't have an account?{' '}
          <Link
            to='/signup'
            className='text-brand-primary font-bold hover:underline'
          >
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}
