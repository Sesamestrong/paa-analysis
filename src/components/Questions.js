import React, {
    useState,
    useEffect,
} from 'react';
import styled from 'styled-components';

const API_URL = window.location.origin.startsWith('http://localhost')?'https://people-also-asked.herokuapp.com':'http://localhost:4000';

const ClickableLi = styled.li `
    :hover {
        background:#DDDDDD;
        border:2px solid;
    }
    border:1px solid;
    background:#FFFFFF;
`;

function Question({
    question,
    answer,
    idx,
    selectQuestion,
}) {
    return (<ClickableLi onClick={selectQuestion} key={idx}><h2>{question}</h2><p>{answer}</p></ClickableLi>);
}

export default function Questions({
    question,
    endTerm,
    allowAnswer
}) {
    const [questions, setQuestions] = useState([]);
    console.log(questions);
    const [won, setWon] = useState(false);
    const [id, setId] = useState(null);
    const click = idx => fetch(`${API_URL}/click?id=${encodeURIComponent(id)}&idx=${encodeURIComponent(idx)}`).then(res => res.json()).then(({
        questions,
        complete,
    }) => {
        setQuestions(questions);
        setWon(complete);
    });
    useEffect(() => {
        console.log("Running!");
        fetch(`${API_URL}/challenge`, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                query: question,
                endTerm,
                allowAnswer
            })
        }).then(res => res.json().then(({
            id,
            questions,
            complete
        }) => {
            setWon(complete);
            setQuestions(questions);
            setId(id);
        }));
    },[question,endTerm,allowAnswer]);

    return (
        <div>{
            won?
                (<h1>You won!</h1>):
                null
        }
        <ul>{console.log("ques",questions)||
            questions.map(({question,answer},idx) =>
                (<Question selectQuestion={evt=>click(idx)} question={question} answer={answer} idx={idx}/>))
        }</ul>
    </div>);
};
