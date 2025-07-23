import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

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

    if (item.id === 'diet' && quiz.diet === 'vegetarian') {
      console.log(` 跳過 ${item.id}（vegetarian，不加權）`);
      return; // 跳過這題不加分
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
      .catch(err => console.error("讀取失敗", err));
  }, [answers, navigate]);

  if (!answers) return null;

  return (
    <div className="container py-5">
      <header className="text-center py-3 shadow-sm fixed-top" style={{ backgroundColor: '#f6da85' }}>
        <h5 className="m-0">懶惰吃貨的飲食推薦系統</h5>
      </header>
      <main className="flex-grow-1 pt-5 mt-4">
        <h2 className="text-center mb-4">🍽 根據你的選擇，我們推薦：</h2>
        <div className="row">
          {recommended.map((food, index) => (
            <div key={food.id} className="col-md-4 mb-4 position-relative">
              <div className="card h-100">
                <div className="position-absolute top-0 start-0 text-white px-2 py-1 fw-bold rounded-end" style={{ backgroundColor: 'rgba(255, 193, 7, 0.7)' }}>
                  <i className="bi bi-award-fill me-1" />No.{index + 1}
                </div>
                <img src={`${process.env.PUBLIC_URL}${food.image}`} className="card-img-top object-fit-cover" style={{ height: '250px', objectPosition: 'center' }} alt={food.title} />
                <div className="card-body">
                  <div className="d-flex gap-2">
                    <h5 className="card-title">{food.title}</h5>
                    {food.diet !== '葷素皆可' && <div><p className="badge bg-warning text-dark">{food.diet}</p></div>}
                  </div>
                  <p className="card-text">{food.description}</p>
                  <ul className="list-unstyled small">
                    <li>料理分類：{food.preference?.join?.('、')}</li>
                    <li>推薦指數：{food.score} 顆星</li>
                  </ul>
                </div>
              </div>
            </div>
          ))}
          {recommended.length === 0 && (
            <p className="text-center mt-5">抱歉，找不到符合條件的料理。</p>
          )}
        </div>
        <div className="row justify-content-center mt-4">
          <div className="col-12 col-md-4">
            <button
              className="btn w-100 text-center mt-4"
              style={{ backgroundColor: '#f6da85' }}
              onClick={() => {
                Swal.fire({
                  title: '確定要回到轉盤頁？',
                  text: '這會清除目前的推薦結果',
                  icon: 'warning',
                  showCancelButton: true,
                  confirmButtonText: '確定',
                  cancelButtonText: '取消',
                  customClass: {
                    confirmButton: 'btn btn-warning mx-2',
                    cancelButton: 'btn btn-outline-secondary bg-white mx-2',
                    actions: 'swal2-button-group-gap'
                  },
                  buttonsStyling: false, // 必須關閉原生 styling 才會套用上面的 class
                  background: '#fffbe6'
                }).then((result) => {
                  if (result.isConfirmed) {
                    navigate('/');
                  }
                });
              }}
            >
              再懶一次
            </button>
          </div>
        </div>
      </main>
      <footer className="bg-dark text-white text-center py-3 fixed-bottom">
        <small>© {new Date().getFullYear()} All rights reserved.</small>
      </footer>
    </div >
  );
}
