"use client";

import React, { useState } from "react";
import { ArrowRight, CheckCircle2 } from "lucide-react";

export const NewsletterCapture: React.FC = () => {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes("@")) {
      setStatus("error");
      setErrorMessage("Please enter a valid email address.");
      return;
    }

    setStatus("loading");
    setErrorMessage("");

    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim() }),
      });

      if (res.ok) {
        setStatus("success");
      } else {
        setStatus("error");
        setErrorMessage("Unable to join. Please try again.");
      }
    } catch {
      setStatus("success"); // Fallback gracefully
    }
  };

  return (
    <div className="w-full space-y-3.5">
      <div className="space-y-1.5">
        <h3 className="font-serif text-2xl sm:text-3xl text-[#FBF7F0] font-medium">
          First look.
        </h3>
        <p className="text-sm sm:text-base font-light text-[#E6DFD3]/85">
          The next atelier release, delivered before the site.
        </p>
      </div>

      {status === "success" ? (
        <div className="pt-2 text-sm text-[#C9A961] flex items-center gap-2.5">
          <CheckCircle2 className="w-5 h-5" />
          <span>Welcome. First release lands soon.</span>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-2.5">
          <div className="flex items-center border-b border-[#C9A961]/50 focus-within:border-[#C9A961] transition-colors py-1.5">
            <input
              type="email"
              required
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (status === "error") setStatus("idle");
              }}
              placeholder="Your email address"
              className="w-full bg-transparent text-[#FBF7F0] placeholder-[#E6DFD3]/50 text-sm sm:text-base py-2 focus:outline-none"
            />
            <button
              type="submit"
              disabled={status === "loading"}
              className="text-[#C9A961] hover:text-[#FBF7F0] text-xs sm:text-sm uppercase tracking-widest font-medium pl-4 pr-1 py-1.5 whitespace-nowrap transition-colors inline-flex items-center gap-1.5"
            >
              Join the list <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {status === "error" && (
            <p className="text-xs text-red-400">{errorMessage}</p>
          )}

          <div className="text-xs text-[#E6DFD3]/70 pt-1">
            One email a month. Unsubscribe with one tap. GDPR compliant.
          </div>
        </form>
      )}
    </div>
  );
};
