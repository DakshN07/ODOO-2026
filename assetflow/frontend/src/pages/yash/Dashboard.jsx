import React, { useEffect, useState } from "react";
import api from "../../api";

const Dashboard = () => {

    const [kpis, setKpis] = useState({

        totalEmployees: 0,
        totalDepartments: 0,
        totalAssets: 0,
        activeAllocations: 0,
        pendingMaintenance: 0,
        activeBookings: 0

    });

    const [loading, setLoading] = useState(true);

    useEffect(() => {

        fetchDashboard();

    }, []);

    const fetchDashboard = async () => {

        try {

            const response = await api.get("/yash/dashboard/kpis");

            setKpis(response.data.kpis);

        }

        catch (error) {

            console.log(error);

            setKpis({
                totalEmployees: 0,
                totalDepartments: 0,
                totalAssets: 0,
                activeAllocations: 0,
                pendingMaintenance: 0,
                activeBookings: 0
            });

        }

        finally {

            setLoading(false);

        }

    };

    const cardStyle = {

        padding: "1.5rem",
        border: "1px solid #1f2937",
        borderRadius: "8px",
        background: "#111827",
        color: "#d1d5db"
    };

    if (loading) {

        return <h2>Loading Dashboard...</h2>;

    }

    return (

        <div style={{ padding: "2rem" }}>

            <h2>Dashboard</h2>

            <div
                style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))",
                    gap: "20px",
                    marginTop: "20px"
                }}
            >

                <div style={cardStyle}>
                    <h3>Total Employees</h3>
                    <p style={{ fontSize: "36px", fontWeight: "bold" }}>
                        {kpis.totalEmployees}
                    </p>
                </div>

                <div style={cardStyle}>
                    <h3>Total Departments</h3>
                    <p style={{ fontSize: "36px", fontWeight: "bold" }}>
                        {kpis.totalDepartments}
                    </p>
                </div>

                <div style={cardStyle}>
                    <h3>Total Assets</h3>
                    <p style={{ fontSize: "36px", fontWeight: "bold" }}>
                        {kpis.totalAssets}
                    </p>
                </div>

                <div style={cardStyle}>
                    <h3>Active Allocations</h3>
                    <p style={{ fontSize: "36px", fontWeight: "bold" }}>
                        {kpis.activeAllocations}
                    </p>
                </div>

                <div style={cardStyle}>
                    <h3>Active Bookings</h3>
                    <p style={{ fontSize: "36px", fontWeight: "bold" }}>
                        {kpis.activeBookings}
                    </p>
                </div>

                <div style={cardStyle}>
                    <h3>Pending Maintenance</h3>
                    <p style={{ fontSize: "36px", fontWeight: "bold" }}>
                        {kpis.pendingMaintenance}
                    </p>
                </div>

            </div>

        </div>

    );

};

export default Dashboard;