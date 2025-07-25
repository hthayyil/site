import React from "react";
import "./style.css";
import { Helmet, HelmetProvider } from "react-helmet-async";
import { meta } from "../../content_option";
import { Container, Row, Col } from "react-bootstrap";
import { contactConfig } from "../../content_option";
import { Mail, Instagram } from "lucide-react";

export const ContactUs = () => {
  return (
    <HelmetProvider>
      <Container>
        <Helmet>
          <meta charSet="utf-8" />
          <title>{meta.title} | Contact</title>
          <meta name="description" content={meta.description} />
        </Helmet>
        <Row className="mb-5 mt-5 pt-5">
          <Col lg="6" className="d-flex align-items-start">
            <div className="contact-list mt-5">
              <div className="contact-item d-flex align-items-center mb-3">
                <a 
                  href={`https://mail.google.com/mail/?view=cm&fs=1&to=${contactConfig.YOUR_EMAIL}`} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="contact-link d-flex align-items-center"
                >
                  <Mail className="contact-icon me-3" />
                  <span className="contact-text">: {contactConfig.YOUR_EMAIL}</span>
                </a>
              </div>
              <div className="contact-item d-flex align-items-center mb-3">
                <a 
                  href="https://www.instagram.com/sisterengineering/?hl=en" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="contact-link d-flex align-items-center"
                >
                  <Instagram className="contact-icon me-3" />
                  <span className="contact-text">: @sisterengineering</span>
                </a>
              </div>
            </div>
          </Col>
        </Row>
      </Container>
    </HelmetProvider>
  );
};
