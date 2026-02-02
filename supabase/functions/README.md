# Supabase Edge Functions

This directory contains Supabase Edge Functions for the Attune app.

## Functions

### `/chat`

Handles Claude AI chat interactions with relationship context injection.

**Features:**
- Secure API key storage (never exposed to frontend)
- User authentication required
- Context-aware system prompts (person, mood, outcome)
- Token usage tracking

## Setup Instructions

### Prerequisites

1. Install Supabase CLI:
   ```bash
   npm install -g supabase
   ```

2. Login to Supabase:
   ```bash
   supabase login
   ```

3. Link your project:
   ```bash
   supabase link --project-ref cjtratenqbohkufbyiqb
   ```

### Set Your Anthropic API Key

Store your Claude API key as a Supabase secret:

```bash
supabase secrets set ANTHROPIC_API_KEY=sk-ant-api03-your-key-here
```

Get your API key from: https://console.anthropic.com/settings/keys

### Deploy the Function

Deploy the chat function:

```bash
supabase functions deploy chat --no-verify-jwt
```

The `--no-verify-jwt` flag is needed because we handle authentication manually in the function.

### Verify Deployment

1. Go to your Supabase Dashboard
2. Navigate to Edge Functions
3. You should see the `chat` function listed
4. Check the logs for any deployment issues

## Local Development

To test the function locally:

```bash
# Start the function locally
supabase functions serve chat --env-file .env.local

# In .env.local, add:
ANTHROPIC_API_KEY=your-api-key
```

## API Reference

### POST `/functions/v1/chat`

**Headers:**
- `Authorization: Bearer <user_access_token>` (required)
- `Content-Type: application/json`

**Request Body:**
```json
{
  "messages": [
    { "role": "user", "content": "Hello" },
    { "role": "assistant", "content": "Hi there!" }
  ],
  "personContext": {
    "name": "John",
    "group": "work",
    "subgroup": "Team",
    "role": "Manager",
    "notes": "Good listener",
    "relationshipHealth": 85
  },
  "mood": "anxious",
  "outcomeGoal": "Have a productive conversation"
}
```

**Response:**
```json
{
  "message": "I understand you're feeling anxious about talking to John...",
  "usage": {
    "inputTokens": 150,
    "outputTokens": 200
  }
}
```

## Troubleshooting

### "ANTHROPIC_API_KEY not configured"
- Run `supabase secrets set ANTHROPIC_API_KEY=your-key`
- Redeploy the function

### "Unauthorized"
- Ensure the user is logged in
- Check that the Authorization header is being sent

### Function not responding
- Check Edge Function logs in Supabase Dashboard
- Verify the function deployed successfully
