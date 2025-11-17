import React, { useState } from "react";
import { Mail, Check } from "lucide-react";

export default function ContactUs() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [sent, setSent] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSent(true);
    setTimeout(() => setSent(false), 2500);
    setForm({ name: "", email: "", message: "" });
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      <h1 className="text-4xl font-bold mb-6 text-center">Contact Us</h1>

      <div className="grid md:grid-cols-2 gap-8">
        <div className="bg-white p-6 rounded-xl shadow">
          <h2 className="text-2xl font-semibold mb-4">Send a Message</h2>
          {sent ? (
            <div className="text-center text-green-600 py-8">
              <Check className="w-12 h-12 mx-auto mb-2" />
              Message sent successfully!
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                className="w-full border p-2 rounded"
                placeholder="Name"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                required
              />
              <input
                type="email"
                className="w-full border p-2 rounded"
                placeholder="Email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                required
              />
              <textarea
                className="w-full border p-2 rounded h-32"
                placeholder="Message"
                value={form.message}
                onChange={(e) => setForm({ ...form, message: e.target.value })}
                required
              />
              <button className="w-full bg-orange-500 text-white py-2 rounded">
                Send Message
              </button>
            </form>
          )}
        </div>

        <div className="space-y-6">
          <div className="bg-white rounded-xl shadow p-6">
            <h3 className="text-xl font-semibold mb-3">Get in Touch</h3>
            <div className="flex items-center gap-3">
              <Mail className="text-orange-500 w-6 h-6" />
              <span>support@flavorfusion.com</span>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow p-6">
            <h3 className="text-xl font-semibold mb-3">About Our Team</h3>
            <p className="text-gray-600 mb-3">
              FlavorFusion is crafted by passionate students and developers
              combining technology and taste.
            </p>
            <ul className="text-gray-600 space-y-1">
              <li>• Adarsha E — Backend Development</li>
              <li>• Anish A Kunder — Frontend Development</li>
              <li>• Abdul Mateen Shaikh & Aryaman D K — Design & Integration</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
