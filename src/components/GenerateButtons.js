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
      <div style={{ display: "flex" }}>
        <div>
          <button onClick={handleNewPivots}>Generate New Pivots</button>
        </div>
        <div>
          <button onClick={handleNewColor}>Generate New Colors</button>
        </div>
        <div>
          <button onClick={handleNewPivotsAndColor}>
            Generate New Pivots and Colors
          </button>
        </div>
      </div>
    );
  };

  export default GenerateButtons