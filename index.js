import express from "express";
import fetch from "node-fetch";
import bodyParser from "body-parser";

import dotenv from "dotenv";
dotenv.config();

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));

const PORT = process.env.PORT || 3000;

const tenantId = process.env.TENANT_ID;
const clientId = process.env.CLIENT_ID;
const clientSecret = process.env.CLIENT_SECRET;
const redirectUri = process.env.REDIRECT_URI || "http://localhost:3000/callback";

app.get("/", (req, res) => {
    const authUrl = `https://login.microsoftonline.com/${tenantId}/oauth2/v2.0/authorize?` +
        `client_id=${clientId}&response_type=code&redirect_uri=${encodeURIComponent(redirectUri)}` +
        `&response_mode=query&scope=OnlineMeetings.ReadWrite%20offline_access&state=12345`;

    res.send(`<a href="${authUrl}">Login with Microsoft</a>`);
});

app.get("/callback", async (req, res) => {
    const code = req.query.code;
    if (!code) {
        return res.status(400).send("No code received");
    }

    try {
        const tokenResponse = await fetch(`https://login.microsoftonline.com/${tenantId}/oauth2/v2.0/token`, {
            method: "POST",
            headers: { "Content-Type": "application/x-www-form-urlencoded" },
            body: new URLSearchParams({
                client_id: clientId,
                client_secret: clientSecret,
                grant_type: "authorization_code",
                code,
                redirect_uri: redirectUri,
            }),
        });

        const tokens = await tokenResponse.json();
        console.log("Tokens received:", tokens);

        res.json(tokens);
    } catch (err) {
        console.error(err);
        res.status(500).send("Token exchange failed");
    }
});

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
