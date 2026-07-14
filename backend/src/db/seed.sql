-- ============================================================
-- DEALER SITE — Seed Data
-- Run this AFTER schema.sql to populate with realistic sample data
-- ============================================================

-- ============================================================
-- ADMIN USER
-- Password: admin123 (bcrypt hash — change in production!)
-- ============================================================
INSERT INTO admins (name, email, password_hash) VALUES
(
  'Site Admin',
  'admin@dealersite.com',
  '$2a$10$R/otdFNw9NmgTCPJg79eB.bgAFUCUOnNIjNo8L.EC/288qKt3oodG'
);


-- ============================================================
-- SITE SETTINGS — Single row (id = 1)
-- ============================================================
INSERT INTO site_settings (
  id, site_name, tagline, logo_url,
  contact_phone, contact_email, contact_address, contact_city, contact_hours,
  hero_content, trust_signals, how_it_works, featured_homes_count
) VALUES (
  1,
  'Home Dealership',
  'Manufactured & Tiny Homes',
  '/logo.svg',
  '(555) 123-4567',
  'info@dealersite.com',
  '123 Dealer Way, Suite 100',
  'Your City, ST 12345',
  'Mon–Fri 9am–6pm · Sat 10am–4pm',
  '{
    "eyebrow": "Manufactured & Tiny Homes",
    "title": "Your path to homeownership starts here",
    "description": "Quality new, pre-owned, and tiny homes at prices that make sense. We guide you from browsing to delivery — with honest advice, not high-pressure sales.",
    "primaryCta": {"label": "Browse Inventory", "href": "/inventory"},
    "secondaryCta": {"label": "Request a Quote", "href": "/request-quote"},
    "cardTitle": "Why buyers choose us",
    "cardFooter": "Every home in our inventory meets federal HUD standards. We handle delivery, setup coordination, and financing guidance — so you can focus on finding the right home.",
    "badges": ["Nationwide Delivery", "Flexible Financing", "HUD-Compliant Homes", "No-Pressure Sales"]
  }'::jsonb,
  '[
    {"value": "30–50%", "label": "Savings vs. site-built", "detail": "Per square foot"},
    {"value": "7+", "label": "Homes in stock", "detail": "New, pre-owned & tiny"},
    {"value": "100%", "label": "HUD compliant", "detail": "Federal safety standards"},
    {"value": "48hr", "label": "Response time", "detail": "On all inquiries"}
  ]'::jsonb,
  '{
    "eyebrow": "Simple process",
    "title": "How it works",
    "description": "No shopping cart. No hidden fees. Just a straightforward path from browsing to homeownership.",
    "steps": [
      {"step": "01", "title": "Browse & compare", "text": "Explore our inventory online. Filter by category, price, and size to find homes that fit your needs."},
      {"step": "02", "title": "Talk to our team", "text": "Request information or a quote. We answer your questions about financing, delivery, and site preparation."},
      {"step": "03", "title": "Move in with confidence", "text": "We coordinate delivery, setup, and utility hookups. Your home arrives ready for the next chapter."}
    ]
  }'::jsonb,
  3
);


