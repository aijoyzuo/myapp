import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import ShareButtons from "./component/ShareButtons";
import RatingStars from "./component/RatingStars";
import TryAgainButton from "./component/TryAgainButton";

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

function answerHandler(quiz, answers, questionMeta) {
  let score = 0;
  console.log(`${quiz.title} 的比對開始`);

  quiz.answer.forEach((item) => {
    const meta = questionMeta.find(q => q.id === item.id);
    const weight = Number(meta?.weight || 1);

    let raw = 0;

    // 特別處理 rating 題目
    if (item.id === 'rating') {
      const userChoice = answers['rating'];
      const movieRating = quiz.rating;

      if (userChoice === 'high' && movieRating > 6) {
        raw = 1; // 符合條件才得分
      } else {
        raw = 0; // 不加分
      }

    } else if (item.type === 'radio') {
      raw = radioHandler(item, answers);
    } else if (item.type === 'checkbox') {
      raw = checkboxHandler(item, answers);
    } else if (item.type === 'range') {
      raw = rangeHandler(item, answers);
    }

    score += raw * weight;
    console.log(` 題目 ${item.id}：得 ${raw} * 權重 ${weight} = ${raw * weight}`);
  });

  console.log(`總分：${score}`);
  return score;
}


export default function RecommendMovie() {
  const { state } = useLocation();
  const answers = state?.answers;
  const navigate = useNavigate();
  const [recommended, setRecommended] = useState([]);

  useEffect(() => {
    if (!answers) {
      navigate('/quiz/movie');
      return;
    }

    fetch(`${process.env.PUBLIC_URL}/data/movie.json`)
      .then(res => res.json())
      .then(({ data }) => {
        const questionMeta = data.questions;
        fetch(`${process.env.PUBLIC_URL}/data/moviedata.json`)
          .then(res => {
            if (!res.ok) throw new Error(`HTTP ${res.status}`);
            return res.json();
          })
          .then(({ data }) => {
            const scored = data.map(movie => ({
              ...movie,
              score: answerHandler(movie, answers, questionMeta)
            }));

            const top = scored
              .filter(m => m.score > 0)
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
      <header className="text-center py-3 shadow-sm fixed-top text-white" style={{ backgroundColor: '#ca4231' }}>
        <h5 className="m-0">懶惰影迷的選片推薦系統</h5>
      </header>
      <main className="flex-grow-1 py-5 mt-4">
        <h2 className="text-center mb-4">根據你的選擇，我們推薦：</h2>
        <div className="row">
          {recommended.map((movie, index) => (
            <div key={movie.id} className="col-md-4 mb-4 position-relative">
              <div className="card h-100 fade-in-up">
                <div className="position-absolute top-0 start-0 text-white px-2 py-1 fw-bold rounded-end"
                  style={{ backgroundColor: 'rgba(202, 66, 49, 0.6)' }}>
                  <i className="bi bi-award-fill me-1" />No.{index + 1}
                </div>
                <img src={movie.image} className="card-img-top object-fit-cover" style={{ height: '250px', objectPosition: 'center' }} alt={movie.title} />
                <div className="card-body">

                  <div className="d-flex gap-2">
                    <h5 className="card-title">{movie.title}</h5>
                    {movie.rating && <div><p className="badge bg-warning text-dark">高分推薦</p></div>}
                  </div>

                  <p className="card-text">{movie.description}</p>
                  <ul className="list-unstyled small">
                    <li>語言：{movie.language}</li>
                    <li>類型：{movie.genres?.join?.('、')}</li>
                    <li>配對分數：<RatingStars score={movie.score} /></li>
                  </ul>
                </div>
              </div>
            </div>
          ))}
          {recommended.length === 0 && (
            <p className="text-center mt-5">抱歉，找不到符合條件的電影。</p>
          )}
        </div>

        <div className="row justify-content-center mt-4">
          <div className="col-12 col-md-5">
            <ShareButtons title="快來看看我該看哪部電影！" />
          </div>
        </div>

        <div className="row justify-content-center mt-4">
          <div className="col-12 col-md-4">
            <TryAgainButton
              text="再懶一次"
              textColor="text-white"
              buttonColor="#ca4231"
              swalBackground="#ffe8e8"        
              swalClass={{
                confirmButton: 'btn btn-danger mx-2',
                cancelButton: 'btn btn-outline-danger bg-white mx-2',
                actions: 'swal2-button-group-gap'
              }}
              redirectPath="/"
            />
          </div>
        </div>
      </main>
      <footer className="bg-dark text-white text-center py-3 fixed-bottom">
        <small>© {new Date().getFullYear()} All rights reserved.</small>
      </footer>
    </div>
  );
}
