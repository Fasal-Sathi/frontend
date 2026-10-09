import { Mail, Phone } from "lucide-react";

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="footer-main">
        <div><h3>Quick Links</h3><a href="/">Home</a><a href="/prediction">Prediction</a><a href="/help">Help</a><a href="/profile">Profile</a></div>
        <div><h3>Resources</h3><a>Farmer's Guide</a><a>Crop Calendar</a><a>Weather Forecast</a><a>Market Prices</a><a>FAQ</a></div>
        <div><h3>Contact</h3><span><Mail size={17}/> support@fasalsathi.gov.in</span><span><Phone size={17}/> 1800-XXX-XXXX</span></div>
      </div>
      <div className="footer-bottom"><span>© 2026 Government of India · FasalSathi Prototype</span><span>Privacy Policy · Terms of Use · Accessibility · Sitemap</span></div>
    </footer>
  );
}
