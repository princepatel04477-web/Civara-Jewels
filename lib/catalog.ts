import { PricingProduct } from "./pricing/compute";

export interface Product {
  id: string;
  name: string;
  category: string;
  categoryName: string;
  subcategory?: string;
  metalSlug?: string;
  puritySlug?: string;
  stoneSlug?: string;
  occasionSlug?: string;
  netWeightG?: number;
  grossWeightG?: number;
  wastagePercent?: number;
  pricing?: PricingProduct;
  priceINR: number;
  description: string;
  metalOptions: string[];
  sizeType: "ring" | "chain" | "wrist" | "none";
  sizeOptions?: string[];
  stoneType: string;
  tagline: string;
  imagePlaceholder: string;
  mainImage?: string;
  altImage?: string;
  thumbnails?: string[];
  hallmark?: string;
  details: {
    materials: string;
    craft: string;
    care: string;
  };
}

export interface CollectionInfo {
  slug: string;
  name: string;
  tagline: string;
  description: string;
  count: number;
  heroPlaceholder: string;
  coverImage?: string;
  mobileCoverImage?: string;
}

export interface JournalArticle {
  slug: string;
  title: string;
  subtitle: string;
  category: string;
  readTime: string;
  date: string;
  excerpt: string;
  author: string;
  content: string[];
  pullQuote: string;
  imagePlaceholder: string;
  image?: string;
  featured?: boolean;
  tags?: string[];
  relatedProductSlug?: string;
}

export const STANDARD_RING_SIZES = [
  "3", "3.5", "4", "4.5", "5", "5.5", "6", "6.5", "7", "7.5",
  "8", "8.5", "9", "9.5", "10", "10.5", "11", "11.5", "12", "12.5",
  "13", "13.5", "14", "14.5", "15"
];

export const STANDARD_METAL_OPTIONS = [
  "18K Yellow Gold",
  "18K White Gold",
  "18K Rose Gold",
  "16K Yellow Gold",
  "16K White Gold",
  "16K Rose Gold",
  "14K Yellow Gold",
  "14K White Gold",
  "14K Rose Gold",
  "10K Yellow Gold",
  "10K White Gold",
  "10K Rose Gold",
];

export class Catalog {
  static collections: Record<string, CollectionInfo> = {
    rings: {
      slug: "rings",
      name: "Rings",
      tagline: "The Solitaire & Band Edit",
      description: "Hand-set solitaires, sculpted gold bands, and stacking rings designed to catch the room rather than the camera.",
      count: 64,
      heroPlaceholder: "Luxury gold & solitaire rings collection banner",
      coverImage: "/images/home-cc/Rings-cc.png",
      mobileCoverImage: "/images/home-m-cc/Rings-m.png",
    },
    necklaces: {
      slug: "necklaces",
      name: "Necklaces",
      tagline: "The Choker & Chain Edit",
      description: "Delicate 18k gold chains, diamond tennis necklaces, and fluid collar pieces that lie weightlessly along the collarbone.",
      count: 48,
      heroPlaceholder: "High jewellery diamond necklace on bust",
      coverImage: "/images/home-cc/Necklaces-cc.png",
      mobileCoverImage: "/images/home-m-cc/Necklaces-m.png",
    },
    earrings: {
      slug: "earrings",
      name: "Earrings",
      tagline: "The Drop & Hoop Edit",
      description: "Sculptural gold hoops, baroque pearl drops, and diamond studs designed with perfect poise and balance.",
      count: 52,
      heroPlaceholder: "Artisanal gold & diamond earrings pair",
      coverImage: "/images/home-cc/Earrings-cc.png",
      mobileCoverImage: "/images/home-m-cc/earrings-m.png",
    },
    bracelets: {
      slug: "bracelets",
      name: "Bracelets",
      tagline: "The Bangle & Cuff Edit",
      description: "Engineered gold bangles, flexible diamond tennis bracelets, and textured open cuffs tailored to the wrist.",
      count: 31,
      heroPlaceholder: "Gold bangles and cuffs stack",
      coverImage: "/images/home-cc/Bracelets-cc.png",
      mobileCoverImage: "/images/home-m-cc/bracelets-m.png",
    },
    bridal: {
      slug: "bridal",
      name: "Bridal",
      tagline: "The Heritage & Ceremony Edit",
      description: "Uncompromised bridal sets, ceremonial necklaces, and bespoke wedding bands handcrafted in hallmarked gold and certified diamonds.",
      count: 27,
      heroPlaceholder: "Grand bridal jewellery set render",
      coverImage: "/images/home-m-cc/bridal-m.png",
      mobileCoverImage: "/images/home-m-cc/bridal-m.png",
    },
    pendants: {
      slug: "pendants",
      name: "Pendants",
      tagline: "The Talisman & Locket Edit",
      description: "Intimate pendants, constellation motifs, and solitary drops suspended on fine Italian gold chains.",
      count: 39,
      heroPlaceholder: "Gold diamond pendant close up",
      coverImage: "/images/home-cc/Pendants=cc.png",
      mobileCoverImage: "/images/home-m-cc/pendants-m.png",
    },
  };

