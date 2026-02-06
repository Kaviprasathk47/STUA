import { useState } from 'react';
import { Mail, Lock, Eye, EyeOff, Leaf, Bus, Bike, Car } from 'lucide-react';
import handleGoogleLogin from '../../fireBase/fireBaseSetUp.jsx';


const LoginPage = () =>{
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false
  });


  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Login submitted:', formData);
  };

  const FloatingIcons = () => (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <Bike className="absolute top-20 left-10 text-green-200 opacity-20 w-16 h-16 animate-float" style={{ animationDelay: '0s' }} />
      <Bus className="absolute top-40 right-20 text-blue-200 opacity-20 w-20 h-20 animate-float" style={{ animationDelay: '2s' }} />
      <Car className="absolute bottom-32 left-16 text-green-200 opacity-20 w-14 h-14 animate-float" style={{ animationDelay: '4s' }} />
      <Leaf className="absolute top-60 right-40 text-green-300 opacity-20 w-12 h-12 animate-float" style={{ animationDelay: '1s' }} />
      <Leaf className="absolute bottom-20 right-12 text-emerald-300 opacity-20 w-16 h-16 animate-float" style={{ animationDelay: '3s' }} />
    </div>
  );

  return (
    <div className="min-h-screen bg-linear-to-br from-emerald-50 via-blue-50 to-teal-50 flex items-center justify-center p-4 relative overflow-hidden">
      <FloatingIcons />
      
      <style>{`
        @keyframes float {
          0%, 100% {
            transform: translateY(0px) rotate(0deg);
          }
          50% {
            transform: translateY(-20px) rotate(5deg);
          }
        }
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
      `}</style>

      <div className="w-full max-w-6xl flex flex-col lg:flex-row gap-8 items-center relative z-10">
        {/* Left Side - Illustration */}
        <div className="hidden lg:flex flex-1 flex-col justify-center items-center text-center space-y-6 p-8">
          <div className="relative">
            <div className="absolute inset-0 bg-linear-to-r from-green-400 to-blue-500 rounded-full blur-3xl opacity-20"></div>
            <div className="relative bg-white/40 backdrop-blur-sm rounded-3xl p-12 border border-white/60 shadow-xl">
              <div className="flex items-center justify-center gap-4 mb-6">
                <Bike className="w-16 h-16 text-green-600" />
                <Bus className="w-20 h-20 text-blue-600" />
                <Car className="w-14 h-14 text-emerald-600" />
              </div>
              <Leaf className="w-24 h-24 mx-auto text-green-500 mb-4" />
            </div>
          </div>
          
          <h1 className="text-4xl font-bold bg-linear-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
            Sustainable Transport
          </h1>
          <p className="text-lg text-gray-600 max-w-md">
            Join thousands making eco-friendly travel choices every day. Track your carbon footprint and make a difference.
          </p>
          
          <div className="flex gap-8 mt-8">
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600">50K+</div>
              <div className="text-sm text-gray-600">Active Users</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600">2M+</div>
              <div className="text-sm text-gray-600">Trips Tracked</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-emerald-600">30%</div>
              <div className="text-sm text-gray-600">CO₂ Reduced</div>
            </div>
          </div>
        </div>

        {/* Right Side - Login Form */}
        <div className="flex-1 w-full max-w-md">
          <div className="bg-white/80 backdrop-blur-lg rounded-3xl shadow-2xl p-8 border border-white/60">
            {/* Header */}
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-linear-to-br from-green-500 to-blue-500 rounded-2xl mb-4 shadow-lg">
                <Leaf className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-3xl font-bold text-gray-800 mb-2">
                Welcome Back
              </h2>
              <p className="text-gray-600">
                Track, analyze and improve your eco-friendly travel habits
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Email */}
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="email"
                  name="email"
                  placeholder="Email Address"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full pl-11 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all bg-white/50 backdrop-blur-sm"
                  required
                />
              </div>

              {/* Password */}
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  placeholder="Password"
                  value={formData.password}
                  onChange={handleInputChange}
                  autoComplete="current-password"
                  className="w-full pl-11 pr-11 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all bg-white/50 backdrop-blur-sm"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>

              {/* Remember Me & Forgot Password */}
              <div className="flex items-center justify-between text-sm">
                <label className="flex items-center cursor-pointer group">
                  <input
                    type="checkbox"
                    name="rememberMe"
                    checked={formData.rememberMe}
                    onChange={handleInputChange}
                    className="w-4 h-4 rounded border-gray-300 text-green-600 focus:ring-green-500 cursor-pointer"
                  />
                  <span className="ml-2 text-gray-600 group-hover:text-gray-800 transition-colors">Remember me</span>
                </label>
                <a href="#" className="text-green-600 hover:text-green-700 font-medium transition-colors">
                  Forgot Password?
                </a>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="w-full bg-linear-to-r from-green-500 to-blue-500 text-white py-3 rounded-xl font-semibold hover:from-green-600 hover:to-blue-600 transform hover:scale-[1.02] transition-all duration-200 shadow-lg hover:shadow-xl"
              >
                Login
              </button>

              {/* Divider */}
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-200"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-4 bg-white/80 text-gray-500">or continue with</span>
                </div>
              </div>

              {/* Google Button */}
              <button
                type="button"
                className="w-full flex items-center justify-center gap-3 bg-white border-2 border-gray-200 text-gray-700 py-3 rounded-xl font-semibold hover:bg-gray-50 hover:border-gray-300 transform hover:scale-[1.02] transition-all duration-200 shadow-sm hover:shadow-md"
                onClick={handleGoogleLogin}
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                Continue with Google 
              </button>
            </form>

            {/* Sign Up Link */}
            <div className="mt-6 text-center text-sm">
              <span className="text-gray-600">
                Don't have an account?{' '}
              </span>
              <a
                href="/"
                className="text-green-600 hover:text-green-700 font-semibold transition-colors"
              >
                Sign Up
              </a>
            </div>
          </div>

          {/* Mobile Stats */}
          <div className="lg:hidden flex justify-around mt-6 bg-white/60 backdrop-blur-sm rounded-2xl p-4 border border-white/60">
            <div className="text-center">
              <div className="text-xl font-bold text-green-600">50K+</div>
              <div className="text-xs text-gray-600">Users</div>
            </div>
            <div className="text-center">
              <div className="text-xl font-bold text-blue-600">2M+</div>
              <div className="text-xs text-gray-600">Trips</div>
            </div>
            <div className="text-center">
              <div className="text-xl font-bold text-emerald-600">30%</div>
              <div className="text-xs text-gray-600">CO₂ Cut</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
export default LoginPage;