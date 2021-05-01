import { BrowserRouter, Switch, Route } from "react-router-dom";
import Board from "./components/Board";
import HomePage from "./components/Home";

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Switch>
          <Route path="/" exact component={HomePage} />
        </Switch>
        <Switch>
          <Route path="/game" component={Board} />
        </Switch>
      </BrowserRouter>
    </div>
  );
}

export default App;
