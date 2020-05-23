const API_URL = "https://people-also-asked.herokuapp.com";

export const createChallenge = async ({ query, endTerm, allowAnswer }) => {
	// challenges[++id] = { query, endTerm, allowAnswer, id };
	// return {
	// 	query,
	// 	endTerm,
	// 	allowAnswer,
	// 	id,
	// 	completed: false,
	// 	questions: [
	// 		{ question: "This is question 1", answer: "This is answer 1" },
	// 		{ question: "This is question 2", answer: "This is answer 2" },
	// 		{ question: "This is question 3", answer: "This is answer 3" },
	// 	],
	// };
	return (
		await fetch(`${API_URL}/challenge`, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({
				query,
				endTerm,
				allowAnswer,
			}),
		})
	).json();
};

export const getChallenge = async (id) => {
	// return {
	// 	...challenges[id],
	// 	completed: Math.random() > 0.5,
	// 	questions: [
	// 		{ question: "This is question 1", answer: "This is answer 1" },
	// 		{ question: "This is question 2", answer: "This is answer 2" },
	// 		{ question: "This is question 3", answer: "This is answer 3" },
	// 	],
	// };
	return (
		await fetch(`${API_URL}/challenge?id=${encodeURIComponent(id)}`)
	).json();
};

export const selectOption = async (id, idx) => {
	return (
		await fetch(
			`${API_URL}/click?id=${encodeURIComponent(
				id
			)}&idx=${encodeURIComponent(idx)}`
		)
	).json();
	// return {
	// 	...challenges[id],
	// 	completed: Math.random() > 0.5,
	// 	questions: [
	// 		{ question: "This is question 1", answer: "This is answer 1" },
	// 		{ question: "This is question 2", answer: "This is answer 2" },
	// 		{ question: "This is question 3", answer: "This is answer 3" },
	// 	],
	// };
};

export const getChallenges = async () =>
	(await fetch(`${API_URL}/challenges`)).json();
// Object.values(challenges)
// 	.map(({ questions, ...c }) => c)
// 	.concat(
// 		Array(15)
// 			.fill()
// 			.map((_, i) => ({
// 				query: "Fake: Query " + i,
// 				endTerm: "End term " + i,
// 				allowAnswer: Math.random() > 0.5,
// 				id: "asdf",
// 				completed: Math.random() > 0.5,
// 			}))
// 	);
