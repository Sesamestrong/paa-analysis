require("dotenv").config();
const {
    runEntireScraper
} = require("@sesamestrong/json-scraper");
const UserAgent = require("user-agents");
const bcrypt = require("bcrypt");
const NUM_ROUNDS = 12;
const startGame = require("./getPaaInfo.json");
const getNewQuestions = require("./getNewQuestions.json");

const mongoose = require("mongoose");
const dbUrl = process.env.DATABASE.replace(/<password>/, process.env.PASSWORD).replace(/<division>/, process.env.DIVISION);
mongoose.connect(dbUrl, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

const db = mongoose.connection;

const {
    ObjectId
} = mongoose.Schema.Types;

// Start schemas

let users, User, games, Game;

games = new mongoose.Schema({
    query: {
        type: String,
        required: true
    },
    endTerm: {
        type: String,
        required: true
    },
    numClicks: {
        type: Number,
        required: true
    },
    questions: [{
        question: {
            type: String,
            required: true
        },
        answer: {
            type: String,
            required: true
        },
        kt: {
            type: String,
            required: true
        },
    }],
    completed: {
        type: Boolean,
        required: true
    },
    ved: {
        type: String,
        required: false
    },
    id: {
        type: String,
        required: false
    },
    cs: {
        type: String,
        required: true
    },
    ei: {
        type: String,
        required: true
    },
    allowAnswer: {
        type: Boolean,
        required: true
    },
});

games.statics.new = async function(query, endTerm, allowAnswer) {
    console.log("New game! scraper");
    const {
        questions: rawQuestions,
        answers,
        kts,
        id,
        cs,
        ved,
        ei,
        info
    } = (await runEntireScraper(startGame, {
        vars: {
            query,
            agent: (new UserAgent()).toString(),
        }
    })).vars;
    console.log(info);
    const game = await new Game({
        query,
        endTerm,
        numClicks: 0,
        questions: rawQuestions.map((rawQuestion, idx) => ({
            question: rawQuestion,
            answer: answers[idx],
            kt: kts[idx]
        })),
        ei,
        id,
        cs,
        ved,
        completed: false,
        allowAnswer
    });
    if (game.hasWon()) game.completed = true;
    await game.save();
    return game;
};
games.methods.click = async function(idx) {
    if (this.completed) return;
    const question = this.questions[idx];
    console.log("Running scraper!");
    const {
        questions,
        answers,
        kts
    } = (await runEntireScraper(getNewQuestions, {
        vars: {
            id: this.id,
            ei: this.ei,
            ved: this.ved,
            kt: question.kt,
            query: question.question,
            cs: this.cs
        }
    })).vars;
    console.log(questions,answers.map(b=>b.slice(0,30)),kts);
    const newQuestions = questions.map((question, idx) => ({
        question,
        kt: kts[idx],
        answer: answers[idx]
    }));
    this.questions = [...this.questions, ...newQuestions];
    this.numClicks++;
    if (this.hasWon(newQuestions)) this.completed = true;
    await this.save();
};
games.methods.hasWon = function(questions = this.questions) {
    console.log(this.endTerm, this.query);
    const lowKey = this.endTerm.toLowerCase();
    return questions.find(question => question.question.toLowerCase().includes(lowKey) || this.allowAnswer && question.answer && question.answer.toLowerCase().includes(lowKey));
};
Game = mongoose.model("Game", games);
/*
accounts = new mongoose.Schema({
    username: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    name: String,
    email: String,
    gameIds: [{
        type: ObjectId,
        required: true,
        unique: true,
        ref: 'Game'
    }]
});

accounts.statics.new = async function({
    username,
    password,
    name
}) {
    const matches = await Account.findOne({
        username
    });
    if (matches) throw new Error('Account already exists');
    const account = new Account({
        username,
        name,
        password: await bcrypt.hash(password, NUM_ROUNDS)
    });
    await account.save();
    return account;
};

accounts.statics.auth = async function({username,password}){
    const matches=await Account.findOne({username});
    if(!matches) return false;
    if(!await bcrypt.compare(password,matches.password)) return false;
    return true;
};
*/

module.exports = {
    Game
};
