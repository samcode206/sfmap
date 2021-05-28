import { BrowserRouter , Switch, Route} from 'react-router-dom';
import SignIn from './signIn';
import Admin from './Admin'; 


function App() {
  return (
    <div>
        <BrowserRouter>
        <Switch>

          <Route exact path="/">
            <SignIn />
          </Route>

          <Route path="/admin">
        
            <Admin />
          </Route>

        </Switch>


      </BrowserRouter>

    </div>
  );
}

export default App;
