const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

const SECRET_KEY = "your_secret_key";

app.post('/update-time', (req, res) => {
    const auth = req.headers.authorization;
    if (auth !== `Bearer ${SECRET_KEY}`) {
        return res.status(403).json({ error: "Unauthorized" });
    }

    const { playerName, time } = req.body;
    console.log(`Received from ${playerName}: Time = ${time}`);
    res.json({ status: "ok" });
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
