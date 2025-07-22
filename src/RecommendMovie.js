//userValue是使用者的答案，item.value是電影需要的答案

import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

// ----------不同題型的 handler ----------
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



// ---------- 總計分數的主函式 ----------
function answerHandler(quiz, answers) {
<<<<<<< HEAD
  console.log('當前電影的數據：', quiz.answer)
  let score = 0;
  console.log(`${quiz.title} 的比對開始`);
=======
  console.log('🎞️ 当前电影的数据：', quiz.answer)
  let score = 0;
  console.log(`📽️ ${quiz.title} 的比對開始`);
>>>>>>> a116725d4276861c001ccc3a53cf15175d664ccf

  quiz.answer.forEach((item) => {
    const weight = Number(item.weight) || 1;

    let raw = 0;
    if (item.type === 'radio') {
      raw = radioHandler(item, answers);
    } else if (item.type === 'checkbox') {
      raw = checkboxHandler(item, answers);
    } else if (item.type === 'range') {
      raw = rangeHandler(item, answers);
    }

<<<<<<< HEAD
    console.log(` 題目 ${item.id}：得 ${raw} * 權重 ${weight} = ${raw * weight}`);
    score += raw * weight;
  });

  console.log(`總分：${score}`);
=======
    console.log(`  ▶️ 題目 ${item.id}：得 ${raw} * 權重 ${weight} = ${raw * weight}`);
    score += raw * weight;
  });

  console.log(`✅ 總分：${score}`);
>>>>>>> a116725d4276861c001ccc3a53cf15175d664ccf
  return score;
}




export default function RecommendMovie() {
  const { state } = useLocation();//這兩行把上一頁的答案帶進來
  const answers = state?.answers;
  const navigate = useNavigate();
  const [recommended, setRecommended] = useState([]);



  useEffect(() => {
    if (!answers) {
      navigate('/quiz/movie');
      return;
    }


<<<<<<< HEAD
    fetch(`${process.env.PUBLIC_URL}/data/moviedata.json`)//這段取得電影data
=======
    fetch(`{process.env.PUBLIC_URL}/data/moviedata.json`)//這段取得電影data
>>>>>>> a116725d4276861c001ccc3a53cf15175d664ccf

      .then(res => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .then(({ data }) => {
        const scored = data.map(movie => ({
          ...movie,
          score: answerHandler(movie, answers) // 用你剛剛的 handler 計算分數
        }));

        const top = scored
          .filter(m => m.score > 0)
          .sort((a, b) => b.score - a.score || Math.random() - 0.5)
          .slice(0, 3);

        setRecommended(top);
      })
      .catch(err => console.error("讀取失敗 👉", err));
  }, [answers, navigate]);
  if (!answers) return null;



  return (
    <div className="container py-5">
      <h2 className="text-center mb-4">🎬 根據你的選擇，我們推薦：</h2>
      <div className="row">
        {recommended.map(movie => (
          <div key={movie.id} className="col-md-4 mb-4">
            <div className="card h-100">
              <img src={movie.image} className="card-img-top" alt={movie.title} />
              <div className="card-body">
                <h5 className="card-title">{movie.title}</h5>
                <p className="card-text">{movie.description}</p>
                <ul className="list-unstyled small">
                  <li>語言：{movie.language}</li>
                  <li>類型：{movie.genres.join('、')}</li>
                  <li>片長分類：{movie.duration}</li>
                  <li>配對分數：{movie.score}</li>
                </ul>
              </div>
            </div>
          </div>
        ))}
        {recommended.length === 0 && (
          <p className="text-center mt-5">抱歉，找不到符合條件的電影。</p>
        )}
      </div>
    </div>
  );
}
