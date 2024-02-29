import React, { useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../../context/AuthContext'; // Adjust the import path as necessary

export const Success = () => {
    const navigate = useNavigate();
    const { setUser, setAuthenticated } = useContext(AuthContext);

    useEffect(() => {
        const fetchData = async () => {
            const dataString = new URLSearchParams(window.location.search).get('data');
            if (!dataString) {
                console.error('User data not found!');
                navigate('/error');
                return;
            }

            try {
                const userData = JSON.parse(decodeURIComponent(dataString));
                localStorage.setItem('user', JSON.stringify(userData));
                localStorage.setItem('auth_token', userData.token); // Assuming token is part of userData
                setUser(userData);
                setAuthenticated(true);
                navigate('/'); // Or navigate to a dashboard or profile page
            } catch (error) {
                console.error('Error parsing user data:', error);
                navigate('/error');
            }
        };

        fetchData();
    }, [navigate, setUser, setAuthenticated]);

    return <div>Logging you in and fetching your data...</div>;
};
