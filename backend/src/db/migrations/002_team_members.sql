CREATE TABLE IF NOT EXISTS team_members (
  id            SERIAL PRIMARY KEY,
  name          VARCHAR(255) NOT NULL,
  role          VARCHAR(255) NOT NULL,
  bio           TEXT,
  email         VARCHAR(255),
  photo_url     TEXT,
  sort_order    INTEGER NOT NULL DEFAULT 0,
  is_published  BOOLEAN NOT NULL DEFAULT TRUE,
  created_at    TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at    TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_team_members_published ON team_members(is_published);
CREATE INDEX IF NOT EXISTS idx_team_members_sort ON team_members(sort_order);

INSERT INTO team_members (name, role, bio, email, sort_order)
SELECT v.name, v.role, v.bio, v.email, v.sort_order
FROM (
  VALUES
    ('Marcus Webb', 'General Manager', 'Marcus has spent 15 years in manufactured housing and leads our team with a focus on honest, no-pressure sales.', 'marcus@dealersite.com', 1),
    ('Jennifer Cole', 'Sales Manager', 'Jennifer helps families compare floor plans and find the right home for their budget, land, and lifestyle.', 'jennifer@dealersite.com', 2),
    ('David Ortiz', 'Home Specialist', 'David knows every model on our lot and loves walking buyers through features, options, and customization.', 'david@dealersite.com', 3),
    ('Rachel Nguyen', 'Financing Coordinator', 'Rachel connects buyers with lenders who understand manufactured and land-home loans.', 'rachel@dealersite.com', 4),
    ('Tom Bradley', 'Delivery & Setup Lead', 'Tom coordinates transport, placement, and tie-down so your home arrives on schedule.', 'tom@dealersite.com', 5),
    ('Sandra Ellis', 'Customer Care', 'Sandra follows up after purchase and makes sure every buyer feels supported through move-in.', 'sandra@dealersite.com', 6)
) AS v(name, role, bio, email, sort_order)
WHERE NOT EXISTS (SELECT 1 FROM team_members LIMIT 1);
