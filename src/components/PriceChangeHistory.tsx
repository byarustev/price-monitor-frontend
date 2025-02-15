import React from 'react';
import { Rate } from '../types';

interface PriceChangeHistoryProps {
    changes: Rate[];
}

const PriceChangeHistory: React.FC<PriceChangeHistoryProps> = ({ changes }) => {
    return (
        <div className="price-history">
            <h2>Recent Price Changes</h2>
            <div className="price-changes-container">
                {changes.length > 0 ? (
                    changes.map((change, index) => (
                        <div
                            key={index}
                            className={`price-change-card ${change.newRate > change.oldRate ? 'increase' : 'decrease'}`}
                        >
                            <div className="currency">{change.currency}</div>
                            <div className="price-change">
                                {change.oldRate.toFixed(4)} → {change.newRate.toFixed(4)}
                            </div>
                            <div className="change-percent">
                                {change.changePercent.toFixed(2)}%
                            </div>
                            <div className="timestamp">
                                {new Date(change.timestamp).toLocaleTimeString()}
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="price-change-placeholder">
                        <div className="placeholder-icon">📈</div>
                        <div className="placeholder-text">
                            Waiting for price changes...
                            <br />
                            <span>Updates will appear here in real-time</span>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default PriceChangeHistory; 