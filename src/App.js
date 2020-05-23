import React, { useState, useEffect } from "react";
import styled, { keyframes } from "styled-components";
import {
	createChallenge,
	getChallenge,
	selectOption,
	getChallenges,
} from "./data.js";

const enter = keyframes`
	from {
		transform: translateX(50%);
		opacity: 0;
	}


	to {
		transform: translateX(0%);
		opacity: 1;
	}
`;
const fadeIn = keyframes`
	from {
		opacity: 0;
	}


	to {
		opacity: 1;
	}
`;

const Container = styled.div`
	color: #fff;
	background-color: #589ad6;
	background-color: #3065fb;
	background: linear-gradient(to right, #00b4db, #0083b0);
	background: linear-gradient(to right, #00d2ff, #3a7bd5);
	background: linear-gradient(to left, #1488cc, #2b32b2);
	background: linear-gradient(to left, #3065fb, #2b32b2);

	font-family: "Lato", sans-serif;

	width: 100%;
	height: 100%;
	max-height: 100vh;
	/* background-color: #eee; */

	box-sizing: border-box;

	display: grid;
	grid-template-areas:
		"title . content"
		"description . content"
		"clicks . content";
	grid-template-rows: min-content minmax(0, 1fr) min-content;
	grid-template-columns: 45% 5% 50%;

	padding: 8em;

	.title {
		margin: 0em 3rem 1rem 0rem;

		font-size: 5em;
		grid-area: title;
		font-weight: 300;
	}
	.description {
		margin: 2rem 0rem;

		grid-area: description;

		line-height: 1.6em;
		font-size: 1.25em;
		color: rgba(163, 165, 204, 0.63);
	}
	.clicks {
		margin: 0rem;
		margin-bottom: 1rem;
		font-size: 3em;
		grid-area: clicks;
		font-weight: 300;
	}
`;

const Contents = styled.div`
	grid-area: content;

	&::-webkit-scrollbar {
		display: none;
	}

	&.minimized {
		position: absolute;
		padding: 8em;
		width: 50%;
		right: 0px;
		top: 0px;
		bottom: 0px;
		grid-area: unset;
		padding-left: 0px;
		box-sizing: border-box;
		overflow-y: auto;

		.contents-container {
			max-height: 4em !important;
			overflow-y: unset !important;
		}
	}

	.contents-container {
		height: 100%;

		background-color: #eee;
		color: #000;

		transition: max-height 0.35s ease-in-out;

		max-height: 100%;

		border-radius: 3em;
		margin: 0em 2em;
		/* margin-left: 5em; */

		overflow-y: hidden;

		display: flex;
		flex-direction: column;
		box-shadow: 0 2px 8px 2px rgba(0, 0, 0, 0.05);
	}

	.panes {
		flex-grow: 1;

		overflow: hidden;

		.pane-container {
			height: 100%;
			width: 200%;
			transition: transform 0.25s ease-in-out;
			transform: translateX(${(p) => -50 * p.transform}%);
			display: flex;
		}

		.pane {
			height: 100%;
			padding: 0em 2em;
			width: 50%;
			overflow: auto;
			&::-webkit-scrollbar {
				display: none;
			}
		}
		.pane-title {
			text-align: center;
			font-size: 3em;
			margin: 1 em;
		}
		.pane-text {
			font-size: 1.15em;
			line-height: 1.4;
			width: 85%;
			margin: auto;
			text-align: center;
			color: #666;
		}

		.break {
			color: #aaa;
			width: 50%;
			text-align: center;
			border-bottom: 1px solid #aaa;
			line-height: 0.1em;
			margin: 1em auto 1.5em auto;
		}

		.break span {
			background-color: #eee;
			padding: 0 10px;
		}

		.inp {
			background-color: #fff;
			padding: 0.5em 1em;
			font-size: 1.5em;
			border-radius: 500em;
			width: 60%;
			display: block;
			margin: auto;
			max-width: unset;
			border: none;
			box-shadow: 0 2px 8px 2px rgba(0, 0, 0, 0.05);
			outline: none;
		}

		.button {
			display: block;
			padding: 0.5em 1.5em;
			font-size: 1.25em;
			border-radius: 500em;
			background-color: #3065fb;
			color: #fff;
			box-shadow: 0 2px 8px 2px rgba(0, 0, 0, 0.05);
			border: none;
			margin: auto;
			cursor: pointer;
			outline: none;

			i {
				margin-left: 0.25em;
			}
		}
	}
	.tabs {
		min-height: 6em;

		display: flex;
		align-items: center;
		position: relative;

		z-index: 1;

		box-shadow: 0 -3px 8px 2px rgba(0, 0, 0, 0.08);

		&:before {
			content: "";
			font-size: 1.5em;
			height: 55%;
			width: 40%;
			border-radius: 100em;
			background-color: #3065fb;
			position: absolute;
			left: ${(p) => 25 + p.transform * 50}%;
			top: 50%;
			bottom: 0px;
			transition: left 0.25s ease-in-out;
			transform: translate(-50%, -50%);
			z-index: -1;

			box-shadow: 0 2px 8px 2px rgba(0, 0, 0, 0.1),
				0 2px 4px 0 rgba(0, 0, 0, 0.12);
		}

		.tab {
			font-size: 1.5em;
			width: 50%;
			padding: 1rem 3rem;
			border-radius: 100em;

			outline: none;
			cursor: pointer;

			background-color: rgba(0, 0, 0, 0);
			border: none;

			transition: color 0.25s ease-in-out,
				background-color 0.25s ease-in-out;
		}

		.tab:hover {
			color: #3065fb;
		}
		.tab.active {
			color: #fff;
		}
	}

	.accordion {
		font-size: 1.75rem;
		margin: 0.5em 1em;
	}

	.new {
		animation: ${enter} 2s linear;
	}
`;

