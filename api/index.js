import axios from "axios";

const client_id = "b40a46efd78f4930b2da171a6933b8ef";
const client_secret = "11e1863d776946848f0a777abb4cbf12";
const redirect_uri = "https://spotify-auth-backend.vercel.app/"; // Cambia esto tras desplegar

export default async function handler(req, res) {
  if (req.url.startsWith("/api/login")) {
    const scopes = "user-read-email user-read-private";
    const url =
      "https://accounts.spotify.com/authorize" +
      "?response_type=code" +
      "&client_id=" + client_id +
      "&scope=" + encodeURIComponent(scopes) +
      "&redirect_uri=" + encodeURIComponent(redirect_uri);
    res.writeHead(302, { Location: url });
    res.end();
    return;
  }

  if (req.url.startsWith("/api/callback")) {
    const urlObj = new URL("http://localhost" + req.url);
    const code = urlObj.searchParams.get("code");
    if (!code) {
      res.status(400).send("No code provided");
      return;
    }
    try {
      const params = new URLSearchParams();
      params.append("code", code);
      params.append("redirect_uri", redirect_uri);
      params.append("grant_type", "authorization_code");

      const tokenRes = await axios.post(
        "https://accounts.spotify.com/api/token",
        params,
        {
          headers: {
            Authorization:
              "Basic " +
              Buffer.from(client_id + ":" + client_secret).toString("base64"),
            "Content-Type": "application/x-www-form-urlencoded",
          },
        }
      );
      // Redirige a tu app con el access_token
      const access_token = tokenRes.data.access_token;
      const refresh_token = tokenRes.data.refresh_token;
      res.writeHead(302, {
        Location: `cdspotify://callback?access_token=${access_token}&refresh_token=${refresh_token}`,
      });
      res.end();
    } catch (e) {
      res.status(500).send("Error al intercambiar el código: " + e);
    }
    return;
  }

  res.status(404).send("Not found");
}
