# AWIN Browser Automation Service

A Node.js service that provides real browser automation for AWIN affiliate program applications using Playwright.

## Features

- **Real Browser Automation**: Uses Playwright to control actual Chromium browser
- **AWIN Integration**: Automated login and form filling for AWIN affiliate applications
- **User Review Process**: Pauses for manual review before form submission
- **Intelligent Form Filling**: Pre-fills common AWIN form fields based on user profile
- **Security**: Rate limiting, CORS, and security headers
- **Error Handling**: Comprehensive error management and logging

## Installation

```bash
cd browser-automation-service
npm install
npm run install-browsers
```

## Configuration

Create a `.env` file:

```env
PORT=3001
NODE_ENV=production
```

## Usage

### Start the service

```bash
npm start
```

### API Endpoints

#### Health Check
```
GET /health
```

#### Automation Endpoint
```
POST /automation/awin-applications
```

Payload:
```json
{
  "credentials": {
    "email": "user@example.com",
    "password": "password"
  },
  "programs": [
    {
      "program_id": 1001,
      "name": "EcoFlow Solar Generator Program",
      "merchant": "EcoFlow",
      "sector": "Renewable Energy",
      "niches": ["Renewable Energy", "Sustainable Living"]
    }
  ],
  "userProfile": {
    "company_name": "AutoContent Nexus",
    "website_url": "https://example.com",
    "promotional_methods": ["Website", "Social Media"],
    "audience_size": "10,000 - 50,000"
  },
  "sessionId": "uuid-session-id"
}
```

## Deployment

For production deployment, this service should be deployed to a cloud platform that supports Node.js and browser automation:

- **Railway**: `railway deploy`
- **Render**: Connect GitHub repository
- **DigitalOcean App Platform**: Deploy from GitHub
- **AWS ECS**: Docker deployment

## Security Considerations

- Rate limiting: 10 requests per 15 minutes per IP
- CORS enabled for specific origins only in production
- Security headers via Helmet
- Input validation and sanitization
- Browser runs in sandboxed environment

## Integration with Supabase

The Supabase edge function calls this service:

```typescript
const automationResponse = await fetch(`${AUTOMATION_SERVICE_URL}/automation/awin-applications`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ credentials, programs, userProfile, sessionId })
});
```
