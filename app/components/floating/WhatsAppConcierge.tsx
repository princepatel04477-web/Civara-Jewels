"use client";

import React, { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { MessageCircle } from "lucide-react";

interface WhatsAppConciergeProps {
  productName?: string;
}

export const WhatsAppConcierge: React.FC<WhatsAppConciergeProps> = ({
  productName,
}) => {
  const pathname = usePathname();
  const [currentUrl, setCurrentUrl] = useState("");

  useEffect(() => {
    if (typeof window !== "undefined") {
      setCurrentUrl(window.location.href);
    }
  }, [pathname]);

  const isPdp = pathname.startsWith("/products/") || Boolean(productName);

  const getWaText = () => {
    if (isPdp && productName) {
      return encodeURIComponent(
        `Hello Civara Jewels, I would like to enquire about the ${productName} (${currentUrl || pathname}).`
      );
    }
    return encodeURIComponent(
      `Hello Civara Jewels, I would like to enquire about scheduling a private viewing.`
    );
  };

  const waHref = `https://wa.me/918866077237?text=${getWaText()}`;

  return (
    <aside
      aria-label="WhatsApp Concierge"
      className="fixed bottom-6 right-5 z-30 md:hidden"
    >
      <a
        href={waHref}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat with Civara Concierge on WhatsApp"
        className="w-12 h-12 rounded-full bg-[#FAF7F0] border border-[#C9A961] text-[#9E7F3C] flex items-center justify-center shadow-lg hover:bg-[#241F1B] hover:text-[#C9A961] hover:border-[#241F1B] transition-colors"
      >
        <MessageCircle className="w-6 h-6 stroke-[1.5]" />
      </a>
    </aside>
  );
};
