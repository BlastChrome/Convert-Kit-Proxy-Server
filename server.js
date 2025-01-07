require("dotenv").config();
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Proxy endpoint
app.post("/subscribe", async (req, res) => {
  const { email, token } = req.body;

  // Optional token validation for security
  if (token !== process.env.ACCESS_TOKEN) {
    return res.status(403).json({ error: "Unauthorized" });
  }

  if (!email) {
    return res.status(400).json({ error: "Email is required" });
  }

  try {
    const response = await fetch(
      `https://api.convertkit.com/v3/forms/${process.env.CONVERTKIT_FORM_ID}/subscribe`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          api_key: process.env.CONVERTKIT_API_KEY,
          email: email,
        }),
      }
    );

    const data = await response.json();
    res.status(response.ok ? 200 : 500).json(data);
  } catch (error) {
    res.status(500).json({ error: "Something went wrong" });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
