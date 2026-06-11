import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion, useInView, useReducedMotion } from 'framer-motion'
import { FiArrowRight, FiBriefcase, FiPlayCircle, FiShield, FiTrendingUp } from 'react-icons/fi'
import ThreeDCarousel from '../components/ui/ThreeDCarousel'
import Header from '../section/Header'
import PageHero from '../section/PageHero'
import SiteFooter from '../section/SiteFooter'
import { createStaggerContainer, getInViewMotion, hoverSpring, revealVariants } from '../lib/motion'
import { API_BASE_URL, useGetPublicServicesQuery } from '../services/overxApi'

const teamMembers = [
    {
        name: 'Michael Reynolds',
        role: 'Chief Strategy Officer',
        image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=700&q=80',
    },
    {
        name: 'Sophie Bennett',
        role: 'Head of Client Success',
        image: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=700&q=80',
    },
    {
        name: 'Daniel Foster',
        role: 'Lead Market Analyst',
        image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=700&q=80',
    },
    {
        name: 'Nora Hayes',
        role: 'Portfolio Operations Manager',
        image: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?auto=format&fit=crop&w=700&q=80',
    },
]

const aboutHighlights = [
    {
        icon: FiShield,
        title: 'Capital Protection First',
        text: 'Every strategy is designed with disciplined risk controls before we target upside.',
    },
    {
        icon: FiTrendingUp,
        title: 'Performance Driven Execution',
        text: 'We combine data, timing, and market structure to keep results consistent time.',
    },
    {
        icon: FiBriefcase,
        title: 'Client-Centered Advisory',
        text: 'You get clear communication, tailored planning, from day one.',
    },
]

function resolveCardImageUrl(cardImage) {
    if (!cardImage) {
        return '/assets/hero-static.webp'
    }

    if (/^https?:\/\//i.test(cardImage)) {
        return cardImage
    }

    const apiOrigin = new URL(API_BASE_URL).origin
    const imagePath = String(cardImage).startsWith('/') ? cardImage : `/${cardImage}`
    return `${apiOrigin}${imagePath}`
}

