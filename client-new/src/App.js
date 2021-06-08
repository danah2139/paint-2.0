// TODO: DIVIDE THIS FILE TO COMPONENTS
import "./App.css";
import { useState, useRef, useEffect } from "react";
import api from "./api";
import ImagesList from "./components/imagesList/ImagesList";
import Statistics from "./components/statistics/Statistics";

function App() {
  const [isMouseDown, setIsMouseDown] = useState(false);
  const [currentColor, setCurrentColor] = useState("#000000");
  const [currentBg, setCurrentBg] = useState("#ffffff");
  const [currentSize, setCurrentSize] = useState(1);
  const [mousePos, setMousePos] = useState({});
  const [linesArray, setLinesArray] = useState([]);
  const [isChange, setIsChange] = useState(false);
  const [ctx, setCtx] = useState(null);
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    console.log(canvas);
    setCtx(canvas.getContext("2d"));
  }, []);

  const handleBrushSize = (e) => {
    setCurrentSize(e.target.value);
  };
  const handleBrushColor = (e) => {
    console.log(e.target.value);
    setCurrentColor(e.target.value);
  };

  const handleBgColor = (e) => {
    console.log(canvasRef.current);
    ctx.fillStyle = e.target.value;
    ctx.fillRect(0, 0, canvasRef.current.width, canvasRef.current.height);
    redraw();
    setCurrentBg(ctx.fillStyle);
  };

  const handleInput = (e) => {
    var file = e.target.files[0];
    const img = new Image();
    let imgSrc = window.URL.createObjectURL(file);
    img.onload = function () {
      ctx.drawImage(img, 0, 0);
    };
    img.src = imgSrc;
  };

  const handleClear = () => {
    window.location.reload();
  };

  const saveImg = async () => {
    let image = canvasRef.current.toDataURL("image/png");
    //console.log(image);
    let res = await api.post("images", { src: image });
    setIsChange(!isChange);
    //console.log()
    //handleClear();
  };
  const clearAllImgs = async () => {
    let res = await api.delete("images");
    console.log(res);
    setIsChange(!isChange);
  };

  // GET MOUSE POSITION

  function getMousePos(canvas, evt) {
    var rect = canvas.getBoundingClientRect();
    let position = {
      x: evt.clientX - rect.left,
      y: evt.clientY - rect.top,
    };

    return position;
  }

  // STORE DATA

  function store(x = 0, y = 0, s, c) {
    var line = {
      x: x,
      y: y,
      size: s,
      color: c,
    };
    linesArray.push(line);
  }

  // ON MOUSE DOWN

  function mousedown(evt) {
    if (typeof evt === "object" && evt.button === 0) {
      setIsMouseDown(true);
      var currentPosition = getMousePos(canvasRef.current, evt);
      ctx.moveTo(currentPosition.x, currentPosition.y);
      ctx.beginPath();
      ctx.lineWidth = currentSize;
      ctx.lineCap = "round";
      ctx.strokeStyle = currentColor;
    }
  }

  // ON MOUSE MOVE

  function mousemove(evt) {
    if (isMouseDown) {
      var currentPosition = getMousePos(canvasRef.current, evt);
      setMousePos({ x: currentPosition.x, y: currentPosition.y });
      ctx.lineTo(currentPosition.x, currentPosition.y);
      ctx.stroke();
      store(currentPosition.x, currentPosition.y, currentSize, currentColor);
    }
  }

  const mouseup = (e) => {
    setIsMouseDown(false);
    store();
    console.log("canvas");
  };

  // REDRAW

  function redraw() {
    for (var i = 1; i < linesArray.length; i++) {
      ctx.beginPath();
      ctx.moveTo(linesArray[i - 1].x, linesArray[i - 1].y);
      ctx.lineWidth = linesArray[i].size;
      ctx.lineCap = "round";
      ctx.strokeStyle = linesArray[i].color;
      ctx.lineTo(linesArray[i].x, linesArray[i].y);
      ctx.stroke();
    }
  }

  return (
    <div id="wrapper">
      <h1>Paint 2.0</h1>
      <div id="toolbar">
        <div>
          <label htmlFor="brushSize">
            Size{" "}
            <input
              id="brushSize"
              type="range"
              value={currentSize}
              min="1"
              max="20"
              onChange={handleBrushSize}
            ></input>
          </label>
          <label htmlFor="brushColor">
            Color{" "}
            <input
              id="brushColor"
              type="color"
              value={currentColor}
              onChange={handleBrushColor}
            ></input>
          </label>
          <label htmlFor="bgColor">
            Background{" "}
            <input
              id="bgColor"
              type="color"
              value={currentBg}
              onChange={handleBgColor}
            />
          </label>
        </div>
        <div>
          <label htmlFor="fileLoadBtn">Load image </label>{" "}
          <input
            id="fileLoadBtn"
            onChange={handleInput}
            type="file"
            //value="load file"
          />
          <button onClick={handleClear} id="clearBtn">
            Clear
          </button>
        </div>
      </div>
      <div>
        <canvas
          id="paintCanvas"
          ref={canvasRef}
          width="600"
          height="400"
          onMouseDown={mousedown}
          onMouseMove={mousemove}
          onMouseUp={mouseup}
        ></canvas>
      </div>
      <Statistics
        color={currentColor}
        size={currentSize}
        x={mousePos.x}
        y={mousePos.y}
      />
      <div id="leftImages">
        <h3>Server</h3>
        <button onClick={saveImg}>Save image</button>
        <button onClick={clearAllImgs}>Delete All</button>
        <ImagesList isChange={isChange} ctx={ctx} />
      </div>
      <div>
        <img src="https://www.centerformindfullearning.org/wp-content/uploads/2015/05/slack-imgs.com_.jpeg" />
      </div>
    </div>
  );
}

export default App;
