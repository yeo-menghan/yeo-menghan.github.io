import Link from "next/link";
export default function FooterCTA() {
  return (
    <footer className="site-footer">
      <div>
        <Link href="/" className="footer-name">
          Yeo Meng Han<span> / </span>Singapore
        </Link>
        <p>Software, meet the physical world.</p>
      </div>
      <div className="footer-links">
        <a href="https://github.com/yeo-menghan">GitHub ↗</a>
        <a href="https://linkedin.com/in/yeo-meng-han">LinkedIn ↗</a>
        <a href="mailto:yeomenghan1989@gmail.com">Email ↗</a>
      </div>
      <span className="copyright">© {new Date().getFullYear()}</span>
    </footer>
  );
}
