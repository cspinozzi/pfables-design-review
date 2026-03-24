export type UserRole = "parent" | "provider" | "repair" | "admin"

export interface User {
  id: string
  email: string
  password: string
  role: UserRole
  name: string
  avatar?: string
  location?: string
  joinedDate?: string
}

export type ProviderType = "teacher" | "repair"

export interface Provider {
  id: string
  userId: string
  name: string
  avatar: string
  providerType: ProviderType
  specialty: string[]
  location: string
  bio: string
  services: Service[]
  verified: boolean
  backgroundCheckStatus: "approved" | "pending" | "rejected" | "none"
  subscriptionTier: "free" | "basic" | "featured" | "premium"
  rating: number
  reviewCount: number
  phone: string
  email: string
  availability: string
  serviceArea: string[]
  credentials: string[]
  yearsExperience: number
}

export interface Service {
  id: string
  name: string
  category: "lessons" | "repair" | "tuning" | "rental"
  description: string
  pricing: string
  location: "in-home" | "in-studio" | "both"
}

export interface Message {
  id: string
  conversationId: string
  senderId: string
  senderName: string
  senderAvatar: string
  content: string
  timestamp: Date
  read: boolean
}

export interface Conversation {
  id: string
  participants: { id: string; name: string; avatar: string; role: UserRole }[]
  lastMessage: Message
  unreadCount: number
}

export interface Subscription {
  id: string
  providerId: string
  tier: "basic" | "featured" | "premium"
  price: number
  status: "active" | "cancelled" | "expired"
  startDate: Date
  nextBillingDate: Date
  paymentMethod: {
    type: "card"
    last4: string
    expiryMonth: number
    expiryYear: number
  }
}

export interface BackgroundCheck {
  id: string
  providerId: string
  status: "pending" | "approved" | "rejected"
  submittedDate: Date
  reviewedDate?: Date
  documents: {
    id: string
    name: string
    type: string
    uploadedDate: Date
    fileUrl?: string
  }[]
  notes?: string
}

export interface ParentChild {
  name: string
  age: number
  instrument: string
  level: "beginner" | "intermediate" | "advanced"
  lessonsPerWeek: number
}

export interface ParentProfile {
  userId: string
  children: ParentChild[]
  connectedProviders: string[]
  totalSpent: number
  activeLessons: number
  completedLessons: number
  accountStatus: "active" | "inactive" | "suspended"
  lastActive: string
  phone: string
  notes?: string
}

export interface ServiceContract {
  id: string
  parentId: string
  providerId: string
  providerName: string
  providerAvatar: string
  serviceName: string
  serviceType: "lessons" | "repair" | "tuning" | "rental"
  status: "active" | "completed"
  startDate: Date
  endDate?: Date
  sessionsTotal?: number
  sessionsCompleted?: number
  pricePerSession?: number
  totalPaid: number
  paymentSchedule: "per-session" | "monthly" | "one-time"
  nextPaymentDate?: Date
  notes?: string
}

// Generate mock parent users
const parentFirstNames = [
  "Sarah", "Jessica", "Amanda", "Ashley", "Jennifer", "Stephanie", "Nicole", "Melissa",
  "Elizabeth", "Rebecca", "Laura", "Megan", "Rachel", "Heather", "Katherine", "Christina",
  "Lauren", "Andrea", "Michelle", "Natalie", "Samantha", "Danielle", "Brittany", "Victoria",
  "Tiffany", "Amber", "Crystal", "Diana", "Patricia", "Maria", "Olivia", "Emma", "Sophia",
  "Isabella", "Charlotte", "Amelia", "Harper", "Evelyn", "Abigail", "Hannah", "Chloe",
  "Grace", "Zoe", "Lily", "Ella", "Avery", "Scarlett", "Madison", "Aria", "Riley",
  "James", "Robert", "Michael", "David", "Richard", "Joseph", "Thomas", "Christopher",
  "Daniel", "Matthew", "Anthony", "Mark", "Steven", "Andrew", "Kenneth", "Paul",
  "Joshua", "Kevin", "Brian", "Timothy", "Ronald", "Edward", "Jason", "Jeffrey",
  "Ryan", "Jacob", "Gary", "Nicholas", "Eric", "Jonathan", "Stephen", "Larry",
  "Justin", "Scott", "Brandon", "Benjamin", "Samuel", "Raymond", "Gregory", "Frank",
  "Alexander", "Patrick", "Jack", "Henry", "Walter", "Dennis", "Peter", "Nathan",
]
const parentLastNames = [
  "Thompson", "Anderson", "Martinez", "Garcia", "Wilson", "Taylor", "Brown", "Davis",
  "Miller", "Jones", "Williams", "Johnson", "White", "Harris", "Clark", "Lewis",
  "Robinson", "Walker", "Hall", "Young", "King", "Wright", "Green", "Adams",
  "Baker", "Nelson", "Hill", "Rivera", "Campbell", "Mitchell", "Roberts", "Carter",
  "Phillips", "Evans", "Turner", "Torres", "Parker", "Collins", "Edwards", "Stewart",
  "Morris", "Murphy", "Cook", "Rogers", "Morgan", "Peterson", "Cooper", "Reed",
  "Bailey", "Bell", "Gomez", "Kelly", "Howard", "Ward", "Cox", "Diaz",
  "Richardson", "Wood", "Watson", "Brooks", "Bennett", "Gray", "James", "Reyes",
  "Cruz", "Hughes", "Price", "Myers", "Long", "Foster", "Sanders", "Ross",
  "Morales", "Powell", "Sullivan", "Russell", "Ortiz", "Jenkins", "Gutierrez", "Perry",
  "Butler", "Barnes", "Fisher", "Henderson", "Coleman", "Simmons", "Patterson", "Jordan",
  "Reynolds", "Hamilton", "Graham", "Kim", "Gonzalez", "Alexander", "Ramos", "Wallace",
]
const suburbs = [
  "Naperville, IL", "Aurora, IL", "Wheaton, IL", "Downers Grove, IL", "Lisle, IL",
  "Glen Ellyn, IL", "Plainfield, IL", "Bolingbrook, IL", "Oswego, IL", "Lombard, IL",
  "Carol Stream, IL", "Westmont, IL", "Hinsdale, IL", "Clarendon Hills, IL", "Winfield, IL",
  "Woodridge, IL", "Darien, IL", "Elmhurst, IL", "Villa Park, IL", "Addison, IL",
]
const joinMonths = [
  "2023-01", "2023-02", "2023-03", "2023-04", "2023-05", "2023-06",
  "2023-07", "2023-08", "2023-09", "2023-10", "2023-11", "2023-12",
  "2024-01", "2024-02", "2024-03", "2024-04", "2024-05", "2024-06",
  "2024-07", "2024-08", "2024-09", "2024-10", "2024-11", "2024-12",
  "2025-01", "2025-02",
]

function generateMockParents(count: number): User[] {
  const parents: User[] = []
  for (let i = 0; i < count; i++) {
    const first = parentFirstNames[i % parentFirstNames.length]
    const last = parentLastNames[i % parentLastNames.length]
    // Avoid duplicate names by appending a number when we cycle through
    const cycle = Math.floor(i / Math.min(parentFirstNames.length, parentLastNames.length))
    const suffix = cycle > 0 ? ` ${cycle + 1}` : ""
    const name = `${first} ${last}${suffix}`
    const emailBase = `${first.toLowerCase()}.${last.toLowerCase()}${cycle > 0 ? cycle + 1 : ""}`.replace(/ /g, "")
    parents.push({
      id: `parent-${i + 1}`,
      email: `${emailBase}@example.com`,
      password: "parent123",
      role: "parent",
      name,
      location: suburbs[i % suburbs.length],
      joinedDate: joinMonths[i % joinMonths.length],
    })
  }
  return parents
}

