"use client";

import React from "react";
import { LegalLayout, LegalSection } from "../components/LegalLayout";

export default function FAQPage() {
  const sections: LegalSection[] = [
    {
      id: "general",
      title: "General & Atelier",
      content: (
        <>
          <p>
            Civara Jewels is a fine jewellery atelier specializing in hallmarked 18-karat gold and certified diamonds. All atelier visits and consultations are strictly by appointment.
          </p>
          <p>
            Because every piece is crafted to order, we do not operate an online cart or automated checkout. Every commission begins with a conversation or a private viewing.
          </p>
        </>
      ),
    },
    {
      id: "crafting",
      title: "Crafting & Turnaround",
      content: (
        <>
          <p>
            Standard crafting turnaround is 2 to 3 weeks from the date of deposit or final drawing confirmation.
          </p>
          <p>
            Rushed ceremonial orders can be prioritized upon request depending on bench capacity.
          </p>
        </>
      ),
    },
    {
      id: "sizing",
      title: "Resizing & Adjustments",
      content: (
        <>
          <p>
            We offer one complimentary ring resizing within the first 12 months of purchase. Resizing takes 5 to 7 business days.
          </p>
        </>
      ),
    },
  ];

  return (
    <LegalLayout
      title="Frequently Asked Questions"
      subtitle="Answers regarding bespoke commissions, viewings, and atelier services."
      sections={sections}
    />
  );
}
