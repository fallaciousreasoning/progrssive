import { useState } from "react";

export const useForeUpdate = () => {
    const [_, causeUpdate] = useState(undefined);

    return () => {
        causeUpdate({});
    }
}