# Pfables - Music Services Marketplace Platform

A trusted marketplace connecting music families with verified local music teachers and service providers.

## Overview

Pfables is a mobile-first Progressive Web App (PWA) designed to simplify the process of finding quality music education and services. The platform emphasizes trust, simplicity, and community values with a focus on verified providers and direct connections.

## Features

### For Parents
- Browse verified music teachers and service providers
- Search and filter by specialty, location, and service type
- Direct contact via phone and messaging
- QR code entry points for easy access
- No account required to browse

### For Providers
- Comprehensive provider dashboard
- Profile management with specialty and service listings
- Lead and inquiry management
- Real-time messaging with parents
- Background check verification workflow
- Subscription management with multiple tiers
- Analytics and performance tracking

### For Administrators
- Platform operations dashboard
- Provider approval and verification system
- Background check document review
- Payment and subscription tracking
- QR code distribution management
- Flag monitoring and moderation tools

## Technology Stack

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4
- **UI Components**: shadcn/ui (Radix UI)
- **State Management**: React Context API
- **Date Handling**: date-fns
- **Icons**: Lucide React
- **PWA**: Progressive Web App enabled

## Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

1. Clone the repository
\`\`\`bash
git clone <repository-url>
cd pfables-prototype
\`\`\`

2. Install dependencies
\`\`\`bash
npm install
\`\`\`

3. Run the development server
\`\`\`bash
npm run dev
\`\`\`

4. Open [http://localhost:3000](http://localhost:3000) in your browser

## Demo Credentials

### Parent Account
- Email: sarah@example.com
- Password: parent123

### Provider Account
- Email: emily@example.com
- Password: provider123

### Admin Account
- Email: john@example.com
- Password: admin123

## Project Structure

\`\`\`
app/
├── (auth)/
│   └── login/          # Authentication pages
├── browse/             # Parent provider discovery
├── messages/           # Parent messaging
├── provider/           # Provider portal
│   ├── dashboard/      # Provider dashboard
│   ├── profile/        # Profile management
│   ├── leads/          # Lead management
│   ├── messages/       # Provider messaging
│   ├── subscription/   # Payment & subscriptions
│   └── verification/   # Background checks
├── admin/              # Admin portal
│   ├── dashboard/      # Admin overview
│   ├── providers/      # Provider management
│   ├── verification/   # Verification review
│   ├── payments/       # Payment tracking
│   └── qr-codes/       # QR code management
components/             # Reusable UI components
lib/                    # Utilities and mock data
hooks/                  # Custom React hooks
public/                 # Static assets
\`\`\`

## Key Components

### Authentication
- Role-based login system (Parent, Provider, Admin)
- One-click demo credentials for easy testing
- Session persistence with localStorage

### Verification System
- Multi-step background check workflow
- Document upload interface
- Admin review and approval process
- Trust badge display

### Subscription Tiers
- **Basic** ($29/mo): Standard directory listing
- **Featured** ($59/mo): Top placement + enhanced profile
- **Premium** ($99/mo): Maximum visibility + premium features

### Messaging System
- Real-time mock messaging interface
- Conversation management
- Read/unread status tracking
- Message threading

## Design System

### Color Palette
- **Primary** (Sage Green): #6B8E6F - Trust, verification
- **Accent** (Terracotta): #C67C5E - Highlights, featured items
- **Background** (Cream/Beige): #F5F1E8 - Warmth, approachability
- **Success**: Green - Verified status, approvals
- **Warning**: Amber - Pending reviews
- **Error**: Red - Rejections, issues

### Typography
- **Font Family**: Geist (Sans), Geist Mono (Monospace)
- **Scale**: Mobile-first with responsive sizing
- **Line Height**: 1.4-1.6 for readability

## PWA Features

- Installable on mobile devices
- Offline-capable with service worker
- App manifest for home screen installation
- Responsive design for all screen sizes
- Touch-optimized interactions

## Mock Data

The application uses comprehensive mock data including:
- 4 sample providers with various specialties
- Background check records
- Subscription data
- Message conversations
- User accounts for all three roles

## Future Enhancements

- Real backend integration with database
- Actual payment processing (Stripe)
- Live messaging with WebSocket
- Email notifications
- Review and rating system
- Advanced search filters
- Geolocation-based provider search
- Calendar/scheduling integration
- Analytics dashboard improvements

## Business Model

### Provider Monetization
Providers pay subscription fees to remain listed on the platform:
- Trial period: 30 days free
- Basic tier: Standard visibility
- Featured tier: Enhanced visibility and features
- Premium tier: Maximum platform benefits

### Key Principle
Parents never pay. Direct communication means:
- No transaction fees
- No platform-mediated payments
- Providers maintain autonomy
- Fair, transparent pricing

## License

This is a prototype project for demonstration purposes.

## Support

For questions or issues, contact the development team.