-- ============================================================
-- SITE PAGES — About & Financing
-- ============================================================
INSERT INTO site_pages (slug, title, subtitle, sections, highlights) VALUES
(
  'about',
  'About Us',
  'A family-focused dealership helping buyers find quality manufactured and tiny homes — without the pressure.',
  '[
    {"heading": "Our Story", "body": "We started with a simple belief: everyone deserves a path to homeownership that is honest, affordable, and straightforward. For over a decade, we have helped families across the region find HUD-compliant manufactured homes and thoughtfully designed tiny homes that fit their budget and lifestyle."},
    {"heading": "What We Stand For", "body": "No high-pressure sales. No hidden fees. Just real guidance from people who know manufactured housing inside and out — from floor plans and land prep to delivery and setup coordination."},
    {"heading": "Why Manufactured Homes", "body": "Modern manufactured homes offer exceptional value — often 30–50% less per square foot than site-built homes — while meeting strict federal safety and construction standards. Whether you are buying new, pre-owned, or going tiny, we help you understand every step before you commit."}
  ]'::jsonb,
  '[
    {"title": "HUD-Compliant Inventory", "body": "Every home we sell meets federal manufactured housing standards."},
    {"title": "Nationwide Delivery", "body": "We coordinate transport, placement, and setup with trusted crews."},
    {"title": "Local Expertise", "body": "Our team knows zoning, foundations, and lenders in your area."},
    {"title": "After-Sale Support", "body": "We stay in touch long after delivery to answer questions."}
  ]'::jsonb
),
(
  'financing',
  'Financing Options',
  'Flexible loan programs and guidance for manufactured, modular, and tiny home buyers.',
  '[
    {"heading": "Financing Made Clear", "body": "Manufactured home financing works differently than traditional site-built mortgages — but that does not mean it has to be confusing. Our financing coordinators walk you through every option and connect you with lenders who understand this market."},
    {"heading": "Get Pre-Qualified", "body": "Knowing your budget upfront saves time and helps us match you with homes that fit. Fill out our quick pre-qualification form and a team member will reach out within one business day — no obligation, no credit hit until you are ready."}
  ]'::jsonb,
  '[
    {"title": "Conventional & FHA Loans", "body": "For homes on permanent foundations, traditional mortgage products may apply — including FHA Title II loans with competitive rates."},
    {"title": "Chattel Loans", "body": "Homes on leased land or without real property often qualify for chattel financing — typically faster to close with flexible terms."},
    {"title": "FHA Title I", "body": "Personal property loans for buyers who own land or are placing a home in a community park."},
    {"title": "In-House Programs", "body": "Select homes qualify for flexible payment plans and rent-to-own arrangements — ask our team for current availability."}
  ]'::jsonb
);


-- ============================================================
-- TEAM MEMBERS — Staff profiles for home page
-- ============================================================
INSERT INTO team_members (name, role, bio, email, sort_order) VALUES
(
  'Marcus Webb',
  'General Manager',
  'Marcus has spent 15 years in manufactured housing and leads our team with a focus on honest, no-pressure sales.',
  'marcus@dealersite.com',
  1
),
(
  'Jennifer Cole',
  'Sales Manager',
  'Jennifer helps families compare floor plans and find the right home for their budget, land, and lifestyle.',
  'jennifer@dealersite.com',
  2
),
(
  'David Ortiz',
  'Home Specialist',
  'David knows every model on our lot and loves walking buyers through features, options, and customization.',
  'david@dealersite.com',
  3
),
(
  'Rachel Nguyen',
  'Financing Coordinator',
  'Rachel connects buyers with lenders who understand manufactured and land-home loans.',
  'rachel@dealersite.com',
  4
),
(
  'Tom Bradley',
  'Delivery & Setup Lead',
  'Tom coordinates transport, placement, and tie-down so your home arrives on schedule.',
  'tom@dealersite.com',
  5
),
(
  'Sandra Ellis',
  'Customer Care',
  'Sandra follows up after purchase and makes sure every buyer feels supported through move-in.',
  'sandra@dealersite.com',
  6
);


