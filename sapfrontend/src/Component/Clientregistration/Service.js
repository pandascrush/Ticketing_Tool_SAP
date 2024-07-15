


// import React, { useEffect, useState } from 'react';
// import 'bootstrap/dist/css/bootstrap.min.css';
// import './Services.css';
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// import { faCode, faBullhorn, faIndustry } from '@fortawesome/free-solid-svg-icons';
// import { useNavigate } from 'react-router-dom';
// import axios from 'axios';

// function Services() {
//   const history = useNavigate();

//   useEffect(()=>{
//     axios.get("http://192.168.252.157:5000/api/serve/services")
//     .then(res=>console.log(res))
//   })
//   const [selectedServices, setSelectedServices] = useState({
//     webDevelopment: [],
//     digitalMarketing: [],
//     sap: []
//   });

//   const handleCheckboxChange = (category, value) => {
//     setSelectedServices(prevState => {
//       const newCategoryValues = prevState[category].includes(value)
//         ? prevState[category].filter(item => item !== value)
//         : [...prevState[category], value];

//       return {
//         ...prevState,
//         [category]: newCategoryValues
//       };
//     });
//   };





//     // Proceed with form submission
//     const handlefinalSubmit = (event) => {
//       event.preventDefault();

//       const totalSelected = Object.values(selectedServices).flat().length;

//       if (totalSelected === 0) {
//         alert('Please select at least one service.');
//         return;
//       }
//       else{
//         alert("Form Submitted Successfully")
//         history("/")
//       }

//       // Proceed with form submission
//       console.log('Form submitted with selected services:', selectedServices);
//     };

//   return (
//     <div className="container-fluid servicecards">
//       <div className="form-container d-flex flex-column justify-content-center align-items-center">
//         <h2 className="logintxt text-center">Client Registration</h2>
//         <form onSubmit={handlefinalSubmit}>
//         <div className="row">
//           <div className="col text-start">
//             <h3 className="icon"><FontAwesomeIcon icon={faBullhorn} /> Digital Marketing</h3>
//             <label><input type="checkbox" onChange={() => handleCheckboxChange('digitalMarketing', 'SEO')} /> <span>SEO</span></label>
//             <label><input type="checkbox" onChange={() => handleCheckboxChange('digitalMarketing', 'Content Marketing')} /> <span>Content Marketing</span></label>
//             <label><input type="checkbox" onChange={() => handleCheckboxChange('digitalMarketing', 'Social Media')} /> <span>Social Media</span></label>
//             <label><input type="checkbox" onChange={() => handleCheckboxChange('digitalMarketing', 'Email Marketing')} /> <span>Email Marketing</span></label>
//             <label><input type="checkbox" onChange={() => handleCheckboxChange('digitalMarketing', 'PPC')} /> <span>PPC</span></label>
//           </div>
//           <div className="col text-start">
//             <h3 className="icon"><FontAwesomeIcon icon={faIndustry} /> SAP</h3>
//             <label><input type="checkbox" onChange={() => handleCheckboxChange('sap', 'ERP')} /> <span>ERP</span></label>
//             <label><input type="checkbox" onChange={() => handleCheckboxChange('sap', 'CRM')} /> <span>CRM</span></label>
//             <label><input type="checkbox" onChange={() => handleCheckboxChange('sap', 'Business Intelligence')} /> <span>Business Intelligence</span></label>
//             <label><input type="checkbox" onChange={() => handleCheckboxChange('sap', 'Supply Chain Management')} /> <span>Supply Chain Management</span></label>
//             <label><input type="checkbox" onChange={() => handleCheckboxChange('sap', 'HCM')} /> <span>HCM</span></label>
//           </div>
//           <div className="col text-start">
//             <h3 className="icon"><FontAwesomeIcon icon={faCode} /> IT Services</h3>
//             <label><input type="checkbox" onChange={() => handleCheckboxChange('webDevelopment', 'HTML')} /> <span>Webpage Development</span></label>
//             <label><input type="checkbox" onChange={() => handleCheckboxChange('webDevelopment', 'CSS')} /> <span>Mobile Application</span></label>
//             <label><input type="checkbox" onChange={() => handleCheckboxChange('webDevelopment', 'JavaScript')} /> <span>UI/UX</span></label>
//             <label><input type="checkbox" onChange={() => handleCheckboxChange('webDevelopment', 'React')} /> <span>E-commerce</span></label>
//             <label><input type="checkbox" onChange={() => handleCheckboxChange('webDevelopment', 'Node.js')} /> <span>LMS</span></label>
//           </div>
//         </div>
//         <div className="text-center mb-3">
//           <button type="submit" className="btn btn-primary btn-block">Submit</button>
//         </div>
//         </form>
//       </div>
//     </div>
//   );
// }

// export default Services;




// import React, { useEffect, useState } from 'react';
// import 'bootstrap/dist/css/bootstrap.min.css';
// import './Services.css';
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// import { faCode, faBullhorn, faIndustry } from '@fortawesome/free-solid-svg-icons';
// import { useNavigate } from 'react-router-dom';
// import axios from 'axios';

// function Services() {
//   const navigate = useNavigate();
//   // const [servicesData, setServicesData] = useState({
//   //   webDevelopment: [],
//   //   digitalMarketing: [],
//   //   sap: []
//   // });

