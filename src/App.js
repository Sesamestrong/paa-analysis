import React, {
    useState
} from 'react';
import {
    HashRouter as Router,
    Switch,
    Route
} from 'react-router-dom';
import './App.css';
import Questions from './components/Questions.js';

function App() {
    const [query, setQuery] = useState("Irish potato famine");
    const [endTerm, setEndTerm] = useState("fish");
    const [allowAnswer, setAllowAnswer] = useState(false);
    // TODO For foxxes: Please put the new app in / and the old app in /old
    return (
        <div className="App">
            <Router>
                <Switch>
                    <Route path="/">
      <input value={query} onChange={(evt)=>setQuery(evt.target.value)}/>
      <br/>
      <input value={endTerm} onChange={(evt)=>setEndTerm(evt.target.value)}/>
      <br/>
      <input type="button" value={allowAnswer} onClick={()=>setAllowAnswer(!allowAnswer)}/>
      <Questions question={query} endTerm={endTerm} allowAnswer={allowAnswer}/>
  </Route>
  <Route path="/old">
  </Route>
  </Switch>
  </Router>
    </div>
    );
}

export default App;