-- ============================================================
-- TESTIMONIALS — Home page customer stories
-- ============================================================
INSERT INTO testimonials (quote, name, location, home, rating, sort_order) VALUES
('From the first phone call to move-in day, the team made everything straightforward. They walked us through financing options we didn''t even know existed and kept us updated every step of the way.', 'Sarah & Mike T.', 'Georgetown, TX', 'Texas Ruby', 5, 1),
('We were nervous about buying a manufactured home, but seeing the HUD certification and touring the lot in person put us at ease. Delivery was on schedule and the setup crew was professional.', 'James R.', 'Round Rock, TX', 'Southern Charm', 5, 2),
('Downsizing into a tiny home was the best decision we made. They helped us understand zoning, foundation options, and what we could realistically afford on a fixed income.', 'Linda K.', 'Bastrop, TX', 'Skyberry Tiny', 5, 3),
('No pressure sales — just honest answers. We compared three models on the lot, took our time, and never felt rushed. Our monthly payment ended up lower than our old apartment rent.', 'Carlos & Elena M.', 'Killeen, TX', 'Horizon View', 5, 4),
('As a first-time homebuyer, I had a lot of questions. They explained the difference between chattel and land-home loans clearly and connected me with a lender who understood manufactured housing.', 'Daniel W.', 'Temple, TX', 'Prairie Creek', 5, 5),
('We drove two hours to visit and it was worth every mile. The home was exactly as pictured, and the delivery team coordinated with our contractor for utilities without a single headache.', 'Patricia & Robert H.', 'Waco, TX', 'Magnolia Ridge', 5, 6),
('After a bad experience elsewhere, we were skeptical. This dealership restored our confidence — transparent pricing, real photos, and a team that still checks in months after we closed.', 'Angela S.', 'Cedar Park, TX', 'Lone Star Deluxe', 5, 7);


-- ============================================================
-- PROPERTIES — Sample Home Listings
-- ============================================================
INSERT INTO properties (
  slug, name, category, status, price, down_payment, monthly_est,
  bedrooms, bathrooms, sqft, year_built, make_model, dimensions,
  hvac_type, insulation, foundation_type,
  description, features, delivery_info, images, is_featured
) VALUES

-- 1. New Home — Texas Ruby
(
  'texas-ruby',
  'Texas Ruby',
  'new', 'available',
  95000.00, 9500.00, 850.00,
  3, 2.0, 1400, 2024,
  'Clayton Homes – Ruby Series',
  '76ft × 28ft',
  'Central Air & Heat', 'R-19 Walls / R-38 Ceiling', 'Pier & Beam',
  'The Texas Ruby is a stunning 3-bedroom, 2-bathroom manufactured home designed for modern family living. Featuring an open-concept floor plan, granite countertops, and energy-efficient appliances, this home delivers luxury at an affordable price. With 1,400 square feet of thoughtfully designed living space, every corner of the Texas Ruby feels spacious and welcoming.',
  ARRAY[
    'Open-concept kitchen and living area',
    'Granite countertops throughout',
    'Stainless steel appliance package',
    'Master suite with walk-in closet',
    'Energy-efficient windows',
    'Central air & heating',
    'Covered front porch',
    'Shingle roof with 30-year warranty'
  ],
  'Available for delivery nationwide. International shipping to Caribbean and West Africa available. Contact us for a custom delivery quote.',
  ARRAY['/uploads/properties/texas-ruby-1.jpg', '/uploads/properties/texas-ruby-2.jpg'],
  TRUE
),

-- 2. New Home — The Skyberry
(
  'the-skyberry',
  'The Skyberry',
  'new', 'available',
  72000.00, 7200.00, 640.00,
  2, 2.0, 1100, 2024,
  'Fleetwood Homes – Skyline Series',
  '60ft × 24ft',
  'Central Air & Heat', 'R-16 Walls / R-33 Ceiling', 'Slab',
  'Perfect for couples or small families, The Skyberry offers a cozy yet modern living experience. This 2-bed, 2-bath home features a split bedroom layout for added privacy, a fully equipped kitchen, and a charming exterior with shuttered windows and a covered porch.',
  ARRAY[
    'Split bedroom floor plan',
    'Fully equipped kitchen with dishwasher',
    'Walk-in shower in master bath',
    'Energy Star certified appliances',
    'Vinyl plank flooring throughout',
    'Covered rear porch'
  ],
  'Nationwide delivery available. Site preparation services included in purchase package.',
  ARRAY['/uploads/properties/skyberry-1.jpg', '/uploads/properties/skyberry-2.jpg'],
  TRUE
),