const ListedContainer = styled.div`
	display: flex;
	align-items: center;

	background-color: #fff;
	border-radius: 100em;
	font-size: 1.5em;

	position: relative;

	margin: 1em 0em;

	box-shadow: 0 2px 8px 2px rgba(0, 0, 0, 0.05);

	color: #000;
	padding: 0.1em;

	cursor: pointer;

	.from,
	.to {
		width: 50%;
		text-align: center;
		padding: 0.75em;
	}

	.from {
	}
	.to {
	}

	.container {
		color: #fff;
		background-color: #3065fb;
		border-radius: 100em;
		box-shadow: 0 4px 8px 2px rgba(0, 0, 0, 0.1),
			0 4px 4px 0 rgba(0, 0, 0, 0.12);
		display: flex;
		justify-content: center;
		align-items: center;
		overflow: hidden;
		padding: 0.5em 0.8em;
	}
	i {
		height: 100%;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.go-text {
		order: -1;

		display: flex;
		align-items: center;
		justify-content: center;
		white-space: nowrap; /*Keep text always one line*/
		overflow: hidden;
		width: 0;
		transition: width 0.25s ease-in-out;

		transform: translateX(-0.25em);
	}
	&:hover {
		.go-text {
			width: 100px;
		}
	}
`;
const Listed = ({ query, endTerm, id, completed, setGameId, done }) => {
	return (
		<ListedContainer onClick={done ? () => {} : () => setGameId(id)}>
			<div className="from">{query}</div>
			<div className="container">
				{done === true ? null : <div className="go-text">Play</div>}{" "}
				<i className="fa fa-arrow-right"></i>
			</div>
			<div className="to">{endTerm}</div>
		</ListedContainer>
	);
};

const NewItemContainer = styled.div`
	animation: ${enter} 0.5s ease-out ${(p) => p.delay * 0.25 + 0.25}s 1 normal
		backwards;

	border-radius: 3em;

	/* height: 4em; */

	background-color: #eee;
	color: #000;

	margin: 2em;

	display: flex;
	align-items: center;
	/* flex-direction: column; */
	box-shadow: 0 2px 8px 2px rgba(0, 0, 0, 0.05);

	transition: transform 0.25s ease-in-out, opacity 0.25s ease-in-out;

	opacity: ${(p) => (p.enabled ? 1 : 0.6)};

	cursor: pointer;

	.accordion {
		font-size: 1.75rem;
		margin: 0.5em 1em;
		flex-grow: 1;
	}

	.icon {
		padding: 0.25rem 1.25rem;

		transition: transform 0.25s ease-in-out, opacity 0.25s ease-in-out;

		opacity: ${(p) => (p.enabled ? 1 : 0)};
	}

	&:hover {
		transform: scale(1.05);
	}
`;

const NewItem = ({ children, delay, enabled, onClick }) => {
	console.log(enabled);
	return (
		<NewItemContainer
			enabled={enabled}
			onClick={enabled ? onClick : null}
			delay={delay}>
			<h3 className="accordion">{children}</h3>
			<h3 className="icon">
				<i className="fa fa-plus"></i>
			</h3>
		</NewItemContainer>
	);
};