const generatedParents = generateMockParents(188)

// Mock Users
export const mockUsers: User[] = [
  {
    id: "user-1",
    email: "sarah@example.com",
    password: "parent123",
    role: "parent",
    name: "Sarah Thompson",
    avatar: "/parent-woman.jpg",
    location: "Naperville, IL",
    joinedDate: "2024-01",
  },
  ...generatedParents,
  {
    id: "user-2",
    email: "emily@example.com",
    password: "provider123",
    role: "provider",
    name: "Emily Carter",
    avatar: "/music-teacher-woman.jpg",
  },
  {
    id: "user-3",
    email: "john@example.com",
    password: "admin123",
    role: "admin",
    name: "John Williams",
    avatar: "/business-man.jpg",
  },
  {
    id: "user-repair",
    email: "tom@example.com",
    password: "repair123",
    role: "repair",
    name: "Tom Henderson",
    avatar: "/luthier-carousel-1.jpg",
  },
]

// Mock Providers
export const mockProviders: Provider[] = [
  {
    id: "provider-1",
    userId: "user-2",
    name: "Emily Carter",
    avatar: "/music-teacher-woman-piano.jpg",
    providerType: "teacher",
    specialty: ["Piano", "Music Theory"],
    location: "Naperville, IL",
    bio: "Experienced piano teacher with 8 years of teaching students of all ages. Specializing in classical and contemporary styles.",
    services: [
      {
        id: "service-1",
        name: "Piano Lessons",
        category: "lessons",
        description: "30-60 minute lessons for beginners to advanced students",
        pricing: "$50-75 per lesson",
        location: "both",
      },
      {
        id: "service-2",
        name: "Music Theory",
        category: "lessons",
        description: "Comprehensive music theory instruction",
        pricing: "$40 per lesson",
        location: "in-studio",
      },
    ],
    verified: true,
    backgroundCheckStatus: "approved",
    subscriptionTier: "featured",
    rating: 4.9,
    reviewCount: 47,
    phone: "(630) 555-0123",
    email: "emily@example.com",
    availability: "Mon-Fri 3-8pm, Sat 9am-2pm",
    serviceArea: ["Naperville", "Lisle", "Wheaton"],
    credentials: ["Bachelor of Music Education", "MTNA Certified"],
    yearsExperience: 8,
  },
  {
    id: "provider-2",
    userId: "user-4",
    name: "Michael Rodriguez",
    avatar: "/guitar-teacher-man.jpg",
    providerType: "teacher",
    specialty: ["Guitar", "Bass"],
    location: "Aurora, IL",
    bio: "Professional guitarist offering lessons in rock, jazz, and classical styles. Focus on technique and musicality.",
    services: [
      {
        id: "service-3",
        name: "Guitar Lessons",
        category: "lessons",
        description: "Electric and acoustic guitar instruction",
        pricing: "$45-65 per lesson",
        location: "in-home",
      },
    ],
    verified: true,
    backgroundCheckStatus: "approved",
    subscriptionTier: "basic",
    rating: 4.8,
    reviewCount: 32,
    phone: "(630) 555-0456",
    email: "michael@example.com",
    availability: "Flexible scheduling",
    serviceArea: ["Aurora", "Naperville", "Plainfield"],
    credentials: ["Berklee College of Music Graduate"],
    yearsExperience: 12,
  },
  {
    id: "provider-3",
    userId: "user-5",
    name: "Sarah Kim",
    avatar: "/violin-teacher-woman.jpg",
    providerType: "teacher",
    specialty: ["Violin", "Viola"],
    location: "Downers Grove, IL",
    bio: "Classically trained violinist with orchestra experience. Specializing in Suzuki method for young students.",
    services: [
      {
        id: "service-4",
        name: "Violin Lessons",
        category: "lessons",
        description: "Suzuki method and traditional violin instruction",
        pricing: "$55-80 per lesson",
        location: "both",
      },
    ],
    verified: true,
    backgroundCheckStatus: "approved",
    subscriptionTier: "premium",
    rating: 5.0,
    reviewCount: 28,
    phone: "(630) 555-0789",
    email: "sarah.kim@example.com",
    availability: "Weekdays 2-7pm",
    serviceArea: ["Downers Grove", "Westmont", "Hinsdale"],
    credentials: ["Suzuki Association Certified", "Masters in Music Performance"],
    yearsExperience: 10,
  },
  {
    id: "provider-4",
    userId: "user-6",
    name: "Tom's Piano Service",
    avatar: "/piano-tuner.jpg",
    providerType: "repair",
    specialty: ["Piano Tuning", "Piano Repair"],
    location: "Wheaton, IL",
    bio: "Professional piano technician with 25 years experience. Serving the western suburbs.",
    services: [
      {
        id: "service-5",
        name: "Piano Tuning",
        category: "tuning",
        description: "Standard tuning service for upright and grand pianos",
        pricing: "$120-150",
        location: "in-home",
      },
      {
        id: "service-6",
        name: "Piano Repair",
        category: "repair",
        description: "Key repair, action regulation, voicing",
        pricing: "Quote based on needs",
        location: "in-home",
      },
    ],
    verified: true,
    backgroundCheckStatus: "approved",
    subscriptionTier: "featured",
    rating: 4.9,
    reviewCount: 156,
    phone: "(630) 555-1234",
    email: "tom@pianoservice.com",
    availability: "Mon-Sat by appointment",
    serviceArea: ["Wheaton", "Glen Ellyn", "Carol Stream", "Lombard"],
    credentials: ["Piano Technicians Guild Member"],
    yearsExperience: 25,
  },
  {
    id: "provider-5",
    userId: "user-7",
    name: "David Chen",
    avatar: "/music-teacher-man-piano.jpg",
    providerType: "teacher",
    specialty: ["Piano", "Jazz Piano"],
    location: "Naperville, IL",
    bio: "Jazz pianist and educator with performance experience in Chicago's top jazz clubs. Teaching jazz improvisation and traditional piano.",
    services: [
      {
        id: "service-7",
        name: "Jazz Piano Lessons",
        category: "lessons",
        description: "Jazz theory, improvisation, and performance techniques",
        pricing: "$60-85 per lesson",
        location: "both",
      },
    ],
    verified: true,
    backgroundCheckStatus: "approved",
    subscriptionTier: "premium",
    rating: 4.9,
    reviewCount: 38,
    phone: "(630) 555-2345",
    email: "david.chen@example.com",
    availability: "Mon-Sat flexible hours",
    serviceArea: ["Naperville", "Aurora", "Bolingbrook"],
    credentials: ["Northwestern University Music Degree", "Jazz Performance Certificate"],
    yearsExperience: 15,
  },
  {
    id: "provider-6",
    userId: "user-8",
    name: "Maria Santos",
    avatar: "/music-teacher-woman-2.jpg",
    providerType: "teacher",
    specialty: ["Piano", "Voice"],
    location: "Wheaton, IL",
    bio: "Classically trained pianist and vocalist offering comprehensive music education. Specializing in young beginners ages 4-10.",
    services: [
      {
        id: "service-8",
        name: "Piano for Young Beginners",
        category: "lessons",
        description: "Fun, engaging piano lessons designed for children ages 4-10",
        pricing: "$45-60 per lesson",
        location: "in-studio",
      },
      {
        id: "service-9",
        name: "Voice Lessons",
        category: "lessons",
        description: "Classical and contemporary vocal training",
        pricing: "$50-70 per lesson",
        location: "both",
      },
    ],
    verified: true,
    backgroundCheckStatus: "approved",
    subscriptionTier: "featured",
    rating: 5.0,
    reviewCount: 52,
    phone: "(630) 555-3456",
    email: "maria@example.com",
    availability: "Weekdays 10am-6pm",
    serviceArea: ["Wheaton", "Glen Ellyn", "Winfield"],
    credentials: ["Bachelor of Music - Piano Performance", "Early Childhood Music Certified"],
    yearsExperience: 12,
  },
  {
    id: "provider-7",
    userId: "user-9",
    name: "James Wilson",
    avatar: "/drums-teacher-man.jpg",
    providerType: "teacher",
    specialty: ["Drums", "Percussion"],
    location: "Aurora, IL",
    bio: "Professional drummer with touring experience. Teaching all styles from rock and jazz to orchestral percussion.",
    services: [
      {
        id: "service-10",
        name: "Drum Lessons",
        category: "lessons",
        description: "Comprehensive drum instruction for all skill levels",
        pricing: "$50-70 per lesson",
        location: "in-studio",
      },
    ],
    verified: true,
    backgroundCheckStatus: "approved",
    subscriptionTier: "basic",
    rating: 4.7,
    reviewCount: 29,
    phone: "(630) 555-4567",
    email: "james.wilson@example.com",
    availability: "Evenings and weekends",
    serviceArea: ["Aurora", "Naperville", "Oswego"],
    credentials: ["Berklee Online Certification"],
    yearsExperience: 18,
  },
  {
    id: "provider-8",
    userId: "user-10",
    name: "Linda Park",
    avatar: "/music-teacher-woman-3.jpg",
    providerType: "teacher",
    specialty: ["Piano", "Music Theory"],
    location: "Downers Grove, IL",
    bio: "Dedicated piano teacher preparing students for ABRSM and RCM examinations. Strong focus on technique and music theory fundamentals.",
    services: [
      {
        id: "service-11",
        name: "Piano Exam Preparation",
        category: "lessons",
        description: "Structured lessons for ABRSM and RCM certification exams",
        pricing: "$55-80 per lesson",
        location: "both",
      },
    ],
    verified: true,
    backgroundCheckStatus: "approved",
    subscriptionTier: "featured",
    rating: 4.8,
    reviewCount: 67,
    phone: "(630) 555-5678",
    email: "linda.park@example.com",
    availability: "Mon-Fri 2pm-8pm, Sat 9am-3pm",
    serviceArea: ["Downers Grove", "Westmont", "Clarendon Hills", "Hinsdale"],
    credentials: ["ABRSM Teaching Diploma", "Masters in Piano Pedagogy"],
    yearsExperience: 20,
  },
  {
    id: "provider-9",
    userId: "user-11",
    name: "Rachel Green",
    avatar: "/music-teacher-woman-4.jpg",
    providerType: "teacher",
    specialty: ["Voice", "Musical Theater"],
    location: "Naperville, IL",
    bio: "Broadway-trained vocalist specializing in musical theater and contemporary pop styles. Preparing students for auditions and performances.",
    services: [
      {
        id: "service-12",
        name: "Voice Lessons",
        category: "lessons",
        description: "Vocal technique, breath control, and performance coaching",
        pricing: "$55-75 per lesson",
        location: "both",
      },
    ],
    verified: true,
    backgroundCheckStatus: "approved",
    subscriptionTier: "premium",
    rating: 4.9,
    reviewCount: 43,
    phone: "(630) 555-6789",
    email: "rachel.green@example.com",
    availability: "Mon-Sat flexible hours",
    serviceArea: ["Naperville", "Aurora", "Plainfield"],
    credentials: ["BFA Musical Theater", "NATS Member"],
    yearsExperience: 14,
  },
  {
    id: "provider-10",
    userId: "user-12",
    name: "Robert Taylor",
    avatar: "/music-teacher-man-2.jpg",
    providerType: "teacher",
    specialty: ["Woodwinds", "Clarinet", "Saxophone"],
    location: "Wheaton, IL",
    bio: "Professional woodwind player with Chicago Symphony Orchestra experience. Teaching clarinet, saxophone, and flute to students of all levels.",
    services: [
      {
        id: "service-13",
        name: "Woodwind Lessons",
        category: "lessons",
        description: "Clarinet, saxophone, and flute instruction",
        pricing: "$50-70 per lesson",
        location: "in-studio",
      },
    ],
    verified: true,
    backgroundCheckStatus: "approved",
    subscriptionTier: "featured",
    rating: 4.8,
    reviewCount: 35,
    phone: "(630) 555-7890",
    email: "robert.taylor@example.com",
    availability: "Weekdays 3pm-8pm",
    serviceArea: ["Wheaton", "Glen Ellyn", "Lombard"],
    credentials: ["DePaul University Music Degree", "CSO Substitute"],
    yearsExperience: 22,
  },
  {
    id: "provider-11",
    userId: "user-13",
    name: "Jennifer Martinez",
    avatar: "/music-teacher-woman-5.jpg",
    providerType: "teacher",
    specialty: ["Piano", "Composition"],
    location: "Aurora, IL",
    bio: "Composer and pianist teaching creative music-making alongside traditional piano technique. Encouraging students to write their own music.",
    services: [
      {
        id: "service-14",
        name: "Piano & Composition",
        category: "lessons",
        description: "Piano lessons with songwriting and composition elements",
        pricing: "$55-75 per lesson",
        location: "both",
      },
    ],
    verified: true,
    backgroundCheckStatus: "approved",
    subscriptionTier: "basic",
    rating: 4.7,
    reviewCount: 24,
    phone: "(630) 555-8901",
    email: "jennifer.martinez@example.com",
    availability: "Tue-Sat flexible",
    serviceArea: ["Aurora", "Naperville", "Oswego"],
    credentials: ["Masters in Composition", "ASCAP Member"],
    yearsExperience: 9,
  },
  {
    id: "provider-12",
    userId: "user-14",
    name: "Kevin O'Brien",
    avatar: "/music-teacher-man-3.jpg",
    providerType: "teacher",
    specialty: ["Brass", "Trumpet", "Trombone"],
    location: "Downers Grove, IL",
    bio: "Brass specialist with marching band and jazz ensemble experience. Building strong fundamentals and performance confidence.",
    services: [
      {
        id: "service-15",
        name: "Brass Lessons",
        category: "lessons",
        description: "Trumpet, trombone, and French horn instruction",
        pricing: "$45-65 per lesson",
        location: "both",
      },
    ],
    verified: true,
    backgroundCheckStatus: "approved",
    subscriptionTier: "basic",
    rating: 4.6,
    reviewCount: 19,
    phone: "(630) 555-9012",
    email: "kevin.obrien@example.com",
    availability: "Evenings and weekends",
    serviceArea: ["Downers Grove", "Westmont", "Lisle"],
    credentials: ["University of Illinois Music Education"],
    yearsExperience: 11,
  },
  {
    id: "provider-13",
    userId: "user-15",
    name: "Amy Liu",
    avatar: "/music-teacher-woman-6.jpg",
    providerType: "teacher",
    specialty: ["Violin", "Chamber Music"],
    location: "Naperville, IL",
    bio: "Concert violinist and chamber music coach. Preparing students for competitions and ensemble performance opportunities.",
    services: [
      {
        id: "service-16",
        name: "Violin & Chamber Music",
        category: "lessons",
        description: "Solo violin and chamber ensemble coaching",
        pricing: "$60-85 per lesson",
        location: "both",
      },
    ],
    verified: true,
    backgroundCheckStatus: "approved",
    subscriptionTier: "premium",
    rating: 5.0,
    reviewCount: 41,
    phone: "(630) 555-0123",
    email: "amy.liu@example.com",
    availability: "Mon-Fri 1pm-7pm",
    serviceArea: ["Naperville", "Lisle", "Bolingbrook"],
    credentials: ["Juilliard Graduate", "Competition Winner"],
    yearsExperience: 16,
  },
  {
    id: "provider-14",
    userId: "user-16",
    name: "Marcus Johnson",
    avatar: "/music-teacher-man-4.jpg",
    providerType: "teacher",
    specialty: ["Guitar", "Music Production"],
    location: "Aurora, IL",
    bio: "Modern guitarist teaching contemporary styles alongside home recording and music production basics. Perfect for aspiring singer-songwriters.",
    services: [
      {
        id: "service-17",
        name: "Guitar & Production",
        category: "lessons",
        description: "Guitar lessons with home recording introduction",
        pricing: "$50-70 per lesson",
        location: "in-studio",
      },
    ],
    verified: true,
    backgroundCheckStatus: "approved",
    subscriptionTier: "featured",
    rating: 4.8,
    reviewCount: 33,
    phone: "(630) 555-1234",
    email: "marcus.johnson@example.com",
    availability: "Flexible scheduling",
    serviceArea: ["Aurora", "Naperville", "Plainfield", "Oswego"],
    credentials: ["Full Sail University Graduate", "Pro Tools Certified"],
    yearsExperience: 8,
  },
  {
    id: "provider-15",
    userId: "user-17",
    name: "Susan White",
    avatar: "/music-teacher-woman-7.jpg",
    providerType: "teacher",
    specialty: ["Piano", "Early Childhood Music"],
    location: "Wheaton, IL",
    bio: "Kindermusik educator specializing in early childhood music development. Group classes and private lessons for ages 2-7.",
    services: [
      {
        id: "service-18",
        name: "Early Childhood Music",
        category: "lessons",
        description: "Music fundamentals for toddlers and young children",
        pricing: "$35-50 per lesson",
        location: "in-studio",
      },
    ],
    verified: true,
    backgroundCheckStatus: "approved",
    subscriptionTier: "featured",
    rating: 4.9,
    reviewCount: 58,
    phone: "(630) 555-2345",
    email: "susan.white@example.com",
    availability: "Weekday mornings and early afternoons",
    serviceArea: ["Wheaton", "Glen Ellyn", "Carol Stream"],
    credentials: ["Kindermusik Licensed Educator", "Early Childhood Development Cert"],
    yearsExperience: 15,
  },
  {
    id: "provider-16",
    userId: "user-18",
    name: "Daniel Kim",
    avatar: "/music-teacher-man-5.jpg",
    providerType: "teacher",
    specialty: ["Drums", "Music Theory"],
    location: "Naperville, IL",
    bio: "Session drummer teaching rock, pop, and jazz styles. Strong emphasis on reading music and understanding rhythm theory.",
    services: [
      {
        id: "service-19",
        name: "Drum Lessons",
        category: "lessons",
        description: "Comprehensive drum and rhythm instruction",
        pricing: "$50-70 per lesson",
        location: "in-studio",
      },
    ],
    verified: true,
    backgroundCheckStatus: "approved",
    subscriptionTier: "basic",
    rating: 4.7,
    reviewCount: 26,
    phone: "(630) 555-3456",
    email: "daniel.kim@example.com",
    availability: "Afternoons and evenings",
    serviceArea: ["Naperville", "Lisle", "Woodridge"],
    credentials: ["Musicians Institute Graduate"],
    yearsExperience: 10,
  },
  {
    id: "provider-17",
    userId: "user-repair",
    name: "Heritage String Repair",
    avatar: "/luthier-carousel-1.jpg",
    providerType: "repair",
    specialty: ["Violin Repair", "Cello Repair", "Bow Rehair"],
    location: "Naperville, IL",
    bio: "Master luthier specializing in string instrument repair and restoration. Expert bow rehairing and setup adjustments for professional musicians.",
    services: [
      {
        id: "service-20",
        name: "String Instrument Repair",
        category: "repair",
        description: "Crack repair, bridge adjustments, soundpost setting, and full restorations",
        pricing: "$50-500+",
        location: "in-studio",
      },
    ],
    verified: true,
    backgroundCheckStatus: "approved",
    subscriptionTier: "featured",
    rating: 4.9,
    reviewCount: 87,
    phone: "(630) 555-4567",
    email: "heritage.strings@example.com",
    availability: "Mon-Fri 9am-5pm",
    serviceArea: ["Naperville", "Aurora", "Lisle", "Bolingbrook"],
    credentials: ["Violin Society of America Member", "40 Years Experience"],
    yearsExperience: 40,
  },
  {
    id: "provider-18",
    userId: "user-20",
    name: "Acoustic Guitar Workshop",
    avatar: "/luthier-carousel-2.jpg",
    providerType: "repair",
    specialty: ["Guitar Repair", "Guitar Setup", "Custom Builds"],
    location: "Aurora, IL",
    bio: "Full-service guitar repair shop offering setups, fret work, electronics repair, and custom acoustic guitar building.",
    services: [
      {
        id: "service-21",
        name: "Guitar Setup & Repair",
        category: "repair",
        description: "Setups, fret leveling, nut and saddle work, crack repairs",
        pricing: "$40-300+",
        location: "in-studio",
      },
    ],
    verified: true,
    backgroundCheckStatus: "approved",
    subscriptionTier: "premium",
    rating: 4.8,
    reviewCount: 124,
    phone: "(630) 555-5678",
    email: "acoustic.workshop@example.com",
    availability: "Tue-Sat 10am-6pm",
    serviceArea: ["Aurora", "Naperville", "Oswego", "Plainfield"],
    credentials: ["Roberto-Venn Graduate", "Guild of American Luthiers"],
    yearsExperience: 18,
  },
  {
    id: "provider-19",
    userId: "user-21",
    name: "Brass & Woodwind Specialists",
    avatar: "/luthier-carousel-4.jpg",
    providerType: "repair",
    specialty: ["Brass Repair", "Woodwind Repair", "Instrument Restoration"],
    location: "Wheaton, IL",
    bio: "Expert repair technicians for all brass and woodwind instruments. From student horns to professional instruments.",
    services: [
      {
        id: "service-22",
        name: "Brass & Woodwind Repair",
        category: "repair",
        description: "Dent removal, pad replacement, valve work, complete overhauls",
        pricing: "$30-400+",
        location: "in-studio",
      },
    ],
    verified: true,
    backgroundCheckStatus: "approved",
    subscriptionTier: "basic",
    rating: 4.7,
    reviewCount: 63,
    phone: "(630) 555-6789",
    email: "brass.woodwind@example.com",
    availability: "Mon-Fri 8am-4pm",
    serviceArea: ["Wheaton", "Glen Ellyn", "Lombard", "Carol Stream"],
    credentials: ["NAPBIRT Certified", "30 Years Experience"],
    yearsExperience: 30,
  },
  // --- 5 Unverified / Pending Providers for testing ---
  {
    id: "provider-20",
    userId: "user-20",
    name: "Marcus Rivera",
    avatar: "/avatars/marcus-rivera.jpg",
    providerType: "teacher",
    bio: "Percussion and drumset instructor with 8 years of performance experience. Specializes in jazz and Latin styles.",
    location: "Naperville, IL",
    specialty: ["Drums", "Percussion"],
    services: [
      {
        id: "service-23",
        name: "Drum Lessons",
        category: "lessons",
        description: "Beginner to advanced drumset and hand percussion lessons",
        pricing: "$50/hr",
        location: "in-studio",
      },
    ],
    verified: false,
    backgroundCheckStatus: "pending",
    subscriptionTier: "basic",
    rating: 0,
    reviewCount: 0,
    phone: "(630) 555-7001",
    email: "marcus.rivera@example.com",
    availability: "Mon-Sat 10am-8pm",
    serviceArea: ["Naperville", "Aurora", "Lisle"],
    credentials: ["B.A. Music Performance"],
    yearsExperience: 8,
  },
  {
    id: "provider-21",
    userId: "user-21",
    name: "Sophia Chen",
    avatar: "/avatars/sophia-chen.jpg",
    providerType: "teacher",
    bio: "Classically trained pianist and music theory instructor. Former adjunct at College of DuPage.",
    location: "Downers Grove, IL",
    specialty: ["Piano", "Music Theory"],
    services: [
      {
        id: "service-24",
        name: "Piano & Theory Lessons",
        category: "lessons",
        description: "Classical and contemporary piano, AP Music Theory prep",
        pricing: "$65/hr",
        location: "in-home",
      },
    ],
    verified: false,
    backgroundCheckStatus: "pending",
    subscriptionTier: "featured",
    rating: 0,
    reviewCount: 0,
    phone: "(630) 555-7002",
    email: "sophia.chen@example.com",
    availability: "Tue-Sat 9am-6pm",
    serviceArea: ["Downers Grove", "Westmont", "Hinsdale"],
    credentials: ["M.M. Piano Performance", "MTNA Certified"],
    yearsExperience: 12,
  },
  {
    id: "provider-22",
    userId: "user-22",
    name: "Jake Patterson",
    avatar: "/avatars/jake-patterson.jpg",
    providerType: "repair",
    bio: "Guitar luthier specializing in acoustic and electric guitar setups, fret work, and custom builds.",
    location: "Wheaton, IL",
    specialty: ["Guitar Repair", "Custom Builds"],
    services: [
      {
        id: "service-25",
        name: "Guitar Setup & Repair",
        category: "repair",
        description: "Full setups, fret leveling, electronics repair, custom wiring",
        pricing: "$40-250",
        location: "in-studio",
      },
    ],
    verified: false,
    backgroundCheckStatus: "none",
    subscriptionTier: "basic",
    rating: 0,
    reviewCount: 0,
    phone: "(630) 555-7003",
    email: "jake.patterson@example.com",
    availability: "Mon-Fri 8am-5pm",
    serviceArea: ["Wheaton", "Glen Ellyn", "Carol Stream"],
    credentials: ["Roberto-Venn School of Luthiery Graduate"],
    yearsExperience: 6,
  },
  {
    id: "provider-23",
    userId: "user-23",
    name: "Aaliyah Johnson",
    avatar: "/avatars/aaliyah-johnson.jpg",
    providerType: "teacher",
    bio: "Voice and vocal coach specializing in contemporary, R&B, and musical theater styles.",
    location: "Aurora, IL",
    specialty: ["Voice", "Musical Theater"],
    services: [
      {
        id: "service-26",
        name: "Vocal Coaching",
        category: "lessons",
        description: "Technique, performance prep, audition coaching",
        pricing: "$55/hr",
        location: "online",
      },
    ],
    verified: false,
    backgroundCheckStatus: "pending",
    subscriptionTier: "basic",
    rating: 0,
    reviewCount: 0,
    phone: "(630) 555-7004",
    email: "aaliyah.johnson@example.com",
    availability: "Mon-Thu 12pm-8pm",
    serviceArea: ["Aurora", "Naperville", "Plainfield"],
    credentials: ["B.F.A. Musical Theater"],
    yearsExperience: 5,
  },
  {
    id: "provider-24",
    userId: "user-24",
    name: "David Kowalski",
    avatar: "/avatars/david-kowalski.jpg",
    providerType: "teacher",
    bio: "Multi-instrumentalist offering guitar, bass, and ukulele lessons for all ages and skill levels.",
    location: "Lisle, IL",
    specialty: ["Guitar", "Bass Guitar", "Ukulele"],
    services: [
      {
        id: "service-27",
        name: "Guitar & Bass Lessons",
        category: "lessons",
        description: "Rock, blues, folk, and fingerstyle for beginners to advanced",
        pricing: "$45/hr",
        location: "in-home",
      },
    ],
    verified: false,
    backgroundCheckStatus: "pending",
    subscriptionTier: "basic",
    rating: 0,
    reviewCount: 0,
    phone: "(630) 555-7005",
    email: "david.kowalski@example.com",
    availability: "Wed-Sun 10am-7pm",
    serviceArea: ["Lisle", "Naperville", "Woodridge", "Bolingbrook"],
    credentials: ["15 Years Teaching Experience"],
    yearsExperience: 15,
  },
]

