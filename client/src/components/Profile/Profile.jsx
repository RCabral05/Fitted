import React, { useContext } from 'react';
import { AuthContext } from "../../context/AuthContext";
import './styles.css';

export const Profile = () => {
    const { user, logout } = useContext(AuthContext);
    console.log('user', user);

    const handleLogout = () => {
        logout();  // This will clear the user from the context and localStorage
    };

    const getImageUrl = (userId, hash, type) => {
        if (!userId || !hash) return null;

        // Determine if the image is animated (GIF) or static (PNG)
        const extension = hash.startsWith('a_') ? 'gif' : 'png';
        const baseUrl = `https://cdn.discordapp.com`;

        switch (type) {
            case 'avatar':
                return `${baseUrl}/avatars/${userId}/${hash}.${extension}`;
            case 'banner':
                // Banners are generally in PNG format, but we'll keep the logic flexible
                return `${baseUrl}/banners/${userId}/${hash}.${extension}?size=1024`;  // Adjust size as needed
            default:
                return null;
        }
    };

    // Function to convert decimal color to hexadecimal
    const getRoleColor = (color) => {
        return `#${color.toString(16).padStart(6, '0')}`;
    };

    return (
        <div className="profile">
            {user && (
                <div>
                    {user.banner && (
                        <img className="user-banner" src={getImageUrl(user.id, user.banner, 'banner')} alt={`${user.username}'s banner`} />
                    )}
                    <div className="profile-content">
                        <img className="user-avatar" src={getImageUrl(user.id, user.avatar, 'avatar')} alt={`${user.username}'s avatar`} />
                        <div className="profile-status">
                            <div className="user-roles">
                                {user.roles
                                  .filter(role => role.name !== '@everyone')  // Filtering out the '@everyone' role
                                  .map((role) => (
                                      <span key={role.id} style={{ color: getRoleColor(role.color), backgroundColor:'black', borderRadius:'20px', padding:'8px', paddingRight:'8px', paddingLeft:'8px',marginRight:'10px', fontSize:'15px' }}>
                                          {role.name}
                                      </span>
                                ))}
                            </div>

                        </div>
                        
                    </div>
                    <h1>| {user.username}</h1>

                    <button onClick={handleLogout}>Logout</button>
                </div>
            )}
        </div>
    );
};
