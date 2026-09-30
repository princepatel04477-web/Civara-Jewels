export interface SubcategoryInfo {
  slug: string;
  displayName: string;
  singularNoun: string;
  pluralNoun: string;
  description: string;
  craftNote: string;
  sortOrder: number;
  enabled: boolean;
}

export interface HowToChooseItem {
  title: string;
  subtitle: string;
  description: string;
  spec: string;
}

export interface HowToChooseGuide {
  title: string;
  intro: string;
  items: HowToChooseItem[];
}

export interface CategoryFAQ {
  question: string;
  answer: string;
}

export interface CategoryInfo {
  slug: string;
  displayName: string;
  singularNoun: string;
  pluralNoun: string;
  editorialDescription: string;
  craftNote: string;
  heroImageSlot: string;
  coverImage?: string;
  mobileCoverImage?: string;
  sortOrder: number;
  enabled: boolean;
  subcategories: SubcategoryInfo[];
  howToChoose?: HowToChooseGuide;
  faqs: CategoryFAQ[];
  relatedCategorySlugs: string[];
}

export interface FacetOption {
  slug: string;
  label: string;
}

export interface FacetSystem {
  metals: FacetOption[];
  purities: FacetOption[];
  stones: FacetOption[];
  occasions: FacetOption[];
  sorts: FacetOption[];
}

export const FACETS: FacetSystem = {
  metals: [
    { slug: "yellow-gold", label: "Yellow Gold" },
    { slug: "white-gold", label: "White Gold" },
    { slug: "rose-gold", label: "Rose Gold" },
    { slug: "platinum", label: "Platinum" },
    { slug: "silver", label: "Sterling Silver" },
  ],
  purities: [
    { slug: "24k", label: "24K (999)" },
    { slug: "22k", label: "22K (916)" },
    { slug: "18k", label: "18K (750)" },
    { slug: "14k", label: "14K (585)" },
    { slug: "9k", label: "9K (375)" },
    { slug: "pt950", label: "PT950" },
    { slug: "925", label: "925 Silver" },
  ],
  stones: [
    { slug: "diamond", label: "Diamond" },
    { slug: "polki", label: "Polki" },
    { slug: "kundan", label: "Kundan" },
    { slug: "emerald", label: "Emerald" },
    { slug: "ruby", label: "Ruby" },
    { slug: "sapphire", label: "Sapphire" },
    { slug: "pearl", label: "South Sea Pearl" },
    { slug: "uncut", label: "Uncut Diamond" },
    { slug: "none", label: "Pure Metal Only" },
  ],
  occasions: [
    { slug: "bridal", label: "Bridal & Wedding" },
    { slug: "festive", label: "Festive & Ceremony" },
    { slug: "everyday", label: "Daily Atelier" },
    { slug: "gifting", label: "Anniversary & Gifting" },
    { slug: "ceremonial", label: "Heirloom & Heritage" },
  ],
  sorts: [
    { slug: "featured", label: "Atelier Curated" },
    { slug: "price-asc", label: "Value: Low to High" },
    { slug: "price-desc", label: "Value: High to Low" },
    { slug: "newest", label: "Latest Commissions" },
  ],
};

