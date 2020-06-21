import { useState } from "react";

export const useForeUpdate = () => {
    const [, causeUpdate] = useState(undefined);

    return () => {
        causeUpdate({});
    }
}