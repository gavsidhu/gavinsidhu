import { type Dispatch, createContext, useContext, useEffect, useState } from 'react';
import { Activity } from '~/global';

type ActivityContextType = {
    data: Activity[];
    setData: Dispatch<React.SetStateAction<Activity[]>>;
};

const ActivityContext = createContext<ActivityContextType | undefined>(undefined);

export const ActivityProvider = ({ children }: { children: React.ReactNode }) => {
    const [data, setData] = useState<Activity[]>([]);

    useEffect(() => {
        let eventSource: EventSource | null = null;

        const connect = () => {
            eventSource = new EventSource('/events');

            eventSource.onmessage = async (e) => {
                try {
                    const data = e.data;
                    if (data === "refresh") {
                        const response = await fetch('/activity', {
                            method: "GET",
                        });
                        const newData = await response.json();
                        setData(newData);
                    }
                } catch (err) {
                    if (eventSource) {
                        eventSource.close();
                    }
                    return
                }
            };

            eventSource.onerror = () => {
                if (eventSource) {
                    eventSource.close();
                }
                setTimeout(connect, 10000);
            };
        };

        connect();

        return () => {
            if (eventSource) {
                eventSource.close();
            }
        };
    }, []);

    return (
        <ActivityContext.Provider value={{ data, setData }}>
            {children}
        </ActivityContext.Provider>
    );
};

export const useActivity = () => {
    const context = useContext(ActivityContext);
    if (!context) {
        throw new Error('useActivity must be used within an ActivityProvider');
    }
    return context;
};

