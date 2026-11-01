"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Navigation() {
  const pathname = usePathname();
  return (
    <header className="site-header">
      <nav className="nav-inner" aria-label="Main navigation">
        <Link href="/" className="wordmark" aria-label="Yeo Meng Han home">
          <span className="brand-symbol">
            ymh<span>_</span>
          </span>
          <span className="brand-name">YEO MENG HAN</span>
        </Link>
        <div className="nav-links">
          {[
            { href: "/about", label: "About" },
            { href: "/projects", label: "Projects" },
            { href: "/notes", label: "Writing" },
          ].map((link) => (
            <Link
              key={link.href}
              href={link.href}
              aria-current={pathname.startsWith(link.href) ? "page" : undefined}
            >
              {link.label}
            </Link>
          ))}
          <a href="/yeo_menghan_resume.pdf">
            Résumé <span aria-hidden="true">↗</span>
          </a>
          <a className="nav-contact" href="mailto:yeomenghan1989@gmail.com">
            Contact <span aria-hidden="true">↗</span>
          </a>
        </div>
      </nav>
    </header>
  );
}
