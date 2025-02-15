import React, { useState, useEffect, useCallback } from 'react'
import CurrencyTable from './components/CurrencyTable'
import PriceChangeHistory from './components/PriceChangeHistory'
import './App.css'
import { logger } from './utils/logger'

function App() {
    const [rates, setRates] = useState({})
    const [priceChanges, setPriceChanges] = useState([])
    const [wsStatus, setWsStatus] = useState('Connecting...')
    const [ws, setWs] = useState(null)

    // Create a connection handler
    const connectWebSocket = useCallback(() => {
        logger.info('Attempting WebSocket connection')
        const wsUrl = import.meta.env.VITE_WS_URL || 'ws://localhost:3000'
        const wsConnection = new WebSocket(wsUrl)

        wsConnection.onopen = () => {
            logger.info('WebSocket connected successfully')
            setWsStatus('Connected')
        }

        wsConnection.onclose = () => {
            logger.warn('WebSocket connection closed')
            setWsStatus('Disconnected')
            // Attempt to reconnect after 3 seconds
            setTimeout(connectWebSocket, 3000)
        }

        wsConnection.onerror = (error) => {
            logger.error('WebSocket error occurred', { error: error.message })
            wsConnection.close()
        }

        wsConnection.onmessage = (event) => {
            try {
                const data = JSON.parse(event.data)
                logger.debug('Received WebSocket message', { type: data.type })

                if (data.type === 'rates') {
                    setRates(data.data)
                } else if (data.type === 'rateChange') {
                    const changeWithTimestamp = {
                        ...data.data,
                        timestamp: new Date().toISOString()
                    }
                    setPriceChanges(prev => [changeWithTimestamp, ...prev].slice(0, 10)) // Keep last 10 changes
                    setRates(prev => ({
                        ...prev,
                        [data.data.currency]: data.data.newRate
                    }))
                }
            } catch (error) {
                logger.error('Error processing message', { error: error.message })
            }
        }

        setWs(wsConnection)

        return wsConnection
    }, [])

    useEffect(() => {
        const wsConnection = connectWebSocket()

        // Cleanup function
        return () => {
            if (wsConnection && wsConnection.readyState === WebSocket.OPEN) {
                wsConnection.close()
            }
        }
    }, [connectWebSocket])

    return (
        <div className="container">
            <h1>Currency Exchange Monitor</h1>
            <div className="status-badge" data-status={wsStatus.toLowerCase()}>
                {wsStatus}
            </div>

            <PriceChangeHistory changes={priceChanges} />
            <CurrencyTable rates={rates} />
        </div>
    )
}

export default App 