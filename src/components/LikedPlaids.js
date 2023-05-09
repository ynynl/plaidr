
import React, { useEffect } from "react";
import {
  generateThumbNailImgSrc
} from "../utils/utils";
import "./styles.css";


const LikedPlaids = ({ likedPlaids, setLikedPlaids }) => {

  // Retrieve likedPlaids from localStorage when the component mounts
  useEffect(() => {
    const storedLikedPlaids = localStorage.getItem("likedPlaids");
    if (storedLikedPlaids) {
      console.log('storedLikedPlaids', storedLikedPlaids);
      setLikedPlaids(JSON.parse(storedLikedPlaids).map(plaid => ({
        ...plaid,
        src: generateThumbNailImgSrc(plaid)
      })));
    }
  }, []);


  return (
    <div className="liked-plaids">
      {likedPlaids.map((plaid, index) => (
        <div className="liked-plaid" key={index}>
          <img src={plaid.src} />
        </div>
      ))}
    </div>
  );
};
export default LikedPlaids