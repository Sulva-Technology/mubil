/**
 * All static copy for the site.
 *
 * DEMO CONTENT: every name, number, date and photo below is sample data so the
 * design can be reviewed. Replace it with real content from Mubil Foundation
 * before launch. Photos are Unsplash demo images; swap `image` values for
 * Supabase Storage URLs or files in /public.
 */

/** Unsplash demo photo by id. */
export function demoPhoto(id: string, width = 2000) {
  return `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${width}&q=80`;
}

export const site = {
  name: "Mubil Foundation",
  shortName: "Mubil",
  tagline: "Mubil Foundation, Nigeria",
  description:
    "Mubil Foundation helps children learn, women earn and families stay healthy across Nigerian communities.",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
  locale: "en_NG",
  founded: 2016,
} as const;

export const navLinks = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
  { label: "Programmes", href: "/programmes" },
  { label: "Events", href: "/events" },
  { label: "News", href: "/news" },
  { label: "Gallery", href: "/gallery" },
  { label: "Contact", href: "/contact" },
] as const;

export const contact = {
  address: "14 Adeola Odeku Street, Victoria Island, Lagos",
  phone: "+234 800 000 0000",
  email: "hello@mubilfoundation.org",
  hours: "Monday to Friday, 9:00 to 17:00",
  mapQuery: "Adeola Odeku Street, Victoria Island, Lagos, Nigeria",
} as const;

export type SocialNetwork = "facebook" | "instagram" | "x" | "linkedin" | "youtube";

export const socials: Array<{ network: SocialNetwork; label: string; href: string }> = [
  { network: "facebook", label: "Facebook", href: "https://facebook.com" },
  { network: "instagram", label: "Instagram", href: "https://instagram.com" },
  { network: "x", label: "X", href: "https://x.com" },
  { network: "linkedin", label: "LinkedIn", href: "https://linkedin.com" },
  { network: "youtube", label: "YouTube", href: "https://youtube.com" },
];

export const footer = {
  blurb: "Helping children learn, women earn and families stay healthy, one community at a time.",
  registration: "CAC/IT/NO 000000",
  columns: [
    {
      title: "Explore",
      links: [
        { label: "About", href: "/about" },
        { label: "Programmes", href: "/programmes" },
        { label: "Gallery", href: "/gallery" },
      ],
    },
    {
      title: "Stay up to date",
      links: [
        { label: "Events", href: "/events" },
        { label: "News", href: "/news" },
        { label: "Contact", href: "/contact" },
      ],
    },
  ],
} as const;

/* ---------------------------------------------------------------------------
   Home
   --------------------------------------------------------------------------- */

export const home = {
  hero: {
    eyebrow: "Mubil Foundation, Nigeria",
    headline: "Every child deserves a fair start in life",
    supporting:
      "We run schools support, women's enterprise and community health programmes in Lagos, Ogun and Oyo, working alongside the families we serve.",
    image: demoPhoto("1632215861513-130b66fe97f4"),
    imageAlt: "A teacher standing in front of a class of young children",
    caption: { location: "Ikorodu, Lagos", year: "2025" },
  },
  impact: {
    eyebrow: "Our impact so far",
    title: "Ten years of showing up",
    stats: [
      { value: 12400, suffix: "+", label: "Children supported in school" },
      { value: 860, suffix: "", label: "Women trained in a trade" },
      { value: 38, suffix: "", label: "Partner communities" },
      { value: 95, suffix: "%", label: "Of funds spent on programmes" },
    ],
  },
  programmes: {
    eyebrow: "Programmes",
    title: "Long-term work, not one-off visits",
    intro: "Each programme runs for years in the same communities, so progress can be measured and kept.",
  },
  events: {
    eyebrow: "Upcoming events",
    title: "Join us in person",
  },
  news: {
    eyebrow: "Latest news",
    title: "Stories from the field",
  },
  story: {
    image: demoPhoto("1743871698163-a2e470d8eac7"),
    imageAlt: "Portrait of a smiling woman wearing a headscarf",
    quote:
      "Before the training I sold from a tray by the road. Today I run a tailoring shop and two young women learn the trade from me.",
    name: "Amina Bello",
    role: "Graduate, Women's Enterprise Programme, Abeokuta",
  },
  cta: {
    headline: "Help us reach the next community",
    supporting: "Volunteer your time, partner with us, or support a programme.",
    action: "Get involved",
  },
} as const;

