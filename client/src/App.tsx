import React from 'react';
import {
    // Box,
    // Button,
    // Center,
    ChakraProvider,
    // Flex,
    // Heading,
    // Input,
    // Link,
    // Text,
    // VStack,
} from '@chakra-ui/react';
import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom';
import Landing from './pages/Landing';
import NavBar from './components/NavBar';
import Products from './pages/admin/Products';

function App() {
    return (
        <ChakraProvider>
            <Router>
                <NavBar />
                <Switch>
                    <Route path='/products' component={Products} />
                    <Route path="/" component={Landing} />
                </Switch>
            </Router>
        </ChakraProvider>
    );
}

export default App;
