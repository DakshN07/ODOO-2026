import React from 'react';
import { Button } from '../../components/Button';

export const Bookings = () => {
  const dummyBookings = [
    { id: 1, resource: 'Conference Room A', user: 'Yash', start: '2026-07-12 11:00 AM', end: '2026-07-12 12:00 PM', status: 'Approved' },
    { id: 2, resource: 'Testing Lab', user: 'Ayush', start: '2026-07-13 02:00 PM', end: '2026-07-13 05:00 PM', status: 'Pending' }
  ];

  return (
    <div style={{ padding: '2rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2>Resource Bookings</h2>
        <Button onClick={() => console.log('New Booking')}>Book Resource</Button>
      </div>
      <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '1rem' }}>
        <thead>
          <tr style={{ background: '#f5f5f5', borderBottom: '2px solid #ddd' }}>
            <th style={{ padding: '10px', textAlign: 'left' }}>Resource Name</th>
            <th style={{ padding: '10px', textAlign: 'left' }}>Booked By</th>
            <th style={{ padding: '10px', textAlign: 'left' }}>Start Time</th>
            <th style={{ padding: '10px', textAlign: 'left' }}>End Time</th>
            <th style={{ padding: '10px', textAlign: 'left' }}>Status</th>
          </tr>
        </thead>
        <tbody>
          {dummyBookings.map(booking => (
            <tr key={booking.id} style={{ borderBottom: '1px solid #eee' }}>
              <td style={{ padding: '10px' }}>{booking.resource}</td>
              <td style={{ padding: '10px' }}>{booking.user}</td>
              <td style={{ padding: '10px' }}>{booking.start}</td>
              <td style={{ padding: '10px' }}>{booking.end}</td>
              <td style={{ padding: '10px' }}>{booking.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Bookings;
