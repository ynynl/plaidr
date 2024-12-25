import React, { useEffect } from "react";
import { generateThumbNailImgSrc } from "../utils/utils";
import { LikedPlaid } from "../types";
import "./styles.css";

interface LikedPlaidsProps {
  likedPlaids: LikedPlaid[];
  setLikedPlaids: (plaids: LikedPlaid[]) => void;
  setNextId: (id: number) => void;
  handleSelectPlaid: (plaid: LikedPlaid) => void;
}

const LikedPlaids: React.FC<LikedPlaidsProps> = ({
  likedPlaids,
  setLikedPlaids,
  setNextId,
  handleSelectPlaid,
}) => {
  useEffect(() => {
    const storedLikedPlaids = localStorage.getItem("likedPlaids");
    if (storedLikedPlaids) {
      setLikedPlaids(
        JSON.parse(storedLikedPlaids).map((plaid: LikedPlaid) => ({
          ...plaid,
          src: generateThumbNailImgSrc(plaid),
        }))
      );
    }
    const storedNextId = localStorage.getItem("nextId");
    if (storedNextId) {
      setNextId(parseInt(storedNextId));
    }
  }, [setLikedPlaids, setNextId]);

  return (
    <div className="liked-plaids">
      {likedPlaids.map((plaid) => (
        <div className="liked-plaid" key={plaid.id}>
          <img
            src={plaid.src}
            onClick={() => handleSelectPlaid(plaid)}
            alt="liked"
          />
        </div>
      ))}
    </div>
  );
};

export default LikedPlaids; 