import { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { Wallet, Eye, EyeOff, House } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router';
import {
  login,
  toUserFriendlyAuthError,
} from '../api/auth';

type LoginPageProps = {
  onCreateAccount?: () => void;
  onLoginSuccess?: (notice?: string) => void;
  notice?: string | null;
};

type LoginLocationState = {
  notice?: string;
};

export default function LoginPage({ onCreateAccount, onLoginSuccess, notice }: LoginPageProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const routedNotice = (location.state as LoginLocationState | null)?.notice ?? null;
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(notice ?? routedNotice);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fieldClassName =
    'block w-full rounded-2xl border border-emerald-900/20 bg-emerald-zenith-surface-high/45 px-4 py-3 text-emerald-zenith-text shadow-sm placeholder:text-emerald-zenith-text-muted/40 outline-none transition-all focus:border-emerald-zenith-primary/50 focus:ring-2 focus:ring-emerald-zenith-primary/15';
  const labelClassName = 'block text-sm font-medium leading-6 text-emerald-zenith-text';
  const socialButtonClassName =
    'flex w-full items-center justify-center gap-3 rounded-2xl border border-emerald-900/20 bg-emerald-zenith-surface-high/35 px-3 py-3 text-sm font-semibold text-emerald-zenith-text shadow-sm transition-all hover:border-emerald-zenith-primary/35 hover:bg-emerald-zenith-surface-high';

  useEffect(() => {
    setSuccessMessage(notice ?? routedNotice ?? null);
  }, [notice, routedNotice]);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;

    setFormData((current) => ({
      ...current,
      [name]: value,
    }));
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);
    setIsSubmitting(true);

    try {
      const session = await login({
        email: formData.email.trim(),
        password: formData.password,
      });

      const successNotice = `Welcome back, ${session.user.firstName}.`;
      setSuccessMessage(successNotice);

      if (typeof onLoginSuccess === 'function') {
        onLoginSuccess(successNotice);
      } else {
        navigate('/app', { state: { notice: successNotice } });
      }
    } catch (error) {
      const rawMessage = error instanceof Error ? error.message : error;
      setErrorMessage(toUserFriendlyAuthError(rawMessage, "Can't log in right now. Please try again later."));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-emerald-zenith-bg font-sans text-emerald-zenith-text">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_12%_10%,rgba(52,211,153,0.16),transparent_32%),radial-gradient(circle_at_88%_88%,rgba(47,184,223,0.12),transparent_28%)]"
      />

      <div className="relative z-10 flex min-h-screen flex-col lg:flex-row">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="relative hidden overflow-hidden border-r border-emerald-900/20 bg-linear-to-br from-emerald-zenith-surface via-emerald-zenith-bg to-emerald-zenith-accent p-12 lg:flex lg:w-1/2 lg:flex-col lg:justify-between"
        >
          <div className="pointer-events-none absolute inset-0 opacity-60">
            <div className="absolute -top-16 -right-20 h-104 w-104 rounded-full bg-emerald-zenith-primary/18 blur-[130px]" />
            <div className="absolute -bottom-24 -left-20 h-88 w-88 rounded-full bg-emerald-zenith-secondary/12 blur-[120px]" />
          </div>

          <div
            className="absolute inset-0 z-0 opacity-18 grayscale mix-blend-overlay"
            style={{
              backgroundImage: "url('https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1600&q=80')",
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }}
          />

          <div className="relative z-10">
            <div className="flex items-center gap-3">
              <div className="flex size-10 items-center justify-center rounded-2xl border border-emerald-zenith-primary/25 bg-emerald-zenith-primary/10 backdrop-blur-sm">
                <Wallet className="h-6 w-6 text-emerald-zenith-primary" />
              </div>
              <h2 className="text-2xl font-black tracking-tight text-emerald-zenith-text">FinTrack</h2>
            </div>
          </div>

          <div className="relative z-10 max-w-lg">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="mb-6 text-5xl font-black leading-tight tracking-tight text-emerald-zenith-text"
            >
              Welcome back to your command center
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.6 }}
              className="text-lg leading-relaxed text-emerald-zenith-text-muted"
            >
              Manage your finances with ease and precision using our advanced tracking tools. Your path to financial freedom starts here.
            </motion.p>
          </div>

          <div className="relative z-10 flex items-center gap-4">
            <div className="flex -space-x-3">
              {[1, 2, 3].map((i) => (
                <img
                  key={i}
                  className="h-10 w-10 rounded-full border-2 border-emerald-zenith-bg"
                  src={`https://picsum.photos/seed/user${i}/100/100`}
                  alt={`User avatar ${i}`}
                  referrerPolicy="no-referrer"
                />
              ))}
            </div>
            <p className="text-sm text-emerald-zenith-text-muted/75">Joined by 10k+ active investors</p>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          className="flex flex-1 items-center justify-center px-6 py-12 lg:px-16"
        >
          <div className="mx-auto w-full max-w-xl rounded-3xl border border-emerald-900/20 bg-emerald-zenith-surface/80 p-6 shadow-2xl shadow-emerald-950/20 backdrop-blur-xl sm:p-8 lg:w-120">
            <div className="mb-8 flex items-center justify-center gap-2 lg:hidden">
              <Wallet className="h-8 w-8 text-emerald-zenith-primary" />
              <h2 className="text-2xl font-black text-emerald-zenith-text">FinTrack</h2>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between gap-3">
                <h2 className="text-3xl font-black tracking-tight text-emerald-zenith-text">Log In</h2>
                <button
                  type="button"
                  onClick={() => navigate('/')}
                  className="inline-flex items-center gap-2 rounded-xl border border-emerald-zenith-text-muted/25 bg-emerald-zenith-surface-high/40 px-3 py-2 text-xs font-black uppercase tracking-widest text-emerald-zenith-text-muted transition-all hover:border-emerald-zenith-primary/40 hover:text-emerald-zenith-primary"
                >
                  <House className="h-3.5 w-3.5" />
                  <span>Home</span>
                </button>
              </div>
              <p className="text-sm text-emerald-zenith-text-muted">
                Enter your credentials to access your account.
              </p>
            </div>

            <div className="mt-8">
              <form className="space-y-5" onSubmit={handleSubmit}>
                {errorMessage && (
                  <div className="rounded-2xl border border-emerald-zenith-error/30 bg-emerald-zenith-error/10 px-4 py-3 text-sm text-emerald-zenith-error" role="alert">
                    {errorMessage}
                  </div>
                )}

                {successMessage && (
                  <div className="rounded-2xl border border-emerald-zenith-primary/30 bg-emerald-zenith-primary/10 px-4 py-3 text-sm text-emerald-zenith-primary" role="status">
                    {successMessage}
                  </div>
                )}

                <div>
                  <label className={labelClassName} htmlFor="email">
                    Email address
                  </label>
                  <div className="mt-2">
                    <input
                      id="email"
                      name="email"
                      type="email"
                      autoComplete="email"
                      required
                      placeholder="name@company.com"
                      value={formData.email}
                      onChange={handleChange}
                      disabled={isSubmitting}
                      className={fieldClassName}
                    />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between">
                    <label className={labelClassName} htmlFor="password">
                      Password
                    </label>
                    <button
                      type="button"
                      className="text-sm font-semibold text-emerald-zenith-primary transition-colors hover:text-emerald-zenith-secondary"
                    >
                      Forgot password?
                    </button>
                  </div>

                  <div className="relative mt-2">
                    <input
                      id="password"
                      name="password"
                      type={showPassword ? 'text' : 'password'}
                      autoComplete="current-password"
                      required
                      placeholder="••••••••"
                      value={formData.password}
                      onChange={handleChange}
                      disabled={isSubmitting}
                      className={fieldClassName}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((current) => !current)}
                      disabled={isSubmitting}
                      className="absolute inset-y-0 right-0 flex items-center pr-3 text-emerald-zenith-text-muted/70 transition-colors hover:text-emerald-zenith-primary"
                    >
                      {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                  </div>
                </div>

                <div>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex w-full justify-center rounded-2xl bg-emerald-zenith-primary px-3 py-3.5 text-sm font-black leading-6 text-emerald-zenith-accent shadow-lg shadow-emerald-950/10 transition-all hover:brightness-110 focus-visible:ring-2 focus-visible:ring-emerald-zenith-primary focus-visible:ring-offset-2 focus-visible:ring-offset-emerald-zenith-surface active:scale-[0.98]"
                  >
                    {isSubmitting ? 'Logging in...' : 'Log In'}
                  </button>
                </div>
              </form>

              <div className="mt-8">
                <div className="relative">
                  <div className="absolute inset-0 flex items-center" aria-hidden="true">
                    <div className="w-full border-t border-emerald-900/20" />
                  </div>
                  <div className="relative flex justify-center text-sm font-medium leading-6">
                    <span className="bg-emerald-zenith-surface px-4 text-emerald-zenith-text-muted">
                      Or continue with
                    </span>
                  </div>
                </div>

                <div className="mt-6 grid grid-cols-2 gap-4">
                  <button type="button" className={socialButtonClassName}>
                    <svg className="h-5 w-5" viewBox="0 0 24 24" aria-hidden="true">
                      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 12-4.53z" fill="#EA4335" />
                    </svg>
                    <span>Google</span>
                  </button>
                  <button type="button" className={socialButtonClassName}>
                    <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                      <path d="M12.152 6.896c-.948 0-2.415-1.078-3.96-1.04-2.04.027-3.91 1.183-4.961 3.014-2.117 3.675-.546 9.103 1.519 12.09 1.013 1.454 2.208 3.09 3.792 3.039 1.52-.065 2.09-.987 3.935-.987 1.831 0 2.35.987 3.96.948 1.637-.026 2.676-1.48 3.676-2.948 1.156-1.688 1.636-3.325 1.662-3.415-.039-.013-3.182-1.221-3.22-4.857-.026-3.04 2.48-4.494 2.597-4.559-1.429-2.09-3.623-2.324-4.39-2.376-2-.156-3.675 1.09-4.61 1.09zM15.53 3.83c.843-1.012 1.4-2.427 1.245-3.83-1.207.052-2.662.805-3.532 1.818-.78.896-1.454 2.338-1.273 3.714 1.338.104 2.715-.688 3.559-1.701z" />
                    </svg>
                    <span>Apple</span>
                  </button>
                </div>
              </div>

              <p className="mt-8 text-center text-sm text-emerald-zenith-text-muted">
                New to FinTrack?{' '}
                <button
                  type="button"
                  onClick={() => {
                    if (typeof onCreateAccount === 'function') {
                      onCreateAccount();
                      return;
                    }

                    navigate('/register');
                  }}
                  className="font-semibold leading-6 text-emerald-zenith-primary transition-colors hover:text-emerald-zenith-secondary"
                >
                  Create an account
                </button>
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}