import { useCallback, useEffect, useState } from "react";
import "./index.css";
function App() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [box, setBox] = useState([]);
  const [point, setPoint] = useState("");
  const [isClick, setIsClick] = useState();
  const [startTime, setStartTime] = useState(0);
  const [nextBox, setNextBox] = useState(1);
  const [gameStatus, setGameStatus] = useState(" Let's Play");
  const [isAutoPlay, setIsAutoplay] = useState(false);
  const handlePlaying = () => {
    if (point && !isNaN(point) && point > 0) {
      setIsPlaying(true);
      BoxTimeOut(point);
      setStartTime(0);
      setGameStatus("Let's Play");
      setNextBox(1);
    } else {
      alert("Please enter a valid point number");
    }
  };

  const handleRestart = () => {
    if (isPlaying) {
      setBox([]);
      BoxTimeOut(point);
      setIsClick(false);
      setNextBox(1);
      setStartTime(0);
    } else {
      setIsPlaying(false);
      setBox([]);
      setStartTime();
      setPoint(0);
      setNextBox(1);
    }
  };
  const BoxTimeOut = (count) => {
    const randomBox = Array.from({ length: count }, (_, i) => ({
      id: i + 1,
      top: Math.random() * 90,
      left: Math.random() * 80,
      value: i + 1,
      zIndex: count - i,
      timeout: null,
    }));
    setBox(randomBox);
  };
  const handlePointChange = (e) => {
    const value = parseInt(e.target.value, 10);
    setPoint(isNaN(value) ? "" : value);
    setIsClick(null);
  };
  const handleClickBox = useCallback(
    (id) => {
      setBox((prBox) =>
        prBox.map((b) => (b.id === id ? { ...b, timeout: 3 } : b))
      );
      if (id === nextBox) {
        setIsClick(id);
        setNextBox((prev) => prev + 1);
      } else {
        setGameStatus("Game Over");
        setIsPlaying(false);
      }
    },
    [nextBox]
  );
  const autoPlayBox = () => {
    if (isAutoPlay) {
      setIsAutoplay(false);
    } else {
      setIsAutoplay(true);
    }
  };
  useEffect(() => {
    if (isAutoPlay && isPlaying) {
      const interval = setInterval(() => {
        setBox((prevBox) => {
          const nextBoxClick = prevBox.find((b) => b.id === nextBox);
          if (nextBoxClick) {
            handleClickBox(nextBoxClick.id);
            console.log(nextBoxClick.id);
          }
          return [...prevBox];
        });
      }, 1000);

      return () => {
        clearInterval(interval);
      };
    }
  }, [isPlaying, isAutoPlay, nextBox, handleClickBox]);
  useEffect(() => {
    if (!isPlaying) return;
    const interval = setInterval(() => {
      setBox((prevBox) =>
        prevBox
          .map((b) =>
            b.timeout !== null
              ? {
                  ...b,
                  timeout:
                    b.timeout > 0.1
                      ? parseFloat((b.timeout - 0.1).toFixed(1))
                      : 0,
                }
              : b
          )
          .filter((b) => b.timeout !== 0)
      );
    }, 100);
    return () => clearInterval(interval);
  }, [isPlaying]);

  useEffect(() => {
    if (isPlaying) {
      const interval = setInterval(() => {
        setStartTime((prevTime) => prevTime + 1);
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [isPlaying]);

  useEffect(() => {
    if (isPlaying) {
      const allBoxesClickedInOrder = box.every((b) => b.timeout === 0);
      if (allBoxesClickedInOrder) {
        setGameStatus("You win");
        setIsPlaying(false);
      }
    }
  }, [isPlaying, box]);
  return (
    <div className="flex flex-col border border-gray-600 mx-auto  p-8 rounded-lg w-[400px]">
      <p
        className={`uppercase font-bold text-[3.5vw] sm:text-[1.5vw] mb-4 ${
          gameStatus === "Game Over"
            ? "text-red-500"
            : gameStatus === "You win"
            ? "text-green-600"
            : ""
        }`}
      >
        {gameStatus}
      </p>

      <div className="space-y-5">
        <div className="flex space-x-4 ">
          <p className="">Point:</p>
          <input
            className="border border-gray-600 rounded-md p-1"
            placeholder="1"
            type="number"
            value={point}
            onChange={handlePointChange}
            name=""
            id=""
          />
        </div>
        <div className="flex   space-x-4">
          <p>Time: </p>
          <p>{startTime}s</p>
        </div>
      </div>

      <div className="space-x-4 mt-5">
        {gameStatus === "You win" || gameStatus === "Game Over" ? (
          <>
            <button
              className="border-gray-600 border rounded-md p-1"
              onClick={handleRestart}
            >
              Restart
            </button>
          </>
        ) : !isPlaying ? (
          <button
            className="border-gray-600 border rounded-md p-1"
            onClick={handlePlaying}
          >
            Play
          </button>
        ) : (
          <>
            <button
              className="border-gray-600 border rounded-md p-1"
              onClick={handleRestart}
            >
              Restart
            </button>
            <button
              className={`border-gray-600 border rounded-md p-1 ${
                isAutoPlay ? "bg-green-400" : ""
              }`}
              onClick={autoPlayBox}
            >
              {isAutoPlay ? " Auto Play OFF" : " Auto Play ON"}
            </button>
          </>
        )}
      </div>

      <div className=" relative h-96 w-full mt-5 border-gray-600 border p-3 rounded-md">
        {box.map((boxes) => (
          <div
            key={boxes.id}
            style={{
              top: `${boxes.top}%`,
              left: `${boxes.left}%`,
              zIndex: boxes.zIndex,
            }}
            onClick={() => handleClickBox(boxes.id)}
            className={`absolute border-orange-500 border h-10 w-10  rounded-full  p-1   text-center cursor-pointer ${
              isClick === boxes.id ? "bg-orange-500" : "bg-white"
            }`}
          >
            <div>
              {boxes.timeout !== null ? boxes.timeout + "s" : boxes.value}
            </div>
          </div>
        ))}
      </div>
      <p>
        Next: <span>{nextBox}</span>
      </p>
    </div>
  );
}

export default App;
