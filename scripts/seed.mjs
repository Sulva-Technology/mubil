// Demo events and news posts.
//
//   node --env-file=.env.local scripts/seed.mjs         upsert into Supabase (service role)
//   node scripts/seed.mjs --sql > supabase/seed.sql    write the same rows as SQL
//
// Rows are upserted by slug, so running it twice is safe. Delete the demo rows
// from the admin dashboard once real content is in.

const photo = (id) => `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=2000&q=80`;

/** Dates relative to today so upcoming events stay upcoming. */
function daysFromNow(days) {
  const d = new Date();
  d.setUTCDate(d.getUTCDate() + days);
  return d.toISOString().slice(0, 10);
}

const p = (...paras) => paras.map((t) => `<p>${t}</p>`).join("");

export const events = [
  {
    title: "Community Health Day: Makoko",
    slug: "community-health-day-makoko",
    excerpt: "Free blood pressure, blood sugar and malaria screening for families in Makoko, with nurses on site all day.",
    description:
      p(
        "Our quarterly health day returns to Makoko. Nurses and doctors from our partner clinics will offer free screening for blood pressure, blood sugar and malaria, plus advice for expectant mothers.",
        "No appointment is needed. Bring any previous test results if you have them. Children are welcome and there will be a play area.",
      ) +
      "<h2>What to expect</h2><ul><li>Free screening and same-day results</li><li>Maternal health talk at 11:00</li><li>Referrals to partner clinics where needed</li></ul>",
    event_date: daysFromNow(12),
    start_time: "09:00",
    end_time: "15:00",
    venue: "Makoko Community Hall",
    address: "Makoko, Yaba, Lagos",
    map_link: "https://maps.google.com/?q=Makoko,+Lagos",
    cover_image_url: photo("1781263409522-06f1d4a6f3af"),
    status: "published",
    featured: true,
  },
  {
    title: "Women's Enterprise Graduation 2026",
    slug: "womens-enterprise-graduation-2026",
    excerpt: "Celebrate 64 women completing six months of trade training in tailoring, catering and hairdressing.",
    description: p(
      "Join us to celebrate the 2026 class of the Women's Enterprise Programme. Graduates will show their work, receive starter kits and share what comes next for their businesses.",
      "Family, friends, partners and anyone curious about the programme are welcome. Light refreshments will be served.",
    ),
    event_date: daysFromNow(26),
    start_time: "11:00",
    end_time: "14:00",
    venue: "Abeokuta Civic Centre",
    address: "Ibara, Abeokuta, Ogun State",
    map_link: "https://maps.google.com/?q=Ibara,+Abeokuta",
    cover_image_url: photo("1666281269793-da06484657e8"),
    status: "published",
    featured: false,
  },
  {
    title: "Back to School Volunteer Drive",
    slug: "back-to-school-volunteer-drive",
    excerpt: "Help pack 1,200 school kits with uniforms, books and stationery for the new term.",
    description: p(
      "We need around 60 volunteers to pack and label school kits for pupils across our partner schools. No experience needed. We will brief everyone on arrival.",
      "Please wear comfortable clothes. Lunch and water are provided.",
    ),
    event_date: daysFromNow(40),
    start_time: "10:00",
    end_time: "16:00",
    venue: "Mubil Foundation Warehouse",
    address: "Ikorodu Road, Ikorodu, Lagos",
    map_link: "https://maps.google.com/?q=Ikorodu,+Lagos",
    cover_image_url: photo("1560220604-1985ebfe28b1"),
    status: "published",
    featured: false,
  },
  {
    title: "Annual Fundraising Dinner",
    slug: "annual-fundraising-dinner",
    excerpt: "An evening with partners and supporters to share results from the year and plan the next one.",
    description: p(
      "Our annual dinner brings together the people who make the work possible. Hear directly from programme graduates and see the results from the year.",
      "Tables and individual seats are available. All proceeds go to the Back to School programme.",
    ),
    event_date: daysFromNow(58),
    start_time: "18:30",
    end_time: "22:00",
    venue: "Eko Hotel and Suites",
    address: "Adetokunbo Ademola Street, Victoria Island, Lagos",
    map_link: "https://maps.google.com/?q=Eko+Hotel,+Victoria+Island",
    cover_image_url: photo("1781263378197-9ea12f94b827"),
    status: "published",
    featured: false,
  },
  {
    title: "Water Committee Training: Iseyin",
    slug: "water-committee-training-iseyin",
    excerpt: "Refresher training on maintenance and record keeping for community water committees.",
    description: p(
      "Members of the Iseyin water committees met for a one-day refresher on pump maintenance, simple repairs and keeping clear records of fees collected.",
    ),
    event_date: daysFromNow(-21),
    start_time: "10:00",
    end_time: "15:00",
    venue: "Iseyin Town Hall",
    address: "Iseyin, Oyo State",
    map_link: "https://maps.google.com/?q=Iseyin,+Oyo",
    cover_image_url: photo("1543181077-099f32f30a1c"),
    status: "published",
    featured: false,
  },
  {
    title: "Reading Week at Ifo Primary",
    slug: "reading-week-ifo-primary",
    excerpt: "Five days of reading circles, storytelling and a book swap for 400 pupils.",
    description: p(
      "Volunteers ran reading circles and storytelling sessions across every class, finishing with a book swap that sent each pupil home with a new book.",
    ),
    event_date: daysFromNow(-48),
    start_time: "09:00",
    end_time: "13:00",
    venue: "Ifo Community Primary School",
    address: "Ifo, Ogun State",
    map_link: "https://maps.google.com/?q=Ifo,+Ogun",
    cover_image_url: photo("1744809482817-9a9d4fc280af"),
    status: "published",
    featured: false,
  },
  {
    title: "Draft: Partner Breakfast",
    slug: "draft-partner-breakfast",
    excerpt: "Draft event used to check that unpublished events stay hidden.",
    description: p("This event is a draft and must never appear on the public site."),
    event_date: daysFromNow(20),
    start_time: "08:00",
    end_time: "10:00",
    venue: "To be confirmed",
    address: "Lagos",
    map_link: null,
    cover_image_url: photo("1515658323406-25d61c141a6e"),
    status: "draft",
    featured: false,
  },
];