-- 3. New Home — Southern Charm
(
  'southern-charm',
  'Southern Charm',
  'new', 'available',
  118000.00, 11800.00, 1050.00,
  4, 2.5, 1850, 2024,
  'Champion Homes – Prestige Series',
  '90ft × 28ft',
  'Central Air & Heat / Heat Pump', 'R-21 Walls / R-44 Ceiling', 'Permanent Foundation',
  'The Southern Charm is our flagship luxury model — a sprawling 4-bedroom, 2.5-bath masterpiece built for families who refuse to compromise on space or style. From the vaulted ceilings to the gourmet kitchen with a kitchen island, this home redefines what affordable housing can look like.',
  ARRAY[
    'Vaulted ceilings in living area',
    'Gourmet kitchen with center island',
    'Double vanity in master bath',
    'Large walk-in closets in all bedrooms',
    'Laundry room with washer/dryer hookups',
    'Energy-efficient heat pump system',
    'Hardwood-look flooring',
    'Two-car carport ready'
  ],
  'Permanent foundation installation available. White-glove delivery and setup service included.',
  ARRAY['/uploads/properties/southern-charm-1.jpg', '/uploads/properties/southern-charm-2.jpg'],
  TRUE
),

-- 4. Pre-Owned Home — The Mayhew
(
  'the-mayhew',
  'The Mayhew',
  'pre-owned', 'available',
  38500.00, 3850.00, 345.00,
  3, 2.0, 1200, 2018,
  'Palm Harbor – Heritage Series',
  '72ft × 24ft',
  'Central Air & Heat', 'R-13 Walls / R-30 Ceiling', 'Pier & Beam',
  'A well-maintained pre-owned gem, The Mayhew is an excellent entry point into homeownership. This 3-bedroom, 2-bath home has been recently inspected, professionally cleaned, and is move-in ready. Minor cosmetic updates have been completed — this is a solid investment at an unbeatable price.',
  ARRAY[
    'Move-in ready condition',
    'Recently inspected and serviced',
    'New carpet in bedrooms',
    'Updated kitchen fixtures',
    'Spacious living and dining combo',
    'Large master bedroom with ensuite'
  ],
  'Available for local and regional delivery. Re-leveling and tie-down included in price.',
  ARRAY['/uploads/properties/mayhew-1.jpg', '/uploads/properties/mayhew-2.jpg'],
  FALSE
),

-- 5. Pre-Owned Home — The Boxwood
(
  'the-boxwood',
  'The Boxwood',
  'pre-owned', 'available',
  29000.00, 2900.00, 260.00,
  2, 1.0, 900, 2015,
  'Cavco Industries – Boxwood Model',
  '54ft × 24ft',
  'Window Units', 'R-11 Walls / R-22 Ceiling', 'Pier & Beam',
  'The Boxwood is an affordable, practical 2-bedroom home perfect for individuals, retirees, or investors looking for a rental property. Compact but smartly designed, this home maximizes every square foot. Priced to sell fast.',
  ARRAY[
    'Compact and efficient layout',
    'New water heater installed',
    'Fresh exterior paint',
    'Large lot-friendly size',
    'Ideal for rental investment',
    'Quick delivery available'
  ],
  'Available immediately. Delivery within 200 miles included.',
  ARRAY['/uploads/properties/boxwood-1.jpg', '/uploads/properties/boxwood-2.jpg'],
  FALSE
),

-- 6. Tiny Home — The Linden
(
  'the-linden',
  'The Linden',
  'tiny', 'available',
  52000.00, 5200.00, 465.00,
  1, 1.0, 400, 2024,
  'Escape Traveler – Linden THOW',
  '28ft × 8.5ft',
  'Mini-Split AC / Propane Heat', 'SIP Panel Construction', 'Trailer (Road-Legal)',
  'The Linden is a road-legal tiny home on wheels (THOW) built with structural insulated panels (SIPs) for superior energy efficiency. Featuring a lofted bedroom, a full kitchen, and a stunning bathroom with a rainfall shower, The Linden proves that small can be spectacular. Perfect for minimalists, adventurers, or Airbnb hosts.',
  ARRAY[
    'Road-legal trailer — move anywhere',
    'SIP panel construction for max insulation',
    'Lofted queen bedroom',
    'Full kitchen with 2-burner induction cooktop',
    'Rainfall shower in compact bathroom',
    'Mini-split HVAC system',
    'Solar-ready electrical setup',
    'Composting toilet option available'
  ],
  'Delivered nationwide. Can be shipped internationally with proper permits. Self-towable or professional delivery available.',
  ARRAY['/uploads/properties/linden-1.jpg', '/uploads/properties/linden-2.jpg'],
  TRUE
),

