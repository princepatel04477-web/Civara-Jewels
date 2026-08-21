import { computePrice, MetalRates, PricingProduct, formatINR } from "../lib/pricing/compute";

console.log("=================================================");
console.log("RUNNING LIVE METAL PRICING ENGINE UNIT TESTS");
console.log("=================================================\n");

const baseRates: MetalRates = {
  gold24kPer10g: 72500, // ₹7,250 per gram
  platinumPer10g: 32000,
  silverPerKg: 86000,
  updatedAt: new Date().toISOString(),
  updatedBy: "Unit Test Harness",
};

let passed = 0;
let total = 0;

function assert(condition: boolean, testName: string, detail: string = "") {
  total++;
  if (condition) {
    passed++;
    console.log(`[PASS] Test ${total}: ${testName}`);
  } else {
    console.error(`[FAIL] Test ${total}: ${testName} - ${detail}`);
  }
}

// TEST 1: Purity Factors Test (24K, 22K, 18K, 14K, 9K)
console.log("--- 1. TESTING PURITY FACTORS ---");
const purities: Array<{ purity: 24 | 22 | 18 | 14 | 9; expectedFactor: number }> = [
  { purity: 24, expectedFactor: 0.999 },
  { purity: 22, expectedFactor: 0.916 },
  { purity: 18, expectedFactor: 0.75 },
  { purity: 14, expectedFactor: 0.585 },
  { purity: 9, expectedFactor: 0.375 },
];

purities.forEach(({ purity, expectedFactor }) => {
  const dummyProd: PricingProduct = {
    id: `test-${purity}k`,
    name: `Test Ring ${purity}K`,
    metal: "gold",
    purity,
    netWeightG: 10.0,
    grossWeightG: 10.0,
    wastagePercent: 0,
    makingCharge: { type: "flat", value: 0 },
    stones: [],
    otherCharges: 0,
    priceMode: "live",
  };
  const breakdown = computePrice(dummyProd, baseRates);
  const gramRate24k = 7250;
  const expectedGramRatePaise = Math.round(gramRate24k * expectedFactor * 100);
  assert(
    breakdown.purityFactor === expectedFactor && breakdown.metalRatePerGramPaise === expectedGramRatePaise,
    `Purity ${purity}K Factor Check`,
    `Got purityFactor=${breakdown.purityFactor}, gramRatePaise=${breakdown.metalRatePerGramPaise}`
  );
});

// TEST 2: Making Charge Types (per_gram, percent, flat)
console.log("\n--- 2. TESTING MAKING CHARGE TYPES ---");

// 2a. Per Gram Making Charge (₹1,000 / gram on 5g net = ₹5,000 making)
const perGramProd: PricingProduct = {
  id: "test-per-gram",
  name: "Per Gram Making Ring",
  metal: "gold",
  purity: 18,
  netWeightG: 5.0,
  grossWeightG: 5.0,
  wastagePercent: 0,
  makingCharge: { type: "per_gram", value: 1000 },
  stones: [],
  otherCharges: 0,
  priceMode: "live",
};
const resPerGram = computePrice(perGramProd, baseRates);
assert(resPerGram.makingValuePaise === 500000, "Per Gram Making Charge (₹1000/g on 5g)", `Got ${resPerGram.makingValuePaise}`);

// 2b. Percent Making Charge (10% on metal value)
const percentProd: PricingProduct = {
  id: "test-percent",
  name: "Percent Making Ring",
  metal: "gold",
  purity: 18,
  netWeightG: 10.0,
  grossWeightG: 10.0,
  wastagePercent: 0,
  makingCharge: { type: "percent", value: 10 },
  stones: [],
  otherCharges: 0,
  priceMode: "live",
};
const resPercent = computePrice(percentProd, baseRates);
const expectedMakingPaise = Math.round(resPercent.metalValuePaise * 0.1);
assert(resPercent.makingValuePaise === expectedMakingPaise, "Percent Making Charge (10% of metal value)", `Got ${resPercent.makingValuePaise}`);

// 2c. Flat Making Charge (₹3,500 flat)
const flatProd: PricingProduct = {
  id: "test-flat",
  name: "Flat Making Ring",
  metal: "gold",
  purity: 18,
  netWeightG: 5.0,
  grossWeightG: 5.0,
  wastagePercent: 0,
  makingCharge: { type: "flat", value: 3500 },
  stones: [],
  otherCharges: 0,
  priceMode: "live",
};
const resFlat = computePrice(flatProd, baseRates);
assert(resFlat.makingValuePaise === 350000, "Flat Making Charge (₹3500 flat)", `Got ${resFlat.makingValuePaise}`);