// Mock Conversations
export const mockConversations: Conversation[] = [
  {
    id: "conv-1",
    participants: [
      { id: "user-1", name: "Sarah Thompson", avatar: "/parent-woman.jpg", role: "parent" },
      { id: "user-2", name: "Emily Carter", avatar: "/music-teacher-woman.jpg", role: "provider" },
    ],
    lastMessage: {
      id: "msg-5",
      conversationId: "conv-1",
      senderId: "user-1",
      senderName: "Sarah Thompson",
      senderAvatar: "/parent-woman.jpg",
      content: "Thank you so much for the wonderful piano lesson with Emma! She had an amazing time and really loved learning the new piece. I just left you a 5-star review!",
      timestamp: new Date(Date.now() - 1000 * 60 * 15),
      read: false,
    },
    unreadCount: 1,
  },
  {
    id: "conv-2",
    participants: [
      { id: "user-1", name: "Sarah Thompson", avatar: "/parent-woman.jpg", role: "parent" },
      { id: "provider-2", name: "Marcus Rivera", avatar: "/avatars/marcus-rivera.jpg", role: "provider" },
    ],
    lastMessage: {
      id: "msg-conv2-3",
      conversationId: "conv-2",
      senderId: "provider-2",
      senderName: "Marcus Rivera",
      senderAvatar: "/avatars/marcus-rivera.jpg",
      content: "I have a drum kit available for the first few lessons so he can try before you buy.",
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 3),
      read: false,
    },
    unreadCount: 2,
  },
  {
    id: "conv-3",
    participants: [
      { id: "user-3", name: "Jessica Anderson", avatar: "/avatars/jessica-anderson.jpg", role: "parent" },
      { id: "user-2", name: "Emily Carter", avatar: "/music-teacher-woman.jpg", role: "provider" },
    ],
    lastMessage: {
      id: "msg-conv3-4",
      conversationId: "conv-3",
      senderId: "user-3",
      senderName: "Jessica Anderson",
      senderAvatar: "/avatars/jessica-anderson.jpg",
      content: "That sounds perfect! Can we start next Monday?",
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 5),
      read: true,
    },
    unreadCount: 0,
  },
  {
    id: "conv-4",
    participants: [
      { id: "user-1", name: "Sarah Thompson", avatar: "/parent-woman.jpg", role: "parent" },
      { id: "provider-17", name: "Jake Patterson", avatar: "/avatars/jake-patterson.jpg", role: "repair" },
    ],
    lastMessage: {
      id: "msg-conv4-4",
      conversationId: "conv-4",
      senderId: "user-1",
      senderName: "Sarah Thompson",
      senderAvatar: "/parent-woman.jpg",
      content: "The bow rehair is perfect! It plays beautifully now. Thank you for the excellent work and quick turnaround. I just left you a 5-star review!",
      timestamp: new Date(Date.now() - 1000 * 60 * 10),
      read: false,
    },
    unreadCount: 1,
  },
  {
    id: "conv-5",
    participants: [
      { id: "user-4", name: "Amanda Martinez", avatar: "/avatars/amanda-martinez.jpg", role: "parent" },
      { id: "user-2", name: "Emily Carter", avatar: "/music-teacher-woman.jpg", role: "provider" },
    ],
    lastMessage: {
      id: "msg-conv5-2",
      conversationId: "conv-5",
      senderId: "user-2",
      senderName: "Emily Carter",
      senderAvatar: "/music-teacher-woman.jpg",
      content: "I'd recommend starting with 30-minute sessions for a 5-year-old. They respond better to shorter, focused lessons.",
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24),
      read: false,
    },
    unreadCount: 1,
  },
  {
    id: "conv-6",
    participants: [
      { id: "user-5", name: "Ashley Garcia", avatar: "/avatars/ashley-garcia.jpg", role: "parent" },
      { id: "provider-2", name: "Marcus Rivera", avatar: "/avatars/marcus-rivera.jpg", role: "provider" },
    ],
    lastMessage: {
      id: "msg-conv6-3",
      conversationId: "conv-6",
      senderId: "user-5",
      senderName: "Ashley Garcia",
      senderAvatar: "/avatars/ashley-garcia.jpg",
      content: "My daughter really enjoyed the first lesson! She hasn't stopped practicing.",
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 48),
      read: true,
    },
    unreadCount: 0,
  },
  {
    id: "conv-7",
    participants: [
      { id: "user-6", name: "Jennifer Wilson", avatar: "/avatars/jennifer-wilson.jpg", role: "parent" },
      { id: "provider-17", name: "Jake Patterson", avatar: "/avatars/jake-patterson.jpg", role: "repair" },
    ],
    lastMessage: {
      id: "msg-conv7-2",
      conversationId: "conv-7",
      senderId: "provider-17",
      senderName: "Jake Patterson",
      senderAvatar: "/avatars/jake-patterson.jpg",
      content: "I can take a look at the violin on Thursday. Bring it to my workshop anytime between 10am-4pm.",
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 72),
      read: true,
    },
    unreadCount: 0,
  },
  {
    id: "conv-8",
    participants: [
      { id: "user-1", name: "Sarah Thompson", avatar: "/parent-woman.jpg", role: "parent" },
      { id: "provider-21", name: "Sophia Chen", avatar: "/avatars/sophia-chen.jpg", role: "provider" },
    ],
    lastMessage: {
      id: "msg-conv8-0",
      conversationId: "conv-8",
      senderId: "user-1",
      senderName: "Sarah Thompson",
      senderAvatar: "/parent-woman.jpg",
      content: "New conversation",
      timestamp: new Date(Date.now() - 1000 * 60 * 5),
      read: true,
    },
    unreadCount: 0,
  },
]

