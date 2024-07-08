// src/components/UnitCard.js
import React from 'react';
import './UnitCard.css'; // Assuming you have some CSS for styling

const UnitCard = ({ name, usage, consumption, snacks }) => {
    return (
        <div className="unit-card">
            <h3>{name}</h3>
            <div className="usage">
                <span>Persentase Pemakaian</span>
                <span>{usage}%</span>
            </div>
            <div className="consumption">
                <span>Nominal Konsumsi</span>
                <span>Rp {consumption.toLocaleString()}</span>
            </div>
            <div className="snacks">
                {snacks.map((snack, index) => (
                    <div key={index} className="snack">
                        <span>{snack.name}</span>
                        <span>{snack.value}</span>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default UnitCard;