function AboutPage() {
    const reduceMotion = useReducedMotion()
    const inViewMotion = getInViewMotion(reduceMotion)
    const heroStatsContainer = createStaggerContainer(0.1, 0.08)
    const servicesContainer = createStaggerContainer(0.1, 0.04)
    const teamContainer = createStaggerContainer(0.09, 0.04)
    const { data: servicesResponse, isLoading: servicesLoading, isFetching: servicesFetching } = useGetPublicServicesQuery()
    const services = Array.isArray(servicesResponse?.services) ? servicesResponse.services : []
    const yearsStatRef = useRef(null)
    const yearsInView = useInView(yearsStatRef, { once: true, amount: 0.55 })
    const [animatedYears, setAnimatedYears] = useState(0)
    const teamSlides = teamMembers.map((member, index) => ({
        id: index + 1,
        src: member.image,
        href: '#',
        alt: `${member.name} - ${member.role}`,
        title: member.name,
        subtitle: member.role,
    }))

    useEffect(() => {
        if (reduceMotion) {
            setAnimatedYears(10)
            return
        }

        if (!yearsInView) {
            return
        }

        let animationFrameId
        const durationMs = 900
        const target = 10
        const startTime = performance.now()

        const tick = (now) => {
            const progress = Math.min((now - startTime) / durationMs, 1)
            setAnimatedYears(Math.round(target * progress))

            if (progress < 1) {
                animationFrameId = requestAnimationFrame(tick)
            }
        }

        animationFrameId = requestAnimationFrame(tick)

        return () => {
            cancelAnimationFrame(animationFrameId)
        }
    }, [reduceMotion, yearsInView])

    return (
        <div className="min-h-screen overflow-x-clip overflow-y-hidden bg-grid text-slate-100">
            <Header />

            <PageHero
                eyebrow="OVERXBIT CORPORATE PROFILE"
                title="About Us"
                titleHighlight=""
                description="We help individuals and businesses move from uncertainty to structured growth through practical strategy, market intelligence, and disciplined execution."
            >
                <Link
                    to="/contact"
                    className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-[#70A9DC] to-[#3D6FA8] px-7 py-3 text-sm font-semibold text-white shadow-[0_0_24px_rgba(61,111,168,0.5)] transition hover:brightness-110"
                >
                    Talk To Our Team
                    <FiArrowRight />
                </Link>
            </PageHero>

            <main className="mx-auto w-full max-w-7xl overflow-x-clip px-5 pt-12 sm:px-8 sm:pt-14">

                <section className="mt-10 ">
                    <div className="grid gap-7 lg:grid-cols-[1fr_1.1fr] lg:items-stretch">
                        <article className="relative h-full overflow-hidden rounded-2xl p-5 sm:p-6">
                            <div className="grid h-full grid-cols-1 gap-3 sm:grid-cols-[1fr_1fr] sm:gap-4">
                                <div className="h-full relative overflow-hidden rounded-[1.1rem] border border-white/10 min-h-[290px] sm:min-h-[350px]">
                                    <img
                                        src="/assets/about-image-1.webp"
                                        alt="OVERXBIT team strategy session"
                                        className="h-full w-full object-cover object-center"
                                        loading="lazy"
                                    />
                                    <span className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/60 to-transparent" aria-hidden="true" />
                                </div>

                                <div className="flex flex-col gap-3 sm:gap-4">

                                    <div className="h-full relative overflow-hidden rounded-[1.1rem] border border-white/10 min-h-[185px] sm:min-h-[246px]">
                                        <img
                                            src="/assets/about-image-2.webp"
                                            alt="OVERXBIT analysis team at work"
                                            className="h-full w-full object-cover object-center"
                                            loading="lazy"
                                        />
                                    </div>
                                    <div ref={yearsStatRef} className="rounded-[1.1rem] bg-[linear-gradient(135deg,#70A9DC_0%,#3D6FA8_46%,#213F7F_100%)] px-4 py-5 text-center shadow-[0_10px_24px_rgba(61,111,168,0.35)]">
                                        <p className="text-4xl font-semibold leading-none text-white">{animatedYears}+</p>
                                        <p className="mt-1 text-xs uppercase tracking-[0.12em] text-white/90">Years Of Experience</p>
                                    </div>


                                </div>
                            </div>
                        </article>

                        <article>
                            <p className="text-sm uppercase tracking-[0.22em] text-[#8EC3EF]">About Us</p>
                            <h2 className="mt-3 font-display text-3xl text-white sm:text-4xl">We are your partner in <br /><span className='text-gradient'>sustainable financial momentum</span></h2>
                            <p className="mt-4 leading-8 text-slate-300">
                                OVERXBIT was built to simplify high-value decisions in complex markets. We focus on strategy clarity,
                                practical execution, and transparent communication so each client can grow with confidence, not guesswork.
                            </p>

                            <div className="mt-6 grid gap-3">
                                {aboutHighlights.map((item) => (
                                    <div
                                        key={item.title}
                                        className="flex items-start gap-2.5 rounded-2xl border border-white/15 bg-[linear-gradient(155deg,rgba(255,255,255,0.12),rgba(255,255,255,0.025)),linear-gradient(145deg,rgba(11,20,38,0.4),rgba(19,39,72,0.28))] px-4 py-3 backdrop-blur-[9px] [backdrop-filter:saturate(130%)]"
                                    >
                                        <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-[#70A9DC]/45 bg-[#70A9DC]/15 text-[#9CCBF0]">
                                            <item.icon />
                                        </span>
                                        <div className="min-w-0">
                                            <h3 className="text-lg font-semibold text-white">{item.title}</h3>
                                            <p className="mt-0.5 text-sm leading-6 text-slate-300">{item.text}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </article>
                    </div>
                </section>

                <motion.section id="about-services" className="mt-20" variants={revealVariants} {...inViewMotion}>
                    <article className="text-center">
                        <p className="text-sm uppercase tracking-[0.2em] text-[#8EC3EF]">Explore Our Services</p>
                        <h2 className="mt-3 font-display text-3xl text-white sm:text-4xl">Solutions Built For Real <span className='text-gradient'>Measurable Outcomes</span></h2>
                        <p className="mx-auto mt-4 max-w-3xl leading-8 text-slate-300">
                            Select the path that fits your goals, then let our specialists design the right operational and investment framework.
                        </p>
                    </article>

                    <motion.div
                        className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-3"
                        variants={servicesContainer}
                        initial={reduceMotion ? false : 'hidden'}
                        whileInView="visible"
                        viewport={reduceMotion ? undefined : { once: true, amount: 0.16 }}
                    >
                        {(servicesLoading || servicesFetching) && !services.length ? (
                            <div className="md:col-span-2 xl:col-span-3 rounded-xl border border-white/10 bg-white/[0.03] p-5 text-center text-sm text-slate-300">
                                Loading services...
                            </div>
                        ) : null}

                        {!servicesLoading && !servicesFetching && !services.length ? (
                            <div className="md:col-span-2 xl:col-span-3 rounded-xl border border-white/10 bg-white/[0.03] p-5 text-center text-sm text-slate-300">
                                No services available right now.
                            </div>
                        ) : null}

                        {services.slice(0, 6).map((service, index) => (
                            <motion.article
                                key={`${service.id || service.number || index}`}
                                variants={revealVariants}
                                whileHover={reduceMotion ? undefined : { y: -8, scale: 1.02 }}
                                transition={hoverSpring}
                                className="service-card group relative overflow-hidden bg-gradient-to-br from-[#3B82F6]/35 via-[#0f172a]/90 to-[#020617] p-5 min-h-[220px]"
                            >
                                <motion.img
                                    src={resolveCardImageUrl(service.card_image)}
                                    alt={service.title}
                                    loading="lazy"
                                    className="absolute inset-0 h-full w-full object-cover"
                                    whileHover={reduceMotion ? undefined : { scale: 1.06 }}
                                    transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/95 via-slate-900/70 to-slate-900/25" />
                                <div className="absolute inset-0 bg-[radial-gradient(circle_at_85%_20%,rgba(255,255,255,0.14),transparent_45%)] opacity-60" />
                                <Link to={`/services/${service.id || service.number || index + 1}`} className="absolute inset-0 z-20" aria-label={`Open ${service.title} details`} />
                                <div className="relative z-10 flex h-full flex-col justify-between">
                                    <p className="text-sm font-semibold tracking-wide text-[#2ABBAF]">{service.number || service.id || index + 1}</p>
                                    <h3 className="text-2xl font-semibold text-white">{service.title}</h3>
                                </div>
                            </motion.article>
                        ))}
                    </motion.div>
                </motion.section>

                <motion.section id="about-team" className="mt-20" variants={revealVariants} {...inViewMotion}>
                    <article className="text-center">
                        <p className="text-sm uppercase tracking-[0.2em] text-[#8EC3EF]">Meet Our Team</p>
                        <h2 className="mt-3 font-display text-3xl text-white sm:text-4xl">People Behind <span className='text-gradient'>The Strategy</span></h2>
                        <p className="mx-auto mt-4 max-w-2xl leading-8 text-slate-300">
                            Our specialists combine market insight, analytical precision, and client-first execution to keep your plan on track.
                        </p>
                    </article>

                    <motion.div className="relative mt-8 hidden lg:block" variants={revealVariants}>
                        <div className="relative overflow-visible rounded-2xl p-4">
                            <ThreeDCarousel
                                slides={teamSlides}
                                itemCount={5}
                                autoplay={!reduceMotion}
                                delay={3.6}
                                pauseOnHover={true}
                                className="my-2"
                            />
                        </div>
                    </motion.div>

                    <motion.div
                        className="mt-8 grid gap-4 sm:grid-cols-2 lg:hidden"
                        variants={teamContainer}
                        initial={reduceMotion ? false : 'hidden'}
                        whileInView="visible"
                        viewport={reduceMotion ? undefined : { once: true, amount: 0.2 }}
                    >
                        {teamMembers.map((member) => (
                            <motion.article key={member.name} variants={revealVariants} className="relative overflow-hidden rounded-2xl border border-white/15 bg-[linear-gradient(155deg,rgba(255,255,255,0.12),rgba(255,255,255,0.025)),linear-gradient(145deg,rgba(11,20,38,0.4),rgba(19,39,72,0.28))] p-1.5 backdrop-blur-[9px] [backdrop-filter:saturate(130%)]">
                                <img src={member.image} alt={member.name} className="h-72 w-full rounded-xl object-cover" loading="lazy" />
                                <div className="absolute inset-x-5 bottom-4 rounded-xl border border-slate-300/80 bg-white px-3 py-2 text-center shadow-[0_10px_24px_rgba(2,6,23,0.24)] backdrop-blur-[2px]">
                                    <h3 className="text-base font-semibold text-slate-900">{member.name}</h3>
                                    <p className="mt-0.5 text-xs font-medium text-slate-600">{member.role}</p>
                                </div>
                            </motion.article>
                        ))}
                    </motion.div>
                </motion.section>
            </main>

            <SiteFooter />
        </div>
    )
}

export default AboutPage
