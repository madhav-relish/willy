import express from 'express';
import { middleware } from '../../middleware.js';
import { createGitHubIntegration, getAllGithubNotifications, getGitHubIntegration } from './service.js';
import crypto from 'crypto';

const router: express.Router = express.Router();

// Store temporary states with user IDs
const pendingStates = new Map<string, { userId: string; expiresAt: number }>();

router.get('/github', middleware, (req, res) => {
  // @ts-ignore
  const userId = req.userId;
  const state = crypto.randomBytes(16).toString('hex');
  
  // Store state with 5 minute expiry
  pendingStates.set(state, {
    userId,
    expiresAt: Date.now() + 5 * 60 * 1000
  });

  const redirectUrl = `https://github.com/login/oauth/authorize?client_id=Ov23liwvJfimL3q75Vl9&scope=repo,user,notifications,read:org&state=${state}`;
  res.json({ authUrl: redirectUrl });
});

router.get('/github/callback', async (req, res) => {
  const { code, state } = req.query;

  if (!code || !state) {
    res.status(400).json({ error: "Missing code or state" });
    return;
  }

  const storedState = pendingStates.get(state as string);
  if (!storedState || Date.now() > storedState.expiresAt) {
    pendingStates.delete(state as string);
    res.status(400).json({ error: "Invalid or expired state" });
    return;
  }

  try {
    const integration = await createGitHubIntegration(storedState.userId, code as string);
    // Clean up the stored state
    pendingStates.delete(state as string);
    res.redirect(`http://localhost:3000/integrations?success=true`);
  } catch (error) {
    console.error("GitHub OAuth Error:", error);
    res.status(500).json({ error: "OAuth Failed" });
  }
});

router.get('/github/status', middleware, async (req, res) => {
  // @ts-ignore
  const userId = req.userId;
  
  try {
    const integration = await getGitHubIntegration(userId);
    res.json({ 
      isConnected: !!integration,
      integration
    });
  } catch (error) {
    res.status(500).json({ error: "Failed to get integration status" });
  }
});


router.get('/github/all-notifications', middleware, async (req, res) => {
    // @ts-ignore
    const userId = req.userId;

    try {
      const integration = await getGitHubIntegration(userId)
      if(!integration) {
         res.status(401).json({
          message: "Github is not integrated"
        })
        return
      }

      const notifications = await getAllGithubNotifications(integration.accessToken)
       res.status(200).json(notifications)
       return
    } catch(error) {
      console.error("Error while fetching notifications:", error)
       res.status(500).json({
        message: "Failed to fetch notifications"
      })
      return
    }
})

export default router;