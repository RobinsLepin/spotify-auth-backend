import axios from "axios";

const client_id = "74dc21db45b74ca19665f9ff2d334554";
const client_secret = "57cd816cf7c04d71b5a7918391412acc";
const redirect_uri = "https://spotify-auth-backend-d25m.vercel.app/api/callback";

export default async function handler(req, res) {
  // Manejar CORS
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  const code = req.query.code;
  console.log("Received callback with code:", code ? "Code received" : "No code");

  if (!code) {
    res.status(400).send("No code provided");
    return;
  }

  try {
    const params = new URLSearchParams();
    params.append("code", code);
    params.append("redirect_uri", redirect_uri);
    params.append("grant_type", "authorization_code");

    console.log("Exchanging code for token...");

    const tokenRes = await axios.post(
      "https://accounts.spotify.com/api/token",
      params,
      {
        headers: {
          Authorization: "Basic " + Buffer.from(client_id + ":" + client_secret).toString("base64"),
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }
    );

    const access_token = tokenRes.data.access_token;
    const refresh_token = tokenRes.data.refresh_token;

    console.log("Token exchange successful");

    const redirectUrl = `cdspotify://callback?access_token=${access_token}&refresh_token=${refresh_token}`;
    console.log("Redirecting to app:", redirectUrl);

    res.writeHead(302, { Location: redirectUrl });
    res.end();
  } catch (error) {
    console.error("Error during token exchange:", error.response?.data || error.message);
    res.status(500).send("Error al intercambiar el código: " + (error.response?.data || error.message));
  }
}
