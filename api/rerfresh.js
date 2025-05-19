import axios from "axios";

const client_id = "b40a46efd78f4930b2da171a6933b8ef";
const client_secret = "11e1863d776946848f0a777abb4cbf12";

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
