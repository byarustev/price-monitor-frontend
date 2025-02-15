import React from 'react';
import { Rates } from '../types';

interface CurrencyTableProps {
    rates: Rates;
}

const CurrencyTable: React.FC<CurrencyTableProps> = ({ rates }) => {
    return (
        <div className="currency-table">
            <h2>Current Exchange Rates</h2>
            <table>
                <thead>
                    <tr>
                        <th>Currency</th>
                        <th>Rate</th>
                    </tr>
                </thead>
                <tbody>
                    {Object.entries(rates).map(([currency, rate]) => (
                        <tr key={currency}>
                            <td>{currency}</td>
                            <td>{rate.toFixed(4)}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default CurrencyTable; 