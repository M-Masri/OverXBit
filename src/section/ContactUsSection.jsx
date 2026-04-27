import { useState } from 'react'
import PhoneInputLib from 'react-phone-input-2'
import 'react-phone-input-2/lib/style.css'

const PhoneInput = PhoneInputLib.default ?? PhoneInputLib

const socialLinks = [
  { name: 'Facebook', href: '#', icon: 'facebook' },
  { name: 'X', href: '#', icon: 'x' },
  { name: 'Instagram', href: '#', icon: 'instagram' },
  { name: 'LinkedIn', href: '#', icon: 'linkedin' },
  { name: 'YouTube', href: '#', icon: 'youtube' },
  { name: 'Telegram', href: '#', icon: 'telegram' },
]

const contactDetails = [
  { label: 'UAE', value: '+971527030890', icon: 'phone' },
  { label: 'LEB', value: '+9613471472', icon: 'phone' },
  { label: 'ARM', value: '+3744999048', icon: 'phone' },
  { label: 'Email', value: 'info@overxbit.com', icon: 'mail' },
]

const subjectOptions = [
  'Subscription Plans',
  'Technical Support',
  'Partnership Inquiry',
  'Career Opportunities',
  'General Question',
]

function SocialIcon({ type }) {
  if (type === 'facebook') {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true" fill="currentColor">
        <path d="M13.5 21v-7h2.4l.4-3h-2.8V9.2c0-.9.3-1.6 1.7-1.6h1.2V5c-.2 0-.9-.1-1.9-.1-2.7 0-4.3 1.6-4.3 4.3V11H7.9v3h2.3v7h3.3Z" />
      </svg>
    )
  }

  if (type === 'x') {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true" fill="currentColor">
        <path d="M4 4h3.8l4 5.4L16.7 4H20l-6.3 7.2L20.4 20h-3.8l-4.3-5.8L7 20H3.7l6.7-7.6L4 4Z" />
      </svg>
    )
  }

  if (type === 'instagram') {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3.5" y="3.5" width="17" height="17" rx="5" />
        <circle cx="12" cy="12" r="4" />
        <circle cx="17.3" cy="6.7" r="1" fill="currentColor" stroke="none" />
      </svg>
    )
  }

  if (type === 'linkedin') {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true" fill="currentColor">
        <path d="M6.1 8.4a1.8 1.8 0 1 0 0-3.6 1.8 1.8 0 0 0 0 3.6Zm-1.5 11.1h3V9.8h-3v9.7Zm5 0h3v-5.3c0-1.4.3-2.8 2-2.8 1.7 0 1.7 1.5 1.7 2.9v5.2h3v-5.8c0-2.8-.6-5-3.9-5-1.6 0-2.7.9-3.1 1.7h0V9.8h-2.8v9.7Z" />
      </svg>
    )
  }

  if (type === 'youtube') {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true" fill="currentColor">
        <path d="M21 8.6a2.8 2.8 0 0 0-2-2c-1.8-.5-7-.5-7-.5s-5.2 0-7 .5a2.8 2.8 0 0 0-2 2A29.3 29.3 0 0 0 3 12a29.3 29.3 0 0 0 .5 3.4c.3 1 .9 1.7 2 2 1.8.5 7 .5 7 .5s5.2 0 7-.5c1.1-.3 1.7-1 2-2A29.3 29.3 0 0 0 21 12a29.3 29.3 0 0 0-.5-3.4ZM10 15.3V8.7l5.4 3.3-5.4 3.3Z" />
      </svg>
    )
  }

  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" fill="currentColor">
      <path d="M9.7 15.7 9.5 19c.4 0 .6-.2.9-.4l2.1-2 4.5 3.3c.8.5 1.4.2 1.6-.8l2.9-13.5c.3-1.2-.4-1.7-1.2-1.4L3.6 10.6c-1.2.4-1.2 1.1-.2 1.4l4.3 1.4 10-6.4c.5-.3.9-.1.6.2l-8.6 8.5Z" />
    </svg>
  )
}

