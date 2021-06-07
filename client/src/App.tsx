import { Box, ChakraProvider } from '@chakra-ui/react';
import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom';
import Landing from './pages/Landing';
import NavBar from './components/NavBar';
import Products from './pages/admin/Products';
import Profile from './pages/Profile';
import { Provider } from 'react-redux';
import store from './redux/store';
import PrivateRoute from './components/ProtectedRoute';
import Feed from './pages/Feed';
import { PersistGate } from 'redux-persist/integration/react';
import ProductDetail from './pages/ProductDetail';
import ShoppingCart from './pages/ShoppingCart';

function App() {
    return (
        <ChakraProvider>
            <Provider store={store.store}>
                <PersistGate persistor={store.persistor} loading={null}>
                    <Router>
                        <Box w="100%" minH="100vh" bgColor="gray.50">
                            <NavBar />
                            <Switch>
                                <Route path="/products" component={Products} />
                                <PrivateRoute exact path="/" component={Feed} />
                                <PrivateRoute
                                    path="/profile"
                                    component={Profile}
                                />
                                <PrivateRoute
                                    path="/product/:id"
                                    component={ProductDetail}
                                />
                                <PrivateRoute
                                    path="/cart"
                                    component={ShoppingCart}
                                />
                                <Route path="/login" component={Landing} />
                            </Switch>
                        </Box>
                    </Router>
                </PersistGate>
            </Provider>
        </ChakraProvider>
    );
}

export default App;