  static products: Product[] = [
    {
      id: "aurelia-pave-solitaire-diamond-ring",
      name: "Aurelia Pavé Solitaire Diamond Ring",
      category: "rings",
      categoryName: "Rings",
      priceINR: 185000,
      tagline: "A radiant solitaire perched above a delicate micropavé diamond band.",
      description: "Handcrafted in luminous gold, this exquisite ring features a brilliant center diamond secured in an elevated four-prong basket, beautifully enhanced by shimmering French micropavé diamonds along the shank. Designed with timeless elegance and meticulous craftsmanship, it serves as a stunning engagement ring or refined luxury statement.",
      metalOptions: STANDARD_METAL_OPTIONS,
      sizeType: "ring",
      sizeOptions: STANDARD_RING_SIZES,
      stoneType: "Natural Diamond",
      netWeightG: 3.40,
      hallmark: "BIS Hallmarked (750 / 667 / 585 / 417)",
      imagePlaceholder: "Aurelia Pavé Solitaire Diamond Ring — hero view",
      mainImage: "/images/products/aurelia/aurelia-1.jpg",
      altImage: "/images/products/aurelia/aurelia-2.jpg",
      thumbnails: [
        "/images/products/aurelia/aurelia-1.jpg",
        "/images/products/aurelia/aurelia-2.jpg",
        "/images/products/aurelia/aurelia-3.jpg",
        "/images/products/aurelia/aurelia-4.jpg",
        "/images/products/aurelia/aurelia-5.jpg",
        "/images/products/aurelia/aurelia-6.jpg"
      ],
      details: {
        materials: "Handcrafted in hallmarked gold with 3.40g net metal weight. Features a 1.25 CT VS1 / G-H brilliant diamond center stone with French micropavé diamond accents.",
        craft: "Individually set by a master lapidary artisan over 2–3 weeks. Includes complimentary insured shipping across India.",
        care: "Complimentary annual inspection, prong tightening, ultrasonic cleaning, and one complimentary resizing within the first year."
      }
    },
    {
      id: "elara-solitaire",
      name: "Elara Solitaire Ring",
      category: "rings",
      categoryName: "Rings",
      priceINR: 84500,
      tagline: "The Solitaire Edit",
      description: "A single certified stone, hand-set in recycled hallmarked gold. The Elara is cut to catch the room rather than the camera — a quiet claw setting that lets light do the work.",
      metalOptions: STANDARD_METAL_OPTIONS,
      sizeType: "ring",
      sizeOptions: STANDARD_RING_SIZES,
      stoneType: "Natural Diamond",
      imagePlaceholder: "Elara solitaire — hero shot",
      mainImage: "/images/elara-solitaire-main.jpg",
      altImage: "/images/home-cc/Rings-cc.png",
      thumbnails: [
        "/images/elara-solitaire-main.jpg",
        "/images/home-cc/Rings-cc.png",
        "/images/home-m-cc/Rings-m.png",
        "/images/vela-pendant.jpg"
      ],
      details: {
        materials: "Recycled hallmarked gold. Centre stone certified by GIA/IGI, ethically sourced. Ships with certificate of authenticity.",
        craft: "Hand-finished to order by a single master goldsmith over 2–3 weeks. Complimentary insured delivery across India.",
        care: "Complimentary lifetime cleaning and inspection. One free resizing within the first year.",
      },
    },
    {
      id: "nira-stacking-band",
      name: "Nira Stacking Band",
      category: "rings",
      categoryName: "Rings",
      priceINR: 38400,
      tagline: "The Sculpted Band Edit",
      description: "A solid gold band featuring a gentle wave texture inspired by water ripples. Designed for solo wear or effortless stacking.",
      metalOptions: STANDARD_METAL_OPTIONS,
      sizeType: "ring",
      sizeOptions: STANDARD_RING_SIZES,
      stoneType: "Gold Only",
      imagePlaceholder: "Nira sculpted stacking band",
      mainImage: "/images/home-cc/Rings-cc.png",
      altImage: "/images/home-m-cc/Rings-m.png",
      thumbnails: ["/images/home-cc/Rings-cc.png", "/images/home-m-cc/Rings-m.png"],
      details: {
        materials: "Solid hallmarked gold with satined interior for comfort.",
        craft: "Crafted in 10 business days by our master bench goldsmiths.",
        care: "Resistant to daily wear; polish lightly with a soft chamois cloth.",
      },
    },
    {
      id: "aethel-emerald-ring",
      name: "Aethel Emerald Cut Solitaire",
      category: "rings",
      categoryName: "Rings",
      priceINR: 112000,
      tagline: "The High Solitaire Edit",
      description: "An architectonic emerald-cut diamond in a bezel setting. Bold yet understated geometry in fine gold.",
      metalOptions: STANDARD_METAL_OPTIONS,
      sizeType: "ring",
      sizeOptions: STANDARD_RING_SIZES,
      stoneType: "Natural Emerald Cut Diamond",
      imagePlaceholder: "Aethel emerald cut ring",
      mainImage: "/images/home-cc/Rings-cc.png",
      altImage: "/images/elara-solitaire-main.jpg",
      thumbnails: ["/images/home-cc/Rings-cc.png", "/images/elara-solitaire-main.jpg"],
      details: {
        materials: "Hallmarked gold with 1.2ct VVS GIA certified emerald cut diamond.",
        craft: "Custom claw-less bezel setting requiring 3 weeks of master lapidary work.",
        care: "Lifetime warrantied against stone movement; free annual checkup.",
      },
    },
    {
      id: "celeste-diamond-tennis-necklace",
      name: "Celeste Diamond Tennis Necklace",
      category: "necklaces",
      categoryName: "Necklaces",
      priceINR: 195000,
      tagline: "The Riviera Edit",
      description: "A continuous line of 84 claw-set brilliant diamonds floating seamlessly along the collarbone.",
      metalOptions: STANDARD_METAL_OPTIONS,
      sizeType: "chain",
      sizeOptions: ["16 inch", "18 inch"],
      stoneType: "Natural Round Diamonds",
      imagePlaceholder: "Celeste diamond tennis necklace on collarbone",
      mainImage: "/images/home-cc/Necklaces-cc.png",
      altImage: "/images/home-m-cc/Necklaces-m.png",
      thumbnails: ["/images/home-cc/Necklaces-cc.png", "/images/home-m-cc/Necklaces-m.png"],
      details: {
        materials: "Hallmarked gold with 4.5ct total weight certified diamonds.",
        craft: "Articulated link assembly for maximum flexibility and liquid drape.",
        care: "Store flat in velvet-lined box; clean with soft brush and warm water.",
      },
    },
    {
      id: "lyra-gold-choker",
      name: "Lyra Sculptural Gold Collar",
      category: "necklaces",
      categoryName: "Necklaces",
      priceINR: 128500,
      tagline: "The Statement Edit",
      description: "A hand-hammered gold collar choker that catches ambient light with soft luster. Fluid spring hinge opening.",
      metalOptions: STANDARD_METAL_OPTIONS,
      sizeType: "none",
      stoneType: "Solid Gold",
      imagePlaceholder: "Lyra gold collar choker on bust",
      mainImage: "/images/home-cc/Necklaces-cc.png",
      altImage: "/images/home-m-cc/Necklaces-m.png",
      thumbnails: ["/images/home-cc/Necklaces-cc.png", "/images/home-m-cc/Necklaces-m.png"],
      details: {
        materials: "Solid hallmarked gold, hand-hammered finish.",
        craft: "Custom formed to ergonomic contours over 18 hours of benchwork.",
        care: "Wipe with gold polishing cloth after wearing.",
      },
    },
    {
      id: "ora-pearl-drops",
      name: "Ora Pearl & Diamond Drops",
      category: "earrings",
      categoryName: "Earrings",
      priceINR: 32900,
      tagline: "The Pearl Edit",
      description: "Luminous Australian South Sea pearls suspended from delicate gold diamond studs. Designed to sway gently with movement.",
      metalOptions: STANDARD_METAL_OPTIONS,
      sizeType: "none",
      stoneType: "South Sea Pearl & Natural Diamonds",
      imagePlaceholder: "Ora pearl drop earrings pair",
      mainImage: "/images/home-cc/Earrings-cc.png",
      altImage: "/images/home-m-cc/earrings-m.png",
      thumbnails: ["/images/home-cc/Earrings-cc.png", "/images/home-m-cc/earrings-m.png"],
      details: {
        materials: "Hand-selected 10mm South Sea pearls and hallmarked gold.",
        craft: "Selected for flawless luster and matching symmetry.",
        care: "Apply perfume and hairspray before putting on pearl earrings.",
      },
    },
    {
      id: "solene-gold-hoops",
      name: "Solene Sculptural Hoops",
      category: "earrings",
      categoryName: "Earrings",
      priceINR: 42500,
      tagline: "The Daily Luxe Edit",
      description: "Substantial hollow-core gold hoops featuring a gentle oval contour. Ultra-lightweight for all-day elegance.",
      metalOptions: STANDARD_METAL_OPTIONS,
      sizeType: "none",
      stoneType: "Solid Gold",
      imagePlaceholder: "Solene sculptural gold hoops",
      mainImage: "/images/home-cc/Earrings-cc.png",
      altImage: "/images/home-m-cc/earrings-m.png",
      thumbnails: ["/images/home-cc/Earrings-cc.png", "/images/home-m-cc/earrings-m.png"],
      details: {
        materials: "Hallmarked gold with secure click-latch closure.",
        craft: "Precision tubing technology ensures featherlight comfort.",
        care: "Store in cloth pouch to avoid friction marks.",
      },
    },
    {
      id: "sena-gold-bangle",
      name: "Sena Gold Hinged Bangle",
      category: "bracelets",
      categoryName: "Bracelets",
      priceINR: 58700,
      tagline: "The Architectural Bangle",
      description: "A clean, oval-profile bangle engineered in solid gold with a seamless hidden push-clasp and double safety latch.",
      metalOptions: STANDARD_METAL_OPTIONS,
      sizeType: "wrist",
      sizeOptions: ["Small (6.0 in)", "Medium (6.5 in)", "Large (7.0 in)"],
      stoneType: "Solid Gold",
      imagePlaceholder: "Sena gold bangle on wrist",
      mainImage: "/images/home-cc/Bracelets-cc.png",
      altImage: "/images/home-m-cc/bracelets-m.png",
      thumbnails: ["/images/home-cc/Bracelets-cc.png", "/images/home-m-cc/bracelets-m.png"],
      details: {
        materials: "Recycled hallmarked gold with precision internal safety spring.",
        craft: "Hand-buffed to mirror finish by Senior Atelier Craftsmen.",
        care: "Clean with mild soap solution; avoid exposure to chlorine pools.",
      },
    },
    {
      id: "kaia-diamond-cuff",
      name: "Kaia Open Diamond Cuff",
      category: "bracelets",
      categoryName: "Bracelets",
      priceINR: 96000,
      tagline: "The Open Cuff Edit",
      description: "An open cuff terminating in two radiant pear-cut diamonds set in opposing directions. Modern grace on the wrist.",
      metalOptions: STANDARD_METAL_OPTIONS,
      sizeType: "wrist",
      sizeOptions: ["Adjustable Standard"],
      stoneType: "Pear Cut Diamonds",
      imagePlaceholder: "Kaia open diamond cuff bracelet",
      mainImage: "/images/home-cc/Bracelets-cc.png",
      altImage: "/images/home-m-cc/bracelets-m.png",
      thumbnails: ["/images/home-cc/Bracelets-cc.png", "/images/home-m-cc/bracelets-m.png"],
      details: {
        materials: "Fine gold with two 0.5ct pear cut certified diamonds.",
        craft: "Tempered gold wire core provides flexible memory fit.",
        care: "Store separately to prevent diamond edges touching other pieces.",
      },
    },
    {
      id: "aanya-bridal-choker-set",
      name: "Aanya Royal Heritage Bridal Set",
      category: "bridal",
      categoryName: "Bridal",
      priceINR: 485000,
      tagline: "The Grand Ceremony Edit",
      description: "A monumental 18k gold bridal necklace paired with chandelier earrings, featuring uncut diamonds and hand-strung pearl drops.",
      metalOptions: ["18K Yellow Gold / Kundan Finish", "18K Yellow Gold", "14K Yellow Gold"],
      sizeType: "none",
      stoneType: "Certified Diamonds & Uncut Polki",
      imagePlaceholder: "Aanya royal bridal necklace set on mannequin",
      mainImage: "/images/home-cc/bridal-cc.png",
      altImage: "/images/home-m-cc/bridal-m.png",
      thumbnails: ["/images/home-cc/bridal-cc.png", "/images/home-m-cc/bridal-m.png"],
      details: {
        materials: "Hallmarked gold, certified diamonds, and AAA grade cultured pearls.",
        craft: "Over 120 hours of master artisan handiwork in our royal bridal atelier.",
        care: "Ships with custom mahogany presentation box and lifetime maintenance certificate.",
      },
    },
    {
      id: "meera-bridal-solitaire-duo",
      name: "Meera Solitaire & Matching Band Set",
      category: "bridal",
      categoryName: "Bridal",
      priceINR: 145000,
      tagline: "The Engagement & Wedding Duo",
      description: "A perfectly flush-fitting set comprising an oval solitaire engagement ring and a pavé diamond wedding band.",
      metalOptions: STANDARD_METAL_OPTIONS,
      sizeType: "ring",
      sizeOptions: STANDARD_RING_SIZES,
      stoneType: "Oval Diamond & Micro Pavé",
      imagePlaceholder: "Meera bridal ring duo set",
      mainImage: "/images/home-cc/bridal-cc.png",
      altImage: "/images/home-cc/Rings-cc.png",
      thumbnails: ["/images/home-cc/bridal-cc.png", "/images/home-cc/Rings-cc.png"],
      details: {
        materials: "Fine gold with 1.0ct oval center diamond and 0.3ct pavé accent diamonds.",
        craft: "3D micro-engineered interlocking silhouette for seamless daily wear.",
        care: "Includes complimentary ring inspection and re-polishing twice yearly.",
      },
    },
    {
      id: "vela-diamond-pendant",
      name: "Vela Diamond Pendant",
      category: "pendants",
      categoryName: "Pendants",
      priceINR: 46200,
      tagline: "The Solitary Pendant Edit",
      description: "A single round diamond suspended in a geometric gold cage that allows 360-degree light entry. Includes adjustable trace chain.",
      metalOptions: STANDARD_METAL_OPTIONS,
      sizeType: "chain",
      sizeOptions: ["16 inch", "18 inch", "20 inch"],
      stoneType: "Natural Round Diamond",
      imagePlaceholder: "Vela diamond pendant on chain",
      mainImage: "/images/vela-pendant.jpg",
      altImage: "/images/home-cc/Pendants=cc.png",
      thumbnails: ["/images/vela-pendant.jpg", "/images/home-cc/Pendants=cc.png", "/images/home-m-cc/pendants-m.png"],
      details: {
        materials: "Hallmarked gold and certified 0.35ct GIA diamond.",
        craft: "Custom four-claw basket engineered for maximum sparkle.",
        care: "Clean periodically with warm water and lint-free microfiber cloth.",
      },
    },
    {
      id: "aster-constellation-locket",
      name: "Aster Diamond Constellation Locket",
      category: "pendants",
      categoryName: "Pendants",
      priceINR: 62000,
      tagline: "The Memory Locket Edit",
      description: "An oval gold locket engraved with star motifs set with tiny brilliant diamonds. Opens to store two cherished photographs.",
      metalOptions: STANDARD_METAL_OPTIONS,
      sizeType: "chain",
      sizeOptions: ["18 inch", "20 inch"],
      stoneType: "Brilliant Micro Diamonds",
      imagePlaceholder: "Aster constellation locket detail",
      mainImage: "/images/home-cc/Pendants=cc.png",
      altImage: "/images/home-m-cc/pendants-m.png",
      thumbnails: ["/images/home-cc/Pendants=cc.png", "/images/home-m-cc/pendants-m.png"],
      details: {
        materials: "Hallmarked gold with snap-hinge enclosure.",
        craft: "Includes photo-sizing template and custom fitting service.",
        care: "Keep inner photo chamber dry and free of liquids.",
      },
    },
  ];

