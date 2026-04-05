import { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { Wallet, Eye, EyeOff } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router';
import {
  AUTH_STORAGE_KEY,
  AUTH_TOKEN_STORAGE_KEY,
  login,
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
      const response = await login({
        email: formData.email.trim(),
        password: formData.password,
      });

      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(response));

      if (typeof response.token === 'string' && response.token) {
        localStorage.setItem(AUTH_TOKEN_STORAGE_KEY, response.token);
      }

      const successNotice = response.message ?? 'Login successful.';
      setSuccessMessage(successNotice);

      if (typeof onLoginSuccess === 'function') {
        onLoginSuccess(successNotice);
      } else {
        navigate('/app', { state: { notice: successNotice } });
      }
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : 'Unable to log in.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-screen w-full flex-col lg:flex-row font-sans">
      {/* Left Section: Visual & Branding */}
      <motion.div 
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6 }}
        className="relative hidden lg:flex lg:w-1/2 flex-col justify-between p-12 bg-primary overflow-hidden"
      >
        {/* Background Decoration */}
        <div className="absolute inset-0 opacity-10 pointer-events-none">
          <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] rounded-full bg-emerald-400 blur-[120px]"></div>
          <div className="absolute bottom-[-10%] left-[-10%] w-[400px] h-[400px] rounded-full bg-emerald-500 blur-[100px]"></div>
        </div>
        
        {/* Background Image Overlay */}
        <div 
          className="absolute inset-0 z-0 opacity-20 grayscale mix-blend-overlay"
          style={{ 
            backgroundImage: "url('https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1600&q=80')",
            backgroundSize: 'cover',
            backgroundPosition: 'center'
          }}
        />

        <div className="relative z-10">
          <div className="flex items-center gap-3 text-white">
            <div className="size-10 flex items-center justify-center rounded-lg bg-emerald-500/20 backdrop-blur-sm border border-emerald-500/30">
              <Wallet className="text-emerald-400 w-6 h-6" />
            </div>
            <h2 className="text-2xl font-bold tracking-tight">FinTrack</h2>
          </div>
        </div>

        <div className="relative z-10 max-w-lg">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="text-5xl font-extrabold text-white leading-tight tracking-tight mb-6"
          >
            Welcome back to your command center
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="text-emerald-100/80 text-lg leading-relaxed"
          >
            Manage your finances with ease and precision using our advanced tracking tools. Your path to financial freedom starts here.
          </motion.p>
        </div>

        <div className="relative z-10 flex items-center gap-4">
          <div className="flex -space-x-3">
            {[1, 2, 3].map((i) => (
              <img 
                key={i}
                className="h-10 w-10 rounded-full border-2 border-primary" 
                src={`https://picsum.photos/seed/user${i}/100/100`}
                alt={`User avatar ${i}`}
                referrerPolicy="no-referrer"
              />
            ))}
          </div>
          <p className="text-sm text-emerald-100/60">Joined by 10k+ active investors</p>
        </div>
      </motion.div>

      {/* Right Section: Login Form */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        className="flex flex-1 flex-col justify-center px-6 py-12 lg:px-24 bg-background-light dark:bg-background-dark"
      >
        <div className="mx-auto w-full max-w-sm lg:w-96">
          {/* Mobile Logo */}
          <div className="lg:hidden flex items-center gap-2 mb-8 justify-center">
            <Wallet className="text-primary dark:text-emerald-400 w-8 h-8" />
            <h2 className="text-2xl font-bold dark:text-white">FinTrack</h2>
          </div>

          <div>
            <h2 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">Log In</h2>
            <p className="mt-2 text-sm text-slate-600 dark:text-emerald-100/60">
              Enter your credentials to access your account
            </p>
          </div>

          <div className="mt-10">
            <form className="space-y-6" onSubmit={handleSubmit}>
              {errorMessage && (
                <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700" role="alert">
                  {errorMessage}
                </div>
              )}

              {successMessage && (
                <div className="rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700" role="status">
                  {successMessage}
                </div>
              )}

              <div>
                <label className="block text-sm font-medium leading-6 text-slate-900 dark:text-slate-100" htmlFor="email">
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
                    className="block w-full rounded-lg border-0 py-3 px-4 text-slate-900 dark:text-white shadow-sm ring-1 ring-inset ring-slate-300 dark:ring-primary/40 bg-white dark:bg-primary/10 placeholder:text-slate-400 dark:placeholder:text-emerald-100/30 focus:ring-2 focus:ring-inset focus:ring-emerald-500 sm:text-sm sm:leading-6 outline-none transition-all"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between">
                  <label className="block text-sm font-medium leading-6 text-slate-900 dark:text-slate-100" htmlFor="password">
                    Password
                  </label>
                  <div className="text-sm">
                    <a href="#" className="font-semibold text-emerald-600 dark:text-emerald-400 hover:text-emerald-500">
                      Forgot password?
                    </a>
                  </div>
                </div>
                <div className="mt-2 relative">
                  <input 
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    autoComplete="current-password"
                    required
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={handleChange}
                    disabled={isSubmitting}
                    className="block w-full rounded-lg border-0 py-3 px-4 text-slate-900 dark:text-white shadow-sm ring-1 ring-inset ring-slate-300 dark:ring-primary/40 bg-white dark:bg-primary/10 placeholder:text-slate-400 dark:placeholder:text-emerald-100/30 focus:ring-2 focus:ring-inset focus:ring-emerald-500 sm:text-sm sm:leading-6 outline-none transition-all"
                  />
                  <button 
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    disabled={isSubmitting}
                    className="absolute inset-y-0 right-0 flex items-center pr-3 text-slate-400 dark:text-emerald-100/40 hover:text-emerald-500 transition-colors"
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>

              <div>
                <button 
                  type="submit"
                  disabled={isSubmitting}
                  className="flex w-full justify-center rounded-lg bg-primary px-3 py-3 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-primary/90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary transition-all active:scale-[0.98]"
                >
                  {isSubmitting ? 'Logging in...' : 'Log In'}
                </button>
              </div>
            </form>

            <div className="mt-10">
              <div className="relative">
                <div className="absolute inset-0 flex items-center" aria-hidden="true">
                  <div className="w-full border-t border-slate-200 dark:border-primary/20"></div>
                </div>
                <div className="relative flex justify-center text-sm font-medium leading-6">
                  <span className="bg-background-light dark:bg-background-dark px-4 text-slate-400 dark:text-emerald-100/40">
                    Or continue with
                  </span>
                </div>
              </div>

              <div className="mt-6 grid grid-cols-2 gap-4">
                <button className="flex w-full items-center justify-center gap-3 rounded-lg bg-white dark:bg-primary/10 px-3 py-2 text-sm font-semibold text-slate-900 dark:text-white shadow-sm ring-1 ring-inset ring-slate-300 dark:ring-primary/40 hover:bg-slate-50 dark:hover:bg-primary/20 transition-all">
                  <svg className="h-5 w-5" viewBox="0 0 24 24">
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 12-4.53z" fill="#EA4335" />
                  </svg>
                  <span>Google</span>
                </button>
                <button className="flex w-full items-center justify-center gap-3 rounded-lg bg-white dark:bg-primary/10 px-3 py-2 text-sm font-semibold text-slate-900 dark:text-white shadow-sm ring-1 ring-inset ring-slate-300 dark:ring-primary/40 hover:bg-slate-50 dark:hover:bg-primary/20 transition-all">
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12.152 6.896c-.948 0-2.415-1.078-3.96-1.04-2.04.027-3.91 1.183-4.961 3.014-2.117 3.675-.546 9.103 1.519 12.09 1.013 1.454 2.208 3.09 3.792 3.039 1.52-.065 2.09-.987 3.935-.987 1.831 0 2.35.987 3.96.948 1.637-.026 2.676-1.48 3.676-2.948 1.156-1.688 1.636-3.325 1.662-3.415-.039-.013-3.182-1.221-3.22-4.857-.026-3.04 2.48-4.494 2.597-4.559-1.429-2.09-3.623-2.324-4.39-2.376-2-.156-3.675 1.09-4.61 1.09zM15.53 3.83c.843-1.012 1.4-2.427 1.245-3.83-1.207.052-2.662.805-3.532 1.818-.78.896-1.454 2.338-1.273 3.714 1.338.104 2.715-.688 3.559-1.701z" />
                  </svg>
                  <span>Apple</span>
                </button>
              </div>
            </div>
          </div>

          <p className="mt-10 text-center text-sm text-slate-500 dark:text-emerald-100/40">
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
              className="font-semibold leading-6 text-emerald-600 dark:text-emerald-400 hover:text-emerald-500"
            >
              Create an account
            </button>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
