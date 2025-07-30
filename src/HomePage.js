import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { Film, Book, CupHot } from 'react-bootstrap-icons';

export default function HomePage() {
  // 路由鍵
  const options = ['movie', 'book', 'food'];
  // 顯示標籤（順序要對上）
  const labels = ['看電影', '看點書', '吃東西'];
  // Icon（可換成圖片）
  const icons = [
    <Film aria-hidden="true" />,
    <Book aria-hidden="true" />,
    <CupHot aria-hidden="true" />
  ];

  const navigate = useNavigate();
  const [rotation, setRotation] = useState(0);
  const [isSpinning, setIsSpinning] = useState(false);

  const sectorAngle = 120; // 三等分
  const pointerAngle = 90;  // 指針在下方（6 點鐘）→ 90°

  const spinWheel = () => {
    if (isSpinning) return;
    setIsSpinning(true);

    const randomIndex = Math.floor(Math.random() * options.length);
    const chosen = options[randomIndex];

    // 讓第 i 塊中心對到下方指針
    const targetAngle = pointerAngle - randomIndex * sectorAngle; // 90 - i*120
    const baseRotation = 360 * 5;
    const randomWiggle = Math.random() * 10 - 5; // ±5° 自然感
    const newRotation = rotation + baseRotation + targetAngle + randomWiggle;

    setRotation(newRotation);

    setTimeout(() => {
      navigate(`/quiz/${chosen}`);
      setIsSpinning(false);
    }, 3500);
  };

  return (
    <div className="wheel-page">
      {/* 你的標題會正常顯示，不會被覆蓋 */}
      <div className="page-head">
        <h1 className="title">懶人救星</h1>
        <p className="subtitle">「啊接下來要幹嘛?」</p>
      </div>

      <div className="box">
        <div className="bgImg">
          <img src="https://img.onl/PLp9ZJ" alt="" />

          {/* 真正旋轉的容器 */}
          <div
            className="wheel"
            style={{ transform: `rotate(${rotation}deg)` }}
            aria-label="轉盤"
          >
            {/* 底層：扇形色塊（不放文字，避免互蓋） */}
            <div className="sectors">
              {labels.map((_, i) => (
                <div
                  className="sector"
                  key={`sector-${i}`}
                  style={{ transform: `translate(-50%, -50%) rotate(${i * sectorAngle}deg)` }}
                />
              ))}
            </div>

            {/* 上層：標籤（圖示＋文字） */}
            <div className="labels">
              {labels.map((text, i) => (
                <div
                  className="labelBlock"
                  key={`label-${i}`}
                  style={{
                    // 圓心 → 旋轉到該扇形 → 沿中心線推出去（半徑可在 SCSS 調）
                    transform: `translate(-50%, -50%) rotate(${i * sectorAngle}deg) translate(var(--labelRadius), 0)`
                  }}
                >
                  <span className="icon" aria-hidden="true">{icons[i]}</span>
                  {/* 只有「食物」直排，其它仍橫排；想全部直排可把條件移掉 */}
                  <span className={`label ${text === '食物' ? 'vertical' : ''}`}>{text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* 覆蓋在轉盤上的互動層：中央按鈕＋下方指針 */}
        <div className="overlay">
          <button
            className="centerText"
            onClick={spinWheel}
            disabled={isSpinning}
            aria-label="開始轉盤"
          >
            PRESS
          </button>
          <div className="arrowIcon" />
        </div>
      </div>
    </div>
  );
}
