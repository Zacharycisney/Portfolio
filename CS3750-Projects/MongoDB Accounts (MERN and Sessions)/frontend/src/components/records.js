import React, { useEffect, useState } from "react"; 
import { Link } from "react-router-dom";



// React component for each row of the result set (Record)
const Record = (props) => (
    <tr>
        <td>{props.record.firstName}</td>
        <td>{props.record.lastName}</td>
        <td>{props.record.email}</td>
        <td>{props.record.phone}</td>
        <td>{props.record.role}</td>
        <td>{props.record.saving}</td>
        <td>{props.record.checking}</td>
        <td><Link to={`/summary/${props.record._id}`}>Edit</Link></td>
    </tr>
)



// One React component for the entire table (Records)
export default function Records() {
    const [records, setRecords] = useState([]);

    useEffect(() => {
        async function getRecords() {
            const response = await fetch(`http://localhost:5000/record`);
            if (!response.ok) {
                const message = `An error occurred: ${response.statusText}`;
                window.alert(message);
                return;
            }
            const responseRecords = await response.json();
            setRecords(responseRecords); // make sure to use the setter not records = responseRecords
            return;
        }
        getRecords ();
        return;
    },[records.length]) // any thing with in [] is a list say if anything change from the list rerender (*records.lenght is for if we manually alter the site)

    function recordList(){
        return records.map((record) => {
            return (
                <Record
                    record={record}
                    key={record._id}
                />
            );
        });
    }


    return (
        <div>
            <h3>Record List</h3>
            <table style={{marginTop: 20}}>
                <thead>
                    <tr>
                        <th>First Name</th>
                        <th>Last Name</th>
                        <th>Email</th>
                        <th>Phone</th>
                        <th>Role</th>
                        <th>Saving</th>
                        <th>Checking</th>
                        <th>Edit</th>
                    </tr>
                </thead>
                <tbody>{recordList()}</tbody>
            </table>
        </div>
    ); 
}