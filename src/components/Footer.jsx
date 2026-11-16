import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faMapMarkerAlt,
  faTruck,
  faShippingFast,
} from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";


function Footer() {
  const helpLinks = [
    { name: "Terms & Conditions", path: "/terms" },
    { name: "Privacy Policy", path: "/privacy" },
    { name: "Services", path: "/services" },
    { name: "FAQ's", path: "/faqs" },
  ];
  const contactInfo = [
    { label: "Ensemble Islamabad Street: 48, F-8/4",
      href: "https://www.google.com/maps/place/Ensemble/@33.7090346,73.0457735,17z/data=!3m1!4b1!4m6!3m5!1s0x38dfbfb218091bf9:0xa23635d9085a9cdf!8m2!3d33.7090346!4d73.0457735!16s%2Fg%2F11c55w0tgd?entry=ttu&g_ep=EgoyMDI1MTAwNy4wIKXMDSoASAFQAw%3D%3D", },
    {
      label: "Instagram: @baaji_byhinafahad",
      href: "https://www.instagram.com/baaji_byhinafahad/",
    },
    { label: "Phone: +92 311 7888100", href: "tel:+923117888100" },
  ];

  return (
    <footer className="footer">
      {/* Row 1: Quick Actions */}
      <div className="row-1">
        <a href="https://www.google.com/maps/place/Ensemble/@33.7090346,73.0457735,17z/data=!3m1!4b1!4m6!3m5!1s0x38dfbfb218091bf9:0xa23635d9085a9cdf!8m2!3d33.7090346!4d73.0457735!16s%2Fg%2F11c55w0tgd?entry=ttu&g_ep=EgoyMDI1MTAwNy4wIKXMDSoASAFQAw%3D%3D">
        <div className="row-1-col">
          <h2>Find Our Store</h2>
          <FontAwesomeIcon icon={faMapMarkerAlt} />
        </div>
        </a>
        <div className="row-1-col">
          <h2>Track Your Order</h2>
          <FontAwesomeIcon icon={faTruck} />
        </div>
        <div className="row-1-col">
          <h2>Shipping</h2>
          <FontAwesomeIcon icon={faShippingFast} />
        </div>
      </div>

      {/* Row 2: Contact + Help */}
      <div className="row-2">
        {/* Contact Us */}
        <div>
          <h3>Contact Us</h3>
          <ul>
            {contactInfo.map((item, i) => (
              <li key={i}>
                <a href={item.href} target="_blank" rel="noreferrer">
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </div>

        {/* Help Section */}
        <div>
          <h3>Help</h3>
          <ul>
            {helpLinks.map((link, i) => (
              <li key={i}>
                <Link to={link.path}>{link.name}</Link>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Newsletter
      <form className="newsletter" onSubmit={(e) => e.preventDefault()}>
        <label htmlFor="newsletter">Get The Latest News:</label>
        <div>
          <input
            type="email"
            id="newsletter"
            placeholder="Email Address"
            required
          />
          <button type="submit">Subscribe</button>
        </div>
      </form> */}

      {/* Copyright */}
      <p className="copyright">
        © {new Date().getFullYear()} Baaji Official. All Rights Reserved.
      </p>
    </footer>
  );
}

export default Footer;
