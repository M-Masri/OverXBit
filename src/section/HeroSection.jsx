function HeroSection() {
  return (
    <section id="home" className="hero-shell h-[500px] relative left-1/2 w-screen max-w-none -translate-x-1/2 overflow-hidden px-6 pb-20 pt-12 sm:px-10 sm:pt-16">
      <div className="hero-noise" />
      <div className="hero-orb" />
      <div className="relative z-10 text-center">
        <h1 className="mx-auto mt-3 max-w-4xl font-display text-4xl leading-[1.1] text-white sm:text-6xl">
          Precision Trading Signals
          <br />
          <span className="text-gradient">Built For Consistent Growth.</span>
        </h1>
        <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-white">
          Join Overxbit to access real-time market signals, clear risk management,
          <br className="hidden sm:block" />
          and expert guidance designed for disciplined performance.
        </p>
        <div className="mt-9 flex flex-wrap items-center justify-center gap-3">
          <button className="rounded-full border border-white/15 bg-white/[0.06] px-7 py-3 text-sm font-semibold text-white transition hover:bg-white/10">
            Explore Plans
          </button>
          <button className="rounded-full bg-gradient-to-r from-orange-500 to-orange-400 px-7 py-3 text-sm font-semibold text-white shadow-[0_0_24px_rgba(249,115,22,0.5)] transition hover:brightness-110">
            Join Now
          </button>
        </div>
      </div>

      <div className="hero-arc" />
    </section>
  )
}

export default HeroSection
