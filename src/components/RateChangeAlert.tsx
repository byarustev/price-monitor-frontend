import React from 'react';
import { Rate } from '../types';

interface RateChangeAlertProps {
    change: Rate;
    onClose: () => void;
}

const RateChangeAlert: React.FC<RateChangeAlertProps> = ({ change, onClose }) => {
    const isIncrease = change.newRate > change.oldRate;
    const changeType = isIncrease ? 'increased' : 'decreased';
    const changeClass = isIncrease ? 'increase' : 'decrease';

    return (
        <div className={`rate-change-alert ${changeClass}`}>
            <div className="alert-content">
                <div className="alert-header">
                    <span className="currency">{change.currency}</span>
                    <button className="close-button" onClick={onClose}>×</button>
                </div>
                <div className="alert-body">
                    <p>
                        Rate has {changeType} by {change.changePercent.toFixed(2)}%
                    </p>
                    <p className="rate-details">
                        From: {change.oldRate.toFixed(4)} → To: {change.newRate.toFixed(4)}
                    </p>
                </div>
            </div>
        </div>
    );
};

export default RateChangeAlert; 