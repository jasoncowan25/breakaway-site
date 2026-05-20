export type PublicCampModule = {
  id: string
  name: string
  publicBullet: string
  description: string
}

export const publicCampModules: PublicCampModule[] = [
  {
    id: "mod-dinks-attacks",
    name: "Dinks & attacks",
    publicBullet: "Dinking patterns, controlled speed-ups, and attackable ball recognition",
    description: "Master the kitchen game with patient patterns and better decisions on when to attack.",
  },
  {
    id: "mod-lobs-returns",
    name: "Lobs & overheads",
    publicBullet: "Offensive lobs, defensive lobs, overheads, and recovery patterns",
    description: "Build the mechanics and judgment to use lobs without giving up court position.",
  },
  {
    id: "mod-drives-drops",
    name: "Drives & drops",
    publicBullet: "Third-shot drops, drive pressure, and transition-zone decision making",
    description: "Learn when to drive, when to drop, and how to move forward with purpose.",
  },
  {
    id: "mod-serve-return",
    name: "Serve & return",
    publicBullet: "High-percentage serves, deep returns, and baseline point structure",
    description: "Start points with cleaner targets and more reliable patterns.",
  },
  {
    id: "mod-reset-neutralise",
    name: "Resets & neutralising",
    publicBullet: "Defensive resets, pace control, and slowing down pressure",
    description: "Turn uncomfortable balls into neutral balls and stay alive in tough points.",
  },
  {
    id: "mod-stacking-poaching",
    name: "Stacking & poaching",
    publicBullet: "Doubles positioning, coordinated switching, and poach timing",
    description: "Sharpen team positioning and learn when to take space in doubles.",
  },
  {
    id: "mod-groundstroke-basics",
    name: "Groundstroke basics",
    publicBullet: "Forehand, backhand, contact point, grip, and consistent ball flight",
    description: "Build a reliable technical base for newer players.",
  },
  {
    id: "mod-bangers-speedup",
    name: "Playing against pace",
    publicBullet: "Blocks, resets, counters, and patterns against hard hitters",
    description: "Stay composed against speed and stop letting pace dictate the rally.",
  },
  {
    id: "mod-mental-game",
    name: "Match play confidence",
    publicBullet: "Point construction, routines, competitive reps, and feedback",
    description: "Apply the work in live games with structure and coaching.",
  },
  {
    id: "mod-fitness-movement",
    name: "Court movement",
    publicBullet: "Split step timing, recovery footwork, and efficient court coverage",
    description: "Move with better timing and arrive balanced for the next ball.",
  },
]

export function getPublicCampModules(ids: string[] | null | undefined, fallbackType?: string | null) {
  const modules = (ids ?? [])
    .map((id) => publicCampModules.find((module) => module.id === id))
    .filter(Boolean) as PublicCampModule[]

  if (modules.length > 0) return modules

  if (fallbackType?.toLowerCase().includes("fund")) {
    return publicCampModules.filter((module) =>
      ["mod-groundstroke-basics", "mod-serve-return", "mod-fitness-movement", "mod-mental-game"].includes(module.id),
    )
  }

  return publicCampModules.filter((module) =>
    ["mod-dinks-attacks", "mod-drives-drops", "mod-reset-neutralise", "mod-mental-game"].includes(module.id),
  )
}
