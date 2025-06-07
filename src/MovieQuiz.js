import { useState } from 'react';
import QuestionBlock from './component/QuestionBlock';

export default function MovieQuiz() {
  const [answers, setAnswers] = useState({// 初始問卷答案（5 題）
    person:'',
    language: '',
    afterMovie: '',
    imdbRating: '',
    mood: '',
  });


  const [submitted, setSubmitted] = useState(false);// submitted===true的時候，顯示推薦結果
  const isFormComplete = Object.values(answers).every((val) => val !== '');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setAnswers((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
  };

  // 假設推薦邏輯
  const recommendMovie = () => {
    const { genre, mood } = answers;
    if (genre === 'action' && mood === 'excited') return '《John Wick》';
    if (genre === 'romance') return '《Before Sunrise》';
    if (genre === 'drama') return '《The Shawshank Redemption》';
    return '《Inception》';
  };

  return (
    <div className="container">
      <div className="row">
        <div className="quiz-page col-md-5 mx-auto mt-4">
          <h2 className="text-center">懶惰影迷看什麼</h2>

          {!submitted ? (
            <form onSubmit={handleSubmit}>
              <QuestionBlock
                label="今日影迷有幾位"
                field="person"
                options={['single', 'double', 'group']}
                answers={answers}
                setAnswers={setAnswers}
                displayMap={{
                  single: '一人',
                  double: '雙人',
                  group: '多人',
                }}
              />
              <QuestionBlock
                label="語系偏好"
                field="language"
                options={['western', 'asian', 'mandarin']}
                answers={answers}
                setAnswers={setAnswers}
                displayMap={{
                  western: '歐美',
                  asian: '日韓',
                  mandarin: '華文',
                }}
              />
              <QuestionBlock
                label="稍後的行程"
                field="afterMovie"
                options={['sleep', 'dining', 'outdoor']}
                answers={answers}
                setAnswers={setAnswers}
                displayMap={{
                  sleep: '躺平',
                  dining: '用餐',
                  outdoor: '戶外活動',
                }}
              />
              <QuestionBlock
                label="IMDb評分"
                field="imdbRating"
                options={['dontCare', 'heigh']}
                answers={answers}
                setAnswers={setAnswers}
                displayMap={{
                  dontCare: '我不在乎',
                  heigh: '六分以上',
                }}
              />
              <QuestionBlock
                label="今天想要"
                field="mood"
                options={['cry', 'laugh', 'shock']}
                answers={answers}
                setAnswers={setAnswers}
                displayMap={{
                  cry: '哭哭啼啼',
                  laugh: '放聲大笑',
                  shock: '來點驚嚇',
                }}
              />
              <button type="submit" className="btn btn-outline-dark p-2 w-100 rounded-0 border-2" disabled={!isFormComplete}>送出</button>
            </form>
          ) : (
            <div className="result">
              <h3>推薦給你的電影是：</h3>
              <p>{recommendMovie()}</p>
            </div>
          )}
        </div>
      </div>
    </div>


  );
}