/* ---------------------------------------------------------------------------
   Programmes
   --------------------------------------------------------------------------- */

export type ProgrammeStatus = "ongoing" | "completed";

export type Programme = {
  slug: string;
  title: string;
  summary: string;
  status: ProgrammeStatus;
  image: string;
  imageAlt: string;
  overview: string[];
  serves: string;
  locations: string[];
  impact: Array<{ value: string; label: string }>;
  photos: Array<{ src: string; alt: string }>;
};

export const programmes: Programme[] = [
  {
    slug: "back-to-school",
    title: "Back to School",
    summary: "Fees, uniforms and learning materials for children at risk of dropping out.",
    status: "ongoing",
    image: demoPhoto("1770843093640-c44ae557928b"),
    imageAlt: "Children sitting in a classroom with numbers on the wall",
    overview: [
      "Back to School pays fees, provides uniforms and books, and funds after-school tutoring for children whose families can no longer keep them in class.",
      "Each child is matched with a volunteer mentor who checks in every term, and we work with head teachers to track attendance and results.",
    ],
    serves: "Primary and junior secondary pupils aged 6 to 15 from low-income households.",
    locations: ["Ikorodu, Lagos", "Ifo, Ogun", "Ibadan North, Oyo"],
    impact: [
      { value: "9,800", label: "Pupils supported" },
      { value: "41", label: "Partner schools" },
      { value: "92%", label: "Stayed in school" },
    ],
    photos: [
      { src: demoPhoto("1744809482817-9a9d4fc280af"), alt: "A teacher instructing students in a classroom" },
      { src: demoPhoto("1744809495173-217ca4faa8bc"), alt: "A student drawing lines with a ruler" },
      { src: demoPhoto("1683728988659-b1e368f423fc"), alt: "A young boy at a table with a book and pencil" },
    ],
  },
  {
    slug: "womens-enterprise",
    title: "Women's Enterprise",
    summary: "Six-month trade training and starter kits so women can earn a steady income.",
    status: "ongoing",
    image: demoPhoto("1666281269793-da06484657e8"),
    imageAlt: "A group of women holding books",
    overview: [
      "Women choose a trade such as tailoring, catering or hairdressing and train for six months with an experienced mentor.",
      "Graduates receive a starter kit and join a savings group that meets monthly, so the business has support long after training ends.",
    ],
    serves: "Women aged 18 to 45, prioritising widows and single mothers.",
    locations: ["Abeokuta, Ogun", "Mushin, Lagos"],
    impact: [
      { value: "860", label: "Women trained" },
      { value: "610", label: "Businesses running" },
      { value: "3x", label: "Average income growth" },
    ],
    photos: [
      { src: demoPhoto("1693305966408-dd1b55b1e117"), alt: "A room filled with sewing machines" },
      { src: demoPhoto("1666281134747-caa676fc2201"), alt: "Women in head scarves reading a book together" },
      { src: demoPhoto("1779357807569-18d3df9df645"), alt: "Women in colourful clothes sitting on a bench outdoors" },
    ],
  },
  {
    slug: "community-health",
    title: "Community Health",
    summary: "Free screening days, maternal health talks and referrals to local clinics.",
    status: "ongoing",
    image: demoPhoto("1781263409522-06f1d4a6f3af"),
    imageAlt: "A smiling woman in a headscarf holding a child among a crowd",
    overview: [
      "Quarterly health days bring nurses and doctors to communities for blood pressure, blood sugar and malaria screening at no cost.",
      "Trained community health volunteers follow up with mothers and refer anyone who needs care to a partner clinic.",
    ],
    serves: "Mothers, young children and older adults in underserved communities.",
    locations: ["Makoko, Lagos", "Ota, Ogun"],
    impact: [
      { value: "14,200", label: "People screened" },
      { value: "120", label: "Health volunteers" },
      { value: "1,900", label: "Clinic referrals" },
    ],
    photos: [
      { src: demoPhoto("1781263378223-1e09658a7567"), alt: "A man surrounded by smiling children and women" },
      { src: demoPhoto("1473594659356-a404044aa2c2"), alt: "A baby carried on a mother's back" },
      { src: demoPhoto("1781427012209-7667265cf769"), alt: "Women carrying children through a rural village" },
    ],
  },
  {
    slug: "clean-water",
    title: "Clean Water Points",
    summary: "Boreholes and water committees for communities without safe water.",
    status: "completed",
    image: demoPhoto("1553775927-a071d5a6a39a"),
    imageAlt: "Three women carrying basins while walking",
    overview: [
      "Between 2019 and 2023 we drilled and handed over solar-powered boreholes, each run by a trained community water committee.",
      "The committees still collect small fees for maintenance, and we continue to check every water point once a year.",
    ],
    serves: "Rural households who previously walked over an hour for water.",
    locations: ["Iseyin, Oyo", "Yewa North, Ogun"],
    impact: [
      { value: "18", label: "Water points built" },
      { value: "22,000", label: "People with safe water" },
      { value: "100%", label: "Still working" },
    ],
    photos: [
      { src: demoPhoto("1543181077-099f32f30a1c"), alt: "People walking along a road carrying water containers" },
      { src: demoPhoto("1515658323406-25d61c141a6e"), alt: "A group of people gathered outdoors" },
      { src: demoPhoto("1509099836639-18ba1795216d"), alt: "A group of children together outdoors" },
    ],
  },
];

