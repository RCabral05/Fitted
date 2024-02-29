import React, { useState, useEffect } from "react";

export const ConnectDiscord = () => {

    const handleLogin = () => {
        const clientId = process.env.REACT_APP_DISCORD_CLIENT_ID;
        const redirectUri = encodeURIComponent(`${process.env.REACT_APP_BASE_URL}api/discord/callback`);
        const discordUrl = `https://discord.com/api/oauth2/authorize?client_id=${clientId}&redirect_uri=${redirectUri}&response_type=code&scope=identify%20guilds`;

        window.location.href = discordUrl;
    };


    return (
        <div className="discord-connect">
            <div>
                <button onClick={handleLogin}>Login with Discord</button>
            </div>
        </div>
    );
};
