import express from 'express';
import { middleware } from '../../middleware.js';
import { createGitHubIntegration, getGitHubIntegration } from './service.js';
import { prismaClient } from '@repo/db/client';
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

  const redirectUrl = `https://github.com/login/oauth/authorize?client_id=Iv23liGFnwBtAHcZLgg0&scope=repo,user,notifications&state=${state}`;
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

export default router;