export interface CoachRosterBadge {
  label: string
  tone: 'signature' | 'credential'
}

export interface CoachRosterProfile {
  name: string
  slug: string
  role: string
  image: string
  imagePosition: string
  bio: string
  badges: CoachRosterBadge[]
}

export const coachRoster: CoachRosterProfile[] = [
  {
    name: 'Joey Manchurek',
    slug: 'joey-manchurek',
    role: 'Founder & Head Pro · Toronto',
    image: '/images/coaches/joey-avatar.png',
    imagePosition: 'center 32%',
    bio: 'Former pro hockey player with a background in tennis and table tennis. Joey is an active tournament competitor who brings a high-performance approach to skill development, strategy and helping players reach their potential.',
    badges: [
      { label: 'Signature Coach', tone: 'signature' },
      { label: '5.0 Rated', tone: 'credential' },
    ],
  },
  {
    name: 'Sam Schachter',
    slug: 'sam-schachter',
    role: 'Founding Coach · Toronto',
    image: '/images/coaches/sam-avatar.png',
    imagePosition: 'center 28%',
    bio: 'Rising quickly through the competitive ranks, Sam regularly competes in Toronto and Florida. He brings strong fundamentals, patience and a genuine passion for helping players improve.',
    badges: [
      { label: 'Rising Star', tone: 'credential' },
      { label: 'Tournament Competitor', tone: 'credential' },
    ],
  },
]
