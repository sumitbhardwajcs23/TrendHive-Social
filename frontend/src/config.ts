export interface SiteConfig {
  language: string
  siteTitle: string
  siteDescription: string
}

export interface NavLink {
  label: string
  targetId: string
}

export interface NavigationConfig {
  brandMark: string
  links: NavLink[]
}

export interface HeroConfig {
  wordmarkText: string
  eyebrow: string
  titleLine1: string
  titleLine2: string
  descriptionLine1: string
  descriptionLine2: string
  ctaText: string
  ctaTargetId: string
}

export interface PhilosophyConfig {
  eyebrow: string
  title: string
  body: string
  rollingWords: string[]
}

export interface ProjectMeta {
  label: string
  value: string
}

export interface ProjectData {
  id: string
  title: string
  location: string
  year: string
  image: string
  subtitle: string
  meta: ProjectMeta[]
  paragraphs: string[]
}

export interface GalleryConfig {
  sectionLabel: string
  title: string
  projects: ProjectData[]
}

export interface MediumItem {
  cn: string
  en: string
  description: string
}

export interface MediumsConfig {
  sectionLabel: string
  items: MediumItem[]
}

export interface FooterEntry {
  text: string
  href?: string
}

export interface FooterColumn {
  heading: string
  entries: FooterEntry[]
}

export interface FooterConfig {
  visionText: string
  brandName: string
  columns: FooterColumn[]
  copyright: string
  videoPath: string
}

export interface ProjectDetailConfig {
  backLabel: string
}

export const siteConfig: SiteConfig = {
  language: "en",
  siteTitle: "TrendHive Social — Social Media Agency",
  siteDescription: "TrendHive Social is a unified social media agency management platform with AI-driven publishing, approval workflows, community management, and brand governance.",
}

export const navigationConfig: NavigationConfig = {
  brandMark: "TrendHive Social",
  links: [
    { label: "Platform", targetId: "philosophy" },
    { label: "Services", targetId: "gallery" },
    { label: "Capabilities", targetId: "mediums" },
    { label: "Contact", targetId: "footer" },
  ],
}

export const heroConfig: HeroConfig = {
  wordmarkText: "TRENDHIVE SOCIAL",
  eyebrow: "AI-DRIVEN SOCIAL MEDIA AGENCY",
  titleLine1: "Unified",
  titleLine2: "Management",
  descriptionLine1: "Plan, publish, and monitor content across",
  descriptionLine2: "Meta, LinkedIn, X, and TikTok — all in one place.",
  ctaText: "Explore Platform",
  ctaTargetId: "philosophy",
}

export const philosophyConfig: PhilosophyConfig = {
  eyebrow: "PLATFORM OVERVIEW",
  title: "Orchestrate Everything",
  body: "The TrendHive Social Platform consolidates content planning, multi-platform publishing, client approval workflows, AI-driven automation, community management, and brand governance into a single unified system. Built for agencies that manage multiple client brands across the social landscape.",
  rollingWords: ["PUBLISH", "AUTOMATE", "ENGAGE", "GOVERN", "SCALE", "ANALYZE"],
}

