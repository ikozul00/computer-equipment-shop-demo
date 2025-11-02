import { useEffect } from "react"

const AppCallback = () => {
    useEffect(() => {
        window.location.href = "computershop://callback"
    }, []);

    return (
        <p>Redirecting to app...</p>
    )
}

export default AppCallback