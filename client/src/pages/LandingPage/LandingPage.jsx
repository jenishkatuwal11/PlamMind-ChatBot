import { FiMessageCircle, FiLock, FiZap } from "react-icons/fi";
import { Link } from "react-router-dom";

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-linear-to-br from-blue-50 via-white to-gray-50 flex items-center justify-center px-4 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-4 -left-4 w-72 h-72 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
        <div className="absolute -bottom-8 -right-4 w-72 h-72 bg-gray-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse animation-delay-2000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-blue-100 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-pulse animation-delay-4000"></div>
      </div>

      {/* Floating particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className="absolute w-2 h-2 bg-blue-300 rounded-full opacity-30 animate-bounce"
            style={{
              left: `${20 + i * 15}%`,
              top: `${30 + (i % 3) * 20}%`,
              animationDelay: `${i * 0.5}s`,
              animationDuration: `${3 + i * 0.5}s`,
            }}
          ></div>
        ))}
      </div>

      <div className="relative z-10 text-center max-w-4xl mx-auto">
        {/* Logo with animation */}
        <div className="mb-8 transform hover:scale-105 transition-transform duration-300">
          <div className="inline-flex items-center justify-center p-6 bg-white rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300 animate-fade-in">
            <svg
              width="300"
              height="120"
              viewBox="0 0 400 160"
              className="drop-shadow-sm"
            >
              <defs>
                <linearGradient
                  id="blueGradient"
                  x1="0%"
                  y1="0%"
                  x2="100%"
                  y2="0%"
                >
                  <stop offset="0%" stopColor="#1e40af" />
                  <stop offset="100%" stopColor="#3b82f6" />
                </linearGradient>
              </defs>

              <circle
                cx="50"
                cy="80"
                r="35"
                fill="none"
                stroke="url(#blueGradient)"
                strokeWidth="4"
                className="animate-spin-slow"
              />
              <circle
                cx="50"
                cy="80"
                r="25"
                fill="none"
                stroke="#6b7280"
                strokeWidth="3"
              />
              <rect
                x="35"
                y="70"
                width="8"
                height="20"
                fill="url(#blueGradient)"
                className="animate-pulse"
              />
              <rect
                x="45"
                y="65"
                width="8"
                height="30"
                fill="url(#blueGradient)"
                className="animate-pulse"
              />
              <rect
                x="55"
                y="60"
                width="8"
                height="40"
                fill="url(#blueGradient)"
                className="animate-pulse"
              />
              <text
                x="110"
                y="70"
                fontFamily="Arial, sans-serif"
                fontSize="32"
                fontWeight="bold"
                fill="url(#blueGradient)"
              >
                PALM
              </text>
              <text
                x="210"
                y="70"
                fontFamily="Arial, sans-serif"
                fontSize="32"
                fontWeight="bold"
                fill="#6b7280"
              >
                MIND
              </text>
              <text
                x="260"
                y="95"
                fontFamily="Arial, sans-serif"
                fontSize="14"
                fill="#9ca3af"
                letterSpacing="2px"
              >
                TECHNOLOGY
              </text>
            </svg>
          </div>
        </div>

        <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-linear-to-r from-blue-600 via-blue-700 to-gray-600 bg-clip-text text-transparent animate-fade-in-up">
          Connect. Communicate. Create.
        </h1>

        <div className="mb-8 animate-fade-in-up animation-delay-500">
          <blockquote className="text-xl md:text-2xl text-gray-600 italic leading-relaxed max-w-3xl mx-auto">
            "The future of communication lies not in the complexity of
            technology, but in the simplicity of human connection."
          </blockquote>
          <p className="text-gray-500 mt-4 text-lg">- Palm Mind Technology</p>
        </div>

        <p className="text-lg md:text-xl text-gray-600 mb-10 max-w-2xl mx-auto animate-fade-in-up animation-delay-700">
          Experience the next generation of chat technology. Seamless,
          intelligent, and designed for the modern world.
        </p>

        <div className="animate-fade-in-up animation-delay-1000">
          <button className="group relative px-8 py-4 bg-linear-to-r from-blue-600 to-blue-700 text-white text-lg font-semibold rounded-full shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 overflow-hidden">
            <span className="relative z-10 flex items-center">
              <Link to="/login">Let's Get Started</Link>
              <svg
                className="ml-2 w-5 h-5 transform group-hover:translate-x-1 transition-transform duration-300"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 7l5 5m0 0l-5 5m5-5H6"
                />
              </svg>
            </span>
            <div className="absolute inset-0 bg-linear-to-r from-blue-700 to-blue-800 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></div>
          </button>
        </div>

        {/* Feature highlights with React Icons */}
        <div className="mt-16 grid md:grid-cols-3 gap-8 animate-fade-in-up animation-delay-1200">
          {[
            {
              icon: <FiMessageCircle className="text-blue-600" />,
              title: "Smart Messaging",
              desc: "AI-powered conversations",
            },
            {
              icon: <FiLock className="text-blue-600" />,
              title: "Secure",
              desc: "End-to-end encryption",
            },
            {
              icon: <FiZap className="text-blue-600" />,
              title: "Lightning Fast",
              desc: "Real-time communication",
            },
          ].map((feature, index) => (
            <div
              key={index}
              className="p-6 bg-white/80 backdrop-blur-sm rounded-xl shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1"
            >
              <div className="text-3xl mb-3">{feature.icon}</div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">
                {feature.title}
              </h3>
              <p className="text-gray-600">{feature.desc}</p>
            </div>
          ))}
        </div>
      </div>

      <style jsx>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes spin-slow {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }

        .animate-fade-in {
          animation: fade-in 1s ease-out;
        }

        .animate-fade-in-up {
          animation: fade-in-up 1s ease-out;
        }

        .animate-spin-slow {
          animation: spin-slow 8s linear infinite;
        }

        .animation-delay-500 {
          animation-delay: 0.5s;
          animation-fill-mode: both;
        }

        .animation-delay-700 {
          animation-delay: 0.7s;
          animation-fill-mode: both;
        }

        .animation-delay-1000 {
          animation-delay: 1s;
          animation-fill-mode: both;
        }

        .animation-delay-1200 {
          animation-delay: 1.2s;
          animation-fill-mode: both;
        }

        .animation-delay-2000 {
          animation-delay: 2s;
        }

        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
    </div>
  );
};

export default LandingPage;
