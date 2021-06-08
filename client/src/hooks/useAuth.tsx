import { useState, useContext } from 'react';
import { useHistory } from 'react-router-dom';
import axios from 'axios';

import { useDispatch } from 'react-redux';
import { setUser } from '../redux/slices/user';
import { User } from '../types/Users';
import { empty } from '../redux/slices/cart';

type SignUpData = Omit<User, 'profilePicture' | '_id' | 'orders'> & {
    password: string;
    passwordConfirmation: string;
};

const useAuth = () => {
    let history = useHistory();
    const dispatch = useDispatch();

    const [error, setError] = useState<any>(null);

    //set user in context and push them home
    const setUserContext = async () => {
        return await axios
            .get('/users')
            .then((res) => {
                dispatch(setUser(res.data as User));
                history.push('/');
            })
            .catch((err) => {
                setError(err.response.data);
            });
    };

    //register user
    const registerUser = async (data: SignUpData) => {
        return axios.post(`users/create`, data).catch((err) => {
            setError(err.response.data);
        });
    };

    //login user
    const loginUser = async (authData: { email: string; password: string }) => {
        return axios
            .post('/login', authData)
            .then(async (res) => {
                await setUserContext();
            })
            .catch((err) => {
                setError(err.response.data);
            });
    };

    const logOut = () => {
        axios.get('/logout').finally(() => {
            history.push('/');
            dispatch(setUser(null));
            dispatch(empty({}));
        });
    };

    return {
        registerUser,
        loginUser,
        logOut,
        error,
    };
};

export default useAuth;