-- 7. Tiny Home — The Park Ridge (Park Model)
(
  'park-ridge',
  'Park Ridge Park Model',
  'tiny', 'available',
  65000.00, 6500.00, 580.00,
  2, 1.0, 560, 2024,
  'Skyline Homes – Park Ridge RV',
  '40ft × 14ft',
  'Central Air & Heat', 'R-16 Walls / R-30 Ceiling', 'Pier & Beam (Park Setup)',
  'The Park Ridge is an RVIA-certified park model home — the ideal solution for RV parks, vacation communities, or as a permanent residence on private land. With 2 sleeping areas, a full kitchen, and a beautifully finished bathroom, the Park Ridge delivers the feel of a full-size home in a park-friendly footprint.',
  ARRAY[
    'RVIA certified park model',
    'Full kitchen with refrigerator and oven',
    'Two sleeping areas (bedroom + loft)',
    'Full bathroom with tub/shower combo',
    'Central air and heat',
    'Covered awning/porch',
    'Perfect for RV parks and vacation land'
  ],
  'Park model delivery and setup included. Site leveling and utility hookup coordination available.',
  ARRAY['/uploads/properties/park-ridge-1.jpg', '/uploads/properties/park-ridge-2.jpg'],
  FALSE
);


-- ============================================================
-- RESOURCES — Knowledge Base Articles
-- ============================================================
INSERT INTO resources (slug, title, type, excerpt, content, reading_time, is_published) VALUES

(
  'complete-manufactured-home-buying-guide',
  'The Complete Manufactured Home Buying Guide',
  'buying-guide',
  'Everything you need to know before purchasing a manufactured, mobile, or tiny home — from financing to site prep.',
  '<h2>Introduction</h2><p>Buying a manufactured home is one of the smartest financial decisions you can make. With prices 30–50% lower per square foot than site-built homes, and quality that rivals traditional construction, manufactured homes offer an incredible path to homeownership.</p><h2>Step 1: Understand Your Options</h2><p>There are three main categories: <strong>Manufactured Homes</strong> (built to HUD code, transported on a chassis), <strong>Modular Homes</strong> (built to local building codes, assembled on-site), and <strong>Tiny Homes</strong> (under 400 sqft, sometimes on wheels).</p><h2>Step 2: Assess Your Land</h2><p>Do you own land already? If not, you will need to either purchase land or find a community/park that accepts your home type. Make sure to check local zoning ordinances.</p><h2>Step 3: Arrange Financing</h2><p>Financing options include conventional mortgages (for homes on permanent foundations), FHA Title I and Title II loans, chattel loans (for homes not on land), and dealer financing. Speak to our team about what options work best for your situation.</p><h2>Step 4: Choose Your Home</h2><p>Browse our inventory with your budget and space requirements in mind. Consider bedrooms, bathrooms, square footage, and energy efficiency ratings.</p><h2>Step 5: Site Preparation</h2><p>Before delivery, your site needs to be graded, leveled, and prepared with utility connections (water, sewer, electric). Our team can handle all of this for you.</p><h2>Step 6: Delivery and Setup</h2><p>We coordinate the full transport and installation process — from permits to final leveling and utility hookup. Your job is simply to enjoy your new home.</p>',
  8,
  TRUE
),

