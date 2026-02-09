// Logo.jsx - Eco-themed logo component
const Logo = ({ className = "", size = "default" }) => {
  const sizes = {
    small: "w-8 h-8",
    default: "w-10 h-10",
    large: "w-12 h-12"
  };

  return (
    <div className={`${sizes[size]} ${className} relative`}>
      <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
        {/* Gradient definitions */}
        <defs>
          <linearGradient id="leafGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#10b981" />
            <stop offset="100%" stopColor="#14b8a6" />
          </linearGradient>
          <linearGradient id="wheelGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#0ea5e9" />
            <stop offset="100%" stopColor="#06b6d4" />
          </linearGradient>
        </defs>
        
        {/* Leaf shape */}
        <path 
          d="M30 50 Q30 20, 50 15 Q70 20, 70 50 Q50 70, 30 50 Z" 
          fill="url(#leafGradient)" 
          opacity="0.9"
        />
        
        {/* Leaf vein */}
        <path 
          d="M50 15 L50 60" 
          stroke="#059669" 
          strokeWidth="2" 
          strokeLinecap="round"
          opacity="0.5"
        />
        
        {/* Bicycle wheel (integrated) */}
        <circle cx="65" cy="70" r="12" stroke="url(#wheelGradient)" strokeWidth="3" fill="none" />
        <circle cx="65" cy="70" r="2" fill="url(#wheelGradient)" />
        
        {/* Spokes */}
        <line x1="65" y1="70" x2="65" y2="58" stroke="url(#wheelGradient)" strokeWidth="1.5" opacity="0.6" />
        <line x1="65" y1="70" x2="77" y2="70" stroke="url(#wheelGradient)" strokeWidth="1.5" opacity="0.6" />
        <line x1="65" y1="70" x2="53" y2="70" stroke="url(#wheelGradient)" strokeWidth="1.5" opacity="0.6" />
        
        {/* Motion lines */}
        <path d="M15 75 L25 75" stroke="#10b981" strokeWidth="2" strokeLinecap="round" opacity="0.4" />
        <path d="M10 82 L22 82" stroke="#14b8a6" strokeWidth="2" strokeLinecap="round" opacity="0.3" />
      </svg>
    </div>
  );
};

export default Logo;
