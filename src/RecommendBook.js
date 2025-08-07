import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import ShareButtons from "./component/ShareButtons";
import RatingStars from "./component/RatingStars";
import TryAgainButton from "./component/TryAgainButton";
import LoadingOverlay from "./component/LoadingOverlay";

// ---------- handler functions ----------
function rangeHandler(item, answers) {
  const userValue = answers[item.id];
  const classifyDuration = (minutes) => {
    if (minutes <= 60) return "short";
    if (minutes <= 80) return "medium";
    return "long";
  };
  const userCategory = classifyDuration(userValue);
  if (userCategory === 'medium') return 0;

  return userCategory === item.value ? 1 : 0;
}


function radioHandler(item, answers) {
  const userValue = answers[item.id];

  // ✅ 若是「不限」，不計分
  if (userValue === '不限') return 0;

  return item.value.includes(userValue) ? 1 : 0;
}

function checkboxHandler(item, answers) {
  const userValues = answers[item.id];
  if (!Array.isArray(userValues)) return 0;
  const matched = item.value.filter((v) => userValues.includes(v));
  return matched.length;
}

function answerHandler(quiz, answers, questionMeta) {
  let score = 0;
  console.log(`${quiz.title} 的比對開始`);

  quiz.answer.forEach((item) => {
    const meta = questionMeta.find((q) => q.id === item.id);
    const weight = Number(meta?.weight || 1);

    let raw = 0;
    if (item.type === "radio") {
      raw = radioHandler(item, answers);
    } else if (item.type === "checkbox") {
      raw = checkboxHandler(item, answers);
    } else if (item.type === "range") {
      raw = rangeHandler(item, answers);
    }

    score += raw * weight;
    console.log(` 題目 ${item.id}：得 ${raw} * 權重 ${weight} = ${raw * weight}`);
  });

  console.log(`總分：${score}`);
  return score;
}

export default function RecommendBook() {
  const { state } = useLocation();
  const answers = state?.answers;
  const navigate = useNavigate();
  const [recommended, setRecommended] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  }, []);

  useEffect(() => {
    if (!answers) {
      navigate("/quiz/book");
      return;
    }

    fetch(`${process.env.PUBLIC_URL}/data/book.json`)
      .then((res) => res.json())
      .then(({ data }) => {
        const questionMeta = data.questions;

        fetch(`${process.env.PUBLIC_URL}/data/bookdata.json`)
          .then((res) => {
            if (!res.ok) throw new Error(`HTTP ${res.status}`);
            return res.json();
          })
          .then(({ data }) => {
            const scored = data.map((book) => ({
              ...book,
              score: answerHandler(book, answers, questionMeta),
            }));

            const top = scored
              .filter((b) => b.score > 0)
              .sort((a, b) => b.score - a.score || Math.random() - 0.5)
              .slice(0, 3);

            setRecommended(top);
          });
      })
      .catch((err) => console.error("讀取失敗 👉", err));
  }, [answers, navigate]);

  if (!answers) return null;




  return (<>  
  <LoadingOverlay show={loading} text="推薦生成中..." />
   {!loading && (
    <div className="container py-5">
      <header className="text-center py-3 shadow-sm fixed-top text-white" style={{ backgroundColor: "#4D606e" }}>
        <h5 className="m-0">懶人書蟲的推薦系統</h5>
      </header>

      <main className="flex-grow-1 py-5 mt-4">
        <h2 className="text-center mb-4">根據你的選擇，我們推薦：</h2>
        <div className="row">
          {recommended.map((book, index) => (
            <div key={book.id} className="col-md-4 mb-4 position-relative">
              <div className="card h-100 fade-in-up">
                <div className="position-absolute top-0 start-0 text-white px-2 py-1 fw-bold rounded-end"
                  style={{ backgroundColor: "rgba(77, 96, 110, 0.7)" }}>
                  <i className="bi bi-award-fill me-1" />No.{index + 1}
                </div>

                <img src={book.image} className="card-img-top object-fit-cover" style={{ height: "250px", objectPosition: "center" }} alt={book.title} />

                <div className="card-body">
                  <div className="d-flex gap-2">
                    <h5 className="card-title mb-0">{book.title}</h5>
                    {book.rating === '限制級' && <div><p className="badge bg-danger text-white">{book.rating}</p></div>}
                    {book.duration !== '一般篇幅' && <div><p className="badge bg-secondary text-white">{book.duration}</p></div>}
                  </div>

                  <p className="card-text">{book.description}</p>
                  <ul className="list-unstyled small">
                    <li>作者：{book.author}</li>
                    <li>類型：{book.genre} 、{book.mood?.join?.("、")}</li>
                    <li>系列：{book.preference}</li>
                    <li>語言：{book.language}</li>
                    <li>配對分數：<RatingStars score={book.score} /></li>
                  </ul>
                </div>
              </div>
            </div>
          ))}

          {recommended.length === 0 && (
            <p className="text-center mt-5">抱歉，找不到符合條件的書籍。</p>
          )}
        </div>

        <div className="row justify-content-center mt-4">
          <div className="col-12 col-md-5">
            <ShareButtons title="這本書超適合你！" />
          </div>
        </div>

        <div className="row justify-content-center mt-4">
          <div className="col-12 col-md-4">
            <TryAgainButton
              text="再懶一次"
              buttonColor="#4D606e"
              textColor="text-white"
              swalBackground="#90b4cf"
              swalClass={{
                confirmButton: "btn btn-primary mx-2",
                cancelButton: "btn btn-outline-primary bg-white mx-2",
                actions: "swal2-button-group-gap"
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
    )} 
  </>
)}
