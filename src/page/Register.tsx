import { useState } from 'react';
import { motion } from 'motion/react';
import { Wallet, Eye, EyeOff } from 'lucide-react';
import { register } from '../api/auth';

type RegisterPageProps = {
  onRegisterSuccess: (notice?: string) => void;
  onSignIn: () => void;
};

export default function RegisterPage({ onRegisterSuccess, onSignIn }: RegisterPageProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

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

    const normalizedFullName = formData.fullName.trim().replace(/\s+/g, ' ');
    const [firstName, ...lastNameParts] = normalizedFullName.split(' ');

    if (!firstName || lastNameParts.length === 0) {
      setErrorMessage('Please enter both first and last name.');
      return;
    }

    const lastName = lastNameParts.join(' ');

    if (formData.password !== formData.confirmPassword) {
      setErrorMessage('Passwords do not match.');
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await register({
        firstName,
        lastName,
        email: formData.email.trim(),
        password: formData.password,
      });

      onRegisterSuccess(response.message ?? 'Account created successfully.');
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : 'Unable to create your account.');
      setIsSubmitting(false);
      return;
    }

    setIsSubmitting(false);
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
            backgroundPosition: 'center',
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
            Your Financial Command Center
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="text-emerald-100/80 text-lg leading-relaxed"
          >
            Take control of your financial future. Track your investments, analyze your portfolio, and make informed decisions with FinTrack.
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

      {/* Right Section: Register Form */}
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
            <h2 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
              Create Account
            </h2>
            <p className="mt-2 text-sm text-slate-600 dark:text-emerald-100/60">
              Enter your details to create your FinTrack account
            </p>
          </div>

          <div className="mt-10">
            <form className="space-y-6" onSubmit={handleSubmit}>
              {errorMessage && (
                <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700" role="alert">
                  {errorMessage}
                </div>
              )}

              <div>
                <label
                  className="block text-sm font-medium leading-6 text-slate-900 dark:text-slate-100"
                  htmlFor="full-name"
                >
                  Full name
                </label>
                <div className="mt-2">
                  <input
                    id="full-name"
                    name="fullName"
                    type="text"
                    autoComplete="name"
                    required
                    placeholder="John Carter"
                    value={formData.fullName}
                    onChange={handleChange}
                    disabled={isSubmitting}
                    className="block w-full rounded-lg border-0 py-3 px-4 text-slate-900 dark:text-white shadow-sm ring-1 ring-inset ring-slate-300 dark:ring-primary/40 bg-white dark:bg-primary/10 placeholder:text-slate-400 dark:placeholder:text-emerald-100/30 focus:ring-2 focus:ring-inset focus:ring-emerald-500 sm:text-sm sm:leading-6 outline-none transition-all"
                  />
                </div>
              </div>

              <div>
                <label
                  className="block text-sm font-medium leading-6 text-slate-900 dark:text-slate-100"
                  htmlFor="email"
                >
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
                <label
                  className="block text-sm font-medium leading-6 text-slate-900 dark:text-slate-100"
                  htmlFor="password"
                >
                  Password
                </label>
                <div className="mt-2 relative">
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    autoComplete="new-password"
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
                <label
                  className="block text-sm font-medium leading-6 text-slate-900 dark:text-slate-100"
                  htmlFor="confirm-password"
                >
                  Confirm password
                </label>
                <div className="mt-2 relative">
                  <input
                    id="confirm-password"
                    name="confirmPassword"
                    type={showConfirmPassword ? 'text' : 'password'}
                    autoComplete="new-password"
                    required
                    placeholder="••••••••"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    disabled={isSubmitting}
                    className="block w-full rounded-lg border-0 py-3 px-4 text-slate-900 dark:text-white shadow-sm ring-1 ring-inset ring-slate-300 dark:ring-primary/40 bg-white dark:bg-primary/10 placeholder:text-slate-400 dark:placeholder:text-emerald-100/30 focus:ring-2 focus:ring-inset focus:ring-emerald-500 sm:text-sm sm:leading-6 outline-none transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    disabled={isSubmitting}
                    className="absolute inset-y-0 right-0 flex items-center pr-3 text-slate-400 dark:text-emerald-100/40 hover:text-emerald-500 transition-colors"
                  >
                    {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>

              <div>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex w-full justify-center rounded-lg bg-primary px-3 py-3 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-primary/90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary transition-all active:scale-[0.98]"
                >
                  {isSubmitting ? 'Creating account...' : 'Create Account'}
                </button>
              </div>
            </form>

            <p className="mt-10 text-center text-sm text-slate-500 dark:text-emerald-100/40">
              Already have an account?{' '}
              <button
                type="button"
                onClick={() => onSignIn()}
                className="font-semibold leading-6 text-emerald-600 dark:text-emerald-400 hover:text-emerald-500"
              >
                Sign in
              </button>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
