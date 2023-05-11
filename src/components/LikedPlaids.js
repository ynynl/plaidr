
import React, { useEffect } from "react";
import {
  generateThumbNailImgSrc
} from "../utils/utils";
import "./styles.css";


const LikedPlaids = ({ likedPlaids, setLikedPlaids, setNextId, handleSelectPlaid }) => {
  // Retrieve likedPlaids from localStorage when the component mounts
  useEffect(() => {
    const storedLikedPlaids = localStorage.getItem("likedPlaids");
    if (storedLikedPlaids) {
      setLikedPlaids(JSON.parse(storedLikedPlaids).map(plaid => ({
        ...plaid,
        src: generateThumbNailImgSrc(plaid)
      })));
    }
    const storedNextId = localStorage.getItem("nextId");
    if (storedNextId) {
      setNextId(parseInt(storedNextId));
    }
  }, []);


  return (
    <div className="liked-plaids">
      {likedPlaids.map((plaid) => (
        <div className="liked-plaid" key={plaid.id}>
          <img src={plaid.src} onClick={() => handleSelectPlaid(plaid)} />
        </div>
      ))}
    </div>
  );
};
export default LikedPlaids