const daysAgoIso = (days) => new Date(Date.now() - days * 86_400_000).toISOString();

export const posts = [
  {
    title: "How 40 schools kept 9,800 children in class this year",
    slug: "how-40-schools-kept-children-in-class",
    excerpt: "Fees, uniforms and a mentor for every child. Here is what changed in our Back to School partner schools.",
    category: "Education",
    author: "Tunde Okafor",
    cover_image_url: photo("1770843093640-c44ae557928b"),
    publish_date: daysAgoIso(3),
    body:
      p(
        "When a child is sent home for unpaid fees, the chance they return drops every week they are away. That is why Back to School starts with the fees, but it does not stop there.",
        "This year we supported 9,800 pupils across 41 partner schools in Lagos, Ogun and Oyo. Each child received a uniform, books and stationery, and was matched with a volunteer mentor who checks in every term.",
      ) +
      "<h2>What the numbers say</h2>" +
      p(
        "Attendance in partner schools rose from 78% to 91% over the year. Ninety-two percent of the children we support moved up to the next class, compared with 74% before they joined the programme.",
      ) +
      "<blockquote><p>The mentors changed everything. The children know someone outside their family is expecting them in class.</p></blockquote>" +
      p(
        "Head teachers tell us the mentor visits matter as much as the money. A short conversation each term is often enough to spot a problem before a child drops out.",
        "Next year we plan to add eight more schools in Ibadan North, where the waiting list is longest.",
      ),
  },
  {
    title: "From a roadside tray to a tailoring shop",
    slug: "from-roadside-tray-to-tailoring-shop",
    excerpt: "Amina Bello trained with our Women's Enterprise programme in 2023. Today she employs two apprentices.",
    category: "Stories",
    author: "Funmilayo Adeyemi",
    cover_image_url: photo("1693305966408-dd1b55b1e117"),
    publish_date: daysAgoIso(9),
    body:
      p(
        "Amina used to sell groundnuts from a tray beside the Lafenwa road. On a good day she made enough for her children's meals. On a bad day she made nothing.",
        "In 2023 she joined the Women's Enterprise programme and chose tailoring. For six months she trained three days a week with a mentor in Abeokuta.",
      ) +
      "<blockquote><p>Before the training I sold from a tray by the road. Today I run a tailoring shop and two young women learn the trade from me.</p></blockquote>" +
      p(
        "Her starter kit included a sewing machine, an overlocker and fabric for her first orders. Her savings group helped her rent a small shop front a year later.",
        "Amina now trains two apprentices of her own, both referred by the programme.",
      ),
  },
  {
    title: "Health days reach 14,000 people screened",
    slug: "health-days-reach-14000-screened",
    excerpt: "Our quarterly community health days passed a new milestone, with 1,900 people referred to partner clinics.",
    category: "Health",
    author: "Ngozi Eze",
    cover_image_url: photo("1781263378223-1e09658a7567"),
    publish_date: daysAgoIso(16),
    body: p(
      "Since the first community health day in 2019, nurses and volunteers have screened more than 14,000 people for blood pressure, blood sugar and malaria.",
      "Around one in seven people screened is referred for follow-up care. Our community health volunteers check in with each of them within two weeks to make sure they reached the clinic.",
      "The next health day is in Makoko. Everyone is welcome and no appointment is needed.",
    ),
  },
  {
    title: "Every water point still working, five years on",
    slug: "every-water-point-still-working",
    excerpt: "Our annual check of 18 boreholes found all of them running, thanks to the community water committees.",
    category: "Water",
    author: "Ibrahim Musa",
    cover_image_url: photo("1553775927-a071d5a6a39a"),
    publish_date: daysAgoIso(30),
    body: p(
      "Many water projects fail within a few years because nobody is responsible for repairs. From the start, each of our water points has been run by a committee elected by the community.",
      "This year's inspection found all 18 boreholes working. Committees had carried out 23 small repairs using fees they collected themselves.",
    ),
  },
  {
    title: "Our 2025 annual report is out",
    slug: "2025-annual-report",
    excerpt: "Audited accounts and programme results for 2025, including how every naira was spent.",
    category: "Announcements",
    author: "Ibrahim Musa",
    cover_image_url: photo("1666281134747-caa676fc2201"),
    publish_date: daysAgoIso(45),
    body: p(
      "Our 2025 annual report is now available to download from the About page. It includes audited accounts and results for each programme.",
      "In 2025, 78% of spending went directly to programmes, 12% to training community volunteers, 5% to fundraising and 5% to administration.",
    ),
  },
  {
    title: "Meet the volunteers behind Reading Week",
    slug: "meet-the-reading-week-volunteers",
    excerpt: "Forty volunteers spent a week reading with 400 pupils in Ifo. Three of them tell us why.",
    category: "Stories",
    author: "Tunde Okafor",
    cover_image_url: photo("1744809495173-217ca4faa8bc"),
    publish_date: daysAgoIso(52),
    body: p(
      "Reading Week started as a small idea: give every pupil in one school a week of stories. This year forty volunteers joined, from university students to retired teachers.",
      "Each volunteer ran a reading circle of ten pupils for an hour a day. On Friday every pupil took home a book of their own.",
    ),
  },
  {
    title: "Draft: Partner update",
    slug: "draft-partner-update",
    excerpt: "Draft post used to check that unpublished posts stay hidden.",
    category: "Announcements",
    author: "Mubil Team",
    cover_image_url: photo("1515658323406-25d61c141a6e"),
    publish_date: daysAgoIso(1),
    status: "draft",
    body: p("This post is a draft and must never appear on the public site."),
  },
].map((post) => ({ status: "published", ...post }));