export const galleryConfig: GalleryConfig = {
  sectionLabel: "PLATFORM SERVICES / 004",
  title: "Core Modules",
  projects: [
    {
      id: "content-calendar",
      title: "Publish",
      location: "Multi-Platform",
      year: "2026",
      image: "images/project-1.jpg",
      subtitle: "Draft, schedule, and publish across all major social platforms from a unified content calendar.",
      meta: [
        { label: "MODULE", value: "Content Calendar & Publishing" },
        { label: "PLATFORMS", value: "Meta, LinkedIn, X, TikTok" },
        { label: "FEATURES", value: "Scheduling, Auto-Publish, Retry Logic" },
        { label: "STATUS", value: "Production Ready" },
      ],
      paragraphs: [
        "The Content Calendar & Publishing Engine is the heartbeat of the SRS Platform. Creators can draft posts with platform-specific variants — copy length, aspect ratios, hashtags — all from a single draft interface. No more switching between native platforms or losing track of what goes where.",
        "Each post can be scheduled for a specific date and time per target platform, with the system respecting optimal posting time recommendations where available. Approved posts publish automatically via each platform's native API, with intelligent retry logic that attempts failed publishes at least twice before alerting the responsible Account Manager.",
        "Every post is tagged with rich metadata at creation time — Client, campaign, content type, and industry vertical. This tagging drives the entire automation pipeline, from approval routing to compliance checking, ensuring nothing slips through the cracks.",
      ],
    },
    {
      id: "ai-automation",
      title: "Automate",
      location: "Workflow Engine",
      year: "2026",
      image: "images/project-2.jpg",
      subtitle: "Intelligent routing, automated chasing, and brand-safety checks that run 24/7.",
      meta: [
        { label: "MODULE", value: "AI Workflow Automation" },
        { label: "STACK", value: "LLM / NLP / Rules Engine" },
        { label: "FEATURES", value: "Smart Routing, SLA Chasing, Compliance" },
        { label: "STATUS", value: "Production Ready" },
      ],
      paragraphs: [
        "The AI-Driven Workflow Automation module eliminates manual chasing by intelligently routing content and self-managing approval SLAs. When a creator uploads a new asset, the system reads its tags and automatically determines the correct approval route — regulated industry content goes through mandatory Legal review before reaching the client.",
        "The platform monitors time elapsed since a post entered pending-approval state relative to its scheduled publish time. Automated reminders fire via email and Slack when a post remains unapproved 24 hours before launch, with escalation to Account Managers if the SLA window continues to close.",
        "Brand safety is built in at every step. Draft copy is scanned against client-specific banned terminology lists, missing legal disclaimers are flagged and blocked, and duplicate or near-duplicate posts are detected before they ever reach a reviewer. The system learns, adapts, and protects your clients' brands without human intervention.",
      ],
    },
    {
      id: "social-crm",
      title: "Engage",
      location: "Global Inbox",
      year: "2026",
      image: "images/project-3.jpg",
      subtitle: "Unified inbox with AI sentiment triage and collision prevention for community teams.",
      meta: [
        { label: "MODULE", value: "Unified Social CRM" },
        { label: "CHANNELS", value: "DMs, Comments, Mentions, Tags" },
        { label: "FEATURES", value: "Sentiment AI, Auto-Replies, Locking" },
        { label: "STATUS", value: "Production Ready" },
      ],
      paragraphs: [
        "The Unified Social CRM aggregates every direct message, comment, mention, and tag from Meta, LinkedIn, X, and TikTok into a single Global Inbox per client. No more tab-switching, missed engagements, or delayed responses — everything your community team needs lives in one place.",
        "AI-powered sentiment analysis runs on every inbound item, classifying messages as Positive, Neutral, or Negative/High Priority. High-priority items — angry sentiment, PR-risk keywords — surface at the top of the queue and immediately notify assigned Community Managers. For routine FAQ patterns, the system drafts auto-reply suggestions pending human approval.",
        "Collision prevention ensures two team members never reply to the same comment simultaneously. When a user opens an item, it locks to them with a visible presence indicator. Locks auto-release after a configurable timeout, keeping the queue flowing smoothly even during high-volume periods.",
      ],
    },
    {
      id: "brand-management",
      title: "Govern",
      location: "Asset Library",
      year: "2026",
      image: "images/project-4.jpg",
      subtitle: "Brand Kits, media library, and creative tool integrations for consistent identity.",
      meta: [
        { label: "MODULE", value: "Asset & Brand Management" },
        { label: "TOOLS", value: "Canva, Figma, Adobe" },
        { label: "FEATURES", value: "Brand Kits, Versioning, Search" },
        { label: "STATUS", value: "Production Ready" },
      ],
      paragraphs: [
        "Centralized Asset & Brand Management gives every client a dedicated Brand Kit containing their hex color palette, typography, logo files, and tone-of-voice guidelines. These kits feed directly into the AI copywriting assistant, ensuring every draft matches the client's voice and flags any off-brand terminology before it reaches reviewers.",
        "The cloud Media Library stores raw and finished video, image, and audio files, tagged by client and campaign. Full-text and tag-based search makes finding assets instantaneous, even across large agencies with thousands of files. Creative tool integrations with Canva, Figma, and Adobe allow creators to push finished designs directly into the scheduling queue.",
        "Version history is retained for all assets pushed from external design tools, keeping prior versions available for audit and rollback. The system enforces brand consistency at every touchpoint — from draft creation through final approval — so clients' identities remain protected across every channel and every team member.",
      ],
    },
  ],
}

export const mediumsConfig: MediumsConfig = {
  sectionLabel: "CAPABILITIES",
  items: [
    {
      cn: "AI",
      en: "INTELLIGENT ROUTING",
      description: "Posts are automatically routed through the correct approval chain based on content tags, industry vertical, and client-specific compliance rules. No manual configuration needed at upload time.",
    },
    {
      cn: "CRM",
      en: "SOCIAL ENGAGEMENT",
      description: "All DMs, comments, mentions, and tags from connected platforms flow into a unified inbox per client. AI sentiment triage prioritizes high-risk messages while collision prevention keeps teams coordinated.",
    },
    {
      cn: "KIT",
      en: "BRAND GOVERNANCE",
      description: "Every client gets a Brand Kit with colors, typography, logos, and tone-of-voice guidelines. The AI copy assistant uses these kits to ensure every draft is on-brand and compliant.",
    },
    {
      cn: "OPS",
      en: "AGENCY ANALYTICS",
      description: "Track logged hours against monthly retainer values to compute profitability per client. Scope creep alerts fire when effort exceeds configured thresholds, giving leadership actionable financial visibility.",
    },
  ],
}

export const footerConfig: FooterConfig = {
  visionText: "We believe social media management should be intelligent, automated, and effortless. The TrendHive Social Platform unifies every workflow — from first draft to final publish, from community reply to profitability report — into one cohesive experience designed for modern agencies.",
  brandName: "TrendHive Social",
  columns: [
    {
      heading: "PLATFORM",
      entries: [
        { text: "Content Calendar", href: "#gallery" },
        { text: "AI Automation", href: "#gallery" },
        { text: "Social CRM", href: "#gallery" },
        { text: "Brand Management", href: "#gallery" },
      ],
    },
    {
      heading: "COMPANY",
      entries: [
        { text: "About TrendHive", href: "#philosophy" },
        { text: "Platform Docs" },
        { text: "API Reference" },
        { text: "System Status" },
      ],
    },
    {
      heading: "CONNECT",
      entries: [
        { text: "contact@trendhive.social" },
        { text: "LinkedIn" },
        { text: "Twitter / X" },
        { text: "GitHub" },
      ],
    },
  ],
  copyright: "© 2026 TrendHive Social. All rights reserved.",
  videoPath: "",
}

export const projectDetailConfig: ProjectDetailConfig = {
  backLabel: "← Back",
}

export function getProjectById(id: string): ProjectData | undefined {
  return galleryConfig.projects.find((p) => p.id === id)
}