// TEST 3: Zero Wastage Test
console.log("\n--- 3. TESTING ZERO WASTAGE ---");
const zeroWastageProd: PricingProduct = {
  id: "test-zero-wastage",
  name: "Zero Wastage Piece",
  metal: "gold",
  purity: 18,
  netWeightG: 8.0,
  grossWeightG: 8.0,
  wastagePercent: 0,
  makingCharge: { type: "flat", value: 0 },
  stones: [],
  otherCharges: 0,
  priceMode: "live",
};
const resZeroWastage = computePrice(zeroWastageProd, baseRates);
assert(resZeroWastage.chargeableWeightG === 8.0, "Zero Wastage Chargeable Weight Equals Net Weight", `Got ${resZeroWastage.chargeableWeightG}`);

// TEST 4: Stone-Only / Pure Diamond Piece (Metal weight 0g)
console.log("\n--- 4. TESTING STONE-ONLY / ZERO METAL WEIGHT ---");
const stoneOnlyProd: PricingProduct = {
  id: "test-stone-only",
  name: "Diamond Solitaire Stone Only",
  metal: "gold",
  purity: 18,
  netWeightG: 0,
  grossWeightG: 0.2,
  wastagePercent: 0,
  makingCharge: { type: "flat", value: 0 },
  stones: [{ type: "Solitaire Diamond", shape: "Round", carat: 1.5, count: 1, flatValue: 125000, certified: true }],
  otherCharges: 0,
  priceMode: "live",
};
const resStoneOnly = computePrice(stoneOnlyProd, baseRates);
assert(
  resStoneOnly.metalValuePaise === 0 && resStoneOnly.stoneValuePaise === 12500000,
  "Stone-Only Piece Metal Value = ₹0, Stone Value = ₹1,25,000",
  `MetalPaise=${resStoneOnly.metalValuePaise}, StonePaise=${resStoneOnly.stoneValuePaise}`
);

// TEST 5: Integer Paise Arithmetic & Nearest ₹10 Half-Up Rounding Boundary
console.log("\n--- 5. TESTING INTEGER PAISE BOUNDARY & NEAREST ₹10 ROUNDING ---");
const paiseBoundaryProd: PricingProduct = {
  id: "test-paise-rounding",
  name: "Precision Paise Ring",
  metal: "gold",
  purity: 18,
  netWeightG: 4.337,
  grossWeightG: 4.5,
  wastagePercent: 6.5,
  makingCharge: { type: "per_gram", value: 1125 },
  stones: [{ type: "Micro Diamond", shape: "Round", carat: 0.23, count: 5, ratePerCarat: 42500, certified: false }],
  otherCharges: 1250,
  priceMode: "live",
};
const resPaise = computePrice(paiseBoundaryProd, baseRates);
const remainder10 = resPaise.roundedTotalINR % 10;
assert(
  Number.isInteger(resPaise.subtotalPaise) && Number.isInteger(resPaise.totalPaise) && remainder10 === 0,
  "Subtotal & Total Are Pure Integers in Paise, Rounded Total Ends in Nearest ₹10",
  `subtotalPaise=${resPaise.subtotalPaise}, totalPaise=${resPaise.totalPaise}, roundedTotalINR=${resPaise.roundedTotalINR}`
);

// TEST 6: Indian Digit Grouping Formatter
console.log("\n--- 6. TESTING INDIAN DIGIT GROUPING FORMATTER ---");
assert(formatINR(124500) === "₹1,24,500", "Format ₹1,24,500", `Got ${formatINR(124500)}`);
assert(formatINR(8450) === "₹8,450", "Format ₹8,450", `Got ${formatINR(8450)}`);
assert(formatINR(125000000) === "₹12,50,00,000", "Format ₹12,50,00,000 (12.5 Crore)", `Got ${formatINR(125000000)}`);

console.log("\n=================================================");
console.log(`TEST RESULTS: ${passed} / ${total} PASSED`);
console.log("=================================================");

if (passed === total) {
  process.exit(0);
} else {
  process.exit(1);
}
