"use client";

import React from "react";
import { LegalLayout, LegalSection } from "../components/LegalLayout";

export default function ShippingPage() {
  const sections: LegalSection[] = [
    {
      id: "shipping",
      title: "Insured Delivery",
      content: (
        <>
          <p>
            Complimentary, fully insured transit is provided across India for all Civara creations. Shipments are hand-delivered via specialized secure armored couriers requiring photo ID verification and OTP upon signature.
          </p>
          <p>
            International insured shipping is available on request to select global destinations.
          </p>
        </>
      ),
    },
    {
      id: "returns",
      title: "Returns & Exchanges",
      content: (
        <>
          <p>
            Because every piece is handcrafted specifically to client measurements and metal selections, bespoke and engraved creations are non-refundable.
          </p>
          <p>
            In the unlikely event of a manufacturing defect, pieces may be returned within 7 days of receipt for repair or replacement under full warranty.
          </p>
        </>
      ),
    },
  ];

  return (
    <LegalLayout
      title="Shipping & Delivery Policy"
      subtitle="Complimentary insured courier transit and delivery procedures across India."
      sections={sections}
    />
  );
}