export const mockMessages: Record<string, Message[]> = {
  "conv-1": [
    {
      id: "msg-1",
      conversationId: "conv-1",
      senderId: "user-1",
      senderName: "Sarah Thompson",
      senderAvatar: "/parent-woman.jpg",
      content: "Hi Emily! I'm interested in piano lessons for my 8-year-old son. He's a complete beginner.",
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2),
      read: true,
    },
    {
      id: "msg-2",
      conversationId: "conv-1",
      senderId: "user-2",
      senderName: "Emily Carter",
      senderAvatar: "/music-teacher-woman.jpg",
      content:
        "Hello Sarah! I'd love to work with your son. I specialize in beginners and make lessons fun and engaging. What days work best for you?",
      timestamp: new Date(Date.now() - 1000 * 60 * 90),
      read: true,
    },
    {
      id: "msg-3",
      conversationId: "conv-1",
      senderId: "user-1",
      senderName: "Sarah Thompson",
      senderAvatar: "/parent-woman.jpg",
      content: "Weekday afternoons after 3pm would be ideal. Do you offer in-home lessons?",
      timestamp: new Date(Date.now() - 1000 * 60 * 45),
      read: true,
    },
    {
      id: "msg-4",
      conversationId: "conv-1",
      senderId: "user-2",
      senderName: "Emily Carter",
      senderAvatar: "/music-teacher-woman.jpg",
      content: "I have availability on Tuesdays and Thursdays at 4pm. Would that work for your son?",
      timestamp: new Date(Date.now() - 1000 * 60 * 30),
      read: true,
    },
    {
      id: "msg-5",
      conversationId: "conv-1",
      senderId: "user-1",
      senderName: "Sarah Thompson",
      senderAvatar: "/parent-woman.jpg",
      content: "Thank you so much for the wonderful piano lesson with Emma! She had an amazing time and really loved learning the new piece. I just left you a 5-star review!",
      timestamp: new Date(Date.now() - 1000 * 60 * 15),
      read: false,
    },
  ],
  "conv-2": [
    {
      id: "msg-conv2-1",
      conversationId: "conv-2",
      senderId: "user-1",
      senderName: "Sarah Thompson",
      senderAvatar: "/parent-woman.jpg",
      content: "Hi Marcus! My son is interested in drum lessons. He's 10 and has never played before. Do you take beginners?",
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 4),
      read: true,
    },
    {
      id: "msg-conv2-2",
      conversationId: "conv-2",
      senderId: "provider-2",
      senderName: "Marcus Rivera",
      senderAvatar: "/avatars/marcus-rivera.jpg",
      content: "Absolutely! Beginners are my specialty. I focus on rhythm fundamentals and making it fun. Does he have a drum kit at home?",
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 3.5),
      read: true,
    },
    {
      id: "msg-conv2-3",
      conversationId: "conv-2",
      senderId: "provider-2",
      senderName: "Marcus Rivera",
      senderAvatar: "/avatars/marcus-rivera.jpg",
      content: "I have a drum kit available for the first few lessons so he can try before you buy.",
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 3),
      read: false,
    },
  ],
  "conv-3": [
    {
      id: "msg-conv3-1",
      conversationId: "conv-3",
      senderId: "user-3",
      senderName: "Jessica Anderson",
      senderAvatar: "/avatars/jessica-anderson.jpg",
      content: "Hi Emily, I saw your profile and I'm looking for violin lessons for my daughter. She's been playing for about a year.",
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 6),
      read: true,
    },
    {
      id: "msg-conv3-2",
      conversationId: "conv-3",
      senderId: "user-2",
      senderName: "Emily Carter",
      senderAvatar: "/music-teacher-woman.jpg",
      content: "Hi Jessica! I'd be happy to help. After a year she's probably ready for more structured pieces. I can assess her level in a trial lesson.",
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 5.5),
      read: true,
    },
    {
      id: "msg-conv3-3",
      conversationId: "conv-3",
      senderId: "user-2",
      senderName: "Emily Carter",
      senderAvatar: "/music-teacher-woman.jpg",
      content: "I have a Saturday morning slot available if that works for you. The trial lesson is free!",
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 5.2),
      read: true,
    },
    {
      id: "msg-conv3-4",
      conversationId: "conv-3",
      senderId: "user-3",
      senderName: "Jessica Anderson",
      senderAvatar: "/avatars/jessica-anderson.jpg",
      content: "That sounds perfect! Can we start next Monday?",
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 5),
      read: true,
    },
  ],
  "conv-4": [
    {
      id: "msg-conv4-1",
      conversationId: "conv-4",
      senderId: "user-1",
      senderName: "Sarah Thompson",
      senderAvatar: "/parent-woman.jpg",
      content: "Hi Jake, my son's acoustic guitar has a crack near the bridge. Is that something you can fix?",
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24),
      read: true,
    },
    {
      id: "msg-conv4-2",
      conversationId: "conv-4",
      senderId: "provider-17",
      senderName: "Jake Patterson",
      senderAvatar: "/avatars/jake-patterson.jpg",
      content: "Definitely! Bridge cracks are common and usually very repairable. Bring it in and I'll give you a free estimate. Depending on the severity, it typically runs $50-120.",
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 12),
      read: true,
    },
    {
      id: "msg-conv4-3",
      conversationId: "conv-4",
      senderId: "provider-17",
      senderName: "Jake Patterson",
      senderAvatar: "/avatars/jake-patterson.jpg",
      content: "The repair is done! You can pick up the guitar anytime after 2pm today.",
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 8),
      read: true,
    },
    {
      id: "msg-conv4-4",
      conversationId: "conv-4",
      senderId: "user-1",
      senderName: "Sarah Thompson",
      senderAvatar: "/parent-woman.jpg",
      content: "The bow rehair is perfect! It plays beautifully now. Thank you for the excellent work and quick turnaround. I just left you a 5-star review!",
      timestamp: new Date(Date.now() - 1000 * 60 * 10),
      read: false,
    },
  ],
  "conv-5": [
    {
      id: "msg-conv5-1",
      conversationId: "conv-5",
      senderId: "user-4",
      senderName: "Amanda Martinez",
      senderAvatar: "/avatars/amanda-martinez.jpg",
      content: "Hello! My 5-year-old wants to learn piano. Is she too young to start?",
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 25),
      read: true,
    },
    {
      id: "msg-conv5-2",
      conversationId: "conv-5",
      senderId: "user-2",
      senderName: "Emily Carter",
      senderAvatar: "/music-teacher-woman.jpg",
      content: "I'd recommend starting with 30-minute sessions for a 5-year-old. They respond better to shorter, focused lessons.",
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24),
      read: false,
    },
  ],
  "conv-6": [
    {
      id: "msg-conv6-1",
      conversationId: "conv-6",
      senderId: "user-5",
      senderName: "Ashley Garcia",
      senderAvatar: "/avatars/ashley-garcia.jpg",
      content: "Hi Marcus, my daughter had her first lesson yesterday and absolutely loved it! Thank you for being so patient with her.",
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 49),
      read: true,
    },
    {
      id: "msg-conv6-2",
      conversationId: "conv-6",
      senderId: "provider-2",
      senderName: "Marcus Rivera",
      senderAvatar: "/avatars/marcus-rivera.jpg",
      content: "That's wonderful to hear! She has great rhythm for a beginner. I gave her a simple practice routine to work on this week.",
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 48.5),
      read: true,
    },
    {
      id: "msg-conv6-3",
      conversationId: "conv-6",
      senderId: "user-5",
      senderName: "Ashley Garcia",
      senderAvatar: "/avatars/ashley-garcia.jpg",
      content: "My daughter really enjoyed the first lesson! She hasn't stopped practicing.",
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 48),
      read: true,
    },
  ],
  "conv-7": [
    {
      id: "msg-conv7-1",
      conversationId: "conv-7",
      senderId: "user-6",
      senderName: "Jennifer Wilson",
      senderAvatar: "/avatars/jennifer-wilson.jpg",
      content: "Hi Jake, I have an old violin that belonged to my grandmother. The strings are gone and the bridge is loose. Can you restore it?",
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 73),
      read: true,
    },
    {
      id: "msg-conv7-2",
      conversationId: "conv-7",
      senderId: "provider-17",
      senderName: "Jake Patterson",
      senderAvatar: "/avatars/jake-patterson.jpg",
      content: "I can take a look at the violin on Thursday. Bring it to my workshop anytime between 10am-4pm.",
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 72),
      read: true,
    },
  ],
  "conv-8": [],
}

