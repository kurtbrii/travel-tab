# Data Models and Schema Changes

## New Data Models
- BorderBuddy
  - One per Trip (idempotent enablement)
  - Fields: `id`, `tripId` (UNIQUE), `enabledAt`, `createdAt`, `updatedAt`

- BorderBuddyContext
  - Persisted form inputs to enrich prompts
  - Fields: `id`, `borderBuddyId` (UNIQUE), `interests` String[]?, `regions` String[]?, `budget` String?, `style` String?, `constraints` String[]?, `updatedAt`, timestamps

- PlacesRecommendation
  - Latest generated places list per trip
  - Fields: `id`, `borderBuddyId` (UNIQUE), `generatedAt`, `items` (JSON array of { name, description, tags?, region? }), timestamps

- ChatMessage
  - Persisted chat per trip
  - Fields: `id`, `borderBuddyId`, `role` (User|Assistant), `content`, `createdAt`, `updatedAt`

## Updates to Existing Models
- Trip: `purpose` Enum or String (default 'Other')

## Schema Integration Strategy
- New Tables: BorderBuddy, BorderBuddyContext, PlacesRecommendation, ChatMessage
- Modified Tables: Trip (+purpose)
- Indexes: UNIQUE(tripId) on BorderBuddy; UNIQUE(borderBuddyId) on BorderBuddyContext and PlacesRecommendation; indexes on FKs and `createdAt` as listed.
- Cascading Deletes: Define `ON DELETE CASCADE` or equivalent service-level transactional deletes for all trip-scoped relations (BorderBuddy → Context/Places/ChatMessages) so deleting a Trip removes dependent data safely.
- Migration: Additive changes; create BorderBuddy lazily on enablement; no destructive changes.
- Backward Compatibility: Existing Trip flows unaffected; new endpoints are additive.

## Canonical Enums
- ChatMessage.role: `User | Assistant`

## Prisma Schema (Reference)
```prisma
enum ChatRole {
  User
  Assistant
}

model User {
  id           String   @id @default(cuid())
  email        String   @unique
  passwordHash String
  nationality  String?  // ISO 3166-1 alpha-3 or alpha-2
  trips        Trip[]
  createdAt    DateTime @default(now())
  updatedAt    DateTime @updatedAt
}

model Trip {
  id                 String       @id @default(cuid())
  userId             String
  user               User         @relation(fields: [userId], references: [id])
  title              String
  destinationCountry String
  purpose            String
  startDate          DateTime
  endDate            DateTime
  borderBuddy        BorderBuddy?
  createdAt          DateTime     @default(now())
  updatedAt          DateTime     @updatedAt
  @@index([userId, createdAt])
}

model BorderBuddy {
  id         String   @id @default(cuid())
  tripId     String   @unique
  trip       Trip     @relation(fields: [tripId], references: [id], onDelete: Cascade)
  enabledAt  DateTime @default(now())
  context    BorderBuddyContext?
  places     PlacesRecommendation?
  messages   ChatMessage[]
  createdAt  DateTime @default(now())
  updatedAt  DateTime @updatedAt
}

model BorderBuddyContext {
  id            String      @id @default(cuid())
  borderBuddyId String      @unique
  borderBuddy   BorderBuddy @relation(fields: [borderBuddyId], references: [id], onDelete: Cascade)
  interests     String[]
  regions       String[]
  budget        String?
  style         String?
  constraints   String[]
  createdAt     DateTime    @default(now())
  updatedAt     DateTime    @updatedAt
}

model PlacesRecommendation {
  id            String      @id @default(cuid())
  borderBuddyId String      @unique
  borderBuddy   BorderBuddy @relation(fields: [borderBuddyId], references: [id], onDelete: Cascade)
  items         Json
  generatedAt   DateTime    @default(now())
  createdAt     DateTime    @default(now())
  updatedAt     DateTime    @updatedAt
}

model ChatMessage {
  id            String      @id @default(cuid())
  borderBuddyId String
  borderBuddy   BorderBuddy @relation(fields: [borderBuddyId], references: [id], onDelete: Cascade)
  role          ChatRole
  content       String
  createdAt     DateTime    @default(now())
  updatedAt     DateTime    @updatedAt
  @@index([borderBuddyId, createdAt])
}
```