export const TAXONOMY: Record<string, CategoryInfo> = {
  rings: {
    slug: "rings",
    displayName: "Rings",
    singularNoun: "Ring",
    pluralNoun: "Rings",
    editorialDescription: "Hand-set solitaires, sculpted gold bands, and stacking rings engineered to catch the room rather than the camera.",
    craftNote: "A solitaire or gold band must endure daily friction without losing structural integrity. Our goldsmiths hand-forge each shank in dense 18K alloy, tension-setting every stone with hand-burnished claws for a flush, snag-free profile.",
    heroImageSlot: "Solitaire and gold band cluster on ivory pedestal",
    coverImage: "/images/home-cc/Rings-cc.png",
    mobileCoverImage: "/images/home-m-cc/Rings-m.png",
    sortOrder: 1,
    enabled: true,
    subcategories: [
      {
        slug: "engagement",
        displayName: "Engagement Rings",
        singularNoun: "Engagement Ring",
        pluralNoun: "Engagement Rings",
        description: "Architectonic solitaire rings designed for life's main commitment.",
        craftNote: "Each engagement setting is individually calculated to maximize light return beneath the pavilion while maintaining a low-profile basket.",
        sortOrder: 1,
        enabled: true,
      },
      {
        slug: "solitaire",
        displayName: "Solitaire Rings",
        singularNoun: "Solitaire Ring",
        pluralNoun: "Solitaire Rings",
        description: "Single GIA/IGI certified natural diamonds mounted in claw or bezel settings.",
        craftNote: "Minimal metal coverage allows maximum light refraction through the girdle.",
        sortOrder: 2,
        enabled: true,
      },
      {
        slug: "band",
        displayName: "Gold & Diamond Bands",
        singularNoun: "Band",
        pluralNoun: "Bands",
        description: "Sculpted 18K solid gold bands with tactile comfort-fit interior profiles.",
        craftNote: "Curved inner edges prevent pinching, hand-buffed to a mirror polish.",
        sortOrder: 3,
        enabled: true,
      },
      {
        slug: "eternity",
        displayName: "Eternity Bands",
        singularNoun: "Eternity Band",
        pluralNoun: "Eternity Bands",
        description: "Unbroken circles of matched diamonds set around the entire band.",
        craftNote: "Precision micro-pave claws ensure equal diamond exposure with zero seam line.",
        sortOrder: 4,
        enabled: true,
      },
      {
        slug: "cocktail",
        displayName: "Cocktail & Statement Rings",
        singularNoun: "Cocktail Ring",
        pluralNoun: "Cocktail Rings",
        description: "Bold sculptural rings featuring precious gemstones and polki accents.",
        craftNote: "Heavy 18K gold casting balances top-heavy gemstone cluster weight.",
        sortOrder: 5,
        enabled: true,
      },
      {
        slug: "couple-bands",
        displayName: "Couple Bands",
        singularNoun: "Couple Band",
        pluralNoun: "Couple Bands",
        description: "Harmonized wedding band pairs with complementary geometric engravings.",
        craftNote: "Hand-finished matching profiles created from the same gold melt.",
        sortOrder: 6,
        enabled: true,
      },
    ],
    howToChoose: {
      title: "Solitaire Setting & Proportion Anatomy",
      intro: "Understanding ring settings and band width balances aesthetics with lifetime durability.",
      items: [
        {
          title: "Claw vs. Bezel Setting",
          subtitle: "Light return vs. daily protection",
          description: "4-prong claws expose 85% of the stone body for maximum fire. A thin gold bezel rim encases the girdle for seamless scratch prevention.",
          spec: "Recommended: 4-Prong for 1.0ct+, Bezel for daily active wear",
        },
        {
          title: "Band Width & Shank Thickness",
          subtitle: "Comfort fit geometry",
          description: "A 1.8mm band creates an delicate slender illusion, while a 2.3mm band provides maximum structural rigidity against bending.",
          spec: "Standard width: 2.0mm comfort-fit curved interior",
        },
        {
          title: "Prong Height & Basket Clearance",
          subtitle: "Stacking alignment",
          description: "High-set baskets allow wedding bands to sit perfectly flush against the solitaire. Low-set baskets minimize snagging on textiles.",
          spec: "Basket clearance: 1.6mm elevation above band",
        },
      ],
    },
    faqs: [
      {
        question: "How do I choose the correct ring size for a surprise order?",
        answer: "We recommend measuring an existing ring that fits the target finger, or ordering our complimentary ring sizing gauge. We also provide one complimentary resizing within 12 months.",
      },
      {
        question: "Are Civara solitaire diamonds certified by independent laboratories?",
        answer: "Yes. Every solitaire diamond above 0.30 carats includes an official GIA or IGI certificate detailing its Cut, Colour, Clarity, and Carat weight.",
      },
      {
        question: "Can I customize the metal purity and stone shape?",
        answer: "Absolutely. Every ring is crafted to order in 18K yellow, white, or rose gold, or PT950 platinum, with your choice of diamond shape.",
      },
      {
        question: "How long does a made-to-order ring take to craft?",
        answer: "Hand-crafting, hallmarking, and GIA certification take 12 to 18 business days from final design approval.",
      },
    ],
    relatedCategorySlugs: ["earrings", "bracelets", "necklaces", "pendants"],
  },
  earrings: {
    slug: "earrings",
    displayName: "Earrings",
    singularNoun: "Earring",
    pluralNoun: "Earrings",
    editorialDescription: "Sculptural gold hoops, baroque pearl drops, and diamond studs designed with perfect poise and balance.",
    craftNote: "Earrings demand delicate weight distribution to prevent earlobe fatigue. Our bench jewelers hollow out interior chambers using wax casting, maintaining structural strength while reducing weight by up to 35%.",
    heroImageSlot: "Pair of diamond chandelier drops on stone slab",
    coverImage: "/images/home-cc/Earrings-cc.png",
    mobileCoverImage: "/images/home-m-cc/earrings-m.png",
    sortOrder: 2,
    enabled: true,
    subcategories: [
      {
        slug: "studs",
        displayName: "Stud Earrings",
        singularNoun: "Stud Earring",
        pluralNoun: "Stud Earrings",
        description: "Classic solitaire diamond and solid gold studs for daily elegance.",
        craftNote: "Threaded post mechanism prevents accidental loss during active wear.",
        sortOrder: 1,
        enabled: true,
      },
      {
        slug: "jhumkas",
        displayName: "Jhumkas",
        singularNoun: "Jhumka",
        pluralNoun: "Jhumkas",
        description: "Traditional bell-shaped Indian drop earrings with filigree work.",
        craftNote: "Hand-soldered gold beads produce a melodic chime with movement.",
        sortOrder: 2,
        enabled: true,
      },
      {
        slug: "drops",
        displayName: "Drop & Dangle Earrings",
        singularNoun: "Drop Earring",
        pluralNoun: "Drop Earrings",
        description: "Elongated gemstone drops that elongate the neck profile.",
        craftNote: "Multi-articulated links allow natural fluid sway.",
        sortOrder: 3,
        enabled: true,
      },
      {
        slug: "hoops",
        displayName: "Gold & Diamond Hoops",
        singularNoun: "Hoop Earring",
        pluralNoun: "Hoop Earrings",
        description: "Seamless gold hoops and inside-out diamond huggies.",
        craftNote: "Snap-latch closure tested over 5,000 cycles for tension security.",
        sortOrder: 4,
        enabled: true,
      },
      {
        slug: "chandbali",
        displayName: "Chandbali Earrings",
        singularNoun: "Chandbali",
        pluralNoun: "Chandbalis",
        description: "Crescent moon motif earrings adorned with polki and pearls.",
        craftNote: "Open-cut kundan foil setting maximizes candlelight brilliance.",
        sortOrder: 5,
        enabled: true,
      },
      {
        slug: "ear-cuffs",
        displayName: "Ear Cuffs",
        singularNoun: "Ear Cuff",
        pluralNoun: "Ear Cuffs",
        description: "Non-pierced architectural gold cuffs that hug the cartilage.",
        craftNote: "Spring-tempered 18K alloy ensures non-slip grip without discomfort.",
        sortOrder: 6,
        enabled: true,
      },
      {
        slug: "sui-dhaga",
        displayName: "Sui Dhaga Earrings",
        singularNoun: "Sui Dhaga",
        pluralNoun: "Sui Dhaga Earrings",
        description: "Threader earrings featuring fine gold chain and end motifs.",
        craftNote: "Ultra-fine Italian box chain slides smoothly through piercings.",
        sortOrder: 7,
        enabled: true,
      },
    ],
    howToChoose: {
      title: "Earring Drop Length & Fastening Anatomy",
      intro: "Selecting the correct post mechanism and drop scale ensures effortless comfort.",
      items: [
        {
          title: "Bombay Screw vs. South Push Back",
          subtitle: "Fastening security",
          description: "Bombay threaded screws feature fine gold threads for maximum security on heavy drops. South push backs utilize friction notches for quick daily application.",
          spec: "Recommended: Bombay Screw for bridal/heavy drops, Push back for studs",
        },
        {
          title: "Drop Length & Jawline Proportion",
          subtitle: "Silhouette framing",
          description: "35mm drops sit near the jaw corner; 55mm to 65mm grand drops touch the collarbone, ideal for wedding attire.",
          spec: "Standard drop lengths: 25mm (Daily), 45mm (Festive), 65mm (Bridal)",
        },
        {
          title: "Hollow Core Weight Management",
          subtitle: "Earlobe ergonomics",
          description: "Large chandbalis engineered with hollow 18K gold chambers weigh under 14 grams per pair, preventing earlobe strain.",
          spec: "Maximum comfortable daily pair weight: 16.0g",
        },
      ],
    },
    faqs: [
      {
        question: "Which backing mechanism is safest for heavy gold earrings?",
        answer: "We recommend our Bombay Threaded Screw back in 18K gold for all heavy drops and chandbalis, providing 100% thread lock security.",
      },
      {
        question: "Can I order single studs or replacement earring backs?",
        answer: "Yes. Our atelier creates individual replacement studs or matching gold backs on request.",
      },
      {
        question: "Are your white gold earrings hypoallergenic?",
        answer: "All Civara 18K white gold alloys are nickel-free, alloyed with palladium and finished with premium hard rhodium plating.",
      },
      {
        question: "What is the turnaround time for bespoke bridal earrings?",
        answer: "Bespoke earrings require 14 business days, including gem stone matching and hand-finishing.",
      },
    ],
    relatedCategorySlugs: ["rings", "bracelets", "necklaces", "pendants"],
  },
  bracelets: {
    slug: "bracelets",
    displayName: "Bracelets",
    singularNoun: "Bracelet",
    pluralNoun: "Bracelets",
    editorialDescription: "Flexible diamond tennis bracelets, textured open cuffs, and delicate gold chain bracelets.",
    craftNote: "A tennis bracelet must drape around the wrist like fabric. Each diamond setting link is pinned with double-jointed gold links, providing fluid 360-degree flexibility.",
    heroImageSlot: "Diamond tennis bracelet draped on marble wrist block",
    coverImage: "/images/home-cc/Bracelets-cc.png",
    mobileCoverImage: "/images/home-m-cc/bracelets-m.png",
    sortOrder: 3,
    enabled: true,
    subcategories: [
      {
        slug: "tennis",
        displayName: "Tennis Bracelets",
        singularNoun: "Tennis Bracelet",
        pluralNoun: "Tennis Bracelets",
        description: "Continuous line of matched diamonds set in 18K gold or platinum.",
        craftNote: "Double-hinged safety clasp prevents accidental opening.",
        sortOrder: 1,
        enabled: true,
      },
      {
        slug: "cuff",
        displayName: "Cuff Bracelets",
        singularNoun: "Cuff Bracelet",
        pluralNoun: "Cuff Bracelets",
        description: "Rigid open-back cuffs featuring hammered textures and gemstone caps.",
        craftNote: "Spring-tempered alloy allows controlled flex without deformation.",
        sortOrder: 2,
        enabled: true,
      },
      {
        slug: "charm",
        displayName: "Charm Bracelets",
        singularNoun: "Charm Bracelet",
        pluralNoun: "Charm Bracelets",
        description: "Gold chain bracelets adorned with personal talisman charms.",
        craftNote: "Laser-welded jump rings ensure charms remain permanently attached.",
        sortOrder: 3,
        enabled: true,
      },
      {
        slug: "chain",
        displayName: "Chain Bracelets",
        singularNoun: "Chain Bracelet",
        pluralNoun: "Chain Bracelets",
        description: "Sleek gold link, paperclip, and cable chain wristwear.",
        craftNote: "Solid gold links polished inside and out.",
        sortOrder: 4,
        enabled: true,
      },
    ],
    faqs: [
      {
        question: "How tight should a tennis bracelet fit?",
        answer: "A tennis bracelet should fit comfortably with one finger width of space between the bracelet and your wrist (typically 6.5 to 7.0 inches).",
      },
      {
        question: "Can extra links be added or removed from a tennis bracelet?",
        answer: "Yes, our atelier adjusts link counts to match your exact wrist circumference before delivery.",
      },
      {
        question: "Is platinum recommended for diamond tennis bracelets?",
        answer: "PT950 platinum provides maximum claw strength and bright white diamond reflection, ideal for heavy carats.",
      },
      {
        question: "How do I care for my daily diamond bracelet?",
        answer: "Clean gently with warm water, mild soap, and a soft brush. Bring it to Civara for complimentary annual prong inspection.",
      },
    ],
    relatedCategorySlugs: ["rings", "earrings", "necklaces", "pendants"],
  },
  necklaces: {
    slug: "necklaces",
    displayName: "Necklaces",
    singularNoun: "Necklace",
    pluralNoun: "Necklaces",
    editorialDescription: "Delicate 18k gold chains, diamond tennis necklaces, and fluid collar pieces that lie weightlessly along the collarbone.",
    craftNote: "A high jewellery necklace must contour seamlessly over the collarbone. Each link in our collar and choker creations is joined by hand-bent gold pins with 0.4mm articulation clearance, ensuring the piece lays flat against skin without flipping.",
    heroImageSlot: "Diamond collar necklace laid flat on silk",
    coverImage: "/images/home-cc/Necklaces-cc.png",
    mobileCoverImage: "/images/home-m-cc/Necklaces-m.png",
    sortOrder: 4,
    enabled: true,
    subcategories: [
      {
        slug: "chokers",
        displayName: "Choker Necklaces",
        singularNoun: "Choker",
        pluralNoun: "Chokers",
        description: "Close-fitting gold and diamond chokers designed to sit high on the neck.",
        craftNote: "Adjustable silk thread or gold extension chain allows 13 to 15 inch sizing flexibility.",
        sortOrder: 1,
        enabled: true,
      },
      {
        slug: "rani-haar",
        displayName: "Rani Haar",
        singularNoun: "Rani Haar",
        pluralNoun: "Rani Haars",
        description: "Grand long-format royal bridal necklaces featuring multi-strand emeralds or pearls.",
        craftNote: "Multi-layered spacers keep strands aligned across movement.",
        sortOrder: 2,
        enabled: true,
      },
      {
        slug: "collar",
        displayName: "Collar Necklaces",
        singularNoun: "Collar Necklace",
        pluralNoun: "Collar Necklaces",
        description: "Structured collarpieces that rest directly above the collarbone.",
        craftNote: "Anatomically curved 18K gold segments eliminate rigid pinch points.",
        sortOrder: 3,
        enabled: true,
      },
      {
        slug: "layered",
        displayName: "Layered Necklaces",
        singularNoun: "Layered Necklace",
        pluralNoun: "Layered Necklaces",
        description: "Pre-curated multi-strand gold chains and delicate diamond drops.",
        craftNote: "Integrated anti-tangle clasp keeps 2 or 3 strands separated.",
        sortOrder: 4,
        enabled: true,
      },
      {
        slug: "lariat",
        displayName: "Lariat & Y-Necklaces",
        singularNoun: "Lariat",
        pluralNoun: "Lariats",
        description: "Fluid drop necklaces designed for deep necklines.",
        craftNote: "Weighted end drop ensures vertical tension and grace.",
        sortOrder: 5,
        enabled: true,
      },
      {
        slug: "temple",
        displayName: "Temple Necklaces",
        singularNoun: "Temple Necklace",
        pluralNoun: "Temple Necklaces",
        description: "Hand-engraved 22K nakshi temple jewellery with deity motifs.",
        craftNote: "Chased and repousse handwork performed by heritage South Indian artisans.",
        sortOrder: 6,
        enabled: true,
      },
    ],
    howToChoose: {
      title: "Necklace Length & Neckline Pairing Guide",
      intro: "Selecting the correct chain gauge and drop length ensures your necklace highlights your ensemble.",
      items: [
        {
          title: "Choker (14 inch) vs. Princess (18 inch)",
          subtitle: "Anatomical placement",
          description: "14-inch chokers hug the throat mid-neck. 18-inch princess lengths rest gracefully at the collarbone center, ideal for saree blouses and boat necklines.",
          spec: "Standard lengths: 14\" Choker, 16\" Collar, 18\" Princess, 24\" Matinee, 32\" Rani Haar",
        },
        {
          title: "Articulation & Anti-Flip Pins",
          subtitle: "Collarbone draping",
          description: "Tennis necklaces require micro-articulated bezel links that rotate 15 degrees max, guaranteeing diamonds face forward without twisting.",
          spec: "Flexibility index: 15° restricted link articulation",
        },
        {
          title: "Chain Gauge & Pendant Load",
          subtitle: "Tensile strength",
          description: "Pendants over 5.0 grams require a minimum 1.2mm solid gold wheat or box chain to prevent long-term link stretch.",
          spec: "Minimum chain gauge for pendants: 1.2mm solid 18K",
        },
      ],
    },
    faqs: [
      {
        question: "How do I choose the correct necklace length for my wedding outfit?",
        answer: "We recommend bringing your neckline measurement or blouse photo to a private viewing. Our atelier fits custom extension links to achieve exact collarbone positioning.",
      },
      {
        question: "Are tennis necklaces flexible enough to wear daily?",
        answer: "Yes. Our tennis necklaces feature hand-assembled 4-prong or bezel links with internal safety catches that prevent accidental unhooking.",
      },
      {
        question: "Can I convert a choker into a long necklace?",
        answer: "We offer dual-purpose convertible pieces with detachable extension chains or hand-woven dori cords.",
      },
      {
        question: "What hallmarking is applied to Civara necklaces?",
        answer: "Every necklace carries the official BIS 750 (18K) or BIS 916 (22K) stamp alongside our atelier maker mark.",
      },
    ],
    relatedCategorySlugs: ["pendants", "earrings", "bracelets", "rings"],
  },
  pendants: {
    slug: "pendants",
    displayName: "Pendants & Chains",
    singularNoun: "Pendant",
    pluralNoun: "Pendants & Chains",
    editorialDescription: "Intimate pendants, constellation motifs, and solitary drops suspended on fine Italian gold chains.",
    craftNote: "A pendant is an intimate talisman. We hand-cut bail loops with smooth radius interiors, allowing the charm to slide silently along wheat or box chains without abrasive wear.",
    heroImageSlot: "Solitaire diamond pendant close up on marble",
    coverImage: "/images/home-cc/Pendants=cc.png",
    mobileCoverImage: "/images/home-m-cc/pendants-m.png",
    sortOrder: 5,
    enabled: true,
    subcategories: [
      {
        slug: "pendants",
        displayName: "Solitaire & Motif Pendants",
        singularNoun: "Pendant",
        pluralNoun: "Pendants",
        description: "Single diamond drops and geometric gold talismans.",
        craftNote: "Concealed rear bail design creates an illusion of floating stones.",
        sortOrder: 1,
        enabled: true,
      },
      {
        slug: "chains",
        displayName: "Gold Chains",
        singularNoun: "Chain",
        pluralNoun: "Chains",
        description: "Solid 18K gold wheat, box, rope, and cable chains.",
        craftNote: "Machine-drawn, hand-soldered links with high tensile strength.",
        sortOrder: 2,
        enabled: true,
      },
      {
        slug: "pendant-sets",
        displayName: "Pendant & Earring Sets",
        singularNoun: "Pendant Set",
        pluralNoun: "Pendant Sets",
        description: "Harmonized pendant and matching stud earring sets.",
        craftNote: "Identical stone color, clarity, and gold melt composition.",
        sortOrder: 3,
        enabled: true,
      },
    ],
    faqs: [
      {
        question: "Do pendants include the gold chain?",
        answer: "All Civara pendants are available as pendant-only or paired with our signature 18-inch adjustable 18K gold chain.",
      },
      {
        question: "Can I fit a Civara pendant onto my existing chain?",
        answer: "Our bails are engineered with a universal 3.5mm interior opening to accommodate standard gold chains.",
      },
      {
        question: "Are daily-wear pendants durable?",
        answer: "Yes, cast in solid 18K gold with bezel or 4-prong claw settings designed for active everyday wear.",
      },
      {
        question: "What diamond qualities are used in solitaire pendants?",
        answer: "We use E-F color, VVS-VS clarity natural diamonds with independent GIA/IGI certificates for stones 0.30ct+.",
      },
    ],
    relatedCategorySlugs: ["necklaces", "rings", "earrings", "bracelets"],
  },
};

export class Taxonomy {
  static getAllCategories(): CategoryInfo[] {
    return Object.values(TAXONOMY)
      .filter((cat) => cat.enabled)
      .sort((a, b) => a.sortOrder - b.sortOrder);
  }

  static getCategory(slug: string): CategoryInfo | undefined {
    return TAXONOMY[slug.toLowerCase()];
  }

  static getSubcategory(categorySlug: string, subcategorySlug: string): { category: CategoryInfo; subcategory: SubcategoryInfo } | undefined {
    const category = this.getCategory(categorySlug);
    if (!category) return undefined;
    const subcategory = category.subcategories.find((sub) => sub.slug.toLowerCase() === subcategorySlug.toLowerCase() && sub.enabled);
    if (!subcategory) return undefined;
    return { category, subcategory };
  }

  static getRelatedCategories(categorySlug: string): CategoryInfo[] {
    const category = this.getCategory(categorySlug);
    if (!category) return [];
    return category.relatedCategorySlugs
      .map((slug) => this.getCategory(slug))
      .filter((cat): cat is CategoryInfo => Boolean(cat && cat.enabled));
  }
}
