import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

export default function RecommendMovie() {
  const { state } = useLocation();
  const answers = state?.answers;
  const navigate = useNavigate();
  const [allMovies, setAllMovies] = useState([]);
  const [recommended, setRecommended] = useState([]);

  useEffect(() => {
    if (!answers) {
      navigate('/quiz/movie');
      return;
    }

    const url = `${process.env.PUBLIC_URL}/data/moviedata.json`;

    fetch(url)
      .then(res => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .then(({ data }) => {
        setAllMovies(data);

        const scoredMovies = data.map(movie => {
          let score = 0;

          // 片長評分（用分類字串比對）
          if (movie.duration === answers.duration) score++;

          // 觀看對象（字串包含）
          if (movie.person.includes(answers.person)) score++;

          // 分級（布林比較）
          if (movie.rating === (answers.rating === "high")) score++;

          // 語言（回答語言陣列 vs 電影語言）
          if (
            answers.language.some(lang =>
              (lang === "western" && movie.language === "歐美") ||
              (lang === "japanese" && movie.language === "日文")
            )
          ) score++;

          // 心情（使用者 mood 陣列是否包含電影 mood）
          if (answers.mood.includes(movie.mood)) score++;

          return { ...movie, score };
        });

        // 排序 + 取前3名（若分數相同則打散）
        const topMovies = scoredMovies
          .filter(m => m.score > 0)
          .sort((a, b) => {
            if (b.score !== a.score) return b.score - a.score;
            return Math.random() - 0.5; // 分數相同時隨機
          })
          .slice(0, 3);

        setRecommended(topMovies);
      })
      .catch(err => {
        console.error("讀取 movieList.json 失敗 👉", err);
      });

  }, [answers, navigate]);

  if (!answers) return null;

  return (
    <div className="container py-5">
      <h2 className="mb-4 text-center">🎬 根據你的選擇，我們推薦以下電影：</h2>
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
                  <li>心情：{movie.mood}</li>
                  <li>片長：{movie.duration}</li>
                  <li>推薦分數：{movie.score}</li>
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
