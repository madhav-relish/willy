import { encrypt, decrypt } from '../../utils/encryption.js';
import { Octokit } from '@octokit/rest';
import { OAuthApp } from '@octokit/oauth-app';
import { prismaClient } from '@repo/db/client';

const oauthApp = new OAuthApp({
  clientId: "Ov23liwvJfimL3q75Vl9",
  clientSecret: "1ae865fbb7042817448de668c81fa0212221c6dd"
});

export const createGitHubIntegration = async (userId: string, code: string) => {
  const { authentication } = await oauthApp.createToken({
    code: code as string
  });

  const octokit = new Octokit({ auth: authentication.token });
  const { data: githubUser } = await octokit.rest.users.getAuthenticated();

  const integration = await prismaClient.integration.upsert({
    where: {
      userId_type: {
        userId,
        type: 'GITHUB'
      }
    },
    update: {
      accessToken: encrypt(authentication.token),
      scope: authentication.scopes,
      metadata: {
        githubId: githubUser.id,
        login: githubUser.login
      },
      isActive: true
    },
    create: {
      type: 'GITHUB',
      userId,
      accessToken: encrypt(authentication.token),
      scope: authentication.scopes,
      metadata: {
        githubId: githubUser.id,
        login: githubUser.login
      }
    }
  });

  return integration;
};

export const getGitHubIntegration = async (userId: string) => {
  const integration = await prismaClient.integration.findUnique({
    where: {
      userId_type: {
        userId,
        type: 'GITHUB'
      }
    }
  });

  if (integration) {
    return {
      ...integration,
      accessToken: decrypt(integration.accessToken)
    };
  }

  return null;
};

export const getAllGithubNotifications = async (accessToken: string) => {
  const octokit = new Octokit({
    auth: accessToken,
    headers: {
      accept: 'application/vnd.github.v3+json'
    }
  });

  try {
    const { data: allNotifications } = await octokit.rest.activity.listNotificationsForAuthenticatedUser({
      all: true,
      per_page: 100,
      headers: {
        'If-None-Match': ''  // Ensure we get fresh data
      }
    });
    return allNotifications;
  } catch (error: any) {
    if (error.status === 403) {
      throw new Error('Insufficient permissions. Please reconnect your GitHub account.');
    }
    throw error;
  }
}
