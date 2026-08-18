export function HeroFallback() {
  return (
    <div className="absolute inset-0 flex items-center justify-center overflow-hidden" aria-hidden="true">
      <svg className="w-full h-full opacity-30" viewBox="0 0 800 600" fill="none" xmlns="http://www.w3.org/2000/svg">
        <line x1="0" y1="300" x2="800" y2="300" stroke="#D8D4CC" strokeWidth="0.5" />
        <line x1="400" y1="0" x2="400" y2="600" stroke="#D8D4CC" strokeWidth="0.5" />
        <path d="M200 200 C 300 100, 500 100, 600 200 C 650 300, 550 400, 400 400 C 250 400, 150 300, 200 200 Z" stroke="#111111" strokeWidth="2" fill="none" />
        <path d="M100 400 C 200 350, 300 300, 400 350 C 500 400, 600 450, 700 400" stroke="#D94F2B" strokeWidth="1.5" fill="none" strokeDasharray="4 4" />
        <path d="M150 500 C 250 450, 350 400, 450 450 C 550 500, 650 550, 750 500" stroke="#D94F2B" strokeWidth="1" fill="none" strokeDasharray="2 4" />
        <circle cx="400" cy="300" r="3" fill="#D94F2B" />
        <circle cx="350" cy="260" r="2" fill="#111111" />
        <circle cx="450" cy="340" r="2" fill="#111111" />
      </svg>
    </div>
  );
}

export default HeroFallback;
