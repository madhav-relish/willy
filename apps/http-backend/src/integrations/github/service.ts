
import { encrypt, decrypt } from '../../utils/encryption.js';
import { Octokit } from '@octokit/rest';
import { OAuthApp } from '@octokit/oauth-app';
import { prismaClient } from '@repo/db/client';

const oauthApp = new OAuthApp({
  clientId: "Iv23liGFnwBtAHcZLgg0",
  clientSecret: "8d0277aa23384853179bab324254c98067f76ee2"
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
