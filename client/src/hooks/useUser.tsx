import { useState, useEffect, useMemo } from 'react';
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

    const pictureSrc = useMemo(() => {
        if (!user?.profilePicture) return '';
        if (typeof user?.profilePicture === 'string') {
            return user?.profilePicture;
        } else if (user?.profilePicture?.data) {
            return `data:${user.profilePicture.contentType};base64,${user.profilePicture.data}`;
        }

        return '';
    }, [user]);

    return {
        user,
        pictureSrc,
        isLoading,
    };
};

export default useUser;