/* ---------------------------------------------------------------------------
   About
   --------------------------------------------------------------------------- */

export const about = {
  header: {
    eyebrow: "About",
    title: "Built with communities, not for them",
    intro:
      "Mubil Foundation started with one classroom in Ikorodu. Ten years on, we work across three states with the same rule: listen first, then stay.",
  },
  story: {
    title: "How we started",
    paragraphs: [
      "In 2016 a group of friends paid the school fees of eleven children in Ikorodu who had been sent home mid-term. Within a year, parents were asking what else could be done.",
      "That question shaped everything that followed. We now run four programmes, each designed with the communities themselves and measured every year.",
      "We are a registered Nigerian non-profit with a small staff and more than three hundred volunteers.",
    ],
    image: demoPhoto("1666281238998-59842bf7e10c"),
    imageAlt: "Two women in blue robes",
    year: "Since 2016",
  },
  pillars: [
    {
      icon: "target",
      title: "Mission",
      body: "To help children learn, women earn and families stay healthy through long-term, community-led programmes.",
    },
    {
      icon: "eye",
      title: "Vision",
      body: "A Nigeria where the place you are born does not decide how far you can go.",
    },
    {
      icon: "heart",
      title: "Values",
      body: "Listen first. Stay for the long term. Be open about every naira. Measure what matters.",
    },
  ],
  timeline: [
    { year: "2016", text: "First eleven children sponsored in Ikorodu, Lagos." },
    { year: "2018", text: "Registered with the Corporate Affairs Commission." },
    { year: "2019", text: "Clean Water Points programme begins in Oyo State." },
    { year: "2021", text: "Women's Enterprise launches with a first class of 40 women." },
    { year: "2023", text: "Community Health days reach 10,000 people screened." },
    { year: "2025", text: "Partner communities grow to 38 across three states." },
  ],
  team: [
    {
      name: "Funmilayo Adeyemi",
      role: "Founder and Executive Director",
      image: demoPhoto("1505421031134-e57263cae630", 900),
      bio: "Funmilayo founded Mubil after a decade in banking. She leads strategy and partnerships and still visits every programme site each quarter.",
    },
    {
      name: "Tunde Okafor",
      role: "Programmes Lead",
      image: demoPhoto("1668752515680-075bf648d8fa", 900),
      bio: "Tunde manages delivery across all four programmes and the volunteer network. He previously ran education projects in Kano and Enugu.",
    },
    {
      name: "Ngozi Eze",
      role: "Health Coordinator",
      image: demoPhoto("1620424037570-15137a4a562d", 900),
      bio: "Ngozi is a registered nurse who coordinates health days, trains community health volunteers and manages clinic referrals.",
    },
    {
      name: "Ibrahim Musa",
      role: "Finance and Operations",
      image: demoPhoto("1657356217673-4f7000f768b4", 900),
      bio: "Ibrahim keeps the books, prepares the annual report and makes sure every naira is accounted for.",
    },
  ],
  transparency: {
    title: "Open about every naira",
    intro: "We publish audited accounts every year. Here is how each naira was spent in 2025.",
    registration: "CAC/IT/NO 000000",
    reportUrl: "#",
    reportLabel: "Download the 2025 annual report",
    funds: [
      { label: "Programmes", value: 78 },
      { label: "Community volunteers and training", value: 12 },
      { label: "Fundraising", value: 5 },
      { label: "Administration", value: 5 },
    ],
  },
} as const;