(
  'new-vs-used-manufactured-home',
  'New vs. Pre-Owned: Which Manufactured Home Is Right for You?',
  'buying-guide',
  'A detailed comparison to help you decide between a brand-new manufactured home and a quality pre-owned model.',
  '<h2>The Case for New Homes</h2><p>New manufactured homes come with modern energy efficiency standards, builder warranties, and the latest design trends. You can often customize floor plans and finishes. The downside is a higher upfront cost.</p><h2>The Case for Pre-Owned Homes</h2><p>Pre-owned homes offer incredible value — often 30–50% less than a comparable new home. Many pre-owned homes are in excellent condition and have already settled, meaning fewer structural surprises. Our pre-owned inventory is inspected before listing.</p><h2>Key Factors to Consider</h2><ul><li><strong>Budget:</strong> Pre-owned homes have lower entry costs and lower monthly payments.</li><li><strong>Customization:</strong> New homes offer more options for personalization.</li><li><strong>Age and Condition:</strong> Check the HUD tag, roof condition, plumbing, and HVAC on pre-owned homes.</li><li><strong>Energy Efficiency:</strong> Newer homes meet stricter energy codes (post-2000 standards are significantly better).</li></ul><h2>Our Recommendation</h2><p>If budget is your primary constraint, a well-inspected pre-owned home offers the best value. If you plan to stay long-term and want modern features, a new home is worth the extra investment.</p>',
  6,
  TRUE
),

(
  'how-to-prepare-your-land-for-delivery',
  'How to Prepare Your Land Before Home Delivery',
  'buying-guide',
  'A practical checklist covering everything you need to do to get your property ready before your manufactured home arrives.',
  '<h2>Why Site Preparation Matters</h2><p>Proper site preparation is critical to the longevity of your home. A poorly prepared site can lead to foundation issues, moisture problems, and structural damage over time.</p><h2>The Site Prep Checklist</h2><ol><li><strong>Clear the area:</strong> Remove all trees, stumps, large rocks, and debris from the home footprint plus a 10-foot perimeter.</li><li><strong>Grade and level:</strong> The ground must be graded to allow water to drain away from the home. A slope of 6 inches per 10 feet is standard.</li><li><strong>Install utilities:</strong> Water lines, sewer/septic connections, and electrical service must be in place before setup.</li><li><strong>Set the foundation:</strong> Whether pier & beam, slab, or permanent foundation — this must be installed and cured before delivery.</li><li><strong>Ensure road access:</strong> The delivery route must accommodate a wide-load transport truck. Clear overhanging branches and check for low bridges.</li><li><strong>Obtain permits:</strong> Most jurisdictions require a building or placement permit. We can assist with this process.</li></ol><h2>How We Can Help</h2><p>Our site preparation team handles grading, foundation installation, and utility coordination. Contact us to schedule a site assessment before you buy.</p>',
  7,
  TRUE
),

(
  'understanding-hud-codes',
  'Understanding HUD Codes and Why They Protect You',
  'buying-guide',
  'A plain-English explanation of the federal HUD code for manufactured homes — and why it matters when you buy.',
  '<h2>What Is the HUD Code?</h2><p>The HUD Manufactured Home Construction and Safety Standards (HUD Code) is a federal building code that has governed all manufactured homes built after June 15, 1976. It covers design, construction, strength, energy efficiency, fire resistance, and transportation.</p><h2>What the HUD Code Covers</h2><ul><li>Structural design and wind load resistance</li><li>Thermal insulation requirements</li><li>Plumbing, electrical, and HVAC systems</li><li>Fire safety standards</li><li>Energy efficiency</li></ul><h2>The HUD Data Plate</h2><p>Every HUD-compliant manufactured home has a <strong>Data Plate</strong> (inside the home, often in a kitchen cabinet or bedroom closet) and a <strong>HUD Label</strong> (red metal plate on the exterior). These confirm the home meets federal standards.</p><h2>Why It Matters for Pre-Owned Homes</h2><p>When buying pre-owned, always verify the HUD labels are present and intact. Missing labels can cause financing problems and are a red flag for the home''s history.</p>',
  5,
  TRUE
);


-- ============================================================
-- FAQs
-- ============================================================
INSERT INTO faqs (question, answer, category, sort_order) VALUES

