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
  naturalDiamondDescription?: string;
  labGrownDescription?: string;
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

  static products: Product[] = [];

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
        "Our devotion to quiet luxury begins at the metallurgical level. Rather than using commercial yellow gold alloys that can appear brassy or harsh under direct daylight, we assay our 18-karat gold with exact fractions of silver and copper. The resulting hue is a luminous honey tone that flatters olive and warm skin tones effortlessly.",
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
        "The journey of an Elara Solitaire begins with pure bullion grains of RJC-certified 24-karat gold, copper, and fine silver, melted in a ceramic crucible at 1,064 degrees Celsius to forge our proprietary 18-karat alloy ingot.",
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

  static async getProductsByCategoryAsync(categorySlug: string): Promise<Product[]> {
    try {
      if (typeof window === "undefined") {
        const { ProductRepo } = await import("./db/repo/products");
        const { CollectionRepo } = await import("./db/repo/collections");
        const collection = await CollectionRepo.getCollectionBySlug(categorySlug);
        if (collection) {
          const { products } = await ProductRepo.listProducts({
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
      // Fallback
    }
    return this.products.filter(
      (p) => p.category.toLowerCase() === categorySlug.toLowerCase()
    );
  }

  static getProductsByCategory(categorySlug: string): Product[] {
    return this.products.filter(
      (p) => p.category.toLowerCase() === categorySlug.toLowerCase()
    );
  }

  static async getProductByIdAsync(id: string): Promise<Product | undefined> {
    if (!id) return undefined;
    try {
      if (typeof window === "undefined") {
        const { ProductRepo } = await import("./db/repo/products");
        const isNumeric = /^\d+$/.test(id.trim());
        const dbProduct = isNumeric
          ? await ProductRepo.getProductById(parseInt(id, 10))
          : await ProductRepo.getProductBySlug(id);

        if (dbProduct && dbProduct.is_published === 1) {
          const mapped = this.mapDbProductToProduct(dbProduct);
          if (mapped.mainImage) return mapped;
        }
      }
    } catch {
      // Fallback
    }
    return this.getProductById(id);
  }

  static getProductById(id: string): Product | undefined {
    if (!id) return undefined;
    const cleanId = id.toLowerCase().trim();
    return this.products.find((p) => p.id.toLowerCase() === cleanId);
  }

  static async getCategoryProductsAsync(categorySlug: string): Promise<Product[]> {
    const cleanCat = categorySlug.toLowerCase().trim();
    try {
      if (typeof window === "undefined") {
        const { ProductRepo } = await import("./db/repo/products");
        const { products } = await ProductRepo.listProducts({
          collectionSlug: cleanCat,
          published: 1,
        });
        if (products && products.length > 0) {
          return products.map((p: any) => this.mapDbProductToProduct(p));
        }
      }
    } catch {
      // ignore
    }
    return this.getCategoryProducts(categorySlug);
  }

  static getCategoryProducts(categorySlug: string): Product[] {
    const cleanCat = categorySlug.toLowerCase().trim();
    return this.products.filter(
      (p) => p.category.toLowerCase() === cleanCat
    );
  }

  static async getFeaturedProductsAsync(minCount = 4): Promise<Product[]> {
    try {
      if (typeof window === "undefined") {
        const { ProductRepo } = await import("./db/repo/products");
        const { products } = await ProductRepo.listProducts({
          featured: 1,
          published: 1,
        });
        if (products && products.length > 0) {
          const mapped = products
            .map((p: any) => this.mapDbProductToProduct(p))
            .filter((p: any) => Boolean(p.mainImage));
          if (mapped.length >= minCount) return mapped.slice(0, minCount);
          return mapped;
        }
      }
    } catch {
      // Fallback
    }
    return this.getFeaturedProducts(minCount);
  }

  static getFeaturedProducts(minCount = 4): Product[] {
    const valid = this.products.filter(
      (p) =>
        Boolean(p.mainImage) &&
        (p.mainImage?.startsWith("/") || p.mainImage?.startsWith("http"))
    );
    return valid.length >= minCount ? valid.slice(0, minCount) : [];
  }

  static mapDbProductToProduct(p: any): Product {
    const slugKey = (p.slug || "").toLowerCase().trim();
    const idKey = String(p.id || "").toLowerCase().trim();
    const staticProduct = this.products.find(
      (prod) => prod.id.toLowerCase() === slugKey || prod.id.toLowerCase() === idKey
    );

    let sizes = staticProduct?.sizeOptions || STANDARD_RING_SIZES;
    if (p.available_sizes) {
      try {
        const parsedSizes = typeof p.available_sizes === "string" ? JSON.parse(p.available_sizes) : p.available_sizes;
        if (Array.isArray(parsedSizes) && parsedSizes.length > 0) {
          sizes = parsedSizes;
        }
      } catch {
        if (typeof p.available_sizes === "string" && p.available_sizes.trim()) {
          sizes = [p.available_sizes];
        }
      }
    }

    let metals = staticProduct?.metalOptions || STANDARD_METAL_OPTIONS;
    if (p.metal_options) {
      try {
        const parsedM = typeof p.metal_options === "string" ? JSON.parse(p.metal_options) : p.metal_options;
        if (Array.isArray(parsedM) && parsedM.length > 0) {
          metals = parsedM;
        }
      } catch {}
    }

    const images = p.images?.map((img: any) => img.path) || [];
    const mainImg = p.primary_image || images[0] || staticProduct?.mainImage || undefined;
    const altImg = images[1] || staticProduct?.altImage || mainImg;
    const allThumbnails = images.length > 0
      ? images
      : staticProduct?.thumbnails && staticProduct.thumbnails.length > 0
      ? staticProduct.thumbnails
      : mainImg
      ? [mainImg]
      : [];

    return {
      id: p.slug || staticProduct?.id || "civara-jewel",
      name: p.name || staticProduct?.name || "Civara Fine Jewel",
      category: p.collection_slug || staticProduct?.category || "rings",
      categoryName: p.collection_name || staticProduct?.categoryName || "Rings & Solitaires",
      priceINR: p.price_inr ? Math.round(p.price_inr / 100) : (staticProduct?.priceINR || 84500),
      tagline: staticProduct?.tagline || p.tagline || (p.is_featured ? "Atelier Featured Edit" : "Civara Edit"),
      description: p.description || staticProduct?.description || "Handcrafted in hallmarked 18k solid gold and certified natural diamonds.",
      naturalDiamondDescription: p.description || staticProduct?.naturalDiamondDescription || staticProduct?.description || "Handcrafted in hallmarked solid gold with certified natural earth-mined diamonds.",
      labGrownDescription: p.lab_grown_description || staticProduct?.labGrownDescription || `Showcasing an IGI-certified Type IIa lab grown diamond of optical perfection, crafted in ${p.metal || "18k solid gold"} within our Surat atelier. Created via sustainable CVD/HPHT technology with identical carbon lattice crystallization, hardness, and brilliant light refraction.`,
      metalOptions: metals,
      sizeType: p.size_type || staticProduct?.sizeType || "ring",
      sizeOptions: sizes,
      stoneType: staticProduct?.stoneType || p.stone_type || (p.diamond_carat ? `${p.diamond_carat}ct Diamond` : "Natural Diamond"),
      imagePlaceholder: p.name || staticProduct?.name,
      mainImage: mainImg,
      altImage: altImg,
      thumbnails: allThumbnails,
      hallmark: staticProduct?.hallmark || "BIS 750 (18k Gold)",
      netWeightG: p.metal_weight_g || staticProduct?.netWeightG || 3.4,
      details: {
        materials: staticProduct?.details?.materials || `Hallmarked ${p.metal || "18k gold"}${p.diamond_carat ? ` with ${p.diamond_carat}ct ${p.diamond_clarity || "VS1"} diamond` : ""}.`,
        craft: staticProduct?.details?.craft || "Hand-finished to order by master goldsmiths in our private atelier over 2–3 weeks.",
        care: staticProduct?.details?.care || "Complimentary annual ultrasonic cleaning and lifetime claw inspection.",
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
