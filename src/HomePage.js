import { useNavigate } from 'react-router-dom';
import { useState } from 'react';

export default function HomePage() {
  const options = ['movie', 'book', 'food'];
  const navigate = useNavigate();

  const [rotation, setRotation] = useState(0);// 當前累積轉盤角度（從 0 開始）
  const [isSpinning, setIsSpinning] = useState(false);// 控制是否正在轉動，避免連續點擊

  const spinWheel = () => {// 點擊「開始轉盤」時呼叫的函式,
    if (isSpinning) return;//如果isSpinning=true，表示正在轉動中ㄝ，就直接return不能重複按
    setIsSpinning(true);

    const randomIndex = Math.floor(Math.random() * options.length); //Math.floor()無條件捨去小數點，Math.random()產生0~1的隨機數，options.length陣列長度，用來決定隨機範圍
    const chosen = options[randomIndex];// 對應的項目文字（例如 'movie'）

    const baseRotation = 360 * 5; // 設定基本旋轉為 5 圈（360° × 5 = 1800°）
    const sectorAngle = 120;// 每個選項佔 120 度（360 ÷ 3 = 120）
    const centerOffset = 0; // 指針在轉盤下方
    const targetAngle = randomIndex * sectorAngle + centerOffset; // 計算目標角度（從原點開始的角度），使選項的中心對準指針

    const randomWiggle = Math.random() * 10 - 5; // 增加隨機的誤差（±5 度），讓轉動看起來更自然(先產生一個0~1的隨機數，再放大十倍，再減掉五)
    const newRotation = rotation + baseRotation + targetAngle + randomWiggle;// 新的總旋轉角度是從上一次停止的位置繼續加上新的轉動

    setRotation(newRotation);// 更新畫面中的旋轉角度

    console.log(`Selected: ${chosen}, Final rotation: ${newRotation.toFixed(2)}°`);// 記錄選擇結果與旋轉角度用

    setTimeout(() => {// 等待轉盤轉完後再跳轉頁面（和 CSS transition 對應）
      navigate(`/quiz/${chosen}`);// 導向對應的測驗頁面
      setIsSpinning(false); // 解鎖再次轉動
    }, 3500);
  };

  return (
    <div className="homepage">
      <h1>懶人轉盤</h1>
      <p>今日你要做什麼?</p>

      <div className="wheel" style={{ transform: `rotate(${rotation}deg)` }}> 
        <div className="wheel-label label-0">書籍</div>
        <div className="wheel-label label-1">電影</div>
        <div className="wheel-label label-2">食物</div>
      </div>

      <div className="pointer"></div>

      <button className="start-btn" onClick={spinWheel}>
        開始轉盤
      </button>
    </div>
  );
}