-- General
('What types of homes do you sell?', 'We specialize in new manufactured homes, quality pre-owned manufactured homes, and tiny homes / park models. Each category is available in various sizes, floor plans, and price points to suit different budgets and lifestyle needs.', 'general', 1),
('Are manufactured homes the same as mobile homes?', 'The terms are often used interchangeably, but technically "mobile home" refers to homes built before June 1976. Homes built after that date under the federal HUD code are called "manufactured homes." All of our inventory meets or exceeds HUD code standards.', 'general', 2),
('What areas do you serve?', 'We deliver nationwide across the continental United States. We also coordinate international shipping to the Caribbean and West Africa. Contact us for a custom delivery quote based on your location.', 'general', 3),

-- Buying Process
('How do I start the buying process?', 'It''s simple: (1) Browse our inventory and find a home you like. (2) Contact us via our inquiry form, phone, or WhatsApp. (3) We''ll schedule a consultation to discuss your needs, site details, and financing options. (4) Once everything is approved, we handle delivery and setup.', 'buying', 1),
('Can I visit and inspect a home before buying?', 'Absolutely. We encourage all buyers to view homes in person before committing. Contact us to schedule a showroom visit or to arrange a viewing of any specific listing.', 'buying', 2),
('How long does the entire process take?', 'For new homes, the process typically takes 4–8 weeks from purchase to move-in, depending on site preparation and delivery distance. Pre-owned homes can be moved faster — sometimes within 2–3 weeks.', 'buying', 3),

-- Financing
('What financing options are available?', 'We work with several lending partners to offer flexible financing solutions including conventional mortgage loans (for homes on permanent foundations), FHA Title I and Title II loans, and chattel loans for homes on leased land. We also offer in-house flexible payment plans. Contact us to discuss your situation.', 'financing', 1),
('What credit score do I need to qualify?', 'Requirements vary by loan type. FHA loans may accept scores as low as 580. Conventional loans typically require 620+. We work with buyers across the credit spectrum and can often find a solution even for those with challenged credit. Fill out our pre-qualification form to get started.', 'financing', 2),
('How much is a typical down payment?', 'Down payments typically range from 5% to 20% of the purchase price depending on the loan type. For a $70,000 home, that could be as low as $3,500 (5%) with an FHA loan. We can walk you through all options during your consultation.', 'financing', 3),
('Is rent-to-own available?', 'Yes, we can discuss rent-to-own arrangements on select properties. This allows you to move in with a lower upfront commitment while working toward full ownership. Contact us to find out which listings qualify.', 'financing', 4),

-- Delivery
('Do you handle delivery and transport?', 'Yes — delivery and transport is one of our core services. We manage the full logistics including permits, routing, and coordination. We offer nationwide delivery and can also arrange international shipping.', 'delivery', 1),
('What is included in delivery?', 'Standard delivery includes transport, placement on your prepared site, leveling, and tie-down. Full-service delivery packages also include site preparation, foundation installation, and utility hookup coordination. Ask us about our turnkey packages.', 'delivery', 2),
('How long does delivery take?', 'Local delivery (under 100 miles) is typically scheduled within 1–2 weeks of purchase. Long-distance delivery takes 2–4 weeks. International shipping takes 6–12 weeks depending on the destination and customs processing.', 'delivery', 3),

-- Installation
('Do I need a permit to install a manufactured home?', 'Yes, in virtually all jurisdictions. Permit requirements vary by state, county, and municipality. Our team can help guide you through the permitting process for your specific location. We strongly recommend contacting your local building department early in the process.', 'installation', 1),
('What foundation options are available?', 'We support all common foundation types: Pier & Beam (most common and cost-effective), Concrete Slab, Permanent Foundation (required for some mortgage types), and in some cases, basement foundations. The right choice depends on your land, local codes, and financing type.', 'installation', 2),
('Do you handle utility connections?', 'We coordinate the connection of your home to existing utility services (water, sewer/septic, and electric). Final connections must be performed by licensed electricians and plumbers per local codes — we can refer trusted contractors in your area.', 'installation', 3);


-- ============================================================
-- SAMPLE NEWSLETTER LEAD
-- ============================================================
INSERT INTO leads (type, name, email) VALUES
('newsletter', 'Sample Subscriber', 'sample@email.com');
