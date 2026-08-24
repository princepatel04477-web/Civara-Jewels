export type MetalType = "gold" | "platinum" | "silver";
export type PurityType = 24 | 22 | 18 | 14 | 9 | "PT950" | "925";

export type MakingChargeType = "per_gram" | "percent" | "flat";

export interface StoneItem {
  type: string;
  shape: string;
  carat: number;
  count: number;
  ratePerCarat?: number; // INR
  flatValue?: number; // INR
  certified: boolean;
}

export interface MakingChargeConfig {
  type: MakingChargeType;
  value: number; // rate in INR per gram, percent value (e.g. 10 for 10%), or flat INR
}

export interface PricingProduct {
  id: string;
  name: string;
  metal: MetalType;
  purity: PurityType;
  netWeightG: number;
  grossWeightG: number;
  wastagePercent: number; // 0-12
  makingCharge: MakingChargeConfig;
  stones: StoneItem[];
  otherCharges: number; // INR (hallmarking, rhodium, etc.)
  priceMode: "live" | "fixed" | "on_request";
  fixedPrice?: number; // INR
}

export interface MetalRates {
  gold24kPer10g: number; // INR per 10g 24K gold (e.g., 93332)
  gold18kPer10g?: number; // INR per 10g 18K gold (e.g., 69999)
  gold14kPer10g?: number; // INR per 10g 14K gold (e.g., 55999)
  gold10kPer10g?: number; // INR per 10g 10K gold (e.g., 42999)
  platinumPer10g: number; // INR per 10g platinum (e.g., 32000)
  silverPerKg: number; // INR per 1kg silver (e.g., 26999)
  updatedAt: string; // ISO string
  updatedBy: string;
}

export interface PriceBreakdownItem {
  label: string;
  amountPaise: number;
  amountINR: number;
  formattedINR: string;
}

export interface PriceBreakdown {
  isLive: boolean;
  isOnRequest: boolean;
  isFixed: boolean;
  rateUsed: number; // rate per 10g or kg
  rateTimestamp: string;
  purityFactor: number;
  metalRatePerGramPaise: number;
  chargeableWeightG: number;
  metalValuePaise: number;
  makingValuePaise: number;
  stoneValuePaise: number;
  otherChargesPaise: number;
  subtotalPaise: number;
  gstPaise: number; // 3% flat
  totalPaise: number;
  rawTotalINR: number;
  roundedTotalINR: number;
  formattedTotalINR: string;
  breakdownItems: PriceBreakdownItem[];
}

// Indian Digit Grouping Formatter (e.g. ₹1,24,500, ₹12,50,00,000)
export function formatINR(amount: number): string {
  if (isNaN(amount) || amount === 0) return "₹0";
  const isNegative = amount < 0;
  const absAmount = Math.abs(Math.round(amount));
  const str = absAmount.toString();

  if (str.length <= 3) {
    return `${isNegative ? "-" : ""}₹${str}`;
  }

  // Indian Digit Grouping: Last 3 digits, then groups of 2 digits
  const lastThree = str.substring(str.length - 3);
  const otherDigits = str.substring(0, str.length - 3);
  const formattedOther = otherDigits.replace(/\B(?=(\d{2})+(?!\d))/g, ",");

  return `${isNegative ? "-" : ""}₹${formattedOther},${lastThree}`;
}

export const PURITY_FACTORS: Record<string, number> = {
  "24": 0.999,
  "22": 0.916,
  "18": 0.75,
  "14": 0.585,
  "9": 0.375,
  PT950: 0.95,
  "925": 0.925,
};

/**
 * Pure function to compute full price breakdown in integer paise.
 * Money Path: Integer Paise ONLY. Rounding half-up to nearest ₹10 at display boundary.
 */