// Mock Subscriptions
export const mockSubscriptions: Subscription[] = [
  {
    id: "sub-1",
    providerId: "provider-1",
    tier: "featured",
    price: 59,
    status: "active",
    startDate: new Date("2024-01-01"),
    nextBillingDate: new Date("2025-02-01"),
    paymentMethod: {
      type: "card",
      last4: "4242",
      expiryMonth: 12,
      expiryYear: 2026,
    },
  },
  {
    id: "sub-2",
    providerId: "provider-17",
    tier: "featured",
    price: 59,
    status: "active",
    startDate: new Date("2024-06-01"),
    nextBillingDate: new Date("2025-03-01"),
    paymentMethod: {
      type: "card",
      last4: "8742",
      expiryMonth: 8,
      expiryYear: 2027,
    },
  },
]

// Mock Background Checks
export const mockBackgroundChecks: BackgroundCheck[] = [
  {
    id: "bg-1",
    providerId: "provider-1",
    status: "approved",
    submittedDate: new Date("2024-12-01"),
    reviewedDate: new Date("2024-12-03"),
    documents: [
      {
        id: "doc-1",
        name: "Driver's License",
        type: "identification",
        uploadedDate: new Date("2024-12-01"),
        fileUrl: "/documents/drivers-license-sample.jpg",
      },
      {
        id: "doc-2",
        name: "Music Education Certificate",
        type: "credential",
        uploadedDate: new Date("2024-12-01"),
        fileUrl: "/documents/music-education-cert.jpg",
      },
    ],
    notes: "All documents verified. Background check clear.",
  },
  {
    id: "bg-2",
    providerId: "provider-17",
    status: "approved",
    submittedDate: new Date("2024-05-15"),
    reviewedDate: new Date("2024-05-18"),
    documents: [
      {
        id: "doc-3",
        name: "Driver's License",
        type: "identification",
        uploadedDate: new Date("2024-05-15"),
        fileUrl: "/documents/drivers-license-sample.jpg",
      },
      {
        id: "doc-4",
        name: "Luthier Certification",
        type: "credential",
        uploadedDate: new Date("2024-05-15"),
        fileUrl: "/documents/luthier-certification.jpg",
      },
    ],
    notes: "All documents verified. Background check clear.",
  },
]

