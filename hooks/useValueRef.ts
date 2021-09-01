import { useEffect, useRef } from "react";

export default <T>(value: T) => {
    const ref = useRef(value);
    useEffect(() => { ref.current = value });
    return ref;
}