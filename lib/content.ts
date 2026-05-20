import {
  Briefcase,
  FlaskConical,
  GraduationCap,
  Heart,
  Laptop,
  Leaf,
  Lightbulb,
  PiggyBank,
  Scale,
  Users,
} from "lucide-react";

export const developmentAreas = [
  {
    slug: "leadership-development",
    title: "Leadership Development",
    description: "Build essential leadership skills to inspire and guide teams effectively.",
    icon: Users,
    tone: "purple",
  },
  {
    slug: "professional-business-development",
    title: "Professional & Business Development",
    description: "Advance your career and business acumen with proven strategies.",
    icon: Briefcase,
    tone: "gold",
  },
  {
    slug: "technological-development",
    title: "Technological Development",
    description: "Stay ahead with cutting-edge tech skills and digital innovation.",
    icon: Laptop,
    tone: "purple",
  },
  {
    slug: "financial-development",
    title: "Financial Development",
    description: "Learn practical money management, investing, and wealth-building principles.",
    icon: PiggyBank,
    tone: "gold",
  },
  {
    slug: "educational-development",
    title: "Educational Development",
    description: "Access learning pathways that support growth, clarity, and long-term mastery.",
    icon: GraduationCap,
    tone: "purple",
  },
  {
    slug: "environmental-sustainability",
    title: "Environmental Sustainability",
    description: "Explore responsible ideas for healthier communities and a better planet.",
    icon: Leaf,
    tone: "green",
  },
  {
    slug: "politics-governance",
    title: "Politics & Governance",
    description: "Understand public leadership, policy thinking, and the systems that shape civic life.",
    icon: Scale,
    tone: "purple",
  },
  {
    slug: "health-sciences",
    title: "Health & Sciences",
    description: "Follow evidence-based health ideas, scientific literacy, and emerging research with real-world relevance.",
    icon: FlaskConical,
    tone: "gold",
  },
  {
    slug: "relationship-development",
    title: "Relationship Development",
    description: "Strengthen spiritual, social, and personal relationships with intention.",
    icon: Heart,
    tone: "rose",
  },
];

export type ContentSection = {
  heading: string;
  body: string;
  bullets?: string[];
};

export type StaticArticle = {
  slug: string;
  category: string;
  area: string;
  level: string;
  title: string;
  excerpt: string;
  readTime: string;
  author: string;
  date: string;
  image: string;
  intro: string;
  sections: ContentSection[];
  quote?: string;
  authorBio: string;
  relatedSlugs: string[];
};

