import React from 'react'

function RateChangeAlert({ change }) {
    const isPositive = change.newRate > change.oldRate

    return (
        <div className={`rate-alert ${isPositive ? 'positive' : 'negative'}`}>
            <h3>Rate Change Detected!</h3>
            <p>
                {change.currency}: {change.oldRate.toFixed(4)} → {change.newRate.toFixed(4)}
                <span className="change-percent">
                    ({isPositive ? '+' : '-'}{Math.abs(change.changePercent).toFixed(2)}%)
                </span>
            </p>
        </div>
    )
}

export default RateChangeAlert 