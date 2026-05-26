# WeAttuned — System Architecture

> **Status:** Living document. Update after every feature/structural change.
> **Last reconciled:** 2026-05-26 (full codebase audit).
> Legend: ✅ exists today · 🔲 planned (Phase 2).

---

## Section 1: System Architecture Diagram

```mermaid
graph TB
    subgraph "Client Layer"
        WEB["WeAttuned Web App<br/>React + Vite PWA<br/>weattuned.com<br/>routes: / , /circle , /chat"]
        MOB["Mobile App<br/>Expo React Native<br/>iOS + Android"]
        EXT["External Tools 🔲<br/>Slack / Gmail / Claude Desktop<br/>(via MCP, future)"]
    end

    subgraph "Backend Layer (Supabase)"
        SUPA["Supabase<br/>PostgreSQL + Auth + RLS"]
        EDGE["Edge Functions<br/>✅ chat<br/>🔲 create-checkout / stripe-webhook<br/>🔲 summaries / send-reminders"]
        STRIPE["Stripe 🔲<br/>Subscriptions"]
    end

    subgraph "MCP Layer 🔲 (future)"
        MCP["WeAttuned MCP Server<br/>9 coaching tools"]
        APIKEY["API Key Auth<br/>api_keys table"]
    end

    subgraph "AI Layer"
        CLAUDE["Claude API<br/>Haiku / Sonnet"]
    end

    WEB --> SUPA
    MOB --> SUPA
    WEB -. 🔲 .-> STRIPE
    STRIPE -. 🔲 webhook .-> EDGE
    SUPA --> EDGE
    EDGE --> CLAUDE
    EXT -. 🔲 .-> MCP
    MCP -. 🔲 .-> APIKEY
    MCP -. 🔲 .-> SUPA
    MCP -. 🔲 .-> CLAUDE
```

---

## Section 2: Database Schema (current)

Tables that exist today (with RLS enabled). 🔲 marks columns/tables to be added in A1/A4/C1.

```mermaid
erDiagram
    profiles {
        uuid id PK
        string email
        string full_name
        string avatar_url
        json preferences
        string subscription_tier "🔲 A1"
        string subscription_status "🔲 A1"
        string stripe_customer_id "🔲 A1"
        timestamp subscription_ends_at "🔲 A1"
    }
    people {
        uuid id PK
        uuid user_id FK
        string name
        string group
        string subgroup
        string role
        json communication_style
        string_array motivations
        number relationship_health
        timestamp last_contact
        boolean is_archived
    }
    interactions {
        uuid id PK
        uuid user_id FK
        uuid person_id FK
        timestamp interaction_date
        string context
        string outcome
        string mood_before
        string mood_after
    }
    coaching_sessions {
        uuid id PK
        uuid user_id FK
        uuid person_id FK
        json messages
        string mood
        string outcome_goal
        number tokens_used
    }
    user_credits {
        uuid id PK
        uuid user_id FK
        number credits_remaining
        number credits_total
        timestamp reset_date
    }
    reminders {
        uuid id PK
        uuid user_id FK
        uuid person_id FK
        string reminder_type
        timestamp reminder_date
        boolean is_completed
    }
    person_connections {
        uuid id PK
        uuid person_a_id FK
        uuid person_b_id FK
        string connection_type
    }
    consent_records {
        uuid id PK
        uuid user_id FK
        string consent_type
        string version_hash
        boolean consent_flag
    }
    subscription_events {
        uuid id PK "🔲 A1"
        uuid user_id FK
        string event_type
        string stripe_event_id
    }
    api_keys {
        uuid id PK "🔲 A4"
        uuid user_id FK
        string key_hash
        string tier
    }
    summaries {
        uuid id PK "🔲 C1"
        uuid user_id FK
        string summary_type
        string content
    }

    profiles ||--o{ people : "has"
    profiles ||--o{ coaching_sessions : "has"
    profiles ||--o{ user_credits : "has"
    people ||--o{ interactions : "has"
    people ||--o{ coaching_sessions : "about"
    people ||--o{ reminders : "has"
    people ||--o{ person_connections : "links"
```

---

## Section 3: MCP Data Flow (future — Part B)

Deferred until Step 4. Sequence diagram retained in `PHASE2_PLAN.md` Section 3.

---

## Section 4: Feature Status

| Area | Feature | Status |
|------|---------|--------|
| App | Auth, Add Person, Chat + AI, voice, onboarding | ✅ |
| App | Person Profile modal (view/edit/archive/delete) | ✅ |
| App | Circle dashboard (groups, search, sort, health) | ✅ |
| App | Interaction logging + relationship health calc | ✅ |
| App | Reminders widget + create modal (UI) | ✅ |
| App | Connections, Summaries/Insights UI | ✅ |
| Compliance | Consent records + legal document versions | ✅ |
| **A1** | Stripe subscriptions (DB, edge fns, /me page, enforcement) | 🔄 in progress |
| **C1** | Smart summaries edge fn + Reflect page | 🔲 |
| **C2** | send-reminders edge fn (email digest) | 🔲 |
| **A4** | api_keys table + service + manager UI | 🔲 (MCP prereq) |
| **B** | MCP server (9 tools, auth, rate limit, deploy) | 🔲 |
| **D** | MCP pricing tiers + API key UI | 🔲 |

---

## Deployment
- **Web:** Vercel → weattuned.com
- **Backend:** Supabase (PostgreSQL + Auth + Edge Functions)
- **Mobile:** Expo (iOS + Android)
- **MCP:** 🔲 TBD (Railway vs Vercel vs Supabase Edge — decided at Step 4)
- **Repo:** github.com/itsmubinaraza-tech/attune_ai_my-circle_of_influence (`origin`)