// Mock Service Contracts
export const mockServiceContracts: ServiceContract[] = [
  {
    id: "contract-1",
    parentId: "user-1",
    providerId: "provider-1",
    providerName: "Emily Carter",
    providerAvatar: "/music-teacher-woman-piano.jpg",
    serviceName: "Piano Lessons",
    serviceType: "lessons",
    status: "active",
    startDate: new Date("2024-09-01"),
    sessionsTotal: 24,
    sessionsCompleted: 16,
    pricePerSession: 65,
    totalPaid: 1040,
    paymentSchedule: "per-session",
    nextPaymentDate: new Date("2025-01-17"),
    notes: "Weekly lessons every Tuesday at 4pm",
  },
  {
    id: "contract-2",
    parentId: "user-1",
    providerId: "provider-2",
    providerName: "Michael Rodriguez",
    providerAvatar: "/guitar-teacher-man.jpg",
    serviceName: "Guitar Lessons",
    serviceType: "lessons",
    status: "completed",
    startDate: new Date("2024-06-01"),
    endDate: new Date("2024-08-31"),
    sessionsTotal: 12,
    sessionsCompleted: 12,
    pricePerSession: 55,
    totalPaid: 660,
    paymentSchedule: "per-session",
    notes: "Summer intensive program completed",
  },
  {
    id: "contract-3",
    parentId: "user-1",
    providerId: "provider-4",
    providerName: "Tom's Piano Service",
    providerAvatar: "/piano-tuner.jpg",
    serviceName: "Piano Tuning",
    serviceType: "tuning",
    status: "completed",
    startDate: new Date("2024-12-28"),
    endDate: new Date("2024-12-28"),
    totalPaid: 135,
    paymentSchedule: "one-time",
    notes: "Annual piano tuning and inspection",
  },
  {
    id: "contract-4",
    parentId: "user-1",
    providerId: "provider-3",
    providerName: "Sarah Kim",
    providerAvatar: "/violin-teacher-woman.jpg",
    serviceName: "Violin Lessons",
    serviceType: "lessons",
    status: "completed",
    startDate: new Date("2024-03-01"),
    endDate: new Date("2024-05-15"),
    sessionsTotal: 10,
    sessionsCompleted: 10,
    pricePerSession: 60,
    totalPaid: 600,
    paymentSchedule: "per-session",
    notes: "Full course completed",
  },
]

