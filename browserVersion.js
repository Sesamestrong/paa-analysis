class PaaGame {
    static regexes = {
        questions: /data-kt="([^"]+)" [^>]+>([^<]+)/g,
        cs: /data-cs="([^"]+)"/,
        id: /data-cs="[^"]+" data-mqac="[^"]+" id="([^"]+)"/,
        vet: /data-ved="([^"]+)"/,
        ei: /<input value="([^"]+)" name="ei"/,
        redirectLink: /Please click <a href="([^"]+)"/,
    };
    query = ""
    questions = []
    numClicks = 0
    endTerm = ""
    allowAnswer = false
    cs = ""
    won = false
    vet = ""
    ei = ""
    id = ""
    constructor(query, endTerm, allowAnswer = false) {
        this.query = query;
        this.allowAnswer = allowAnswer;
        this.endTerm = endTerm;
    }
    async start() {
        const startupText = (await (await fetch("https://www.google.com/search?q=" + encodeURIComponent(this.query))).text());
        const extraLink = PaaGame.getRedirectLink(startupText); //TODO get answers for original few questions
        this.cs = PaaGame.getCs(startupText);
        this.vet = PaaGame.getVet(startupText);
        this.questions = PaaGame.getQuestions(startupText);
        this.id = PaaGame.getId(startupText);
        this.dispQuestions();
    }
    async click(idx) {
        const question = this.questions[idx];
        this.numClicks++;
        const newQuestions = PaaGame.getQuestions(await (await fetch("https://www.google.com/search?vet=1" + encodeURIComponent(this.vet) + "..i&asearch=rq&safe=strict&ei=" + this.ei + "&yq=3&q=" + encodeURIComponent(question.question) + "?&async=state:" + encodeURIComponent(this.cs) + "." + question.kt + ",_id:" + encodeURIComponent(this.id) + ",_pms:s,_fmt:pc", {
            credentials: "omit",
            headers: {
                "referrer": "https://www.google.com/"
            }
        })).text()).filter(({
            kt
        }) => !this.questions.find(question => question.kt == kt));
        this.questions = [...this.questions, ...newQuestions];
        this.dispQuestions();
        if (newQuestions.find(({
                question,
                answer
            }) => question.includes(this.endTerm) || (this.allowAnswer && answer ? .includes ? .(this.endTerm)))) {
            this.won = true;
            console.log("You won!");
        }
    }
    dispQuestions() {
        console.log("Questions:\n\n" + this.questions.map(({
            question
        }, idx) => `${idx}. ${question}`).join("\n"));
    }
    static getQuestions(str) {
        return [...str.matchAll(PaaGame.regexes.questions)].map(([_, kt, question, answer]) => ({
            kt,
            question, //answer:PaaGame.getText(answer),
        }));
    }
    static getText(html) {
        const container = document.createElement("div");
        container.innerHTMl = html;
        return container.innerText;
    }
    static decodeSpecialChars(str) {
        const container = document.createElement("textarea");
        container.innerHTML = str;
        return container.value;
    }
    static getCs(str) {
        return str.match(PaaGame.regexes.cs) ? .[1];
    }
    static getVet(str) {
        return str.match(PaaGame.regexes.vet) ? .[1];
    }
    static getEi(str) {
        return str.match(PaaGame.regexes.ei) ? .[1];
    }
    static getId(str) {
        return str.match(PaaGame.regexes.id) ? .[1];
    }
    static getRedirectLink(str) {
        return str.match(PaaGame.regexes.redirectLink) ? .[1];
    }
}
// myGame=new PaaGame("irish potato blight","ketchup");
// // await myGame.start();
// //await myGame.click(3)
