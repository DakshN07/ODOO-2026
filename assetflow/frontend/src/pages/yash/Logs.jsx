import React,{useEffect,useState} from "react";
import api from "../../api";

const Logs = ()=>{

    const [logs,setLogs]=useState([]);

    useEffect(()=>{

        fetchLogs();

    },[]);

    const fetchLogs = async()=>{

        try{

            const response = await api.get(

                "/yash/logs"

            );

            setLogs(

                response.data.logs

            );

        }

        catch(error){

            console.log(error);

        }

    };

    return(

        <div style={{padding:"2rem"}}>

            <h2>Activity Logs</h2>

            <table
            style={{
                width:"100%",
                marginTop:"20px"
            }}
            >

                <thead>

                    <tr>

                        <th>User</th>

                        <th>Role</th>

                        <th>Action</th>

                        <th>Module</th>

                        <th>Time</th>

                    </tr>

                </thead>

                <tbody>

                {

                    logs.length===0 ?

                    <tr>

                        <td
                        colSpan="5"
                        >
                            No Logs
                        </td>

                    </tr>

                    :

                    logs.map((log)=>(

                        <tr
                        key={log._id}
                        >

                            <td>

                                {log.user?.name}

                            </td>

                            <td>

                                {log.user?.role}

                            </td>

                            <td>

                                {log.action}

                            </td>

                            <td>

                                {log.module}

                            </td>

                            <td>

                                {

                                    new Date(

                                        log.createdAt

                                    ).toLocaleString()

                                }

                            </td>

                        </tr>

                    ))

                }

                </tbody>

            </table>

        </div>

    );

};

export default Logs;