const GenerateButtons = ({
    getNewPivots,
    getNewColors,
    setPivotsAndColors,
  }) => {
    const handleNewColor = () =>
      setPivotsAndColors({
        colors: getNewColors(),
      });
  
    const handleNewPivots = () =>
      setPivotsAndColors({
        pivots: getNewPivots(),
      });
  
    const handleNewPivotsAndColor = () =>
      setPivotsAndColors({
        colors: getNewColors(),
        pivots: getNewPivots(),
      });
    return (
      <div style={{ display: "flex", gap: 4 }}>
        <div>
          <button onClick={handleNewPivots}>Shuffle Pattern</button>
        </div>
        <div>
          <button onClick={handleNewColor}>Shuffle Color</button>
        </div>
        <div>
          <button onClick={handleNewPivotsAndColor}>
            Shuffle Both
          </button>
        </div>
      </div>
    );
  };

  export default GenerateButtons