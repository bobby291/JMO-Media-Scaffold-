import Link from "next/link";

const quickLinks = [
  { href: "/", label: "Home" },
  { href: "/articles", label: "Articles" },
  { href: "/development-areas", label: "Development Areas" },
  { href: "/about", label: "About" },
];

const ecosystemLinks = [
  { href: "https://www.jmobizhub.com/", label: "JMO BIZHUB", external: true },
  { href: "/development-areas/educational-development", label: "JMO Academy" },
  { href: "/join", label: "Join Community" },
];

const socials = [
  { label: "Facebook", icon: "facebook", href: "https://www.facebook.com/jmomedia" },
  { label: "X", icon: "x", href: "#" },
  { label: "LinkedIn", icon: "linkedin", href: "#" },
  { label: "Instagram", icon: "instagram", href: "#" },
  { label: "YouTube", icon: "youtube", href: "#" },
];

function SocialIcon({ name }: { name: string }) {
  if (name === "facebook") {
    return (
      <svg viewBox="0 0 24 24" className="size-5" fill="currentColor" aria-hidden="true">
        <path d="M14.2 8.4V6.7c0-.8.5-1 1.1-1h1.6V3h-2.3c-2.5 0-3.9 1.5-3.9 4v1.4H8.2v2.9h2.5V21h3.2v-9.7h2.5l.4-2.9h-2.6Z" />
      </svg>
    );
  }

  if (name === "x") {
    return (
      <svg viewBox="0 0 24 24" className="size-5" fill="currentColor" aria-hidden="true">
        <path d="M13.9 10.5 21.3 2h-1.8l-6.4 7.4L8 2H2.1l7.8 11.3L2.1 22h1.8l6.8-7.8 5.4 7.8H22l-8.1-11.5Zm-2.4 2.8-.8-1.1L4.5 3.4h2.7l5 7.1.8 1.1 6.5 9.1h-2.7l-5.3-7.4Z" />
      </svg>
    );
  }

  if (name === "linkedin") {
    return (
      <svg viewBox="0 0 24 24" className="size-5" fill="currentColor" aria-hidden="true">
        <path d="M5.2 8.8H2.4V21h2.8V8.8ZM3.8 3C2.8 3 2 3.8 2 4.8s.8 1.7 1.8 1.7 1.8-.7 1.8-1.7S4.8 3 3.8 3Zm7 5.8H8V21h2.8v-6.4c0-1.7.8-3.3 2.7-3.3 1.9 0 2 1.8 2 3.4V21h2.8v-7c0-3.5-.8-5.5-4.3-5.5-1.6 0-2.7.8-3.2 1.7V8.8Z" />
      </svg>
    );
  }

  if (name === "instagram") {
    return (
      <svg viewBox="0 0 24 24" className="size-5" fill="none" aria-hidden="true">
        <rect width="16" height="16" x="4" y="4" rx="4.2" stroke="currentColor" strokeWidth="2" />
        <circle cx="12" cy="12" r="3.3" stroke="currentColor" strokeWidth="2" />
        <circle cx="16.7" cy="7.4" r="1.1" fill="currentColor" />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 24 24" className="size-5" fill="currentColor" aria-hidden="true">
      <path d="M21.6 7.2s-.2-1.5-.8-2.1c-.8-.8-1.7-.8-2.1-.9C15.8 4 12 4 12 4s-3.8 0-6.7.2c-.4.1-1.3.1-2.1.9-.6.6-.8 2.1-.8 2.1S2.2 9 2.2 10.8v1.7c0 1.8.2 3.6.2 3.6s.2 1.5.8 2.1c.8.8 1.9.8 2.4.9 1.8.2 6.4.2 6.4.2s3.8 0 6.7-.3c.4 0 1.3 0 2.1-.8.6-.6.8-2.1.8-2.1s.2-1.8.2-3.6v-1.7c0-1.8-.2-3.6-.2-3.6ZM10.1 14.9V8.7l5.7 3.1-5.7 3.1Z" />
    </svg>
  );
}

export default function Footer() {
  return (
    <footer id="footer" className="scroll-mt-32 bg-[#191919] px-6 py-20 text-white md:px-10">
      <div className="mx-auto max-w-[1408px]">
        <div className="grid gap-12 lg:grid-cols-[1.3fr_1fr_1fr_1.2fr]">
          <div>
            <Link href="/" className="flex items-center gap-4">
              <span className="grid size-16 place-items-center rounded-[14px] bg-[#7427b3] text-2xl font-bold text-white">
                JMO
              </span>
              <span className="text-3xl font-bold">JMO Media</span>
            </Link>
            <p className="mt-9 max-w-sm text-xl font-medium leading-9 text-[#a7adb8]">
              Empowering holistic development through valuable, structured
              content.
            </p>
            <div className="mt-8 flex items-center gap-7 text-3xl font-semibold text-[#a7adb8]">
              {socials.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="grid size-11 place-items-center rounded-full border border-white/10 bg-white/5 text-[#a7adb8] transition hover:border-[#7427b3] hover:bg-[#7427b3] hover:text-white"
                  aria-label={`Visit JMO Media on ${social.label}`}
                >
                  <SocialIcon name={social.icon} />
                </a>
              ))}
            </div>
          </div>

          <div>
            <h2 className="text-3xl font-bold">Quick Links</h2>
            <div className="mt-8 flex flex-col gap-5 text-xl font-medium text-[#a7adb8]">
              {quickLinks.map((link) => (
                <Link key={link.href} href={link.href} className="hover:text-white">
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

          <div>
            <h2 className="text-3xl font-bold">Ecosystem</h2>
            <div className="mt-8 flex flex-col gap-5 text-xl font-medium text-[#a7adb8]">
              {ecosystemLinks.map((link) => (
                link.external ? (
                  <a
                    key={link.href}
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-white"
                  >
                    {link.label}
                  </a>
                ) : (
                  <Link key={link.href} href={link.href} className="hover:text-white">
                    {link.label}
                  </Link>
                )
              ))}
            </div>
          </div>

          <div>
            <h2 className="text-3xl font-bold">Contact</h2>
            <div className="mt-8 flex flex-col gap-5 text-xl font-medium text-[#a7adb8]">
              <p>Email: jmobizhub@gmail.com</p>
              <p>Phone: +234 703 358 6251</p>
              <p>Location: Nigeria, NG</p>
            </div>
          </div>
        </div>

        <div className="mt-16 border-t border-[#253044] pt-12 text-center">
          <p className="text-xl font-medium text-[#a7adb8]">
            © 2026 JMO Media. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
