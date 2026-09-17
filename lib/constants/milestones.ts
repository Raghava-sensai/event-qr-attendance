export interface Milestone {
  id: string
  name: string
  requiredEvents: number
  description: string
  icon: string
}

export const MILESTONES: Milestone[] = [
  {
    id: 'rookie',
    name: 'Club Rookie',
    requiredEvents: 1,
    description: 'Welcome to the club! You have participated in your first event.',
    icon: '🌱'
  },
  {
    id: 'active',
    name: 'Active Member',
    requiredEvents: 3,
    description: 'You are an active participant in our club events.',
    icon: '🔥'
  },
  {
    id: 'explorer',
    name: 'Event Explorer',
    requiredEvents: 7,
    description: 'You are deeply involved in everything the club has to offer.',
    icon: '🧭'
  },
  {
    id: 'champion',
    name: 'Club Champion',
    requiredEvents: 10,
    description: 'An absolute legend. You attend almost every event!',
    icon: '🏆'
  },
  {
    id: 'mvp',
    name: 'Club MVP',
    requiredEvents: 20,
    description: 'The pinnacle of club participation.',
    icon: '👑'
  }
]

/**
 * Helper to get the user's current milestone and the next one they are working towards
 */
export function getProgressStats(participationCount: number) {
  // Sort milestones by requirement just in case
  const sorted = [...MILESTONES].sort((a, b) => a.requiredEvents - b.requiredEvents)
  
  let currentMilestone: Milestone | null = null
  let nextMilestone: Milestone | null = null

  for (let i = 0; i < sorted.length; i++) {
    if (participationCount >= sorted[i].requiredEvents) {
      currentMilestone = sorted[i]
    } else {
      nextMilestone = sorted[i]
      break
    }
  }

  // If they have passed all milestones
  if (!nextMilestone && currentMilestone) {
    const maxMilestone = sorted[sorted.length - 1]
    return {
      currentMilestone,
      nextMilestone: null,
      progressPercentage: 100,
      eventsToNext: 0,
      currentBase: currentMilestone.requiredEvents,
      nextTarget: maxMilestone.requiredEvents
    }
  }

  // If they haven't even hit the first milestone
  if (!currentMilestone && nextMilestone) {
    const target = nextMilestone.requiredEvents
    return {
      currentMilestone: null,
      nextMilestone,
      progressPercentage: Math.min(100, Math.max(0, (participationCount / target) * 100)),
      eventsToNext: target - participationCount,
      currentBase: 0,
      nextTarget: target
    }
  }

  // They are between two milestones
  if (currentMilestone && nextMilestone) {
    const base = currentMilestone.requiredEvents
    const target = nextMilestone.requiredEvents
    const eventsNeeded = target - base
    const eventsEarned = participationCount - base
    const progressPercentage = Math.min(100, Math.max(0, (eventsEarned / eventsNeeded) * 100))

    return {
      currentMilestone,
      nextMilestone,
      progressPercentage,
      eventsToNext: target - participationCount,
      currentBase: base,
      nextTarget: target
    }
  }

  return {
    currentMilestone: null,
    nextMilestone: null,
    progressPercentage: 0,
    eventsToNext: 0,
    currentBase: 0,
    nextTarget: 0
  }
}
