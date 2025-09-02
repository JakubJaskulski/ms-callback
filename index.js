import express from "express";
import fetch from "node-fetch";
import dotenv from "dotenv";
import {Client} from "@microsoft/microsoft-graph-client";

dotenv.config();

const app = express();

const {TENANT_ID, CLIENT_ID, CLIENT_SECRET, PORT} = process.env;
const redirectUri = "http://localhost:3000/callback";

let accessToken = null;

app.get("/", (req, res) => {
    const authUrl = `https://login.microsoftonline.com/${TENANT_ID}/oauth2/v2.0/authorize?` +
        `client_id=${CLIENT_ID}&response_type=code&redirect_uri=${redirectUri}` +
        `&scope=User.Read OnlineMeetings.ReadWrite Calendars.ReadWrite&state=12345`;

    res.send(`<a href="${authUrl}">Login with Microsoft</a>`);
});

app.get("/callback", async (req, res) => {
    const code = req.query.code;
    if (!code) {
        return res.status(400).send("No code received");
    }

    try {
        const tokenResponse = await fetch(`https://login.microsoftonline.com/${TENANT_ID}/oauth2/v2.0/token`, {
            method: "POST",
            headers: {"Content-Type": "application/x-www-form-urlencoded"},
            body: new URLSearchParams({
                client_id: CLIENT_ID,
                client_secret: CLIENT_SECRET,
                grant_type: "authorization_code",
                code,
                redirect_uri: redirectUri,
            }),
        });

        const tokens = await tokenResponse.json();
        console.log("Tokens received:", tokens);
        accessToken = tokens.access_token;

        res.send(`<a href="/meeting">Create Teams Meeting</a>`);
    } catch (err) {
        console.error(err);
        res.status(500).send("Token exchange failed");
    }
});

app.get("/meeting", async (req, res) => {
    if (!accessToken) return res.send("Not authenticated");

    try {
        const authProvider = {
            getAccessToken: async () => {
                return accessToken;
            }
        };

        const client = Client.initWithMiddleware({authProvider});

        const onlineMeeting = {
            startDateTime: new Date(Date.now() + 5 * 60 * 1000).toISOString(),
            endDateTime: new Date(Date.now() + 65 * 60 * 1000).toISOString(),
            subject: 'Quick Teams Meeting'
        };

        const meeting = await client.api('/me/onlineMeetings').post(onlineMeeting);

        console.log("Meeting created:", meeting);

        if (meeting.joinWebUrl) {
            return res.send(`<a href="${meeting.joinWebUrl}" target="_blank">Join Teams Meeting</a>`);
        }

        res.send(`Meeting created but no join URL found: ${JSON.stringify(meeting, null, 2)}`);

    } catch (error) {
        console.error("Error creating meeting:", error);
        res.send(`Error creating meeting: ${error.message}<br><br>Full error: ${JSON.stringify(error, null, 2)}`);
    }
});

app.listen(PORT, () => console.log(`Server running at http://localhost:${PORT}`));
