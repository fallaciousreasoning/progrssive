import { useEffect, useState } from "react"

export const useIsFrontend = () => {
    const [frontend, setFrontend] = useState(false);
    useEffect(() => {
        process.nextTick(() => {
            setFrontend(typeof window !== 'undefined');
        })
    }, [])
    return frontend;
}