  static articles: JournalArticle[] = [
    {
      slug: "founders-note-why-quiet-luxury",
      title: "Founder's Note: Why Quiet Luxury",
      subtitle: "On stripping away spectacle to let pure gold and light speak.",
      category: "Atelier Philosophy",
      readTime: "5 min read",
      date: "August 2026",
      author: "Founder & Creative Director",
      featured: true,
      image: "/images/atelier/artisan-bench.png",
      imagePlaceholder: "Founder bench sketch and gold alloy assay",
      tags: ["Philosophy", "Quiet Luxury", "Metallurgy", "Surat Atelier"],
      relatedProductSlug: "elara-solitaire",
      excerpt: "When fine jewellery stops shouting for attention across the room, an intimate relationship begins between the jewel and the skin that wears it.",
      pullQuote: "Quiet luxury is not minimalism — it is the unyielding conviction that when material and craft are flawless, no excess ornament is required.",
      content: [
        "In a market crowded with oversized logos, exaggerated prong baskets, and synthetic urgency, fine jewellery has often traded timelessness for spectacle. We established Civara Jewels on a counter-intuitive premise: that the most powerful heirlooms are those crafted with supreme restraint.",
        "A solitaire ring resting on the hand is not meant to broadcast wealth to strangers across a restaurant; it is designed to catch ambient room light at dusk, to bring personal calm to the wearer during a quiet moment at a desk, and to sit flush and weightless against the finger for fifty years.",
        "Our devotion to quiet luxury begins at the metallurgical level. Rather than using commercial yellow gold alloys that can appear brassy or harsh under direct daylight, we assay our 18-karat recycled gold with exact fractions of silver and copper. The resulting hue is a luminous honey tone that flatters olive and warm skin tones effortlessly.",
        "Similarly, in our lapidary stone curation, we refuse to sacrifice optical light return for nominal carat weight. A stone must possess internal life. When our master goldsmiths set a solitaire, they reduce claw mass to the absolute structural minimum, permitting photons to flood the pavilion from all 360 degrees.",
        "To own a Civara creation is to know that every milligram of precious metal is hallmarked BIS 750, every diamond is conflict-free and certified by GIA or IGI, and no middleman was paid to amplify artificial prestige. We make to order, quietly and thoroughly, for those who measure luxury by permanence rather than noise."
      ]
    },
    {
      slug: "the-making-of-an-elara",
      title: "The Making of an Elara: From Molten Bullion to Solitaire",
      subtitle: "A step-by-step master goldsmith photo essay from molten gold to finished solitaire.",
      category: "Craft & Process",
      readTime: "7 min read",
      date: "July 2026",
      author: "Master Bench Goldsmith",
      featured: false,
      image: "/images/elara-solitaire-main.jpg",
      imagePlaceholder: "Macro photograph of Elara claw setting under microscope",
      tags: ["Goldsmithing", "Micro-Lapidary", "Solitaire", "BIS 750"],
      relatedProductSlug: "elara-solitaire",
      excerpt: "Behind the fluid silhouette of the Elara Solitaire lies 18 hours of micro-lapidary benchwork, zero-porosity casting, and microscopic claw alignment.",
      pullQuote: "Every micron of gold removed during the polishing wheel must reveal the natural fire of the diamond, never compete with it.",
      content: [
        "The journey of an Elara Solitaire begins with pure bullion grains of RJC-certified recycled 24-karat gold, copper, and fine silver, melted in a ceramic crucible at 1,064 degrees Celsius to forge our proprietary 18-karat alloy ingot.",
        "The alloy is drawn into an ergonomic ring profile through hardened steel rollers, ensuring internal grain density and complete elimination of microscopic casting porosity.",
        "Using hand-held gravers under 20x stereoscopic magnification, our master setter carves the four delicate talon claws that cradle the certified centre stone.",
        "The diamond is positioned with mathematical precision, ensuring the table facet sits exactly parallel to the finger surface for unobstructed light entry and return.",
        "The interior shank is gently comfort-curved and buffed with natural vegetable rouge compound, yielding an ultra-smooth finish that feels like silk against the finger.",
        "Finally, the piece receives its official BIS 750 hallmark laser inscription in Surat and undergoes full ultrasonic cleansing before resting in its custom presentation box."
      ]
    },
    {
      slug: "how-to-inherit-jewellery",
      title: "How to Inherit Jewellery: Custody, Remodelling & Legacy",
      subtitle: "A practical and emotional guide to caring for ancestral gold and family stones.",
      category: "Heirloom & Legacy",
      readTime: "8 min read",
      date: "June 2026",
      author: "Senior Atelier Curator",
      featured: false,
      image: "/images/bespoke/bespoke-step-1.png",
      imagePlaceholder: "Antique gold heirloom alongside modern bespoke sketch",
      tags: ["Ancestral Gold", "Remodelling", "Family Heirlooms", "Custody"],
      relatedProductSlug: "nira-stacking-band",
      excerpt: "Inheriting family jewellery is an emotional inheritance. Learn how to evaluate antique hallmarks, safely reset vintage diamonds, and preserve generational memory.",
      pullQuote: "An heirloom is never truly owned; you merely hold custody of its gold and fire for the generation that follows.",
      content: [
        "Receiving ancestral jewellery is one of the most intimate moments in a family's history. Yet many modern heirs find themselves inheriting heavy, fragile, or dated pieces that remain locked in bank vaults rather than worn in daily life.",
        "The first step in respectful heirloom custody is a thorough gemmological and structural condition audit. Inspect the claws for thinning metal, check old European cut diamonds for girdle chipping, and verify ancestral purity stamps.",
        "When an inherited setting no longer fits your daily aesthetic, ethical remodelling offers a seamless bridge between heritage and modern wear. At Civara, we specialize in carefully unsetting ancestral stones, assaying the family gold into pure bullion, and recasting it into contemporary solitaires and stacking bands.",
        "By preserving the original stone's provenance while adapting the silhouette to contemporary ergonomics, the memory of previous custodians stays alive on your hand every single day.",
        "Always keep written documentation of provenance, insurance certificates, and laboratory grading reports safely catalogued alongside your jewellery collection."
      ]
    },
    {
      slug: "the-diamond-light-equation",
      title: "The Diamond Light Equation: Why Table Spread Lies and Pavilion Angles Rule",
      subtitle: "Deconstructing optical physics, light leaks, and the true geometry of natural diamond fire.",
      category: "Gemmology & 4Cs",
      readTime: "6 min read",
      date: "May 2026",
      author: "Lead Gemmologist, FGA",
      featured: false,
      image: "/images/collections-portfolio/Rings-Collection-Cover.png",
      imagePlaceholder: "Diamond ray-tracing diagram and scintillation facet model",
      tags: ["Gemmology", "Diamond Cut", "Pavilion Physics", "GIA Standards"],
      relatedProductSlug: "aurelia-emerald-ring",
      excerpt: "Many diamond buyers focus strictly on carat weight, unaware that poorly proportioned pavilions cause light to leak out the bottom rather than bounce back into the eye.",
      pullQuote: "A smaller diamond cut to perfect 40.8-degree pavilion angles will invariably outshine a larger, shallow-cut stone across any candlelit room.",
      content: [
        "In commercial diamond grading, carat weight is the easiest metric to price, but the most misleading indicator of visual beauty. A heavy diamond with a shallow pavilion simply acts like a window, allowing light to pass straight through without returning brilliance to your eyes.",
        "Total Internal Reflection is the optical engine of a great solitaire. When a light ray strikes the crown facets, it must refract at precisely calculated angles, reflect off the opposite pavilion facet, and return upward through the table with vivid dispersion into rainbow spectral fire.",
        "At Civara, we reject stones with steep crown angles or excessive pavilion depth, selecting only stones whose optical proportions fall within the tightest tolerances of the Tolkowsky ideal cut formula.",
        "Our gemmologists individually inspect each certified stone under polarized light filters to ensure exceptional crystal strain transparency, zero haziness, and breathtaking scintillation in natural daylight."
      ]
    },
    {
      slug: "the-surat-goldsmithing-tradition",
      title: "The Surat Atelier Heritage: 500 Years of Precision Benchwork",
      subtitle: "Inside the world capital of diamond cutting and bespoke heirloom metalcraft.",
      category: "Craft & Process",
      readTime: "9 min read",
      date: "April 2026",
      author: "Atelier Historian",
      featured: false,
      image: "/images/artisan-bench.jpg",
      imagePlaceholder: "Surat artisan bench with traditional hand tools and modern microscopes",
      tags: ["Surat", "Diamond Capital", "Heritage", "Artisan Bench"],
      relatedProductSlug: "celeste-diamond-tennis-necklace",
      excerpt: "Over 90% of the world's diamonds are cut and polished in Surat. Explore how multi-generational artisans blend ancient lapidary wisdom with modern microscopic precision.",
      pullQuote: "In Surat, diamond setting is not an industrial trade — it is a sacred lineage of hand-eye memory passed from father to daughter across centuries.",
      content: [
        "Surat's relationship with precious stones dates back half a millennium to the Mughal maritime trade on the banks of the Tapi River. Today, the city stands as the undisputed global capital of diamond cutting, shaping the vast majority of natural gemstones on Earth.",
        "Within Civara's private atelier suites in Surat, our bench masters work with tools that bridge eras: traditional hardened-steel burrs and brass bezel pushers rest beside 40x Leica stereo microscopes and fiber-laser welders.",
        "Each jewel is created without production-line rush. A single master goldsmith is entrusted with a piece from initial ingot rolling to the final hand-stamped hallmark, ensuring unbroken artistic accountability and structural integrity.",
        "This intimate proximity to the world's finest diamond cutters allows Civara to source stones directly at the lapidary source, eliminating intermediaries and investing the value directly into superior gold weight and artisanal finishing."
      ]
    },
    {
      slug: "bespoke-reimagining-ancestral-heirlooms",
      title: "Bespoke Reimagining: Transforming a 1940s Necklace into Everyday Modern Rings",
      subtitle: "A real atelier case study in unsetting family diamonds and casting new lifelong silhouettes.",
      category: "Bespoke Stories",
      readTime: "6 min read",
      date: "March 2026",
      author: "Head of Bespoke Design",
      featured: false,
      image: "/images/bespoke/bespoke-sketch.png",
      imagePlaceholder: "Bespoke gouache illustration alongside finished modern gold rings",
      tags: ["Bespoke", "Case Study", "Restoration", "Custom Atelier"],
      relatedProductSlug: "aethel-emerald-ring",
      excerpt: "When client Priya inherited an unworn 1940s floral necklace, our bespoke atelier extracted 32 Old European cut diamonds and forged three contemporary stacking bands.",
      pullQuote: "The greatest tribute to ancestral jewellery is not locking it in safe deposit, but wearing its gold and memories every single day.",
      content: [
        "When our client visited our Surat atelier with her grandmother's 1940s platinum and yellow gold floral collar, the piece had spent nearly three decades in a bank locker. While sentimentally invaluable, its rigid construction made it impossible to style with modern tailored wardrobes.",
        "Our bespoke team began with a comprehensive non-destructive mapping of all 32 Old European cut diamonds, measuring their unique cushion-like facet patterns and warm candlelight glow.",
        "In collaboration with the client, we sketched three distinct creations: a central architectural bezel ring for daily wear, and two nesting wave bands to be gifted to her daughters on their wedding days.",
        "The ancestral gold was refined and re-alloyed into 18K honey gold, casting new contemporary silhouettes while preserving every single grain of family lineage.",
        "The resulting trio of rings turned an unworn relic into three living heirlooms that are now worn across two generations every single day."
      ]
    }
  ];

