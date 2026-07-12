import React,{useState,useEffect} from "react";
import { Button } from "../../components/Button";

import api from "../../api";

const AdminSetup = () => {

    const [tab, setTab] = useState("departments");
    const [departments,setDepartments]=useState([]);

    const [departmentName,setDepartmentName]=useState("");

    const [categories,setCategories]=useState([]);

    const [categoryName,setCategoryName]=useState("");

    const [users, setUsers] = useState([]);

    const [selectedRole, setSelectedRole] = useState({});

    useEffect(()=>{

    fetchDepartments();
    fetchCategories();
    fetchUsers();

    },[]);

    const fetchDepartments = async()=>{

    try{

        const response = await api.get(

            "/yash/departments"

        );

        setDepartments(

            response.data.departments

        );

    }

    catch(error){

        console.log(error);

    }

  };

  const createDepartment = async()=>{

    if(!departmentName){

        return;

    }

    try{

        await api.post(

            "/yash/departments",

            {

                name:departmentName

            }

        );

        setDepartmentName("");

        fetchDepartments();

    }

    catch(error){

        alert(

            error.response.data.message

        );

    }

  };

  const fetchCategories = async()=>{

    try{

        const response = await api.get(

            "/yash/categories"

        );

        setCategories(

            response.data.categories

        );

    }

    catch(error){

        console.log(error);

    }

  };

  const createCategory = async()=>{

    if(!categoryName){

        return;

    }

    try{

        await api.post(

            "/yash/categories",

            {

                name:categoryName

            }

        );

        setCategoryName("");

        fetchCategories();

    }

    catch(error){

        alert(

            error.response.data.message

        );

    }

  };

  const fetchUsers = async()=>{

    try{

        const response = await api.get(

            "/yash/users"

        );

        setUsers(

            response.data.users

        );

    }

    catch(error){

        console.log(error);

    }

};

const promoteUser = async(userId)=>{

    try{

        await api.put(

            "/yash/admin/promote",

            {

                userId,

                role:selectedRole[userId]

            }

        );

        fetchUsers();

        alert("Role Updated");

    }

    catch(error){

        alert(

            error.response?.data?.message ||

            "Promotion Failed"

        );

    }

};



    return (

        <div style={{ padding: "2rem" }}>

            <h2>Organization Setup</h2>

            <div
                style={{
                    display: "flex",
                    gap: "15px",
                    marginTop: "20px",
                    marginBottom: "25px"
                }}
            >

                <button onClick={() => setTab("departments")}>
                    Departments
                </button>

                <button onClick={() => setTab("categories")}>
                    Categories
                </button>

                <button onClick={() => setTab("employees")}>
                    Employees
                </button>

            </div>

            {

                tab === "departments"

                                &&

                                <div>

                                    <>
                    <h3>Departments</h3>

                    <div
                        style={{
                            display: "flex",
                            gap: "10px",
                            marginTop: "20px",
                            marginBottom: "20px"
                        }}
                    >

                        <input

                            type="text"

                            placeholder="Department Name"

                            value={departmentName}

                            onChange={(e)=>setDepartmentName(e.target.value)}

                            style={{
                                padding:"10px",
                                width:"300px"
                            }}

                        />

                          <Button
                              variant="primary"
                              onClick={createDepartment}
                          >
                              Create
                          </Button>

                    </div>

                    <table
                        style={{
                            width:"100%"
                        }}
                    >

                        <thead>

                            <tr>

                                <th>Name</th>

                                <th>Status</th>

                            </tr>

                        </thead>

                        <tbody>

                          {
                              departments.length === 0 ?

                              <tr>
                                  <td colSpan="2">
                                      No Departments Found
                                  </td>
                              </tr>

                              :

                              departments.map((dept)=>(

                                  <tr key={dept._id}>

                                      <td>{dept.name}</td>

                                      <td>{dept.status}</td>

                                  </tr>

                              ))

                          }

                        </tbody>

                    </table>

                </>

                </div>

            }

            {

                tab === "categories"

                                        &&

                                        <div>

                                            <>

                        <h3>Categories</h3>

                        <div
                        style={{

                        display:"flex",

                        gap:"10px",

                        marginTop:"20px",

                        marginBottom:"20px"

                        }}
                        >

                        <input

                        placeholder="Category Name"

                        value={categoryName}

                        onChange={(e)=>setCategoryName(e.target.value)}

                        style={{

                        padding:"10px",

                        width:"300px"

                        }}

                        />

                        <Button

                        variant="primary"

                        onClick={createCategory}

                        >

                        Create

                        </Button>

                        </div>

                        <table
                        style={{
                        width:"100%"
                        }}
                        >

                        <thead>

                        <tr>

                        <th>Name</th>

                        </tr>

                        </thead>

                        <tbody>

                        {

                        categories.length===0

                        ?

                        <tr>

                        <td>No Categories</td>

                        </tr>

                        :

                        categories.map((cat)=>(

                        <tr key={cat._id}>

                        <td>{cat.name}</td>

                        </tr>

                        ))

                        }

                        </tbody>

                        </table>

                        </>

                </div>

            }

            {

                tab === "employees"

                &&

                <div>

                    <>

                <h3>Employee Directory</h3>

                <table
                style={{
                width:"100%"
                }}
                >

                <thead>

                <tr>

                <th>Name</th>

                <th>Email</th>

                <th>Role</th>

                <th>Promote</th>

                </tr>

                </thead>

                <tbody>

                {

                users.map((user)=>(

                <tr key={user._id}>

                <td>

                {user.name}

                </td>

                <td>

                {user.email}

                </td>

                <td>

                {user.role}

                </td>

                <td>

                <select

                value={

                selectedRole[user._id] ||

                user.role

                }

                onChange={(e)=>

                setSelectedRole({

                ...selectedRole,

                [user._id]:e.target.value

                })

                }

                >

                <option>

                Employee

                </option>

                <option>

                Department Head

                </option>

                <option>

                Asset Manager

                </option>

                <option>

                Admin

                </option>

                </select>

                <Button

                variant="primary"

                onClick={()=>promoteUser(user._id)}

                >

                Promote

                </Button>

                </td>

                </tr>

                ))

                }

                </tbody>

                </table>

                </>

                </div>

            }

        </div>

    );

};

export default AdminSetup;