function sqlValue(v) {
  if (v === null || v === undefined) return "null";
  if (typeof v === "boolean") return v ? "true" : "false";
  return `'${String(v).replace(/'/g, "''")}'`;
}

function toSql(table, rows) {
  const cols = Object.keys(rows[0]);
  const values = rows.map((r) => `  (${cols.map((c) => sqlValue(r[c])).join(", ")})`).join(",\n");
  const updates = cols.filter((c) => c !== "slug").map((c) => `${c} = excluded.${c}`).join(", ");
  return `insert into public.${table} (${cols.join(", ")}) values\n${values}\non conflict (slug) do update set ${updates};\n`;
}

async function upsert(table, rows) {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) throw new Error("NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY must be set");
  const res = await fetch(`${url}/rest/v1/${table}?on_conflict=slug`, {
    method: "POST",
    headers: {
      apikey: key,
      Authorization: `Bearer ${key}`,
      "Content-Type": "application/json",
      Prefer: "resolution=merge-duplicates,return=minimal",
    },
    body: JSON.stringify(rows),
  });
  if (!res.ok) throw new Error(`${table}: ${res.status} ${await res.text()}`);
  console.log(`${table}: upserted ${rows.length}`);
}

if (process.argv.includes("--sql")) {
  process.stdout.write(
    "-- Demo content for development. Generated by scripts/seed.mjs --sql\n" +
      "-- Event dates are relative to the day it was generated.\n\n" +
      toSql("events", events) +
      "\n" +
      toSql("posts", posts),
  );
} else {
  await upsert("events", events);
  await upsert("posts", posts);
}