  static getCollection(slug: string): CollectionInfo | undefined {
    return this.collections[slug.toLowerCase()];
  }

  static getProductsByCategory(categorySlug: string): Product[] {
    // Try reading from SQLite DB if available
    try {
      if (typeof window === "undefined") {
        const { ProductRepo } = require("./db/repo/products");
        const { CollectionRepo } = require("./db/repo/collections");
        const collection = CollectionRepo.getCollectionBySlug(categorySlug);
        if (collection) {
          const { products } = ProductRepo.listProducts({
            collectionId: collection.id,
            published: 1,
          });
          if (products && products.length > 0) {
            return products
              .map((p: any) => this.mapDbProductToProduct(p))
              .filter((p: any) => Boolean(p.mainImage));
          }
        }
      }
    } catch {
      // Fallback to static catalog
    }

    return this.products.filter(
      (p) => p.category.toLowerCase() === categorySlug.toLowerCase()
    );
  }

  static getProductById(id: string): Product | undefined {
    // Try reading from SQLite DB if available
    try {
      if (typeof window === "undefined") {
        const { ProductRepo } = require("./db/repo/products");
        const numericId = parseInt(id, 10);
        const dbProduct = !isNaN(numericId)
          ? ProductRepo.getProductById(numericId)
          : ProductRepo.getProductBySlug(id);

        if (dbProduct && dbProduct.is_published === 1) {
          const mapped = this.mapDbProductToProduct(dbProduct);
          if (mapped.mainImage) return mapped;
        }
      }
    } catch {
      // Fallback
    }

    return this.products.find((p) => p.id.toLowerCase() === id.toLowerCase());
  }

