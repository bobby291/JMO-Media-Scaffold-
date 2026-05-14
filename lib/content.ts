import {
  Briefcase,
  GraduationCap,
  Heart,
  Laptop,
  Leaf,
  Lightbulb,
  PiggyBank,
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
    slug: "relationship-development",
    title: "Relationship Development",
    description: "Strengthen spiritual, social, and personal relationships with intention.",
    icon: Heart,
    tone: "rose",
  },
];

export const featuredArticles = [
  {
    slug: "future-ready-leadership",
    category: "Leadership",
    title: "Future-ready leadership habits for fast-changing teams",
    excerpt:
      "A practical guide to clarity, communication, and decision-making for emerging leaders.",
    readTime: "7 min read",
  },
  {
    slug: "digital-skills-career-growth",
    category: "Technology",
    title: "Digital skills every professional should build this year",
    excerpt:
      "Explore the tools and habits that help professionals stay relevant in a digital economy.",
    readTime: "6 min read",
  },
  {
    slug: "financial-discipline-for-builders",
    category: "Finance",
    title: "Financial discipline for builders, creators, and founders",
    excerpt:
      "Simple structures for managing resources while pursuing ambitious personal goals.",
    readTime: "5 min read",
  },
];

export const trendingPosts = [
  "How to build a resilient mindset",
  "Business lessons from community-led brands",
  "Practical sustainability for everyday life",
  "Relationship habits that protect your focus",
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