// Generate parent profiles for all parents
const childFirstNames = [
  "Liam", "Noah", "Oliver", "Elijah", "Lucas", "Mason", "Logan", "Aiden",
  "Ethan", "Jackson", "Sebastian", "Caleb", "Owen", "Dylan", "Luke", "Leo",
  "Emma", "Ava", "Sophia", "Mia", "Luna", "Layla", "Chloe", "Penelope",
  "Ivy", "Stella", "Hazel", "Aurora", "Willow", "Isla", "Violet", "Clara",
]
const instruments = ["Piano", "Guitar", "Violin", "Drums", "Cello", "Flute", "Voice", "Trumpet", "Saxophone", "Ukulele", "Bass Guitar", "Clarinet"]
const levels: ParentChild["level"][] = ["beginner", "intermediate", "advanced"]
const accountStatuses: ParentProfile["accountStatus"][] = ["active", "active", "active", "active", "active", "active", "active", "active", "inactive", "active"]

function generateParentProfiles(): ParentProfile[] {
  const allParentUsers = mockUsers.filter((u) => u.role === "parent")
  const providerNames = mockProviders.map((p) => p.name)

  return allParentUsers.map((parent, i) => {
    const seed = i * 7 + 3
    const numChildren = (seed % 3) + 1 // 1-3 children
    const children: ParentChild[] = []
    for (let c = 0; c < numChildren; c++) {
      children.push({
        name: childFirstNames[(seed + c * 5) % childFirstNames.length],
        age: 5 + ((seed + c) % 14), // age 5-18
        instrument: instruments[(seed + c * 3) % instruments.length],
        level: levels[(seed + c) % levels.length],
        lessonsPerWeek: ((seed + c) % 3) + 1, // 1-3 per week
      })
    }

    const numConnectedProviders = (seed % 3) + 1
    const connectedProviders: string[] = []
    for (let p = 0; p < Math.min(numConnectedProviders, providerNames.length); p++) {
      connectedProviders.push(providerNames[(seed + p) % providerNames.length])
    }

    const activeLessons = children.reduce((sum, ch) => sum + ch.lessonsPerWeek, 0)
    const completedTotal = 10 + (seed % 80)
    const totalSpent = completedTotal * (45 + (seed % 30))

    const monthsAgo = i % 6
    const lastActiveDate = new Date()
    lastActiveDate.setMonth(lastActiveDate.getMonth() - monthsAgo)
    lastActiveDate.setDate(lastActiveDate.getDate() - (seed % 28))

    return {
      userId: parent.id,
      children,
      connectedProviders,
      totalSpent,
      activeLessons,
      completedLessons: completedTotal,
      accountStatus: accountStatuses[i % accountStatuses.length],
      lastActive: lastActiveDate.toISOString().split("T")[0],
      phone: `(${630 + (i % 15)}) ${200 + (seed % 800)}-${1000 + (seed % 9000)}`,
      notes: i % 5 === 0 ? "VIP family - referred multiple new users" : i % 7 === 0 ? "Prefers afternoon lesson times" : undefined,
    }
  })
}

