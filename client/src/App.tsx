import { ChakraProvider } from '@chakra-ui/react';
import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom';
import Landing from './pages/Landing';
import NavBar from './components/NavBar';
import Products from './pages/admin/Products';
import Profile from './pages/Profile';
import { Provider } from 'react-redux';
import store from './redux/store';
import PrivateRoute from './components/ProtectedRoute';
import Feed from './pages/Feed';

function App() {
    return (
        <ChakraProvider>
            <Provider store={store}>
                <Router>
                    <NavBar />
                    <Switch>
                        <Route path="/products" component={Products} />
                        <PrivateRoute exact path="/" component={Feed} />
                        <PrivateRoute path="/profile" component={Profile} />
                        <Route path="/login" component={Landing} />
                    </Switch>
                </Router>
            </Provider>
        </ChakraProvider>
    );
}

export default App;
