import React from "react";

interface PressStripProps {
  show?: boolean;
}

export const PressStrip: React.FC<PressStripProps> = ({ show = true }) => {
  if (!show) return null;

  const publications = [
    { name: "VOGUE", sub: "INDIA" },
    { name: "HARPER'S BAZAAR", sub: "EDIT" },
    { name: "ELLE", sub: "LUXURY" },
    { name: "GQ", sub: "ATELIER" },
    { name: "ROBB REPORT", sub: "COLLECTIONS" },
  ];

  return (
    <section className="py-8 sm:py-10 border-y border-[#E6DFD3] bg-[#FAF7F0] overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 lg:px-14 flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="text-[10px] uppercase tracking-[0.3em] text-[#9E7F3C] font-medium whitespace-nowrap">
          Featured & Recognized In
        </div>

        <div className="flex flex-wrap items-center justify-center sm:justify-end gap-8 sm:gap-12 opacity-75">
          {publications.map((pub) => (
            <div
              key={pub.name}
              className="text-center font-serif text-sm sm:text-base tracking-[0.25em] text-[#9E7F3C]/80 hover:text-[#9E7F3C] transition-colors"
            >
              <span>{pub.name}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
