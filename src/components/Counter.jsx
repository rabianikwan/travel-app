'use client';

import { useEffect, useState } from 'react';

export default function Counter() {
    const [counter, setCounter] = useState(60);

    useEffect(() => {
        const timer = counter > 0 && setInterval(() => setCounter(counter - 1), 1000);
        return () => clearInterval(timer);
    }, [counter]);

    return <>{counter}</>;
}
