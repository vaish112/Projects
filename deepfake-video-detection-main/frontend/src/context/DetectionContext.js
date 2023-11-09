// import { createContext, useState, useEffect } from "react";
// import jwt_decode from "jwt-decode";
// import { useHistory } from "react-router-dom";

// const DetectionContext = createContext();

// export default DetectionContext;

// export const DetectionProvider = ({ children }) => {
//     var data = localStorage.getItem("authTokens");

//   const detectVideo = async (video, model) => {
//     const response = await fetch(
//       "http://127.0.0.1:8000/api/detection/" + model + "/",
//       {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({
//           video,
//         }),
//       }
//     );
//     const data = await response.json();
//     return data;
//   };
// };