function ContactDetailIcon({ type }) {
  if (type === 'mail') {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 6h16v12H4z" />
        <path d="m4 7 8 6 8-6" />
      </svg>
    )
  }

  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.4 19.4 0 0 1-6-6A19.8 19.8 0 0 1 2 4.2 2 2 0 0 1 4 2h3a2 2 0 0 1 2 1.7c.1 1 .4 2.1.8 3.1a2 2 0 0 1-.4 2.1L8.1 10a16 16 0 0 0 5.9 5.9l1.1-1.3a2 2 0 0 1 2.1-.4c1 .4 2 .7 3.1.8A2 2 0 0 1 22 16.9Z" />
    </svg>
  )
}

function ContactUsSection() {
  const [phone, setPhone] = useState('971')

  return (
    <section id="contact" className="pt-16">
      <div className="contact-shell p-6 sm:p-8 lg:p-10">
        <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr]">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-orange-300">Contact Us</p>
            <h2 className="mt-3 font-display text-5xl text-white sm:text-6xl">
              Contact <span className="text-gradient">Us</span>
            </h2>
            <p className="mt-4 max-w-sm leading-8 text-slate-300">
              Tell us what you are aiming for in trading, and our team will guide you
              toward the right plan and execution path.
            </p>

            <div className="mt-8 space-y-3">
              {contactDetails.map((item) => (
                <div key={`${item.label}-${item.value}`} className="contact-detail-item">
                  <span className="contact-detail-icon">
                    <ContactDetailIcon type={item.icon} />
                  </span>
                  <span className="text-sm text-slate-300">
                    {item.label}: {item.value}
                  </span>
                </div>
              ))}
            </div>

            <div className="mt-10">
              <p className="text-lg font-semibold text-white">Follow us</p>
              <div className="mt-4 flex flex-wrap gap-2">
                {socialLinks.map((item) => (
                  <a key={item.name} href={item.href} aria-label={item.name} className="contact-social-chip">
                    <SocialIcon type={item.icon} />
                  </a>
                ))}
              </div>
            </div>
          </div>

          <form className="contact-form-card p-5 sm:p-8">
            <div className="grid gap-5 sm:grid-cols-2">
              <label className="block">
                <span className="contact-label">Name</span>
                <input className="contact-input mt-2" placeholder="John Carter" />
              </label>

              <label className="block">
                <span className="contact-label">Email</span>
                <input className="contact-input mt-2" placeholder="example@youremail.com" type="email" />
              </label>
            </div>

            <div className="mt-4 grid gap-5 sm:grid-cols-2">
              <label className="block">
                <span className="contact-label">Phone</span>
                <PhoneInput
                  country="ae"
                  value={phone}
                  onChange={setPhone}
                  countryCodeEditable={false}
                  placeholder="52 703 0890"
                  containerClass="contact-phone-container mt-2"
                  inputClass="contact-phone-input"
                  buttonClass="contact-phone-button"
                />
              </label>

              <label className="block">
                <span className="contact-label">Subject</span>
                <select className="contact-input contact-select mt-2" defaultValue="">
                  <option value="" disabled>
                    Select subject
                  </option>
                  {subjectOptions.map((item) => (
                    <option key={item} value={item}>
                      {item}
                    </option>
                  ))}
                </select>
              </label>
            </div>

            <label className="mt-4 block">
              <span className="contact-label">Message</span>
              <textarea
                className="contact-input mt-2 min-h-[130px] resize-none"
                placeholder="Type your message here..."
              />
            </label>

            <button
              type="button"
              className="mt-6 rounded-xl bg-gradient-to-r from-orange-500 to-orange-400 px-8 py-3 text-sm font-semibold text-white shadow-[0_10px_28px_rgba(249,115,22,0.35)]"
            >
              Send message
            </button>
          </form>
        </div>
      </div>
    </section>
  )
}

export default ContactUsSection
