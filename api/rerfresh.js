import axios from "axios";

const client_id = "74dc21db45b74ca19665f9ff2d334554";
const client_secret = "57cd816cf7c04d71b5a7918391412acc";

export default async function handler(req, res) {
  const refresh_token = req.query.refresh_token;
  if (!refresh_token) {
    res.status(400).json({ error: "No refresh_token provided" });
    return;
  }

  try {
    const params = new URLSearchParams();
    params.append("grant_type", "refresh_token");
    params.append("refresh_token", refresh_token);

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

    res.status(200).json({
      access_token: tokenRes.data.access_token,
      expires_in: tokenRes.data.expires_in,
      scope: tokenRes.data.scope,
      token_type: tokenRes.data.token_type,
    });
  } catch (error) {
    res.status(500).json({
      error: "Error al refrescar el token",
      details: error.response?.data || error.message,
    });
  }
}
