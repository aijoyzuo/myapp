import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
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
  const [loaded, setLoaded] = useState(false);

  const sectorAngle = 120; // 三等分
  const pointerAngle = 90;  // 指針在下方（6 點鐘）→ 90°

  const spinWheel = () => {
    if (isSpinning) return;

    setIsSpinning(true); // 1️⃣ 先移除 slow-spin class（讓動畫停止）

    const randomIndex = Math.floor(Math.random() * options.length);
    const chosen = options[randomIndex];

    const targetAngle = pointerAngle - randomIndex * sectorAngle;
    const baseRotation = 360 * 5;
    const randomWiggle = Math.random() * 10 - 5;
    const newRotation = rotation + baseRotation + targetAngle + randomWiggle;

    // 2️⃣ 等動畫解除，再觸發快速轉（下一輪事件迴圈）
    setTimeout(() => {
      setRotation(newRotation);
    }, 50); // 你可以調整成 10～100ms 都可以

    setTimeout(() => {
      navigate(`/quiz/${chosen}`);
      setIsSpinning(false); // 如果你之後要重新 spin 再慢轉
    }, 3500);
  };


  useEffect(() => {
    const t = setTimeout(() => setLoaded(true), 100);
    return () => clearTimeout(t);
  }, []);




  return (
    <>
      <div className="py-5">
        <header className="text-center py-3 shadow-sm fixed-top" style={{ color:'var(--darkBlue)',backgroundColor: 'var(--pink-alpha)' }}>
          <h1 className="title mb-0">懶人救星</h1>
        </header>
        <div className="wheel-page">
          <div className="info text-center p-4 mb-3">
            <p className="mb-1">懶人今天怎麼過</p>
            <p className="mb-0">試試給懶人的活動推薦系統！</p>
          </div>
          <div className={`box ${loaded ? 'wheel-fadein' : ''}`}>
            <div className="wheel-background" />
            <div className="bgImg">
              {/* 旋轉的容器 */}
              <div
                className={`wheel ${!isSpinning ? 'slow-spin' : ''}`}
                style={{
                  transform: `rotate(${rotation}deg)`,
                  transition: isSpinning ? 'transform 3.5s cubic-bezier(0.33, 1, 0.68, 1)' : 'none'
                }}
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
                        transform: `
      translate(-50%, -50%) 
      rotate(${i * sectorAngle - sectorAngle / 6}deg)
      translate(var(--labelRadius), 0) 
      rotate(80deg)
      translate(-50%, -20%)
    `
                      }}
                    >
                      <span className="icon" aria-hidden="true">{icons[i]}</span>
                      <span className={`label ${labels[i] === '食物' ? 'vertical' : ''}`}>{labels[i]}</span>
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
              <img
                src={`${process.env.PUBLIC_URL}/images/pointer.png`}
                alt="指針"
                className="arrowIcon"
              />
            </div>
          </div>
        </div>
        <footer className="text-white text-center py-3 fixed-bottom" style={{ backgroundColor: 'var(--pink-alpha)' }}>
          <small>© {new Date().getFullYear()} All rights reserved.</small>
        </footer>
      </div>
    </>);
}
