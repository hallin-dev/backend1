const express = require('express');
const { MongoClient } = require('mongodb');

const app = express();
const PORT = process.env.PORT || 3000;

const uri = "mongodb+srv://h41lin_business:<db_password>@cluster0.wulbrc8.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

const client = new MongoClient(uri);

app.use(express.json());

const SECRET_KEY = "kai_no1lol3141592653589793238462643382";

let collection;

async function connectToMongo() {
    try {
        await client.connect();
        const db = client.db("roblox_game");
        collection = db.collection("player_times");
        console.log("데이타베이스 연결 성공!");
    } catch (err) {
        console.error("데이타베이스에 연결을 하는데 실패했어요.:", err);
    }
}

connectToMongo();

app.post('/update-time', async (req, res) => {
    const auth = req.headers.authorization;
    if (auth !== `Bearer ${SECRET_KEY}`) {
        return res.status(403).json({ error: "Unauthorized" });
    }

    const { playerName, time, userId } = req.body;

    console.log(`Received from ${playerName}: Time = ${time}`);

    if (!collection) {
        return res.status(500).json({ error: "MongoDB not connected yet" });
    }

    try {
        await collection.updateOne(
            { playerName },
            { $set: { playerName, time, updatedAt: new Date() } },
            { upsert: true }
        );

        res.json({ status: "ok" });
    } catch (err) {
        console.error("❌ Failed to save to MongoDB:", err);
        res.status(500).json({ error: "Internal server error" });
    }
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