  static getFeaturedProducts(minCount = 4): Product[] {
    try {
      if (typeof window === "undefined") {
        const { ProductRepo } = require("./db/repo/products");
        const { products } = ProductRepo.listProducts({
          featured: 1,
          published: 1,
        });
        if (products && products.length >= minCount) {
          const mapped = products
            .map((p: any) => this.mapDbProductToProduct(p))
            .filter((p: any) => Boolean(p.mainImage));
          if (mapped.length >= minCount) return mapped.slice(0, minCount);
        }
      }
    } catch {
      // Fallback
    }

    const valid = this.products.filter(
      (p) => Boolean(p.mainImage) && (p.mainImage?.startsWith("/") || p.mainImage?.startsWith("http"))
    );

    if (process.env.NODE_ENV === "development" && valid.length < minCount) {
      console.warn(
        `[Catalog Warning] Featured products count (${valid.length}) is below required minCount (${minCount}). Section will be gated.`
      );
    }

    return valid.length >= minCount ? valid.slice(0, minCount) : [];
  }

  static mapDbProductToProduct(p: any): Product {
    let sizes = ["10", "11", "12", "13", "14", "15", "16"];
    if (p.available_sizes) {
      try {
        sizes = typeof p.available_sizes === "string" ? JSON.parse(p.available_sizes) : p.available_sizes;
      } catch {
        sizes = [p.available_sizes];
      }
    }

    const images = p.images?.map((img: any) => img.path) || [];
    const mainImg = p.primary_image || images[0] || undefined;

    return {
      id: p.slug,
      name: p.name,
      category: p.collection_slug || "rings",
      categoryName: p.collection_name || "Rings & Solitaires",
      priceINR: Math.round(p.price_inr / 100),
      tagline: p.is_featured ? "Atelier Featured Edit" : "Civara Edit",
      description: p.description || "Handcrafted in hallmarked 18k gold and certified diamonds.",
      metalOptions: [p.metal || "18k Yellow Gold"],
      sizeType: "ring",
      sizeOptions: sizes && sizes.length > 0 ? sizes : STANDARD_RING_SIZES,
      stoneType: p.diamond_carat ? `${p.diamond_carat}ct Diamond` : "Natural Diamond",
      imagePlaceholder: p.name,
      mainImage: mainImg,
      altImage: images[1] || mainImg,
      thumbnails: images.length > 0 ? images : mainImg ? [mainImg] : [],
      hallmark: "BIS 750 (18k Gold)",
      details: {
        materials: `Hallmarked ${p.metal || "18k gold"}${p.diamond_carat ? ` with ${p.diamond_carat}ct ${p.diamond_clarity || "VS1"} diamond` : ""}.`,
        craft: "Hand-finished to order by master goldsmiths in our private atelier over 2–3 weeks.",
        care: "Complimentary annual ultrasonic cleaning and lifetime claw inspection.",
      },
    };
  }

  static getRelatedProducts(currentId: string, limit = 4): Product[] {
    return this.products.filter((p) => p.id !== currentId).slice(0, limit);
  }

  static getArticleBySlug(slug: string): JournalArticle | undefined {
    return this.articles.find((a) => a.slug.toLowerCase() === slug.toLowerCase());
  }

  static searchCatalog(query: string): { products: Product[]; articles: JournalArticle[]; collections: CollectionInfo[] } {
    const q = query.toLowerCase().trim();
    if (!q) return { products: [], articles: [], collections: [] };

    const products = this.products.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.categoryName.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        p.stoneType.toLowerCase().includes(q)
    );

    const articles = this.articles.filter(
      (a) =>
        a.title.toLowerCase().includes(q) ||
        a.excerpt.toLowerCase().includes(q) ||
        a.category.toLowerCase().includes(q)
    );

    const collections = Object.values(this.collections).filter(
      (c) => c.name.toLowerCase().includes(q) || c.description.toLowerCase().includes(q)
    );

    return { products, articles, collections };
  }
}
