This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

# GitHub Integration Documentation

## Project Structure

```bash
frontend/
├── components/
│   └── Integrations/
│       ├── GithubIntegration.tsx   # GitHub integration UI
│       └── IntegrationCard.tsx     # Generic integration card
├── hooks/
│   └── useGithub.ts               # GitHub data management hook
└── lib/
    └── api.ts                     # API client configuration

backend/
├── src/
│   ├── integrations/
│   │   └── github/
│   │       ├── route.ts           # GitHub OAuth routes
│   │       ├── service.ts         # GitHub business logic
│   │       └── controller.ts      # GitHub API controllers
│   └── utils/
│       └── encryption.ts          # Token encryption utilities
```

## Frontend Implementation

### 1. GitHub Integration Component
```tsx
// GithubIntegration.tsx
import { Button } from "../ui/button";
import { GithubIcon } from "lucide-react";

export const GithubIntegration = () => {
  const [isConnected, setIsConnected] = useState(false);
  
  const handleConnect = async () => {
    const { data } = await apiClient.get('/auth/github');
    window.location.href = data.authUrl;
  };

  return (
    <div className="border rounded-lg p-4">
      <Button onClick={handleConnect}>
        {isConnected ? 'Disconnect' : 'Connect GitHub'}
      </Button>
    </div>
  );
};
```

### 2. GitHub Hook Usage
```tsx
// Component using GitHub data
const GitHubDashboard = () => {
  const { isConnected, loading, data } = useGithub();
  
  if (loading) return <div>Loading...</div>;
  
  return (
    <div>
      {data.repositories?.map(repo => (
        <div key={repo.id}>{repo.name}</div>
      ))}
    </div>
  );
};
```

## Backend Implementation

### 1. GitHub OAuth Flow

```typescript
// route.ts
router.get('/github', middleware, (req, res) => {
  const state = crypto.randomBytes(16).toString('hex');
  pendingStates.set(state, {
    userId: req.userId,
    expiresAt: Date.now() + 5 * 60 * 1000
  });

  const redirectUrl = `https://github.com/login/oauth/authorize?...`;
  res.json({ authUrl: redirectUrl });
});

router.get('/github/callback', async (req, res) => {
  const { code, state } = req.query;
  // Verify state and create integration
  const integration = await createGitHubIntegration(userId, code);
  res.redirect('/integrations?success=true');
});
```

### 2. Token Management

```typescript
// service.ts
export const createGitHubIntegration = async (userId: string, code: string) => {
  const { authentication } = await oauthApp.createToken({
    code: code as string
  });

  return prismaClient.integration.upsert({
    where: { userId_type: { userId, type: 'GITHUB' } },
    update: {
      accessToken: encrypt(authentication.token),
      // ... other fields
    },
    create: {
      type: 'GITHUB',
      userId,
      accessToken: encrypt(authentication.token),
      // ... other fields
    }
  });
};
```

## Environment Variables

```env
# Frontend (.env.local)
NEXT_PUBLIC_BACKEND_URL=http://localhost:3002
NEXT_PUBLIC_GITHUB_CLIENT_ID=your_client_id

# Backend (.env)
GITHUB_CLIENT_ID=your_client_id
GITHUB_CLIENT_SECRET=your_client_secret
ENCRYPTION_KEY=your_encryption_key
```

## Security Considerations

1. **Token Encryption**: All GitHub tokens are encrypted before storage
2. **State Parameter**: Used to prevent CSRF attacks
3. **Token Expiry**: Managed through `tokenExpiresAt` field
4. **Scope Control**: Limited to required permissions only

## API Endpoints

```typescript
// GitHub Integration Endpoints
GET    /auth/github           // Initiate OAuth
GET    /auth/github/callback  // OAuth callback
GET    /auth/github/status    // Check connection
POST   /auth/github/disconnect // Remove integration

// GitHub Data Endpoints
GET    /auth/github/repos     // List repositories
GET    /auth/github/issues    // List issues
GET    /auth/github/pulls     // List pull requests
```

## Error Handling

The integration implements comprehensive error handling for:
- OAuth flow failures
- Token encryption/decryption
- API rate limits
- Network issues
- Invalid states

## Testing

1. OAuth Flow:
   - Test connection initiation
   - Verify callback handling
   - Check state validation

2. Data Sync:
   - Repository fetching
   - Issue tracking
   - Pull request updates

3. Security:
   - Token encryption
   - State parameter validation
   - Scope verification

## Additional Resources

- [GitHub OAuth Documentation](https://docs.github.com/en/developers/apps/building-oauth-apps)
- [Octokit SDK](https://octokit.github.io/rest.js)
- [GitHub Webhooks](https://docs.github.com/en/webhooks)
