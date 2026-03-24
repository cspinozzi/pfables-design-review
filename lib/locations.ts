// Default locations available in the system
const DEFAULT_LOCATIONS = [
  { value: "naperville", label: "Naperville, IL" },
  { value: "chicago", label: "Chicago, IL" },
  { value: "aurora", label: "Aurora, IL" },
  { value: "wheaton", label: "Wheaton, IL" },
  { value: "downers-grove", label: "Downers Grove, IL" },
  { value: "lisle", label: "Lisle, IL" },
  { value: "bolingbrook", label: "Bolingbrook, IL" },
  { value: "plainfield", label: "Plainfield, IL" },
  { value: "oswego", label: "Oswego, IL" },
  { value: "online", label: "Online Only" },
]

// Store for custom locations added by providers
let customLocations: { value: string; label: string }[] = []

// List of blocked words (basic profanity filter)
const BLOCKED_WORDS = [
  "fuck", "shit", "ass", "damn", "bitch", "bastard", "crap", "dick", "piss", 
  "cock", "cunt", "slut", "whore", "nigger", "faggot"
]

export function getAllLocations() {
  return [...DEFAULT_LOCATIONS, ...customLocations]
}

export function getDefaultLocations() {
  return DEFAULT_LOCATIONS
}

export function isValidCityName(name: string): { valid: boolean; reason?: string } {
  const trimmed = name.trim()
  
  // Check minimum length
  if (trimmed.length < 2) {
    return { valid: false, reason: "City name is too short" }
  }
  
  // Check maximum length
  if (trimmed.length > 100) {
    return { valid: false, reason: "City name is too long" }
  }
  
  // Check for profanity (case insensitive)
  const lowerName = trimmed.toLowerCase()
  for (const word of BLOCKED_WORDS) {
    if (lowerName.includes(word)) {
      return { valid: false, reason: "Invalid city name" }
    }
  }
  
  // Check that it contains at least one letter
  if (!/[a-zA-Z]/.test(trimmed)) {
    return { valid: false, reason: "City name must contain letters" }
  }
  
  // Check for reasonable format (letters, spaces, hyphens, apostrophes, periods, commas)
  if (!/^[a-zA-Z\s\-'.,]+$/.test(trimmed)) {
    return { valid: false, reason: "City name contains invalid characters" }
  }
  
  return { valid: true }
}

export function addCustomLocation(locationName: string): { success: boolean; reason?: string } {
  const validation = isValidCityName(locationName)
  
  if (!validation.valid) {
    return { success: false, reason: validation.reason }
  }
  
  const trimmed = locationName.trim()
  const value = trimmed.toLowerCase().replace(/[^a-z0-9]+/g, "-")
  
  // Check if already exists
  const allLocations = getAllLocations()
  const exists = allLocations.some(
    (loc) => loc.value === value || loc.label.toLowerCase() === trimmed.toLowerCase()
  )
  
  if (exists) {
    return { success: true } // Already exists, no need to add but not an error
  }
  
  // Add to custom locations
  customLocations.push({ value, label: trimmed })
  
  return { success: true }
}

// Instruments available for selection
export const INSTRUMENTS = [
  "Piano",
  "Guitar", 
  "Violin",
  "Cello",
  "Voice",
  "Drums",
  "Saxophone",
  "Clarinet",
  "Flute",
  "Trumpet",
  "Trombone",
  "Bass",
  "Ukulele",
  "Music Theory",
]