export function computePrice(product: PricingProduct, rates: MetalRates): PriceBreakdown {
  if (product.priceMode === "on_request") {
    return {
      isLive: false,
      isOnRequest: true,
      isFixed: false,
      rateUsed: 0,
      rateTimestamp: rates.updatedAt,
      purityFactor: 0,
      metalRatePerGramPaise: 0,
      chargeableWeightG: 0,
      metalValuePaise: 0,
      makingValuePaise: 0,
      stoneValuePaise: 0,
      otherChargesPaise: 0,
      subtotalPaise: 0,
      gstPaise: 0,
      totalPaise: 0,
      rawTotalINR: 0,
      roundedTotalINR: 0,
      formattedTotalINR: "Price on Request",
      breakdownItems: [],
    };
  }

  if (product.priceMode === "fixed" && product.fixedPrice) {
    const fixedINR = product.fixedPrice;
    const fixedPaise = Math.round(fixedINR * 100);
    const roundedINR = Math.round(fixedINR / 10) * 10;
    return {
      isLive: false,
      isOnRequest: false,
      isFixed: true,
      rateUsed: 0,
      rateTimestamp: rates.updatedAt,
      purityFactor: 0,
      metalRatePerGramPaise: 0,
      chargeableWeightG: 0,
      metalValuePaise: 0,
      makingValuePaise: 0,
      stoneValuePaise: 0,
      otherChargesPaise: 0,
      subtotalPaise: fixedPaise,
      gstPaise: 0,
      totalPaise: fixedPaise,
      rawTotalINR: fixedINR,
      roundedTotalINR: roundedINR,
      formattedTotalINR: formatINR(roundedINR),
      breakdownItems: [
        {
          label: "Fixed Atelier Value",
          amountPaise: fixedPaise,
          amountINR: fixedINR,
          formattedINR: formatINR(fixedINR),
        },
      ],
    };
  }

  // LIVE PRICING ENGINE (INTEGER PAISE MATH)
  let metalRatePerGramPaise = 0;
  let purityFactor = PURITY_FACTORS[product.purity.toString()] || 0.75;
  let rateUsed = rates.gold24kPer10g;

  if (product.metal === "gold") {
    if (Number(product.purity) === 18 && rates.gold18kPer10g) {
      metalRatePerGramPaise = Math.round((rates.gold18kPer10g * 100) / 10);
      rateUsed = rates.gold18kPer10g;
    } else if (Number(product.purity) === 14 && rates.gold14kPer10g) {
      metalRatePerGramPaise = Math.round((rates.gold14kPer10g * 100) / 10);
      rateUsed = rates.gold14kPer10g;
    } else if (Number(product.purity) === 10 && rates.gold10kPer10g) {
      metalRatePerGramPaise = Math.round((rates.gold10kPer10g * 100) / 10);
      rateUsed = rates.gold10kPer10g;
    } else {
      const baseRatePerUnitPaise = Math.round(rates.gold24kPer10g * 100);
      const gramRate24kPaise = baseRatePerUnitPaise / 10;
      metalRatePerGramPaise = Math.round(gramRate24kPaise * purityFactor);
      rateUsed = rates.gold24kPer10g;
    }
  } else if (product.metal === "platinum") {
    const baseRatePerUnitPaise = Math.round(rates.platinumPer10g * 100);
    const gramRatePaise = baseRatePerUnitPaise / 10;
    metalRatePerGramPaise = Math.round(gramRatePaise * (PURITY_FACTORS["PT950"] || 0.95));
    rateUsed = rates.platinumPer10g;
  } else if (product.metal === "silver") {
    const baseRatePerUnitPaise = Math.round(rates.silverPerKg * 100);
    metalRatePerGramPaise = Math.round(baseRatePerUnitPaise / 1000);
    rateUsed = rates.silverPerKg;
  }

  const chargeableWeightG = product.netWeightG * (1 + product.wastagePercent / 100);
  const metalValuePaise = Math.round(metalRatePerGramPaise * chargeableWeightG);

  // Making Charge Calculation
  let makingValuePaise = 0;
  if (product.makingCharge.type === "per_gram") {
    makingValuePaise = Math.round(product.makingCharge.value * 100 * product.netWeightG);
  } else if (product.makingCharge.type === "percent") {
    makingValuePaise = Math.round((metalValuePaise * product.makingCharge.value) / 100);
  } else if (product.makingCharge.type === "flat") {
    makingValuePaise = Math.round(product.makingCharge.value * 100);
  }

  // Stone Value Calculation (Never scales with gold rate)
  let stoneValuePaise = 0;
  if (product.stones && product.stones.length > 0) {
    product.stones.forEach((stone) => {
      if (stone.flatValue) {
        stoneValuePaise += Math.round(stone.flatValue * 100);
      } else if (stone.ratePerCarat) {
        const val = stone.carat * stone.count * stone.ratePerCarat;
        stoneValuePaise += Math.round(val * 100);
      }
    });
  }

  const otherChargesPaise = Math.round(product.otherCharges * 100);

  const subtotalPaise = metalValuePaise + makingValuePaise + stoneValuePaise + otherChargesPaise;
  const gstPaise = Math.round(subtotalPaise * 0.03); // 3% GST
  const totalPaise = subtotalPaise + gstPaise;

  const rawTotalINR = totalPaise / 100;
  // Round half-up to nearest ₹10 at display boundary
  const roundedTotalINR = Math.round(rawTotalINR / 10) * 10;

  const metalValueINR = Math.round(metalValuePaise / 100);
  const makingValueINR = Math.round(makingValuePaise / 100);
  const stoneValueINR = Math.round(stoneValuePaise / 100);
  const otherChargesINR = Math.round(otherChargesPaise / 100);
  const subtotalINR = Math.round(subtotalPaise / 100);
  const gstINR = Math.round(gstPaise / 100);

  const breakdownItems: PriceBreakdownItem[] = [
    {
      label: `Net Metal Value (${product.purity} ${product.metal.toUpperCase()} · ${product.netWeightG}g net)`,
      amountPaise: metalValuePaise,
      amountINR: metalValueINR,
      formattedINR: formatINR(metalValueINR),
    },
    {
      label: `Crafting & Making Charge (${product.makingCharge.type.replace("_", " ")})`,
      amountPaise: makingValuePaise,
      amountINR: makingValueINR,
      formattedINR: formatINR(makingValueINR),
    },
    ...(stoneValuePaise > 0
      ? [
          {
            label: `Certified Stones (${product.stones.map((s) => `${s.count}x ${s.type}`).join(", ")})`,
            amountPaise: stoneValuePaise,
            amountINR: stoneValueINR,
            formattedINR: formatINR(stoneValueINR),
          },
        ]
      : []),
    ...(otherChargesPaise > 0
      ? [
          {
            label: "Hallmarking & Finishing Charges",
            amountPaise: otherChargesPaise,
            amountINR: otherChargesINR,
            formattedINR: formatINR(otherChargesINR),
          },
        ]
      : []),
    {
      label: "Subtotal",
      amountPaise: subtotalPaise,
      amountINR: subtotalINR,
      formattedINR: formatINR(subtotalINR),
    },
    {
      label: "GST (3%)",
      amountPaise: gstPaise,
      amountINR: gstINR,
      formattedINR: formatINR(gstINR),
    },
  ];

  return {
    isLive: true,
    isOnRequest: false,
    isFixed: false,
    rateUsed: rates.gold24kPer10g,
    rateTimestamp: rates.updatedAt,
    purityFactor,
    metalRatePerGramPaise,
    chargeableWeightG,
    metalValuePaise,
    makingValuePaise,
    stoneValuePaise,
    otherChargesPaise,
    subtotalPaise,
    gstPaise,
    totalPaise,
    rawTotalINR,
    roundedTotalINR,
    formattedTotalINR: formatINR(roundedTotalINR),
    breakdownItems,
  };
}
