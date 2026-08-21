"use client";

import React, { useState } from "react";
import { BookViewingDialog } from "./BookViewingDialog";

interface BookViewingButtonProps {
  className?: string;
  label?: string;
  initialPiece?: string;
}

export const BookViewingButton: React.FC<BookViewingButtonProps> = ({
  className = "",
  label = "Book a viewing",
  initialPiece = "",
}) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className={
          className ||
          "border border-[#C9A961] text-[#9E7F3C] rounded-full px-5 py-2 text-xs tracking-[0.16em] uppercase hover:bg-[#241F1B] hover:text-[#FBF7F0] hover:border-[#241F1B] transition-all whitespace-nowrap"
        }
      >
        {label}
      </button>

      <BookViewingDialog
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        initialPiece={initialPiece}
      />
    </>
  );
};