const ModalContainer = styled.div`
	position: fixed;
	left: 0px;
	right: 0px;
	top: 0px;
	bottom: 0px;

	background-color: rgba(0, 0, 0, 0.5);

	animation: ${fadeIn} 0.5s ease-out 0s 1 normal both;

	display: flex;
	justify-content: center;
	align-items: center;

	z-index: 99999;
	color: #000;

	text-align: center;

	font-size: 1.25em;

	.modal-content {
		background-color: #fff;

		padding: 2rem;
		border-radius: 2rem;
	}

	.actions {
		display: flex;
		justify-content: flex-end;
	}

	.button {
		display: block;
		padding: 0.5em 1em;
		font-size: 1em;
		border-radius: 500em;
		background-color: #3065fb;
		color: #fff;
		box-shadow: 0 2px 8px 2px rgba(0, 0, 0, 0.05);
		border: none;
		cursor: pointer;
		outline: none;

		i {
			margin-right: 0.5em;
		}
	}
`;
const Modal = ({ from, to, clicks }) => (
	<ModalContainer>
		<div className="modal-content">
			<h2 className="title">You won!!1</h2>
			You got
			<Listed query={from} endTerm={to} done={true}></Listed>
			in {clicks} {clicks === 1 ? "click" : "clicks"}.
			<div className="actions">
				<button
					onClick={() => window.location.reload(false)}
					className="button">
					<i className="fa fa-check"></i> Done
				</button>
			</div>
		</div>
	</ModalContainer>
);

export default () => {
	const [clicks, setClicks] = useState(0);
	const [from, setFrom] = useState("");
	const [to, setTo] = useState("");
	const [gameId, setGameId] = useState(null);

	const [questions, setQuestions] = useState([]);
	const [enabled, setEnabled] = useState([]);

	const [tab, setTab] = useState("create");

	const [listed, setListed] = useState(null);

	const [completed, setCompleted] = useState(false);

	const playing = gameId !== null;

	console.log(questions, enabled);

	useEffect(() => {
		getChallenges().then(setListed);
	}, []);

	useEffect(() => {
		(async () => {
			if (playing) {
				const {
					questions: qs,
					query,
					endTerm,
				} = await getChallenge(gameId);
				//console.log(qs, query, endTerm, questions, enabled);
				setFrom(query);
				setTo(endTerm);
				setEnabled(qs.map(() => true));
				setQuestions(
					qs.map((v, delay) => ({
						...v,
						delay,
					}))
				);
			}
		})();
	}, [gameId,playing]);

	return (
		<Container>
			<h1 className="title">People also asked</h1>
			<p className="description">
                            People also asked&trade; is like if Google met the the Wikipedia Game. Instead of navigating wiki pages, you find your way through related google searches. When you search something or click on a question, you are provided 2-4 new questions related to it. Your job is to reach a question containing the target word. Remember to count your clicks!
			</p>
			<h1 className="clicks">
				{clicks} {clicks === 1 ? "Click" : "Clicks"}
			</h1>
			<Contents
				className={playing ? "minimized" : ""}
				transform={tab === "create" ? 0 : 1}>
				{playing ? (
					<>
						<div className="contents-container">
							<h3 className="accordion">{from}</h3>
						</div>
						{questions.map((v, i) => (
							<NewItem
								enabled={enabled[i]}
								onClick={async () => {
									const {
										questions: qs,
										completed,
									} = await selectOption(gameId, i);
									console.log(qs, questions, enabled);

									setEnabled([
										...enabled.map((v, i2) =>
											i === i2 ? false : v
										),
										...qs.map(() => true),
									]);
									setQuestions([
										...questions,
										...qs.map((v, delay) => ({
											...v,
											delay,
										})),
									]);
									setClicks(clicks + 1);
									setCompleted(completed);
								}}
								key={i}
								delay={v.delay}>
								{v.question}
							</NewItem>
						))}
					</>
				) : (
					<div className="contents-container">
						<div className="panes">
							<div className="pane-container">
								<div className="pane">
									<h2 className="pane-title">Create</h2>
									<input
										onChange={(e) =>
											setFrom(e.target.value)
										}
										placeholder="Initial query"
										type="text"
										className="inp"
									/>
									<h2 className="break">
										<span>TO</span>
									</h2>
									<input
										onChange={(e) => setTo(e.target.value)}
										placeholder="Destination"
										type="text"
										className="inp"
									/>
									<br />
									<br />
									<button
										onClick={async () => {
											setGameId(
												(
													await createChallenge({
														query: from,
														endTerm: to,
														allowAnswer: true,
													})
												).id
											);
										}}
										className="button">
										Done{" "}
										<i className="fa fa-arrow-right"></i>
									</button>
								</div>
								<div className="pane">
									<h2 className="pane-title">Listed</h2>
									<div className="listed">
										{listed === null
											? "Loading..."
											: listed.map((l) => (
													<Listed
														{...l}
														setGameId={
															setGameId
														}></Listed>
											  ))}
									</div>
								</div>
							</div>
						</div>
						<div className="tabs">
							<button
								onClick={() => setTab("create")}
								className={
									"tab " + (tab === "create" ? "active" : "")
								}>
								Create
							</button>
							<button
								onClick={() => setTab("listed")}
								className={
									"tab " + (tab === "listed" ? "active" : "")
								}>
								Listed
							</button>
						</div>
					</div>
				)}
			</Contents>
			{completed ? (
				<Modal from={from} to={to} clicks={clicks}></Modal>
			) : null}
		</Container>
	);
};
