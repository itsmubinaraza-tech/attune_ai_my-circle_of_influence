# Attune - Service Offering & Pricing Model

## Overview

This document outlines the pricing strategy for Attune to ensure sustainable operations while passing AI token costs to end users.

---

## Current Cost Structure

### Claude API Costs (Anthropic)

| Model | Input (per 1M tokens) | Output (per 1M tokens) | Best For |
|-------|----------------------|------------------------|----------|
| Claude 3 Haiku | $0.25 | $1.25 | Cost-effective, fast responses |
| Claude 3 Sonnet | $3.00 | $15.00 | Balanced quality/cost |
| Claude 3 Opus | $15.00 | $75.00 | Premium, complex advice |

### Estimated Token Usage Per Conversation

| Component | Tokens (Approx) |
|-----------|-----------------|
| System prompt (with experts) | ~2,500 tokens |
| User message (average) | ~100 tokens |
| AI response (structured) | ~800-1,200 tokens |
| **Total per exchange** | ~3,500-4,000 tokens |

### Cost Per Message (Claude 3 Haiku)

```
Input: 2,600 tokens × $0.25/1M = $0.00065
Output: 1,000 tokens × $1.25/1M = $0.00125
Total per message: ~$0.002 (0.2 cents)
```

### Cost Per Conversation (5 exchanges average)

```
5 messages × $0.002 = $0.01 per conversation
```

---

## Proposed Pricing Tiers

### Tier 1: Free Plan
- **Price:** $0/month
- **Credits:** 10 messages/month
- **Features:**
  - Basic coaching responses
  - 3 expert perspectives
  - Limited conversation history (7 days)
- **Cost to you:** ~$0.02/user/month
- **Purpose:** User acquisition, trial experience

### Tier 2: Starter Plan
- **Price:** $4.99/month
- **Credits:** 100 messages/month
- **Features:**
  - Full structured responses
  - All 10 expert perspectives
  - Unlimited conversation history
  - Quick Talk voice feature
- **Cost to you:** ~$0.20/user/month
- **Margin:** ~96%

### Tier 3: Growth Plan
- **Price:** $9.99/month
- **Credits:** 300 messages/month
- **Features:**
  - Everything in Starter
  - Priority response time
  - Relationship insights & analytics
  - Export conversation summaries
  - Smart reminders
- **Cost to you:** ~$0.60/user/month
- **Margin:** ~94%

### Tier 4: Premium Plan
- **Price:** $19.99/month
- **Credits:** Unlimited messages
- **Features:**
  - Everything in Growth
  - Claude 3 Sonnet model (higher quality)
  - Advanced AI summaries
  - Family/team sharing (up to 3 users)
  - Priority support
- **Cost to you:** ~$3-5/user/month (estimated)
- **Margin:** ~75-85%

---

## Credit System Design

### Current Implementation
```typescript
const DEFAULT_MONTHLY_CREDITS = 50;
const CREDITS_PER_MESSAGE = 1;
```

### Recommended Changes

```typescript
// Credit costs based on actual token usage
const CREDIT_COSTS = {
  haiku_message: 1,      // Standard message
  sonnet_message: 5,     // Premium message
  voice_transcription: 1, // Quick Talk
  ai_summary: 2,         // Relationship summary
};

// Tier configurations
const TIER_CONFIG = {
  free: {
    monthly_credits: 10,
    model: 'claude-3-haiku-20240307',
    features: ['basic_coaching', 'limited_history'],
  },
  starter: {
    monthly_credits: 100,
    model: 'claude-3-haiku-20240307',
    features: ['full_coaching', 'all_experts', 'quick_talk'],
  },
  growth: {
    monthly_credits: 300,
    model: 'claude-3-haiku-20240307',
    features: ['full_coaching', 'analytics', 'reminders', 'export'],
  },
  premium: {
    monthly_credits: -1, // Unlimited
    model: 'claude-3-sonnet-20240229',
    features: ['all', 'family_sharing', 'priority_support'],
  },
};
```

---

## Pay-As-You-Go Option

### Credit Packs (One-time Purchase)

| Pack | Credits | Price | Per Credit |
|------|---------|-------|------------|
| Small | 50 | $1.99 | $0.04 |
| Medium | 150 | $4.99 | $0.033 |
| Large | 500 | $14.99 | $0.03 |
| Mega | 1,500 | $39.99 | $0.027 |

