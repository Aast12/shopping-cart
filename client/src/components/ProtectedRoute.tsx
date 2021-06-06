import { Spinner } from '@chakra-ui/react';
import { Route, Redirect } from 'react-router-dom';
import useUser from '../hooks/useUser';

export default function PrivateRoute(props) {
    const { user, isLoading } = useUser();
    const { component: Component, ...rest } = props;

    if (isLoading) return <Spinner />;

    if (user)
        return <Route {...rest} render={(props) => <Component {...props} />} />;

    return <Redirect to="/login" />;
}
