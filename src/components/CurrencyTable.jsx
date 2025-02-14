import React from 'react'

function CurrencyTable({ rates }) {
    return (
        <div className="rates-table">
            <h2>Current Exchange Rates</h2>
            <table>
                <thead>
                    <tr>
                        <th>Currency</th>
                        <th>Rate (EUR)</th>
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
    )
}

export default CurrencyTable 