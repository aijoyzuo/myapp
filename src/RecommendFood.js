import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

// ---------- 不同題型的 handler ----------
function rangeHandler(item, answers) {
  const userValue = answers[item.id];
  const classifyDuration = (minutes) => {
    if (minutes <= 60) return 'short';
    if (minutes <= 120) return 'medium';
    return 'long';
  };
  const userCategory = classifyDuration(userValue);
  return userCategory === item.value ? 1 : 0;
}

function radioHandler(item, answers) {
  const userValue = answers[item.id];
  return item.value.includes(userValue) ? 1 : 0;
}

function checkboxHandler(item, answers) {
  const userValues = answers[item.id];
  if (!Array.isArray(userValues)) return 0;
  const matched = item.value.filter(v => userValues.includes(v));
  return matched.length;
}

// ---------- 主比對邏輯 ----------
function answerHandler(quiz, answers, questionMeta) {
  let score = 0;
  console.log(`${quiz.title} 的比對開始`);

  quiz.answer.forEach((item) => {
    const meta = questionMeta.find(q => q.id === item.id);
    const weight = Number(meta?.weight || 1);

    let raw = 0;
    if (item.type === 'radio') {
      raw = radioHandler(item, answers);
    } else if (item.type === 'checkbox') {
      raw = checkboxHandler(item, answers);
    } else if (item.type === 'range') {
      raw = rangeHandler(item, answers);
    }

    console.log(` 題目 ${item.id}：得 ${raw} * 權重 ${weight} = ${raw * weight}`);
    score += raw * weight;
  });

  console.log(`總分：${score}`);
  return score;
}

export default function RecommendFood() {
  const { state } = useLocation();
  const answers = state?.answers;
  const navigate = useNavigate();
  const [recommended, setRecommended] = useState([]);

  useEffect(() => {
    if (!answers) {
      navigate('/quiz/food');
      return;
    }

    // 載入 foodQuiz.json（題目定義）
    fetch(`${process.env.PUBLIC_URL}/data/food.json`)
      .then(res => res.json())
      .then(({ data }) => {
        const questionMeta = data.questions;

        // 再載入食物資料
        fetch(`${process.env.PUBLIC_URL}/data/fooddata.json`)
          .then(res => {
            if (!res.ok) throw new Error(`HTTP ${res.status}`);
            return res.json();
          })
          .then(({ data }) => {
            const scored = data.map(food => ({
              ...food,
              score: answerHandler(food, answers, questionMeta)
            }));

            const top = scored
              .filter(f => f.score > 0)
              .sort((a, b) => b.score - a.score || Math.random() - 0.5)
              .slice(0, 3);

            setRecommended(top);
          });
      })
      .catch(err => console.error("讀取失敗 👉", err));
  }, [answers, navigate]);

  if (!answers) return null;

  return (
    <div className="container py-5">
      <h2 className="text-center mb-4">🍽 根據你的選擇，我們推薦：</h2>
      <div className="row">
        {recommended.map(food => (
          <div key={food.id} className="col-md-4 mb-4">
            <div className="card h-100">
              <img src={`${process.env.PUBLIC_URL}${food.image}`}  className="card-img-top" alt={food.title} />
              <div className="card-body">
                <h5 className="card-title">{food.title}</h5>
                <p className="card-text">{food.description}</p>
                <ul className="list-unstyled small">
                  <li>飲食分類：{food.diet}</li>
                  <li>偏好料理：{food.preference?.join?.('、')}</li>
                  <li>用餐時機：{food.occasion?.join?.('、')}</li>
                  <li>耗時分類：{food.duration}</li>
                  <li>配對分數：{food.score}</li>
                </ul>
              </div>
            </div>
          </div>
        ))}
        {recommended.length === 0 && (
          <p className="text-center mt-5">抱歉，找不到符合條件的料理。</p>
        )}
      </div>
    </div>
  );
}
