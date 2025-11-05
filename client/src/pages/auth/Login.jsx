import { useState } from "react";
import axios from "../../utils/axios"; // Import axios instance
import { Eye, EyeOff, Mail, Lock } from "lucide-react";
import { FcGoogle } from "react-icons/fc";
import { MdFacebook } from "react-icons/md";
import { Link } from "react-router-dom";
import { toast } from "react-toastify"; // Import toast for notifications

const LoginForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await axios.post(
        "/login",
        { email, password },
        { withCredentials: true }
      );

      // Show success toast
      toast.success("Login successful!", {
        position: "top-right",
        autoClose: 3000,
      });

      // Redirect to homepage or protected route after successful login
      window.location.href = "/home";
    } catch (err) {
      // Show error toast
      toast.error(err.response?.data?.message || "Something went wrong!", {
        position: "top-right",
        autoClose: 3000,
      });
      setError(err.response?.data?.message || "Something went wrong!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">
              Welcome Back
            </h2>
            <p className="text-gray-600">Sign in with Palm Mind</p>
          </div>

          {error && (
            <div className="bg-red-100 text-red-700 px-4 py-2 rounded-md text-sm mb-4">
              {error}
            </div>
          )}

          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="email"
                  type="email"
                  required
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-gray-50 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:bg-white transition-all duration-200"
                  placeholder="Enter your email"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  required
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-12 py-3 bg-gray-50 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:bg-white transition-all duration-200"
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                  ) : (
                    <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                  )}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember"
                  type="checkbox"
                  className="h-4 w-4 text-orange-600 focus:ring-orange-500 rounded"
                />
                <label
                  htmlFor="remember"
                  className="ml-2 block text-sm text-gray-700"
                >
                  Remember me
                </label>
              </div>
              <a
                href="#"
                className="text-sm text-orange-600 hover:text-orange-700 font-medium"
              >
                Forgot password?
              </a>
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`w-full bg-linear-to-r from-orange-500 to-red-500 text-white py-3 px-4 rounded-lg font-medium focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 transition-all duration-200 shadow-lg ${
                loading
                  ? "opacity-50 cursor-not-allowed"
                  : "hover:from-orange-600 hover:to-red-600 transform hover:scale-[1.02]"
              }`}
            >
              {loading ? "Signing In..." : "Sign In"}
            </button>
          </form>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">
                  Or continue with
                </span>
              </div>
            </div>
          </div>

          <div className="mt-6 grid grid-cols-2 gap-3">
            <button
              type="button"
              aria-label="Sign in with Google"
              className="w-full inline-flex items-center justify-center py-2 px-4 rounded-lg shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 transition-colors duration-200"
            >
              <FcGoogle className="w-5 h-5" />
              <span className="ml-2">Google</span>
            </button>

            <button
              type="button"
              aria-label="Sign in with Facebook"
              className="w-full inline-flex items-center justify-center py-2 px-4 rounded-lg shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 transition-colors duration-200"
            >
              <MdFacebook className="w-5 h-5" />
              <span className="ml-2">Facebook</span>
            </button>
          </div>

          <p className="mt-6 text-center text-sm text-gray-600">
            Don't have an account?{" "}
            <Link
              to="/register"
              className="font-medium text-orange-600 hover:text-orange-700"
            >
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;