/* ---------------------------------------------------------------------------
   Gallery
   --------------------------------------------------------------------------- */

export type GalleryItem = { src: string; alt: string; caption: string; album: string; width: number; height: number };

export const galleryAlbums = ["Classrooms", "Communities", "Health days"] as const;

export const gallery: GalleryItem[] = [
  { src: demoPhoto("1632215861513-130b66fe97f4", 1400), alt: "A teacher in front of young pupils", caption: "Morning lesson, Ikorodu", album: "Classrooms", width: 3, height: 2 },
  { src: demoPhoto("1744809495173-217ca4faa8bc", 1400), alt: "A student drawing with a ruler", caption: "Geometry practice, Ifo", album: "Classrooms", width: 2, height: 3 },
  { src: demoPhoto("1770843093640-c44ae557928b", 1400), alt: "Children in a classroom", caption: "Primary 3 class, Ibadan", album: "Classrooms", width: 3, height: 2 },
  { src: demoPhoto("1683728988659-b1e368f423fc", 1400), alt: "A boy studying with a book and pencil", caption: "After-school tutoring", album: "Classrooms", width: 4, height: 5 },
  { src: demoPhoto("1781263378197-9ea12f94b827", 1400), alt: "A large group of people raising their hands", caption: "Community meeting, Ota", album: "Communities", width: 3, height: 2 },
  { src: demoPhoto("1779357807569-18d3df9df645", 1400), alt: "Women in colourful clothes on a bench", caption: "Savings group, Abeokuta", album: "Communities", width: 4, height: 5 },
  { src: demoPhoto("1734255026082-82fdc81991f0", 1400), alt: "People around a table of tomatoes", caption: "Market day, Mushin", album: "Communities", width: 3, height: 2 },
  { src: demoPhoto("1509099863731-ef4bff19e808", 1400), alt: "A woman smiling", caption: "Water committee member, Iseyin", album: "Communities", width: 2, height: 3 },
  { src: demoPhoto("1781263409522-06f1d4a6f3af", 1400), alt: "A woman holding a child in a crowd", caption: "Health day, Makoko", album: "Health days", width: 4, height: 5 },
  { src: demoPhoto("1781263378223-1e09658a7567", 1400), alt: "A man with children and women", caption: "Volunteers and families", album: "Health days", width: 3, height: 2 },
  { src: demoPhoto("1473594659356-a404044aa2c2", 1400), alt: "A baby on a mother's back", caption: "Maternal health talk", album: "Health days", width: 2, height: 3 },
  { src: demoPhoto("1560220604-1985ebfe28b1", 1400), alt: "Volunteers in yellow shirts", caption: "Our volunteer team", album: "Health days", width: 3, height: 2 },
];

/* ---------------------------------------------------------------------------
   Inner page headers
   --------------------------------------------------------------------------- */

export const pages = {
  programmes: {
    eyebrow: "Programmes",
    title: "Four programmes, one goal",
    intro: "Education, enterprise, health and water. Each one is run with the community and measured every year.",
  },
  events: {
    eyebrow: "Events",
    title: "Come and see the work",
    intro: "Health days, graduations, fundraisers and volunteer drives. Everyone is welcome.",
  },
  news: {
    eyebrow: "News",
    title: "Stories and updates",
    intro: "Field stories, programme results and announcements from the Mubil team.",
  },
  gallery: {
    eyebrow: "Gallery",
    title: "Moments from the field",
    intro: "Classrooms, communities and health days across Lagos, Ogun and Oyo.",
  },
  contact: {
    eyebrow: "Contact",
    title: "Let's talk",
    intro: "Volunteer, partner with us, or ask a question. We reply within two working days.",
  },
} as const;