export const featuredArticles: StaticArticle[] = [
  {
    slug: "transformational-leadership-modern-organizations",
    category: "leadership",
    area: "Leadership Development",
    level: "Advanced",
    title: "The Art of Transformational Leadership in Modern Organizations",
    excerpt:
      "Discover how to inspire and empower your team through authentic leadership practices that drive real change.",
    readTime: "8 min read",
    author: "James Morrison",
    date: "Apr 15, 2026",
    image:
      "https://images.unsplash.com/photo-1681949103006-70066fb25dfe?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsZWFkZXJzaGlwJTIwdGVhbSUyMG1lZXRpbmd8ZW58MXx8fHwxNzc2NzAwNzQyfDA&ixlib=rb-4.1.0&q=80&w=1080",
    intro:
      "Leadership in the 21st century requires more than authority. It demands authenticity, empathy, and the ability to turn uncertainty into shared direction.",
    sections: [
      {
        heading: "Key Takeaways",
        body:
          "Transformational leadership begins when leaders connect people to purpose, create psychological safety, and keep decision-making transparent. Teams respond to leaders who listen carefully, communicate consistently, and model the standards they expect from others.",
      },
      {
        heading: "Practical Applications",
        body:
          "Understanding theory is important, but applying these concepts in real-world scenarios is where true transformation occurs. Use these steps to build momentum in your personal and professional development journey.",
        bullets: [
          "Start with small, consistent actions that build momentum over time",
          "Track your progress and adjust strategies based on results",
          "Seek feedback from mentors and peers to accelerate growth",
          "Stay committed to continuous learning and adaptation",
        ],
      },
      {
        heading: "Moving Forward",
        body:
          "The journey of development is ongoing and ever-evolving. By staying curious, remaining open to new ideas, and consistently applying what you learn, you will continue to grow and achieve your goals.",
      },
    ],
    quote:
      "Success is not final, failure is not fatal: it is the courage to continue that counts.",
    authorBio:
      "James Morrison is a thought leader in leadership development with years of experience helping individuals and organizations build resilient, high-performing teams.",
    relatedSlugs: ["leading-through-crisis-framework-resilience", "building-personal-brand-opens-doors"],
  },
  {
    slug: "building-personal-brand-opens-doors",
    category: "professional-business",
    area: "Professional & Business Development",
    level: "Intermediate",
    title: "Building a Personal Brand That Opens Doors",
    excerpt:
      "Your personal brand is your professional superpower. Learn how to craft and communicate yours effectively.",
    readTime: "6 min read",
    author: "Sarah Chen",
    date: "Apr 12, 2026",
    image:
      "https://images.unsplash.com/photo-1775163560631-6ff15eb2fa1f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcm9mZXNzaW9uYWwlMjBuZXR3b3JraW5nJTIwZXZlbnR8ZW58MXx8fHwxNzc2NjcwNjAyfDA&ixlib=rb-4.1.0&q=80&w=1080",
    intro:
      "A strong personal brand is the clear public expression of your expertise, values, and track record.",
    sections: [
      {
        heading: "Clarify Your Promise",
        body:
          "Start by defining the problems you solve, the audience you serve, and the proof that makes your work credible. A memorable brand is specific enough for people to repeat it when you are not in the room.",
      },
      {
        heading: "Build Visible Trust",
        body:
          "Share useful ideas, document outcomes, and engage with communities where your skills matter. Consistency matters more than volume because trust compounds through repeated signals.",
        bullets: [
          "Write one useful insight from your field every week",
          "Turn project lessons into practical examples",
          "Keep your profiles aligned across major platforms",
        ],
      },
      {
        heading: "Create Opportunity Loops",
        body:
          "The best personal brands make it easy for collaborators, clients, employers, and communities to understand where you can contribute immediately.",
      },
    ],
    quote:
      "Reputation grows fastest when your message, work, and relationships point in the same direction.",
    authorBio:
      "Sarah Chen advises professionals and founders on career positioning, business storytelling, and relationship-led growth.",
    relatedSlugs: ["startup-growth-market-signals", "creative-brainstorming-better-ideas"],
  },
  {
    slug: "ai-automation-skills-future-workplace",
    category: "technology",
    area: "Technological Development",
    level: "Advanced",
    title: "AI and Automation: Skills for the Future Workplace",
    excerpt:
      "Prepare for tomorrow by understanding the AI tools and automation skills that will define the next era of work.",
    readTime: "10 min read",
    author: "Michael Torres",
    date: "Apr 10, 2026",
    image:
      "https://images.unsplash.com/photo-1697577418970-95d99b5a55cf?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhcnRpZmljaWFsJTIwaW50ZWxsaWdlbmNlJTIwdGVjaG5vbG9neXxlbnwxfHx8fDE3NzY2MDk0MTV8MA&ixlib=rb-4.1.0&q=80&w=1080",
    intro:
      "AI is changing job design, decision-making, operations, and creative production. The opportunity belongs to people who can pair tools with judgment.",
    sections: [
      {
        heading: "The New Skill Stack",
        body:
          "Future-ready workers need prompt literacy, workflow mapping, data awareness, automation design, and ethical judgment. These skills help teams move faster without lowering quality.",
      },
      {
        heading: "Where to Begin",
        body:
          "Start with repetitive workflows that already have clear inputs and outputs. Use AI to draft, summarize, classify, research, and check patterns before moving into higher-risk decisions.",
        bullets: [
          "Audit recurring tasks and identify manual bottlenecks",
          "Create reusable prompts for common workflows",
          "Keep human review in place for sensitive decisions",
          "Measure time saved, quality, and user impact",
        ],
      },
      {
        heading: "Human Advantage",
        body:
          "Automation increases the value of context, empathy, strategy, and taste. The strongest professionals will use AI to extend their judgment, not replace it.",
      },
    ],
    quote:
      "AI rewards people who can ask better questions and turn answers into responsible action.",
    authorBio:
      "Michael Torres writes about workplace technology, automation strategy, and digital capability building for teams.",
    relatedSlugs: ["cybersecurity-digital-protection", "crypto-blockchain-technology"],
  },
  {
    slug: "financial-discipline-for-builders",
    category: "finance",
    area: "Financial Development",
    level: "Foundational",
    title: "Financial Discipline for Builders, Creators, and Founders",
    excerpt:
      "Simple structures for managing resources while pursuing ambitious personal and business goals.",
    readTime: "5 min read",
    author: "Nora Williams",
    date: "Apr 09, 2026",
    image:
      "https://images.unsplash.com/photo-1748439281934-2803c6a3ee36?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmaW5hbmNpYWwlMjBjaGFydHMlMjBhbmFseXRpY3N8ZW58MXx8fHwxNzc2NjcwNDczfDA&ixlib=rb-4.1.0&q=80&w=1080",
    intro:
      "Growth requires capital, but capital only becomes useful when it is directed with discipline.",
    sections: [
      {
        heading: "Build a Clear Money System",
        body:
          "Separate personal expenses, operating costs, taxes, investment capital, and emergency reserves. Clarity turns financial pressure into decisions you can manage.",
      },
      {
        heading: "Protect the Downside",
        body:
          "Ambitious people often over-focus on opportunity and under-plan for volatility. A simple reserve strategy gives you room to keep building through slow months.",
        bullets: [
          "Track cash flow every week",
          "Create a baseline monthly operating number",
          "Hold reserves before increasing lifestyle costs",
        ],
      },
      {
        heading: "Fund the Future",
        body:
          "Discipline is not restriction. It is the structure that lets you keep investing in work, people, tools, and learning when opportunities appear.",
      },
    ],
    quote:
      "Financial clarity gives ambition a longer runway.",
    authorBio:
      "Nora Williams helps creators and early-stage founders build practical financial habits for sustainable growth.",
    relatedSlugs: ["crypto-blockchain-technology", "startup-growth-market-signals"],
  },
  {
    slug: "education-in-the-age-of-self-directed-learning",
    category: "education",
    area: "Educational Development",
    level: "Foundational",
    title: "Education in the Age of Self-Directed Learning",
    excerpt:
      "Design a learning system that turns curiosity into measurable progress across your career and life.",
    readTime: "7 min read",
    author: "Amina Brooks",
    date: "Apr 08, 2026",
    image:
      "https://images.unsplash.com/photo-1752920299180-e8fd9276c202?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzdHVkZW50JTIwc3R1ZHlpbmclMjBib29rc3xlbnwxfHx8fDE3NzY2NjE3Njd8MA&ixlib=rb-4.1.0&q=80&w=1080",
    intro:
      "Self-directed learning works best when curiosity is supported by structure, feedback, and useful projects.",
    sections: [
      {
        heading: "Choose a Learning Outcome",
        body:
          "Replace vague goals with visible outcomes: publish a case study, build a prototype, pass a certification, or teach a concept to someone else.",
      },
      {
        heading: "Practice Retrieval",
        body:
          "Reading is only one part of learning. Recall, explain, apply, and review ideas until they become usable knowledge.",
        bullets: [
          "Summarize every lesson in your own words",
          "Apply one concept within 48 hours",
          "Review weak points weekly",
        ],
      },
      {
        heading: "Learn in Public",
        body:
          "Sharing your progress invites feedback and creates accountability while helping others learn from your process.",
      },
    ],
    quote:
      "A good learning system turns attention into ability.",
    authorBio:
      "Amina Brooks designs learning experiences for professionals, students, and community programs.",
    relatedSlugs: ["ai-automation-skills-future-workplace", "creative-brainstorming-better-ideas"],
  },
  {
    slug: "sustainable-living-community-impact",
    category: "sustainability",
    area: "Environmental Sustainability",
    level: "Intermediate",
    title: "Sustainable Living That Creates Community Impact",
    excerpt:
      "Move beyond individual habits and learn how small environmental choices can influence neighborhoods and organizations.",
    readTime: "6 min read",
    author: "Elena Park",
    date: "Apr 06, 2026",
    image:
      "https://images.unsplash.com/photo-1694663150234-2d0a7446430f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzdXN0YWluYWJsZSUyMGVjbyUyMGZyaWVuZGx5JTIwbGl2aW5nfGVufDF8fHx8MTc3NjcwMDc0M3ww&ixlib=rb-4.1.0&q=80&w=1080",
    intro:
      "Sustainability becomes durable when it is practical, shared, and connected to everyday systems.",
    sections: [
      {
        heading: "Start with Visible Habits",
        body:
          "Energy use, transport, food waste, and purchasing choices are practical starting points. The goal is not perfection; it is repeatable improvement.",
      },
      {
        heading: "Make It Collective",
        body:
          "Invite households, teams, schools, and local groups into simple challenges that make better environmental choices easier to adopt.",
        bullets: [
          "Track one measurable habit for 30 days",
          "Create shared resources for reuse and repair",
          "Support local suppliers with responsible practices",
        ],
      },
      {
        heading: "Connect Values to Systems",
        body:
          "The highest impact comes when personal choices influence policies, purchasing standards, and community infrastructure.",
      },
    ],
    quote:
      "Sustainable change lasts when it becomes convenient, visible, and shared.",
    authorBio:
      "Elena Park covers environmental responsibility, local action, and practical sustainability programs.",
    relatedSlugs: ["relationship-intelligence-stronger-communities", "financial-discipline-for-builders"],
  },
  {
    slug: "relationship-intelligence-stronger-communities",
    category: "social",
    area: "Relationship Development",
    level: "Intermediate",
    title: "Relationship Intelligence for Stronger Communities",
    excerpt:
      "Build trust, communicate with care, and develop the social awareness needed for healthy families, teams, and communities.",
    readTime: "7 min read",
    author: "David Okoro",
    date: "Apr 04, 2026",
    image:
      "https://images.unsplash.com/photo-1758179765242-66d864a121f2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwZW9wbGUlMjBjb25uZWN0aW5nJTIwZnJpZW5kc2hpcHxlbnwxfHx8fDE3NzY3MDA3NDR8MA&ixlib=rb-4.1.0&q=80&w=1080",
    intro:
      "Relationship intelligence is the ability to understand needs, manage conflict, and communicate in ways that strengthen trust.",
    sections: [
      {
        heading: "Listen for Context",
        body:
          "Strong relationships improve when people feel understood before they are advised. Listening gives you the context required to respond wisely.",
      },
      {
        heading: "Repair Quickly",
        body:
          "Conflict is normal, but unresolved tension weakens community. Repair requires accountability, clarity, and a willingness to reset expectations.",
        bullets: [
          "Name the issue without attacking the person",
          "Acknowledge the impact of your actions",
          "Agree on the next behavior, not just the apology",
        ],
      },
      {
        heading: "Build Shared Rhythms",
        body:
          "Consistent check-ins, shared service, and honest conversations create belonging that survives pressure.",
      },
    ],
    quote:
      "Healthy communities are built through repeated moments of trust.",
    authorBio:
      "David Okoro writes about community development, communication, and relational leadership.",
    relatedSlugs: ["sustainable-living-community-impact", "transformational-leadership-modern-organizations"],
  },
  {
    slug: "leading-through-crisis-framework-resilience",
    category: "leadership",
    area: "Leadership Development",
    level: "Advanced",
    title: "Leading Through Crisis: A Framework for Resilience",
    excerpt:
      "Develop the skills to guide your team through challenging times with confidence and clarity.",
    readTime: "11 min read",
    author: "James Morrison",
    date: "Mar 28, 2026",
    image:
      "https://images.unsplash.com/photo-1758521961707-9075574354c1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxidXNpbmVzcyUyMGNyaXNpcyUyMG1hbmFnZW1lbnR8ZW58MXx8fHwxNzc2NzAwNzQ1fDA&ixlib=rb-4.1.0&q=80&w=1080",
    intro:
      "Crisis leadership is the discipline of creating calm, prioritizing clearly, and keeping people aligned when conditions change quickly.",
    sections: [
      {
        heading: "Stabilize First",
        body:
          "Before solving every problem, leaders must establish facts, reduce confusion, and define the first decisions that protect people and operations.",
      },
      {
        heading: "Communicate Rhythmically",
        body:
          "Teams need predictable updates, even when every answer is not yet available. Consistency reduces anxiety and keeps action coordinated.",
        bullets: [
          "Share what is known, unknown, and being decided",
          "Create one source of truth for updates",
          "Revisit priorities as new information arrives",
        ],
      },
      {
        heading: "Learn After Action",
        body:
          "Resilience grows when teams turn pressure into learning, document what worked, and redesign weak systems before the next challenge.",
      },
    ],
    quote:
      "In crisis, clarity is an act of care.",
    authorBio:
      "James Morrison helps organizations develop leadership systems that hold up under pressure.",
    relatedSlugs: ["transformational-leadership-modern-organizations", "startup-growth-market-signals"],
  },
  {
    slug: "civic-trust-public-leadership",
    category: "politics",
    area: "Politics & Governance",
    level: "Intermediate",
    title: "Civic Trust and the New Standard for Public Leadership",
    excerpt:
      "Why legitimacy, transparency, and service delivery now matter more than rhetoric for modern governance.",
    readTime: "8 min read",
    author: "Amara Bello",
    date: "Apr 03, 2026",
    image:
      "https://images.unsplash.com/photo-1529107386315-e1a2ed48a620?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxnb3Zlcm5hbmNlJTIwcHVibGljJTIwbGVhZGVyc2hpcHxlbnwxfHx8fDE3ODAwMjAwMDB8MA&ixlib=rb-4.1.0&q=80&w=1080",
    intro:
      "Public trust is increasingly shaped by whether institutions can communicate clearly, respond quickly, and deliver visible results.",
    sections: [
      {
        heading: "Trust Is Built Through Competence",
        body:
          "Citizens judge leadership by how reliably public systems solve real problems. Competence, transparency, and follow-through build legitimacy more effectively than slogans.",
      },
      {
        heading: "Governance Requires Clear Feedback Loops",
        body:
          "Healthy institutions gather signals from communities, translate them into action, and report progress in ways the public can verify.",
        bullets: [
          "Publish goals and measurable delivery timelines",
          "Use citizen feedback to refine implementation priorities",
          "Communicate tradeoffs openly when resources are limited",
        ],
      },
      {
        heading: "Leadership Beyond Elections",
        body:
          "Sustainable governance depends on strengthening systems, not just personalities. Public leaders create confidence when institutions continue to perform under pressure.",
      },
    ],
    quote:
      "Trust grows when public leadership is experienced as service, not spectacle.",
    authorBio:
      "Amara Bello writes on democratic institutions, civic participation, and the practice of accountable public leadership.",
    relatedSlugs: ["policy-literacy-for-rising-civic-leaders", "transformational-leadership-modern-organizations"],
  },
  {
    slug: "startup-growth-market-signals",
    category: "business",
    area: "Professional & Business Development",
    level: "Intermediate",
    title: "Reading Market Signals Before Scaling a Startup",
    excerpt:
      "Learn how founders can use customer behavior, retention, and pricing feedback to scale with evidence.",
    readTime: "8 min read",
    author: "Sarah Chen",
    date: "Mar 24, 2026",
    image:
      "https://images.unsplash.com/photo-1758873272412-7166447a94ae?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzdGFydHVwJTIwYnVzaW5lc3MlMjBncm93dGh8ZW58MXx8fHwxNzc2NzAwNzQ1fDA&ixlib=rb-4.1.0&q=80&w=1080",
    intro:
      "Scaling too early can turn small product gaps into expensive operational problems.",
    sections: [
      {
        heading: "Watch Behavior, Not Hype",
        body:
          "Customer usage, referrals, renewal intent, and willingness to pay reveal more than compliments. Strong signals show up repeatedly across segments.",
      },
      {
        heading: "Test Before Expanding",
        body:
          "Use focused experiments to test pricing, messaging, onboarding, and support capacity before adding more spend or headcount.",
        bullets: [
          "Identify the metric that proves repeat value",
          "Interview customers who stayed and customers who left",
          "Document what must be true before scaling",
        ],
      },
      {
        heading: "Scale with Evidence",
        body:
          "Growth is healthier when it follows validated demand, clear economics, and a team that can deliver consistently.",
      },
    ],
    quote:
      "The market speaks through behavior before it speaks through revenue.",
    authorBio:
      "Sarah Chen works with founders on positioning, customer development, and early growth strategy.",
    relatedSlugs: ["building-personal-brand-opens-doors", "financial-discipline-for-builders"],
  },
  {
    slug: "preventive-health-habits-for-modern-work",
    category: "health",
    area: "Health & Sciences",
    level: "Foundational",
    title: "Preventive Health Habits for High-Performance Work and Life",
    excerpt:
      "Simple evidence-based practices that improve energy, resilience, and long-term wellbeing in demanding schedules.",
    readTime: "7 min read",
    author: "Dr. Leah Morgan",
    date: "Apr 02, 2026",
    image:
      "https://images.unsplash.com/photo-1576091160550-2173dba999ef?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxoZWFsdGglMjBjYXJlJTIwbWVkaWNhbCUyMGNvbnN1bHRhdGlvbnxlbnwxfHx8fDE3ODAwMjAwMDB8MA&ixlib=rb-4.1.0&q=80&w=1080",
    intro:
      "Preventive health is less about perfection and more about creating stable routines that keep the body and mind reliable under pressure.",
    sections: [
      {
        heading: "Focus on the Foundational Signals",
        body:
          "Sleep quality, movement, nutrition, stress, and routine screening tell you far more about long-term health than reactive fixes after burnout sets in.",
      },
      {
        heading: "Build Sustainable Systems",
        body:
          "Health habits are easier to keep when they fit your real calendar, environment, and work demands rather than an idealized routine.",
        bullets: [
          "Protect a consistent sleep window during the week",
          "Schedule movement into the workday instead of hoping it appears",
          "Use routine screening and primary care visits to catch issues early",
        ],
      },
      {
        heading: "Performance Depends on Recovery",
        body:
          "People who want durable output need recovery systems that are treated as seriously as ambition. Recovery is operational capacity, not a reward after collapse.",
      },
    ],
    quote:
      "Preventive health is how long-term performance stays honest.",
    authorBio:
      "Dr. Leah Morgan covers preventive medicine, workforce wellbeing, and the science of sustainable performance.",
    relatedSlugs: ["science-literacy-for-everyday-medical-decisions", "ai-automation-skills-future-workplace"],
  },
  {
    slug: "cybersecurity-digital-protection",
    category: "technology",
    area: "Technological Development",
    level: "Foundational",
    title: "Cybersecurity Habits Every Digital Professional Needs",
    excerpt:
      "Protect your work, identity, and organization with simple security practices that reduce everyday risk.",
    readTime: "6 min read",
    author: "Michael Torres",
    date: "Mar 20, 2026",
    image:
      "https://images.unsplash.com/photo-1768839720936-87ce3adf2d08?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjeWJlcnNlY3VyaXR5JTIwZGlnaXRhbCUyMHByb3RlY3Rpb258ZW58MXx8fHwxNzc2NjcwMDMwfDA&ixlib=rb-4.1.0&q=80&w=1080",
    intro:
      "Security is not only a technical department. It is a daily practice for anyone who creates, stores, or shares digital information.",
    sections: [
      {
        heading: "Secure Access",
        body:
          "Strong passwords, password managers, and multi-factor authentication reduce the easiest paths attackers use to enter accounts.",
      },
      {
        heading: "Reduce Exposure",
        body:
          "Limit unnecessary permissions, update software, and treat unexpected links or file requests with caution.",
        bullets: [
          "Use unique passwords for important accounts",
          "Enable multi-factor authentication",
          "Review shared files and app permissions quarterly",
        ],
      },
      {
        heading: "Build Team Awareness",
        body:
          "Security improves when teams make reporting easy and treat suspicious activity as useful information, not personal failure.",
      },
    ],
    quote:
      "Good security habits make trust easier to protect.",
    authorBio:
      "Michael Torres writes practical guides on digital work, automation, and cybersecurity basics.",
    relatedSlugs: ["ai-automation-skills-future-workplace", "crypto-blockchain-technology"],
  },
  {
    slug: "crypto-blockchain-technology",
    category: "finance",
    area: "Financial Development",
    level: "Intermediate",
    title: "Blockchain, Digital Assets, and the New Finance Literacy",
    excerpt:
      "Understand blockchain beyond hype and build a clearer framework for evaluating digital finance opportunities.",
    readTime: "9 min read",
    author: "Nora Williams",
    date: "Mar 18, 2026",
    image:
      "https://images.unsplash.com/photo-1590286162167-70fb467846ae?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjcnlwdG9jdXJyZW5jeSUyMGJsb2NrY2hhaW4lMjB0ZWNobm9sb2d5fGVufDF8fHx8MTc3NjcwMDc0NXww&ixlib=rb-4.1.0&q=80&w=1080",
    intro:
      "Digital assets require a balanced lens: technology, risk, regulation, utility, and personal financial discipline.",
    sections: [
      {
        heading: "Separate Technology from Speculation",
        body:
          "Blockchain can support settlement, identity, ownership records, and programmable assets. Speculation is only one use case, and it carries high volatility.",
      },
      {
        heading: "Assess Risk Clearly",
        body:
          "Before investing or building, understand custody, liquidity, counterparty risk, regulation, and the difference between a useful network and a noisy trend.",
        bullets: [
          "Never risk money needed for essential obligations",
          "Verify custody and platform security",
          "Look for real usage, not only social momentum",
        ],
      },
      {
        heading: "Build Literacy First",
        body:
          "The goal is not to chase every opportunity. It is to understand the systems well enough to make careful decisions.",
      },
    ],
    quote:
      "New finance tools still require old finance discipline.",
    authorBio:
      "Nora Williams writes about financial systems, creator economics, and practical money decisions.",
    relatedSlugs: ["financial-discipline-for-builders", "cybersecurity-digital-protection"],
  },
  {
    slug: "policy-literacy-for-rising-civic-leaders",
    category: "governance",
    area: "Politics & Governance",
    level: "Foundational",
    title: "Policy Literacy for Rising Civic Leaders",
    excerpt:
      "Learn how to read policy proposals, understand implementation risk, and participate more effectively in public decision-making.",
    readTime: "6 min read",
    author: "Daniel Mensah",
    date: "Mar 26, 2026",
    image:
      "https://images.unsplash.com/photo-1517048676732-d65bc937f952?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwdWJsaWMlMjBwb2xpY3klMjBtZWV0aW5nfGVufDF8fHx8MTc4MDAyMDAwMHww&ixlib=rb-4.1.0&q=80&w=1080",
    intro:
      "Policy literacy helps citizens and young leaders move from opinion to informed participation by understanding how ideas become implementation.",
    sections: [
      {
        heading: "Read Beyond Headlines",
        body:
          "Policy proposals should be examined through goals, cost, delivery structure, incentives, and who will be affected most. Headlines rarely capture those layers.",
      },
      {
        heading: "Implementation Is the Real Test",
        body:
          "A good idea can still fail when it lacks staffing, budget, timelines, coordination, or accountability. Policy literacy means learning to ask how execution will work.",
        bullets: [
          "Identify the agencies or institutions responsible for delivery",
          "Check whether funding and timelines are realistic",
          "Look for measurable outcomes, not only broad promises",
        ],
      },
      {
        heading: "Civic Participation Improves with Clarity",
        body:
          "The public contributes more effectively when people understand the mechanics of governance and can evaluate tradeoffs with discipline.",
      },
    ],
    quote:
      "Policy literacy turns civic passion into useful judgment.",
    authorBio:
      "Daniel Mensah writes about governance systems, civic education, and public-sector execution.",
    relatedSlugs: ["civic-trust-public-leadership", "financial-discipline-for-builders"],
  },
  {
    slug: "creative-brainstorming-better-ideas",
    category: "social",
    area: "Educational Development",
    level: "Foundational",
    title: "Creative Brainstorming for Better Ideas and Better Teams",
    excerpt:
      "Use structured collaboration to move from loose thoughts to useful concepts people can test and improve.",
    readTime: "5 min read",
    author: "Amina Brooks",
    date: "Mar 12, 2026",
    image:
      "https://images.unsplash.com/photo-1758691737045-3ece61135061?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjcmVhdGl2ZSUyMGJyYWluc3Rvcm1pbmclMjBpZGVhc3xlbnwxfHx8fDE3NzY3MDA3NDV8MA&ixlib=rb-4.1.0&q=80&w=1080",
    intro:
      "The best brainstorming sessions are not random. They create space for imagination, then use constraints to shape ideas into action.",
    sections: [
      {
        heading: "Frame the Challenge",
        body:
          "Teams generate better ideas when they understand the user, the problem, and the limits they must work within.",
      },
      {
        heading: "Separate Generation from Evaluation",
        body:
          "First create options, then critique them. Mixing both too early causes teams to reject promising ideas before they are developed.",
        bullets: [
          "Write ideas individually before group discussion",
          "Cluster ideas by theme",
          "Select experiments instead of debating opinions",
        ],
      },
      {
        heading: "Turn Ideas into Tests",
        body:
          "A useful idea becomes stronger when it meets reality through prototypes, interviews, pilots, or small launches.",
      },
    ],
    quote:
      "Creativity improves when people have freedom inside a useful frame.",
    authorBio:
      "Amina Brooks helps teams design learning sessions, workshops, and creative collaboration systems.",
    relatedSlugs: ["education-in-the-age-of-self-directed-learning", "building-personal-brand-opens-doors"],
  },
  {
    slug: "science-literacy-for-everyday-medical-decisions",
    category: "science",
    area: "Health & Sciences",
    level: "Intermediate",
    title: "Science Literacy for Everyday Medical Decisions",
    excerpt:
      "A practical guide to reading health claims, understanding evidence, and making more informed decisions about treatments and research headlines.",
    readTime: "8 min read",
    author: "Dr. Samuel Reed",
    date: "Mar 16, 2026",
    image:
      "https://images.unsplash.com/photo-1532187643603-ba119ca4109e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzY2llbmNlJTIwbGFib3JhdG9yeSUyMGhlYWx0aHxlbnwxfHx8fDE3ODAwMjAwMDB8MA&ixlib=rb-4.1.0&q=80&w=1080",
    intro:
      "The modern information environment makes health advice abundant, but not equally reliable. Science literacy helps you distinguish evidence from noise.",
    sections: [
      {
        heading: "Look at Study Quality",
        body:
          "Ask whether a claim comes from a peer-reviewed study, a small sample, an observational finding, or a randomized trial. The strength of evidence matters as much as the headline.",
      },
      {
        heading: "Understand Risk and Context",
        body:
          "Relative improvement can sound dramatic without absolute risk, side effects, or information about who the treatment was actually tested on.",
        bullets: [
          "Read beyond the summary when a health claim sounds absolute",
          "Check whether results were replicated by other studies",
          "Use clinicians and trusted institutions to interpret uncertainty",
        ],
      },
      {
        heading: "Use Science as a Decision Tool",
        body:
          "Science literacy is not about memorizing jargon. It is about asking better questions before making medical, lifestyle, or policy decisions.",
      },
    ],
    quote:
      "Better health decisions start with better questions about evidence.",
    authorBio:
      "Dr. Samuel Reed writes about public health communication, research interpretation, and science-informed decision-making.",
    relatedSlugs: ["preventive-health-habits-for-modern-work", "education-in-the-age-of-self-directed-learning"],
  },
];

export const trendingPosts = [
  featuredArticles[0],
  featuredArticles[1],
  featuredArticles[2],
  featuredArticles[7],
];

export const ecosystemLinks = [
  {
    title: "JMO BIZHUB",
    description: "Business growth, entrepreneurship, and market-building resources.",
    icon: Lightbulb,
  },
  {
    title: "JMO Academy",
    description: "Learning pathways, training, and development programs.",
    icon: GraduationCap,
  },
];
