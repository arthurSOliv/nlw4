import { createContext, ReactNode, useState, useContext, useEffect } from "react";
import { ChallengesContext } from "./ChallengesContext";

interface CountdownContextData {
    isActive: boolean;
    hasFinished: boolean;
    minutes: number;
    seconds: number;
    startContdown: () => void;
    resetContdown: () => void;
}

interface CountdownProviderProps {
    children: ReactNode;
}

export const CountdownContext = createContext({} as CountdownContextData);

let contdownTimeout: NodeJS.Timeout;

export function CountdownProvider({ children }: CountdownProviderProps) {
    const { startNewChallenge } = useContext(ChallengesContext);

    const [time, setTime] = useState(0.1 * 60);
    const [isActive, setIsActive] = useState(false);
    const [hasFinished, setHasFinished] = useState(false);

    const minutes = Math.floor(time / 60);

    const seconds = time % 60;

    function startContdown() {
        setIsActive(true);
    }

    function resetContdown() {
        clearTimeout(contdownTimeout);
        setHasFinished(false);
        setIsActive(false);
        setTime(0.1 * 60);
    }

    useEffect(() => {
        if (isActive && time > 0) {
            contdownTimeout = setTimeout(() => {
                setTime(time - 1);
            }, 1000);
        } else if (isActive && time === 0) {
            console.log('Contdown finalizado');
            setHasFinished(true);
            setIsActive(false);
            startNewChallenge();
        }
    }, [isActive, time]);

    return (
        <CountdownContext.Provider
            value={{
                isActive,
                hasFinished,
                minutes,
                seconds,
                startContdown,
                resetContdown,
            }}
        >
            {children}
        </CountdownContext.Provider>
    )
}