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
    category: "leadership",
    title: "The Art of Transformational Leadership in Modern Organizations",
    excerpt:
      "Discover how to inspire and empower your team through authentic leadership practices that drive real...",
    readTime: "8 min read",
    author: "James Morrison",
    date: "Apr 15, 2026",
    image:
      "https://images.unsplash.com/photo-1552664730-d307ca884978?q=80&w=1800&auto=format&fit=crop",
  },
  {
    slug: "digital-skills-career-growth",
    category: "professional-business",
    title: "Building a Personal Brand That Opens Doors",
    excerpt:
      "Your personal brand is your professional superpower. Learn how to craft and communicate yours effectively.",
    readTime: "6 min read",
    author: "Sarah Chen",
    date: "Apr 12, 2026",
    image:
      "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?q=80&w=1800&auto=format&fit=crop",
  },
  {
    slug: "financial-discipline-for-builders",
    category: "financial",
    title: "Financial discipline for builders, creators, and founders",
    excerpt:
      "Simple structures for managing resources while pursuing ambitious personal goals.",
    readTime: "5 min read",
    author: "Nora Williams",
    date: "Apr 09, 2026",
    image:
      "https://images.unsplash.com/photo-1554224155-6726b3ff858f?q=80&w=1800&auto=format&fit=crop",
  },
];

export const trendingPosts = [
  featuredArticles[0],
  featuredArticles[1],
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
