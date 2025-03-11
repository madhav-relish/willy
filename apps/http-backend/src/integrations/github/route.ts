import express from 'express';
import { middleware } from '../../middleware';
import { createGitHubIntegration, getGitHubIntegration } from './service';

const router: express.Router = express.Router();

router.get('/github', (req, res) => {
  const redirectUrl = `https://github.com/login/oauth/authorize?client_id=${process.env.GITHUB_CLIENT_ID}&scope=repo,user,notifications`;
  res.redirect(redirectUrl);
});

router.get('/github/callback', middleware, async (req, res) => {
  const { code } = req.query;
  // @ts-ignore
  const userId = req.userId;

  if (!code) {
    res.status(400).json({ error: "Missing code" });
    return;
  }

  try {
    const integration = await createGitHubIntegration(userId, code as string);
    res.redirect(`${process.env.FRONTEND_URL}/integrations?success=true`);
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