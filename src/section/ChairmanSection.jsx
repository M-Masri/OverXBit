function ChairmanSection() {
  return (
    <section id="chairman" className="pt-16">
      <div className="chairman-shell p-6 sm:p-8 lg:p-10">
        <h2 className="text-center font-display text-4xl text-white sm:text-5xl">
          A Message From The <span className="text-gradient">Chairman</span>
        </h2>

        <div className="mt-10 grid gap-8 lg:grid-cols-[1fr_1.2fr] lg:items-center">
          <div className="chairman-media relative overflow-hidden rounded-2xl p-2">
            <img
              src="https://overxbit.com/static/images/ceo/miro-img-msg.jpg"
              alt="Miro M. Fallahi"
              className="h-[440px] w-full rounded-2xl object-cover"
            />
            <div className="chairman-ring" />
          </div>

          <article>
            <h3 className="text-4xl font-semibold text-white">Miro M. Fallahi</h3>
            <p className="mt-2 text-xl text-orange-300">Founder - Chairman</p>

            <div className="mt-6 space-y-5 text-lg leading-9 text-slate-300">
              <p>
                In a world that&apos;s evolving faster than ever, technology is rewriting the
                rules of finance. At the heart of this transformation lies cryptocurrency,
                a powerful force reshaping how we store, trade, and grow value. What once
                seemed like a distant innovation is now becoming the foundation of the
                future economy.
              </p>
              <p>
                Crypto isn&apos;t just about trading or mining. It&apos;s about freedom,
                transparency, and the empowerment of individuals across the globe. We&apos;re
                building more than a company, we&apos;re building a movement that connects
                people to the future of money.
              </p>
              <p>
                Whether you&apos;re a seasoned investor or just beginning your journey,
                there&apos;s never been a better time to be part of this revolution.
              </p>
              <p>Join our family now, and let&apos;s shape the future together.</p>
            </div>

            <button className="mt-8 rounded-full bg-gradient-to-r from-orange-500 to-orange-400 px-7 py-3 text-sm font-semibold text-white shadow-[0_0_24px_rgba(249,115,22,0.45)] transition hover:brightness-110">
              Become A Member
            </button>
          </article>
        </div>
      </div>
    </section>
  )
}

export default ChairmanSection