export const mockParentProfiles: ParentProfile[] = generateParentProfiles()

// Helper: get parent profile by userId
export function getParentProfile(userId: string): ParentProfile | undefined {
  return mockParentProfiles.find((p) => p.userId === userId)
}

// Helper: generate payment history for any parent
export function generateParentPayments(userId: string, profile: ParentProfile): { id: string; description: string; date: string; amount: number; status: "paid" | "pending" | "overdue" }[] {
  const payments: { id: string; description: string; date: string; amount: number; status: "paid" | "pending" | "overdue" }[] = []
  const seed = Number.parseInt(userId.replace(/\D/g, ""), 10) || 0

  // Generate past paid lessons
  for (let i = 0; i < Math.min(profile.completedLessons, 8); i++) {
    const date = new Date()
    date.setDate(date.getDate() - (i * 7 + (seed % 3)))
    const child = profile.children[i % profile.children.length]
    const price = 45 + (seed % 30)
    payments.push({
      id: `pay-${userId}-${i}`,
      description: `${child.instrument} Lesson - ${child.name}`,
      date: date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
      amount: price,
      status: "paid",
    })
  }

  // Add 1-2 pending payments
  for (let i = 0; i < ((seed % 2) + 1); i++) {
    const date = new Date()
    date.setDate(date.getDate() + (i * 7 + 3))
    const child = profile.children[i % profile.children.length]
    const price = 45 + (seed % 30)
    payments.push({
      id: `pay-pending-${userId}-${i}`,
      description: `${child.instrument} Lesson - ${child.name}`,
      date: date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
      amount: price,
      status: "pending",
    })
  }

  // Maybe add 1 overdue payment for some users
  if (seed % 4 === 0) {
    const date = new Date()
    date.setDate(date.getDate() - 14)
    const child = profile.children[0]
    payments.push({
      id: `pay-overdue-${userId}`,
      description: `${child.instrument} Lesson - ${child.name} (Overdue)`,
      date: date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
      amount: 45 + (seed % 30),
      status: "overdue",
    })
  }

  return payments
}
