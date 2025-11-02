import { useEffect, useState } from "react"

const AppCallback = () => {
    const [token, setToken] = useState("");
    useEffect(() => {
        const fetchToken = async () => {
            const res = await fetch("/api/auth/create-token");
            const data = await res.json();
            setToken(data.token);
        };
        fetchToken();
    })

    useEffect(() => {
        if (token) {
            window.location.href = `computershop://callback?token=${encodeURIComponent(JSON.stringify(token))}`
        }

    }, [token]);

    return (
        <p>Redirecting to app...</p>
    )
}

export default AppCallback