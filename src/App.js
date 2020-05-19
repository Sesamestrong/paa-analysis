import React from 'react';
import './App.css';
import Questions from './components/Questions.js';

function App() {
  return (
    <div className="App">
      <Questions question="Irish potato famine" endTerm="fish" allowAnswer={false}/>
    </div>
  );
}

export default App;