//   // const [selectedServices, setSelectedServices] = useState({
//   //   webDevelopment: [],
//   //   digitalMarketing: [],
//   //   sap: []
//   // });
//   const [dm, setDm] = useState([])
//   const [sap, setSap] = useState([])
//   const [web, setWeb] = useState([])

//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   useEffect(() => {
//     axios.get("http://192.168.252.186:5000/api/serve/services ")
//       .then(res => {
//         console.log(res.data[0].subdivisions);
//         setDm(res.data[0].subdivisions)
//         setSap(res.data[1].subdivisions)
//         setWeb(res.data[2].subdivisions)
//         setLoading(false)
//       })

//       .catch(err => {
//         console.error(err);
//         setError(err);
//         setLoading(false);
//       });
//   }, []);

//   // const handleCheckboxChange = (category, value) => {
//   //   setSelectedServices(prevState => {
//   //     const newCategoryValues = prevState[category].includes(value)
//   //       ? prevState[category].filter(item => item !== value)
//   //       : [...prevState[category], value];

//   //     return {
//   //       ...prevState,
//   //       [category]: newCategoryValues
//   //     };
//   //   });
//   // };

//   const handleFinalSubmit = (event) => {
//     event.preventDefault();

//     // const totalSelected = Object.values(selectedServices).flat().length;

//     // if (totalSelected === 0) {
//     //   alert('Please select at least one service.');
//     //   return;
//     // } else {
//     //   alert("Form Submitted Successfully");
//     //   navigate("/");
//     // }

//     console.log('Form submitted with selected services:');
//   };

//   // const renderCheckboxes = (category, values) => {
//   //   return values.map((value, index) => (
//   //     <label key={index}>
//   //       <input type="checkbox" onChange={() => handleCheckboxChange(category, value)} /> <span>{value}</span>
//   //     </label>
//   //   ));
//   // };

//   if (loading) return <div>Loading...</div>;
//   if (error) return <div>Error loading services: {error.message}</div>;

//   return (
//     <div className="container-fluid servicecards">
//       <div className="form-container d-flex flex-column justify-content-center align-items-center">
//         <h2 className="logintxt text-center">Client Registration</h2>

//         <form onSubmit={handleFinalSubmit}>
//         <div className='row'>
//           <div className='col'>
//             <h3>SAP</h3>
//             {
//               sap.map(e => (
//                 <div className='d-flex align-items-center'>
//                   <input type='checkbox' />
//                   <label>{e}</label>
//                 </div>
//               ))
//             }
//           </div>
//           <div className='col'>
//             <h3>Digital Marketing</h3>
//             {
//               dm.map(e => (
//                 <div className='d-flex  text-start'>
//                   <input type='checkbox' />
//                   <label>{e}</label>
//                 </div>
//               ))
//             }
//           </div>
//           <div className='col'>
//             <h3>Web Development</h3>
//             {
//               web.map(e => (
//                 <div className='d-flex'>
//                   <input type='checkbox' />
//                   <label>{e}</label>
//                 </div>
//               ))
//             }
//           </div>
//           </div>
//           <input type='submit'/>
//         </form>
//       </div>
//     </div>

//   );
// }

// export default Services;




import React, { useEffect, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './Service.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCode, faBullhorn, faIndustry } from '@fortawesome/free-solid-svg-icons';

import axios from 'axios';

function Services() {

  // const { id } = useParams()
  // const client = atob(id)

  const [dm, setDm] = useState([]);
  const [sap, setSap] = useState([]);
  const [web, setWeb] = useState([]);
  const [selectedServices, setSelectedServices] = useState({
    webDevelopment: [],
    digitalMarketing: [],
    sap: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    axios.get("http://localhost:5002/api/serve/services")
      .then(res => {
        console.log(res)
        setDm(res.data[0].subdivisions);
        setSap(res.data[1].subdivisions);
        setWeb(res.data[2].subdivisions);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setError(err);
        setLoading(false);
      });
  }, []);


  const handleCheckboxChange = (category, value) => {
    setSelectedServices(prevState => {
      const newCategoryValues = prevState[category].includes(value)
        ? prevState[category].filter(item => item !== value)
        : [...prevState[category], value];
      return {
        ...prevState,
        [category]: newCategoryValues
      };
    });
  };

  const handleFinalSubmit = (event) => {
    event.preventDefault();
    console.log('Form submitted with selected services:', selectedServices);
  };

  const renderCheckboxes = (category, values) => {
    return values.map((value, index) => (
      <label key={index} className="d-flex align-items-center">
        <input type="checkbox" onChange={() => handleCheckboxChange(category, value)} /> <span>{value}</span>
      </label>
    ));
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error loading services: {error.message}</div>;

  return (
    <div className="container-fluid servicecards">
      <div className="form-container d-flex flex-column justify-content-center align-items-center">
        <h2 className="logintxt text-center">Client Registration</h2>
        <form onSubmit={handleFinalSubmit}>
          <div className="row">
            <div className="col">
              <h3>SAP</h3>
              {renderCheckboxes('sap', sap)}
            </div>
            <div className="col">
              <h3>Digital Marketing</h3>
              {renderCheckboxes('digitalMarketing', dm)}
            </div>
            <div className="col">
              <h3>Web Development</h3>
              {renderCheckboxes('webDevelopment', web)}
            </div>
          </div>
          <div className="text-center mb-3">
            <button type="submit" className="btn btn-primary btn-block">Submit</button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Services;
