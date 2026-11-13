import { useState } from "react";
import { Clock, Mail, MapPin, Phone } from "../lib/icons";
import { contactService } from "../services";
import { useToast } from "../context/ToastContext";

const INFO = [
  {
    icon: Mail,
    title: "Email us",
    value: "hello@happyshop.test",
    href: "mailto:hello@happyshop.test",
  },
  {
    icon: Phone,
    title: "Call us",
    value: "+212 600 000 001",
    href: "tel:+212600000001",
  },
  { icon: MapPin, title: "Visit", value: "Casablanca, Morocco" },
  { icon: Clock, title: "Hours", value: "Mon – Sat, 9:00 – 19:00" },
];

const EMPTY = {
  full_name: "",
  email: "",
  phone: "",
  subject: "",
  message: "",
};

export default function Contact() {
  const toast = useToast();
  const [form, setForm] = useState(EMPTY);
  const [submitting, setSubmitting] = useState(false);

  function update(field, value) {
    setForm((current) => ({ ...current, [field]: value }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setSubmitting(true);
    try {
      await contactService.send(form);
      toast.success("Thank you — we’ll get back to you shortly.", "Message sent");
      setForm(EMPTY);
    } catch (err) {
      toast.error(err.message, "Could not send message");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="container section">
      <div className="page-head">
        <span className="eyebrow">Get in touch</span>
        <h1>We’d love to hear from you</h1>
        <p className="lead">
          Questions about an order, a product or a return? Our team replies within
          one business day.
        </p>
      </div>

      <div className="contact-layout">
        <div className="contact-info">
          {INFO.map((item) => {
            const Icon = item.icon;
            return (
              <div className="contact-card" key={item.title}>
                <span className="contact-card__icon">
                  <Icon size={22} />
                </span>
                <div>
                  <h4>{item.title}</h4>
                  {item.href ? (
                    <a href={item.href}>{item.value}</a>
                  ) : (
                    <p>{item.value}</p>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        <form className="contact-form panel" onSubmit={handleSubmit}>
          <h3>Send a message</h3>

          <div className="form-grid">
            <div className="field">
              <label htmlFor="full_name">Full name</label>
              <input
                id="full_name"
                className="input"
                required
                maxLength={200}
                value={form.full_name}
                onChange={(event) => update("full_name", event.target.value)}
              />
            </div>

            <div className="field">
              <label htmlFor="email">Email</label>
              <input
                id="email"
                type="email"
                className="input"
                required
                maxLength={200}
                value={form.email}
                onChange={(event) => update("email", event.target.value)}
              />
            </div>

            <div className="field">
              <label htmlFor="phone">Phone</label>
              <input
                id="phone"
                className="input"
                maxLength={50}
                value={form.phone}
                onChange={(event) => update("phone", event.target.value)}
              />
            </div>

            <div className="field">
              <label htmlFor="subject">Subject</label>
              <input
                id="subject"
                className="input"
                maxLength={200}
                value={form.subject}
                onChange={(event) => update("subject", event.target.value)}
              />
            </div>

            <div className="field span-2">
              <label htmlFor="message">Message</label>
              <textarea
                id="message"
                className="textarea"
                required
                maxLength={2000}
                value={form.message}
                onChange={(event) => update("message", event.target.value)}
              />
            </div>
          </div>

          <button type="submit" className="btn btn-gold btn-lg" disabled={submitting}>
            {submitting ? "Sending…" : "Send message"}
          </button>
        </form>
      </div>
    </div>
  );
}
