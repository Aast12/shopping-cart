import { Spinner } from '@chakra-ui/react';
import { Route, Redirect } from 'react-router-dom';
import useUser from '../hooks/useUser';

// export default function MultipleRoute({
//     component,
//     // adminComponent,
//     ...props
// }) {
//     const { user, isLoading } = useUser();
//     const {
//         component: Component,
//         // adminComponent: AdminComponent,
//         ...rest
//     } = props;

//     if (isLoading) return <Spinner />;

//     console.log(user);

//     if (user) {
//         // if (user.role === 'admin')
//         //     return (
//         //         <Route
//         //             {...rest}
//         //             render={(props) => <AdminComponent {...props} />}
//         //         />
//         //     );
//         // else
//         return <Route {...rest} render={(props) => <Component {...props} />} />;
//     }

//     return <Redirect to="/login" />;
// }

export default function MultipleRoute({ role = 'user', ...props }) {
    const { user, isLoading } = useUser();
    const {
        userComponent: UserComponent,
        adminComponent: AdminComponent,
        ...rest
    } = props;

    if (isLoading) return <Spinner />;

    if (user) {
        if (user.role === 'admin')
            return (
                <Route
                    {...rest}
                    render={(props) => <AdminComponent {...props} />}
                />
            );
        else
            return (
                <Route
                    {...rest}
                    render={(props) => <UserComponent {...props} />}
                />
            );
    }

    return <Redirect to="/login" />;
}
