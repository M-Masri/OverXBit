const posts = [
  {
    title: 'Digital Age',
    text: 'How trading teams stay disciplined while markets shift every hour.',
  },
  {
    title: 'Misconceptions',
    text: '5 false beliefs that usually break consistency in subscription trading.',
  },
  {
    title: 'Market Systems',
    text: 'A practical framework for combining signals, risk rules, and execution.',
  },
]

function InsightsSection() {
  return (
    <section className="pt-16">
      <div className="text-center">
        <h2 className="font-display text-4xl text-white">Insights & Inspiration</h2>
        <p className="mx-auto mt-3 max-w-3xl text-slate-400">
          Dive into a rich stream of trading articles, practical playbooks, and strategy updates from the Overxbit team.
        </p>
      </div>
      <div className="mt-10 grid gap-5 md:grid-cols-3">
        {posts.map((post) => (
          <article key={post.title} className="group rounded-2xl border border-white/10 bg-slate-900/65 p-4">
            <div className="blog-thumb" />
            <h3 className="mt-4 text-xl font-semibold text-white">{post.title}</h3>
            <p className="mt-2 text-sm text-slate-300">{post.text}</p>
            <a href="#" className="mt-4 inline-block text-sm font-semibold text-orange-300">Read article</a>
          </article>
        ))}
      </div>
    </section>
  )
}

export default InsightsSection
