# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

MumbleKey is a secure, anonymous, asynchronous messaging application built with Next.js. It allows users to exchange encrypted messages using "magic words" (3-word phrases) without requiring accounts or personal information.

## Common Development Commands

```bash
# Install dependencies (requires pnpm)
pnpm install

# Run development server with Turbopack
pnpm dev

# Build for production
pnpm build

# Start production server
pnpm start

# Run linter
pnpm lint

# Format code with Prettier
pnpm prettier --write .

# Generate CRON_SECRET for Vercel deployment
pnpm generate-env
```

## Architecture Overview

### Core Concepts

1. **Magic Words System**: 3-word phrases generated deterministically using an LCG (Linear Congruential Generator) that link to public keys
2. **Hybrid Encryption**: RSA-OAEP (2048-bit) for key exchange + AES-GCM (256-bit) for message encryption
3. **Anonymous Sessions**: Cookie-based sessions that only link to magic words, no user accounts
4. **Automatic Expiration**: All data expires after 7 days for privacy

### Data Flow

1. **Receiver** generates RSA key pair locally → receives magic words → shares with sender
2. **Sender** enters magic words → encrypts message with AES → encrypts AES key with receiver's public key → sends
3. **Receiver** retrieves encrypted messages → decrypts AES key with private key → decrypts message

### Key Patterns

#### Redis Key Structure
- `mumble:last_seed` - Counter for magic word generation
- `mumble:session:{id}:words` - Links sessions to magic words
- `mumble:words:{words}:key` - Stores public keys
- `mumble:words:{words}:messages` - Message queue

#### Server Actions
All server-side operations use Next.js Server Actions (`"use server"`). Key actions:
- `getOrCreateMagicWords()` - Session management
- `sendMessageForWords()` - Message sending
- `getMessagesForWords()` - Message retrieval
- `storePublicKeyForWords()` - Key storage

#### Encryption Implementation
- Client-side key generation using Web Crypto API
- Private keys stored in localStorage, never sent to server
- Messages encrypted client-side before transmission
- See `src/state/client.ts` for encryption/decryption logic

### Project Structure

```
src/
├── app/              # Next.js App Router pages
│   ├── send/         # Send message flow
│   ├── receive/      # Receive messages flow
│   ├── inbox/        # View received messages
│   └── destroy/      # Session destruction
├── components/       # React components
├── state/           # Core business logic
│   ├── client.ts    # Client-side encryption
│   ├── server.ts    # Server actions
│   └── lcg.ts       # Magic word generation
└── styles/          # CSS (Cosmo theme)
```

### Environment Variables

Required for production:
- `UPSTASH_REDIS_REST_URL` - Redis connection URL
- `UPSTASH_REDIS_REST_TOKEN` - Redis auth token
- `CRON_SECRET` - Secret for Vercel Cron authentication (generate with `pnpm generate-env`)

Optional LCG configuration:
- `LCG_A` - LCG multiplier (default: 1103515245)
- `LCG_C` - LCG increment (default: 12345)
- `LCG_M` - LCG modulus (default: 2^31)

### Security Considerations

- All encryption happens client-side
- Private keys never leave the user's device
- Server only stores encrypted data
- Sessions are httpOnly cookies
- All data auto-expires after 7 days
- No user tracking or persistent accounts

### API Routes

#### Cron Keep-Alive
- **Path**: `/api/cron/keep-alive`
- **Purpose**: Keeps Upstash Redis active on free tier
- **Schedule**: Every 12 hours (configured in vercel.json)
- **Authentication**: Requires `CRON_SECRET` in Authorization header
- **Redis Keys**: 
  - `mumble:cron:keepalive` - Single record with latest timestamp
  - `mumble:cron:keepalive:count` - Tracks total number of updates

### Testing

Currently no test framework is configured. When adding tests, consider:
- Testing the LCG for deterministic output
- Verifying encryption/decryption roundtrips
- Testing Redis operations with mocks
- End-to-end flows for send/receive