import { useState, useEffect } from 'react';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { User } from '../types/Users';
import { RootState } from '../redux/store';
import { setUser } from '../redux/slices/user';

const useUser = () => {
    const { user } = useSelector((state: RootState) => state.user);
    const [isLoading, setLoading] = useState(true);
    const dispatch = useDispatch();
    
    useEffect(() => {
        axios
            .get('/users')
            .then((res) => {
                dispatch(setUser(res.data as User));
                setLoading(false);
            })
            .catch((err) => {
                setLoading(false);
            });
    }, []);

    return {
        user,
        isLoading,
    };
};

export default useUser;
