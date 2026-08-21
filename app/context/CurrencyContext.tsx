"use client";

import React, { createContext, useContext, useState } from "react";

export type CurrencyOption = "₹ INR" | "$ USD" | "€ EUR";

interface CurrencyContextType {
  currency: CurrencyOption;
  setCurrency: (c: CurrencyOption) => void;
  formatPrice: (inr: number) => string;
}

const CurrencyContext = createContext<CurrencyContextType>({
  currency: "₹ INR",
  setCurrency: () => {},
  formatPrice: (inr) => `₹${inr.toLocaleString("en-IN")}`,
});

export const CurrencyProvider = ({ children }: { children: React.ReactNode }) => {
  const [currency, setCurrency] = useState<CurrencyOption>("₹ INR");

  const formatPrice = (inr: number): string => {
    const config = {
      "₹ INR": { symbol: "₹", rate: 1, locale: "en-IN" },
      "$ USD": { symbol: "$", rate: 1 / 84, locale: "en-US" },
      "€ EUR": { symbol: "€", rate: 1 / 91, locale: "de-DE" },
    }[currency];

    const converted = Math.round(inr * config.rate);
    return `${config.symbol}${converted.toLocaleString(config.locale)}`;
  };

  return (
    <CurrencyContext.Provider value={{ currency, setCurrency, formatPrice }}>
      {children}
    </CurrencyContext.Provider>
  );
};

export const useCurrency = () => useContext(CurrencyContext);
