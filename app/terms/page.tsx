"use client";

import React from "react";
import { LegalLayout, LegalSection } from "../components/LegalLayout";

export default function TermsPage() {
  const sections: LegalSection[] = [
    {
      id: "terms",
      title: "Atelier Terms of Service",
      content: (
        <>
          <p>
            By booking a private viewing or placing a bespoke commission with Civara Jewels, you agree to our atelier terms. All product photography and editorial text remain the intellectual property of Civara Jewels.
          </p>
          <p>
            Prices quoted on the site are subject to minor variation based on natural gemstone carat weights and daily market gold hallmarking rates at the time of order confirmation.
          </p>
        </>
      ),
    },
  ];

  return (
    <LegalLayout
      title="Terms of Service"
      subtitle="Conditions governing atelier viewings, bespoke commissions, and website usage."
      sections={sections}
    />
  );
}
