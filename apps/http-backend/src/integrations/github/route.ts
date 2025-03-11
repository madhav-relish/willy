import express from 'express'
import { OAuthApp } from '@octokit/oauth-app'
import { Octokit } from '@octokit/rest'

const router: express.Router = express.Router()

const oauthApp = new OAuthApp({
    clientId: process.env.GITHUB_CLIENT_ID ||  "",
    clientSecret: process.env.GITHUB_CLIENT_SECRET ||  ""
})


// Redirect user to github oauth url
router.get('/github', (req, res)=>{
    const redirectUrl = `https://github.com/login/oauth/authorize?client_id=${process.env.GITHUB_CLIENT_ID}&scope=read:user,user:email`;
    res.redirect(redirectUrl)
})

//Github redirects back with code
router.get('/github/callback', async(req,res)=>{
    const { code } = req.query
    if (!code) { res.status(400).json({ error: "Missing code" });
    return
}

try{
    //exchanging code for token
    const { authentication } = await oauthApp.createToken({code: code as string})

   // fetch github user details
   const octokit = new Octokit({ auth: authentication.token})
    const { data: user } = await octokit.request("GET /user");

    res.redirect(`http://localhost:3000/integrations?token=${authentication.token}`);

 }catch(error){
    console.error("GitHub OAuth Error:", error);
    res.status(500).json({ error: "OAuth Failed" });
}
})


export default router