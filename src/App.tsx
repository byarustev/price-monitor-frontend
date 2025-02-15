import React, { useState, useEffect, useCallback } from 'react';
import CurrencyTable from './components/CurrencyTable';
import PriceChangeHistory from './components/PriceChangeHistory';
import { logger } from './utils/logger';
import { Rate, Rates, WebSocketMessage } from './types';
import './App.css';

const App: React.FC = () => {
    const [rates, setRates] = useState<Rates>({});
    const [priceChanges, setPriceChanges] = useState<Rate[]>([]);
    const [wsStatus, setWsStatus] = useState<string>('Connecting...');
    const [ws, setWs] = useState<WebSocket | null>(null);

    const connectWebSocket = useCallback(() => {
        logger.info('Attempting WebSocket connection');
        const wsUrl = import.meta.env.VITE_WS_URL || 'ws://localhost:3000';
        const wsConnection = new WebSocket(wsUrl);

        wsConnection.onopen = () => {
            logger.info('WebSocket connected successfully');
            setWsStatus('Connected');
        };

        wsConnection.onclose = () => {
            logger.warn('WebSocket connection closed');
            setWsStatus('Disconnected');
            setTimeout(connectWebSocket, 3000);
        };

        wsConnection.onerror = (error) => {
            logger.error('WebSocket error occurred', { error: error.toString() });
            wsConnection.close();
        };

        wsConnection.onmessage = (event) => {
            try {
                const message: WebSocketMessage = JSON.parse(event.data);
                logger.debug('Received WebSocket message', { type: message.type });

                if (message.type === 'rates') {
                    setRates(message.data as Rates);
                } else if (message.type === 'rateChange') {
                    const change = message.data as Rate;
                    setPriceChanges(prev => [change, ...prev].slice(0, 10));
                    setRates(prev => ({
                        ...prev,
                        [change.currency]: change.newRate
                    }));
                }
            } catch (error) {
                logger.error('Error processing message', {
                    error: error instanceof Error ? error.message : 'Unknown error'
                });
            }
        };

        setWs(wsConnection);
        return wsConnection;
    }, []);

    useEffect(() => {
        const wsConnection = connectWebSocket();

        return () => {
            if (wsConnection && wsConnection.readyState === WebSocket.OPEN) {
                wsConnection.close();
            }
        };
    }, [connectWebSocket]);

    return (
        <div className="container">
            <h1>Currency Exchange Monitor</h1>
            <div className="status-badge" data-status={wsStatus.toLowerCase()}>
                {wsStatus}
            </div>
            <PriceChangeHistory changes={priceChanges} />
            <CurrencyTable rates={rates} />
        </div>
    );
};

export default App; 