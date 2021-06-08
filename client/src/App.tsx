import { Box, ChakraProvider } from '@chakra-ui/react';
import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom';
import Landing from './pages/Landing';
import NavBar from './components/NavBar';
import Products from './pages/admin/Products';
import Profile from './pages/Profile';
import { Provider } from 'react-redux';
import store from './redux/store';
import ProtectedRoute from './components/ProtectedRoute';
import Feed from './pages/Feed';
import { PersistGate } from 'redux-persist/integration/react';
import ProductDetail from './pages/ProductDetail';
import ShoppingCart from './pages/ShoppingCart';
import Orders from './pages/Orders';

function App() {
    return (
        <ChakraProvider>
            <Provider store={store.store}>
                <PersistGate persistor={store.persistor} loading={null}>
                    <Router>
                        <Box w="100%" minH="100vh" bgColor="gray.50">
                            <NavBar />
                            <Switch>
                                <ProtectedRoute
                                    role="admin"
                                    path="/products"
                                    component={Products}
                                />
                                <ProtectedRoute
                                    path="/profile"
                                    component={Profile}
                                />
                                <ProtectedRoute
                                    path="/product/:id"
                                    component={ProductDetail}
                                />
                                <ProtectedRoute
                                    path="/cart"
                                    component={ShoppingCart}
                                />
                                <ProtectedRoute
                                    path="/orders"
                                    component={Orders}
                                />
                                <Route path="/login" component={Landing} />
                                <ProtectedRoute exact path="/" component={Feed} />
                            </Switch>
                        </Box>
                    </Router>
                </PersistGate>
            </Provider>
        </ChakraProvider>
    );
}

export default App;
