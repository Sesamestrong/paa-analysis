const express = require("express");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const request = require("request-promise");
const UserAgent = require("user-agents");
require("dotenv").config();
const app = express();
app.use(require("cors")());
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));

(async () => {
    const {
        Game
    } = require("./mongoose.js");
    app.post("/challenge", async (req, res) => {
        const {
            query,
            endTerm,
            allowAnswer
        } = req.body;
        const game = await Game.new(query, endTerm, allowAnswer);
        res.json({
            id: game._id,
            query: game.query,
            questions: game.questions,
            endTerm: game.endTerm,
            allowAnswer: game.allowAnswer,
            complete: game.completed
        });
    });
    app.get("/click", async (req, res) => {
        const {
            idx,
            id
        } = req.query;
        console.log(idx,id);
        if (!(idx && id!==undefined)) return res.status(400).json({
            err: "Required fields missing."
        });
        const game = await Game.findById(id);
        if (!game) return res.status(404).json({
            err: "Game not found"
        });
        await game.click(idx);
        res.json({
            id: game._id,
            query: game.query,
            questions: game.questions,
            endTerm: game.endTerm,
            allowAnswer: game.allowAnswer,
            complete: game.completed
        });
    });
    app.get("/challenge", async (req, res) => {
        const {
            id
        } = req.query;
        if (!id) return res.status(400).json({
            err: "Missing required field."
        });
        const game  = await Game.findById(id);
        res.json({
            id: game._id,
            query: game.query,
            questions: game.questions,
            endTerm: game.endTerm,
            allowAnswer: game.allowAnswer,
            complete: game.completed
        });
    });
    app.get("/google", async (req, res) => {
        const txt = await request({
            uri: "https://www.google.com/search",
            "qs": {
                q: "irish potato famine"
            },
            headers:{"User-Agent": (new UserAgent()).toString()}
        });
        res.send(txt);
    });

    const port = process.env.PORT || 3000;
    app.listen(port, () => console.log("Server listening on port " + port));
})();
