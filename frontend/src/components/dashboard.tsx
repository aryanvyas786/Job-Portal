import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

interface User {
  usertype: string;
  resumeFile: string | null;
  profileImage: string | null;
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  gender: string;
  userType: string;
  agencyId: number | null;
}




const Dashboard: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const navigate = useNavigate()
  
const logout = ()=>{
  console.log("logout");
  localStorage.removeItem('token');
  navigate('/login')
}
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const token = localStorage.getItem('token');
        
        if (!token) {
          throw new Error('No token found. Please log in.');
        }

        const response = await axios.get('http://localhost:9000/api/dashboard', {
          headers: { Authorization: `Bearer ${token}` }, // Pass token as Authorization header
        });
        

        console.log(response.data.updatedUserList)
        // console.log(response.data.updatedUserList[0].usertype)

        setUsers(response.data.updatedUserList);
      } catch (error) {
        setError('Error fetching users');
      } finally {
        setLoading(false);
      }
    };
  
    fetchUsers();
  }, []);

  
  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;
  
  return (  
    <div style={{ padding: '20px', background:'black', height:'1000vh'}} >
      <h1 style={{color:'#f9d9d9'}}>Hello , </h1>
      <h1 style={{color:'#f9d9d9'}}>User Dashboard</h1>   
      <table style={{ width: '100%', borderCollapse: 'collapse', color:'#f9d9d9'}}>
        <thead>
          <tr>
            <th style={{ border: '1px solid #ccc', padding: '10px' }}>ID</th>
            <th style={{ border: '1px solid #ccc', padding: '10px' }}>First Name</th>
            <th style={{ border: '1px solid #ccc', padding: '10px' }}>Last Name</th>
            <th style={{ border: '1px solid #ccc', padding: '10px' }}>Email</th>
            <th style={{ border: '1px solid #ccc', padding: '10px' }}>Phone</th>
            <th style={{ border: '1px solid #ccc', padding: '10px' }}>Gender</th>
            <th style={{ border: '1px solid #ccc', padding: '10px' }}>User Type</th>
            <th style={{ border: '1px solid #ccc', padding: '10px' }}>Profile Image</th>
            <th style={{ border: '1px solid #ccc', padding: '10px' }}>Resume File</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user , index) => (
            <tr key={user.id}>
              <td style={{ border: '1px solid #ccc', padding: '10px' }}>{index+1}</td>
              <td style={{ border: '1px solid #ccc', padding: '10px' }}>{user.firstName}</td>
              <td style={{ border: '1px solid #ccc', padding: '10px' }}>{user.lastName}</td>
              <td style={{ border: '1px solid #ccc', padding: '10px' }}>{user.email}</td>
              <td style={{ border: '1px solid #ccc', padding: '10px' }}>{user.phone}</td>
              <td style={{ border: '1px solid #ccc', padding: '10px' }}>{user.gender}</td>
              <td style={{ border: '1px solid #ccc', padding: '10px' }}>{user.usertype === '1' ? 'Job Seeker' : 'Agency'}</td>
              
              {/* Display Profile Image */}
              <td style={{ border: '1px solid #ccc', padding: '10px' }}>
                {user.profileImage ? (
                  <img
                    src={`${user.profileImage}`}
                    alt="Profile"
                    style={{ width: '100px', height: '100px', objectFit: 'cover' }}
                  />
                ) : (
                  'No image'
                )}
              </td>

              {/* Display Resume File Link */}
              <td style={{ border: '1px solid #ccc', padding: '10px' }}>
                {user.resumeFile ? (
                  <a href={`${user.resumeFile}`} target="_blank" rel="noopener noreferrer" style={{color:"#f9d9d9"}}>
                    Download Resume
                  </a>
                ) : (
                  'No resume'
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <center style={{marginTop:'10%'}}><button style={{background:'white', padding:'10px' ,color:'black', cursor:'pointer', border:'0.1px solid white'}} onClick={logout}>Logout </button></center>
    </div>
  );
};

export default Dashboard;
