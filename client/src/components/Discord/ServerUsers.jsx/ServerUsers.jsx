import React, { useState, useContext, useEffect } from "react";
import axios from "axios";

export const ServerUsers = () => {
    const [loading, setLoading] = useState(false);
    const [users, setUsers] = useState([]);
    console.log('server users', users);
    
    useEffect(() => {
        const fetchUsers = async () => {
            setLoading(true);
            try {
                const response = await axios.get(`${process.env.REACT_APP_BASE_URL}api/discord-users`);
                setUsers(response.data); // Assuming the response data is the array of users
            } catch (error) {
                console.error('Error fetching users:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchUsers();
    }, []);



    return (
        <div className="server-users">
            <div>
                <h3>Server Users:</h3>
                <ul>
                {users.map((user, index) => (
                    <li key={index}>{user.username}#{user.discriminator}</li>
                ))}
                </ul>
            </div>
        </div>
    );
};
