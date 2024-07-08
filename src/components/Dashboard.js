import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './Dashboard.css';

const Dashboard = () => {
  const [bookingData, setBookingData] = useState([]);
  const [consumptionData, setConsumptionData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [selectedMonth, setSelectedMonth] = useState('');

  useEffect(() => {
    axios.get('https://66876cc30bc7155dc017a662.mockapi.io/api/dummy-data/bookingList')
      .then(response => setBookingData(response.data))
      .catch(error => console.error('Error fetching booking data:', error));

    axios.get('https://6686cb5583c983911b03a7f3.mockapi.io/api/dummy-data/masterJenisKonsumsi')
      .then(response => setConsumptionData(response.data))
      .catch(error => console.error('Error fetching consumption data:', error));
  }, []);

  useEffect(() => {
    if (selectedMonth) {
      const [month, year] = selectedMonth.split('-');
      const filtered = bookingData.filter(item => {
        const date = new Date(item.startTime);
        return date.getMonth() === parseInt(month) && date.getFullYear() === parseInt(year);
      });
      setFilteredData(filtered);
    }
  }, [selectedMonth, bookingData]);

  const getUniqueMonths = () => {
    const uniqueMonths = new Set();
    bookingData.forEach(item => {
      const startDate = new Date(item.startTime);
      const endDate = new Date(item.endTime);
      const startMonth = `${startDate.getMonth()}-${startDate.getFullYear()}`;
      const endMonth = `${endDate.getMonth()}-${endDate.getFullYear()}`;
      uniqueMonths.add(startMonth);
      uniqueMonths.add(endMonth);
    });
    return Array.from(uniqueMonths);
  };

  const handleMonthChange = (event) => {
    setSelectedMonth(event.target.value);
  };

  const calculateConsumptionDetails = (roomName) => {
    const roomBookings = filteredData.filter(item => item.roomName === roomName);
    let total = 0;
    let snackSiangCount = 0;
    let makanSiangCount = 0;
    let snackSoreCount = 0;

    roomBookings.forEach(booking => {
      booking.listConsumption.forEach(consumption => {
        const consumptionDetail = consumptionData.find(item => item.name === consumption.name);
        if (consumptionDetail) {
          const consumptionCost = consumptionDetail.maxPrice * booking.participants;
          total += consumptionCost;
          if (consumption.name === "Snack Siang") {
            snackSiangCount += booking.participants;
          } else if (consumption.name === "Makan Siang") {
            makanSiangCount += booking.participants;
          } else if (consumption.name === "Snack Sore") {
            snackSoreCount += booking.participants;
          }
        }
      });
    });

    return { total, snackSiangCount, makanSiangCount, snackSoreCount };
  };

  const renderRoomData = (roomName) => {
    const { total, snackSiangCount, makanSiangCount, snackSoreCount } = calculateConsumptionDetails(roomName);
    const roomBookings = filteredData.filter(item => item.roomName === roomName);
    const usagePercentage = (roomBookings.length / bookingData.length) * 100;

    return (
        <div className="room-card" key={roomName}>
            <h3>{roomName}</h3>
            <p>Persentase Pemakaian: </p>
            <p><strong>{usagePercentage.toFixed(2)}%</strong></p>
            <p>Nominal Konsumsi: </p>
            <p><strong>Rp {total.toLocaleString()}</strong></p>
            <div>
            <p>Snack Siang: {snackSiangCount}</p>
            <div className="bar"><span style={{ width: `${snackSiangCount}px` }}></span></div>
            </div>
            <div>
            <p>Makan Siang: {makanSiangCount}</p>
            <div className="bar"><span style={{ width: `${makanSiangCount}px` }}></span></div>
            </div>
            <div>
            <p>Snack Sore: {snackSoreCount}</p>
            <div className="bar"><span style={{ width: `${snackSoreCount}px` }}></span></div>
            </div>
        </div>
        );
    };
    
    const groupedRooms = filteredData.reduce((acc, booking) => {
        if (!acc[booking.officeName]) {
        acc[booking.officeName] = new Set();
        }
        acc[booking.officeName].add(booking.roomName);
        return acc;
    }, {});
    
    return (
        <div className="dashboard">
        <h1>DASHBOARD</h1>
        <label htmlFor="month-select">Periode</label>
        <select id="month-select" onChange={handleMonthChange} value={selectedMonth}>
            <option value="">Select a month</option>
            {getUniqueMonths().map(month => (
            <option key={month} value={month}>{new Date(month.split('-')[1], month.split('-')[0]).toLocaleString('default', { month: 'long', year: 'numeric' })}</option>
            ))}
        </select>
        
        <div className="block-office">
        {Object.keys(groupedRooms).map(officeName => (
            <div className="office-section" key={officeName}>
            <h2>{officeName}</h2>
            <div className="unit-cards">
                {[...groupedRooms[officeName]].map(roomName => renderRoomData(roomName))}
            </div>
            </div>
        ))}
        </div>
        </div>
    );
    };
    
    export default Dashboard;
      