### Implementation
- Credits never expire
- Can be used alongside subscription
- Good for occasional heavy users

---

## Revenue Projections

### Assumptions
- 1,000 users in Year 1
- Conversion: 5% Free → Starter, 2% → Growth, 1% → Premium

### Monthly Revenue (at 1,000 users)

| Tier | Users | Price | Revenue |
|------|-------|-------|---------|
| Free | 920 | $0 | $0 |
| Starter | 50 | $4.99 | $249.50 |
| Growth | 20 | $9.99 | $199.80 |
| Premium | 10 | $19.99 | $199.90 |
| **Total** | **1,000** | | **$649.20/mo** |

### Monthly Costs

| Item | Cost |
|------|------|
| API (Anthropic) | ~$50-100 |
| Supabase | $25 (Pro plan) |
| Vercel | $20 (Pro plan) |
| **Total** | ~$95-145/mo |

### Estimated Profit
**$500-550/month** at 1,000 users

---

## Implementation Roadmap

### Phase 1: Basic Monetization (Week 1-2)
- [ ] Implement Stripe integration
- [ ] Create subscription plans in Stripe
- [ ] Add payment UI components
- [ ] Enforce credit limits based on plan

### Phase 2: Usage Tracking (Week 3-4)
- [ ] Track token usage per user
- [ ] Create usage analytics dashboard
- [ ] Implement overage alerts
- [ ] Add credit purchase option

### Phase 3: Advanced Features (Week 5-6)
- [ ] Model selection based on plan
- [ ] Feature gating per tier
- [ ] Family/team accounts
- [ ] Usage reports for users

---

## Database Schema Updates

```sql
-- Add subscription fields to profiles
ALTER TABLE profiles ADD COLUMN subscription_tier TEXT DEFAULT 'free';
ALTER TABLE profiles ADD COLUMN subscription_status TEXT DEFAULT 'active';
ALTER TABLE profiles ADD COLUMN stripe_customer_id TEXT;
ALTER TABLE profiles ADD COLUMN subscription_ends_at TIMESTAMPTZ;

-- Add token tracking to coaching_sessions
ALTER TABLE coaching_sessions ADD COLUMN input_tokens INTEGER DEFAULT 0;
ALTER TABLE coaching_sessions ADD COLUMN output_tokens INTEGER DEFAULT 0;
ALTER TABLE coaching_sessions ADD COLUMN model_used TEXT;

-- Create subscription_history table
CREATE TABLE subscription_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  tier TEXT NOT NULL,
  action TEXT NOT NULL, -- 'upgrade', 'downgrade', 'cancel', 'renew'
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

---

## Stripe Integration

### Products to Create
1. **Attune Starter** - $4.99/month
2. **Attune Growth** - $9.99/month
3. **Attune Premium** - $19.99/month
4. **Credit Pack - Small** - $1.99 (one-time)
5. **Credit Pack - Medium** - $4.99 (one-time)
6. **Credit Pack - Large** - $14.99 (one-time)

### Webhook Events to Handle
- `checkout.session.completed` - New subscription
- `invoice.paid` - Subscription renewed
- `invoice.payment_failed` - Payment failed
- `customer.subscription.deleted` - Subscription canceled

---

## Competitive Analysis

| App | Free Tier | Paid Plans | Focus |
|-----|-----------|------------|-------|
| **Attune** | 10 msg/mo | $4.99-$19.99 | Relationship coaching |
| Replika | Limited | $7.99-$69.99 | AI companion |
| Woebot | Free | Enterprise | Mental health |
| Character.AI | Limited | $9.99 | AI chat |

### Attune's Differentiators
- Expert-backed advice (10 thought leaders)
- Relationship-specific context
- Actionable guidance structure
- Voice-first Quick Talk

---

## Risk Mitigation

### API Cost Spikes
- Set hard limits per user per day (e.g., 20 messages)
- Alert when user approaches limit
- Implement request throttling

### Abuse Prevention
- Rate limiting: 1 message per 5 seconds
- Content moderation via Claude
- Account verification for premium features

### Revenue Protection
- Require payment method upfront for trials
- Clear cancellation policy
- Dunning management for failed payments

---

*Last Updated: February 3, 2026*
