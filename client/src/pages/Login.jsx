import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { toast } from 'react-hot-toast';
import { LogIn, Users, Eye, EyeOff, Loader2 } from 'lucide-react';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const { login } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            await login(email, password);
            toast.success('Login successful!');
            navigate('/');
        } catch (error) {
            toast.error(error || 'Failed to login');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50 relative overflow-hidden py-12 px-4 sm:px-6 lg:px-8">
            {/* Background Decorative Elements */}
            <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-indigo-600/10 blur-[100px] pointer-events-none"></div>
            <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-rose-500/10 blur-[100px] pointer-events-none"></div>

            <div className="w-full max-w-md z-10 slide-up">
                {/* Logo / Header */}
                <div className="mb-8 flex flex-col items-center">
                    <div className="w-14 h-14 bg-indigo-600 rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-600/30 mb-6 transform transition-transform hover:scale-105 duration-300">
                        <Users className="w-7 h-7 text-white" />
                    </div>
                    <h2 className="text-center text-3xl font-bold tracking-tight text-slate-900 mb-2">
                        Welcome back
                    </h2>
                    <p className="text-center text-[15px] text-slate-500">
                        Enter your credentials to access the dashboard
                    </p>
                </div>

                {/* Form Card */}
                <div className="bg-white/80 backdrop-blur-xl p-8 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-white">
                    <form className="space-y-5" onSubmit={handleSubmit}>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1.5" htmlFor="email">
                                    Email address
                                </label>
                                <input
                                    id="email"
                                    name="email"
                                    type="email"
                                    required
                                    className="block w-full px-4 py-3 rounded-xl border border-slate-200 bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all sm:text-sm placeholder:text-slate-400"
                                    placeholder="Enter your email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1.5" htmlFor="password">
                                    Password
                                </label>
                                <div className="relative">
                                    <input
                                        id="password"
                                        name="password"
                                        type={showPassword ? 'text' : 'password'}
                                        required
                                        className="block w-full pl-4 pr-11 py-3 rounded-xl border border-slate-200 bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all sm:text-sm placeholder:text-slate-400"
                                        placeholder="••••••••"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600 transition-colors"
                                    >
                                        {showPassword ? (
                                            <EyeOff className="h-4 w-4" />
                                        ) : (
                                            <Eye className="h-4 w-4" />
                                        )}
                                    </button>
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center justify-between mt-6 mb-2">
                            <div className="flex items-center">
                                <input
                                    id="remember-me"
                                    name="remember-me"
                                    type="checkbox"
                                    className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-slate-300 rounded transition-all"
                                />
                                <label htmlFor="remember-me" className="ml-2 block text-sm text-slate-600">
                                    Remember me
                                </label>
                            </div>

                            <div className="text-sm">
                                <a href="#" className="font-medium text-indigo-600 hover:text-indigo-500 transition-colors">
                                    Forgot password?
                                </a>
                            </div>
                        </div>

                        <div>
                            <button
                                type="submit"
                                disabled={isLoading}
                                className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-xl shadow-sm text-[15px] font-semibold text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-70 disabled:cursor-not-allowed transition-all hover:shadow-indigo-500/25"
                            >
                                {isLoading ? (
                                    <>
                                        <Loader2 className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" />
                                        Signing in...
                                    </>
                                ) : (
                                    <>
                                        Sign In
                                        <LogIn className="ml-2 -mr-1 h-4 w-4" />
                                    </>
                                )}
                            </button>
                        </div>
                    </form>
                </div>

                {/* Footer text */}
                <p className="mt-8 text-center text-[13px] text-slate-500">
                    Protected by reCAPTCHA and subject to the Privacy Policy and Terms of Service.
                </p>
            </div>
        </div>
    );
};

export default Login;
