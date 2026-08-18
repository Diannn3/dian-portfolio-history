export function DigitalArtifactFallback() {
  return (
    <div className="flex h-full w-full items-center justify-center p-8">
      <svg className="h-64 w-64 opacity-40" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M100 20 L180 100 L100 180 L20 100 Z" stroke="#111111" strokeWidth="1" fill="none" />
        <circle cx="100" cy="100" r="40" stroke="#D94F2B" strokeWidth="1" fill="none" />
        <line x1="100" y1="20" x2="100" y2="180" stroke="#D8D4CC" strokeWidth="0.5" />
        <line x1="20" y1="100" x2="180" y2="100" stroke="#D8D4CC" strokeWidth="0.5" />
      </svg>
    </div>
  );
}
