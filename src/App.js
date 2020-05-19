import React, {
    useState,
    useEffect
} from 'react';
import './App.css';
import Questions from './components/Questions.js';

function App() {
    const [query, setQuery] = useState("Irish potato famine");
    const [endTerm, setEndTerm] = useState("fish");
    const [allowAnswer, setAllowAnswer] = useState(false);
    useEffect(()=>{console.log(query,endTerm,allowAnswer);});
    return (
        <div className="App">
      <input value={query} onChange={(evt)=>setQuery(evt.target.value)}/>
      <br/>
      <input value={endTerm} onChange={(evt)=>setEndTerm(evt.target.value)}/>
      <br/>
      <input type="button" value={allowAnswer} onClick={()=>setAllowAnswer(!allowAnswer)}/>
      <Questions question={query} endTerm={endTerm} allowAnswer={allowAnswer}/>
    </div>
    );
}

export default App;
