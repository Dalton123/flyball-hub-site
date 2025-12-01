export function HeroBackground() {
  return (
    <>
      {/* Gradient base layer */}
      <div className="absolute inset-0 bg-gradient-to-br from-background via-background to-accent/10" />

      {/* Radial spotlight effect */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,oklch(0.92_0.08_125)_0%,transparent_65%)]" />

      {/* Subtle animated gradient mesh */}
      <div
        className="absolute inset-0 opacity-40"
        style={{
          background: 'linear-gradient(45deg, transparent 35%, oklch(0.92 0.08 125) 50%, transparent 65%)',
          backgroundSize: '200% 200%',
          animation: 'gradient-shift 8s ease infinite',
        }}
      />
    </>
  );
}
