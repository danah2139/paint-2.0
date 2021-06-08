const Statistics = ({ x = 0, y = 0, size = 1, color = "#ffffff" }) => {
  return (
    <div id="statistics">
      <span id="mousePos">
        Pos: {x}, {y}
      </span>
      <span id="brushSizeVal">Brush Size: {size}</span>
      <span id="brushColorVal">Brush Color: {color}</span>
    </div>
  );
};
export default Statistics;
