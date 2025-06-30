import React from "react";
import { Container, Row, Col } from "react-bootstrap";
import {
  FaFacebook,
  FaTwitter,
  FaInstagram,
  FaEnvelope,
  FaPhone,
  FaMapMarkerAlt,
} from "react-icons/fa";

function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer-gradient text-light py-3 mt-auto shadow-lg custom-footer">
      <Container>
        <Row className="align-items-center mb-2">
          <Col md={12} className="text-center">
            <h4 className="fw-bold text-accent mb-1">Orchid Garden</h4>
            <div
              className="fst-italic text-footer-muted mb-2"
              style={{ fontSize: "1.1rem" }}
            >
              "Bringing Nature's Elegance to Your Home"
            </div>
            <div className="d-flex justify-content-center gap-3 mt-2">
              <a href="#" className="footer-social fs-4" aria-label="Facebook">
                <FaFacebook />
              </a>
              <a href="#" className="footer-social fs-4" aria-label="Twitter">
                <FaTwitter />
              </a>
              <a href="#" className="footer-social fs-4" aria-label="Instagram">
                <FaInstagram />
              </a>
            </div>
          </Col>
        </Row>
        <Row>
          <Col lg={3} md={6} className="mb-4">
            <h6 className="text-accent mb-3 fw-bold">About Us</h6>
            <p className="text-footer-muted small">
              We are passionate about orchids and dedicated to providing the
              best plants, care tips, and customer service. Explore our curated
              collection and let your space bloom with beauty.
            </p>
          </Col>
          <Col lg={2} md={6} className="mb-4">
            <h6 className="text-accent mb-3 fw-bold">Quick Links</h6>
            <ul className="list-unstyled">
              <li className="mb-2">
                <a href="/home" className="footer-link">
                  Home
                </a>
              </li>
              <li className="mb-2">
                <a href="/" className="footer-link">
                  Orchids
                </a>
              </li>
              <li className="mb-2">
                <a href="/employees" className="footer-link">
                  Employees
                </a>
              </li>
              <li className="mb-2">
                <a href="#" className="footer-link">
                  About Us
                </a>
              </li>
            </ul>
          </Col>
          <Col lg={3} md={6} className="mb-4">
            <h6 className="text-accent mb-3 fw-bold">Services</h6>
            <ul className="list-unstyled">
              <li className="mb-2">
                <a href="#" className="footer-link">
                  Orchid Care
                </a>
              </li>
              <li className="mb-2">
                <a href="#" className="footer-link">
                  Consultation
                </a>
              </li>
              <li className="mb-2">
                <a href="#" className="footer-link">
                  Delivery
                </a>
              </li>
              <li className="mb-2">
                <a href="#" className="footer-link">
                  Maintenance
                </a>
              </li>
            </ul>
          </Col>
          <Col lg={4} md={6} className="mb-4">
            <h6 className="text-accent mb-3 fw-bold">Contact</h6>
            <div className="d-flex align-items-center mb-2">
              <FaMapMarkerAlt className="text-accent me-2" />
              <span className="text-footer-muted">
                123 Orchid Lane, Green City, Country
              </span>
            </div>
            <div className="d-flex align-items-center mb-2">
              <FaPhone className="text-accent me-2" />
              <span className="text-footer-muted">(+84) 795 335 577</span>
            </div>
            <div className="d-flex align-items-center mb-2">
              <FaEnvelope className="text-accent me-2" />
              <span className="text-footer-muted">
                contact@orchidgarden.com
              </span>
            </div>
          </Col>
        </Row>
        <hr className="my-4 border-footer" />
        <Row className="align-items-center">
          <Col md={6} className="text-center text-md-start mb-2 mb-md-0">
            <span className="text-footer-muted small">
              © {currentYear} Orchid Garden. All rights reserved.
            </span>
          </Col>
          <Col md={6} className="text-center text-md-end">
            <span className="text-footer-muted small me-3">
              <a href="#" className="footer-link">
                Privacy Policy
              </a>
            </span>
            <span className="text-footer-muted small me-3">
              <a href="#" className="footer-link">
                Terms of Service
              </a>
            </span>
            <span className="text-footer-muted small">
              <a href="#" className="footer-link">
                Cookie Policy
              </a>
            </span>
          </Col>
        </Row>
        <Row>
          <Col className="text-center mt-3">
            <span className="text-footer-muted small">
              Developed by{" "}
              <a href="https://github.com/your-github" className="footer-link">
                Phạm Đăng Khôi
              </a>{" "}
              &mdash; Powered by React &amp; MinIO
            </span>
          </Col>
        </Row>
      </Container>
      <style>{`
        .footer-gradient {
          background: linear-gradient(120deg, #1a237e 0%, #283593 60%, #3949ab 100%);
        }
        .text-accent {
          color: #ffd54f !important;
        }
        .footer-link {
          color: #bfc9d1;
          text-decoration: none;
          transition: color 0.2s;
          font-size: 0.98rem;
        }
        .footer-link:hover {
          color: #ffd54f;
          text-decoration: underline;
        }
        .footer-social {
          color: #bfc9d1;
          transition: color 0.2s, transform 0.2s;
          font-size: 1.3rem;
        }
        .footer-social:hover {
          color: #ffd54f;
          transform: translateY(-2px) scale(1.12);
        }
        .custom-footer {
          font-size: 0.97rem;
          letter-spacing: 0.01em;
        }
        .text-footer-muted {
          color: #e3e7ef !important;
          font-size: 0.97rem;
        }
        .border-footer {
          border-color: #3949ab !important;
        }
        .footer-gradient .row > [class*='col-'] {
          margin-bottom: 0.7rem;
        }
        .footer-gradient h4, .footer-gradient h6 {
          margin-bottom: 0.5rem !important;
        }
        .footer-gradient ul {
          margin-bottom: 0.5rem;
        }
        .footer-gradient hr {
          margin: 1rem 0;
        }
        .footer-gradient .mt-3 {
          margin-top: 0.7rem !important;
        }
      `}</style>
    </footer>
  );
}

export default Footer;
