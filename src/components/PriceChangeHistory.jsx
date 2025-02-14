import React from 'react';

function PriceChangeHistory({ changes }) {
    return (
        <div className="price-history-container">
            <h2>Recent Price Changes</h2>
            <div className="price-history-slider">
                {changes.map((change, index) => (
                    <div
                        key={index}
                        className={`price-history-card ${change.newRate > change.oldRate ? 'positive' : 'negative'}`}
                    >
                        <div className="timestamp">
                            {new Date(change.timestamp).toLocaleTimeString()}
                        </div>
                        <div className="currency">{change.currency}</div>
                        <div className="price-change">
                            <span className="old-price">{change.oldRate.toFixed(4)}</span>
                            <span className="arrow">→</span>
                            <span className="new-price">{change.newRate.toFixed(4)}</span>
                        </div>
                        <div className="percent-change">
                            {change.newRate > change.oldRate ? '+' : '-'}
                            {Math.abs(change.changePercent).toFixed(2)}%
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default PriceChangeHistory; 