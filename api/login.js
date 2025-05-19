import axios from "axios";

const client_id = "b40a46efd78f4930b2da171a6933b8ef";
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

  const scopes = "user-read-email user-read-private";
  const url = "https://accounts.spotify.com/authorize" +
    "?response_type=code" +
    "&client_id=" + client_id +
    "&scope=" + encodeURIComponent(scopes) +
    "&redirect_uri=" + encodeURIComponent(redirect_uri);
  
  console.log("Redirecting to Spotify auth:", url);
  res.writeHead(302, { Location: url });
  res.end();
}
