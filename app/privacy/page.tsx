"use client";

import React from "react";
import { LegalLayout, LegalSection } from "../components/LegalLayout";

export default function PrivacyPage() {
  const sections: LegalSection[] = [
    {
      id: "data-collection",
      title: "Data Collection & Confidentiality",
      content: (
        <>
          <p>
            At Civara Jewels, client confidentiality is paramount. Personal details shared during private viewing bookings or WhatsApp enquiries (names, contact numbers, delivery addresses) are handled with strict discretion and never sold to third parties.
          </p>
        </>
      ),
    },
    {
      id: "cookies",
      title: "Cookies & Preferences",
      content: (
        <>
          <p>
            We use essential local storage strictly to preserve your selected currency preferences and saved wishlist items across sessions.
          </p>
        </>
      ),
    },
  ];

  return (
    <LegalLayout
      title="Privacy Policy"
      subtitle="How Civara Jewels protects client confidentiality and personal information."
      sections={sections}
    />
  );
}
