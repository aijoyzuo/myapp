import { useState } from 'react';
import QuestionBlock from './component/QuestionBlock';

export default function BookQuiz() {
  const [answers, setAnswers] = useState({// 初始問卷答案（5 題）
    genre: '',
    mood: '',
    length: '',
    language: '',
    diet: '',
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
          <h2 className="text-center">懶惰書蟲讀什麼</h2>

          {!submitted ? (
            <form onSubmit={handleSubmit}>
              <QuestionBlock
                label="你的閱讀偏好"
                field="genre"
                options={['fiction', 'history', 'inspiration', 'mystery']}
                answers={answers}
                setAnswers={setAnswers}
                displayMap={{
                  fiction: '小說',
                  history: '歷史',
                  inspiration: '勵志',
                  mystery:'懸疑',
                }}
              />
              <QuestionBlock
                label="現在想要"
                field="mood"
                options={['emotional', 'relaxing', 'thrilling']}
                answers={answers}
                setAnswers={setAnswers}
                displayMap={{
                  emotional: '感性一下',
                  relaxing: '放鬆一下',
                  thrilling: '刺激一下',
                }}
              />
              <QuestionBlock
                label="閱讀時長"
                field="length"
                options={['short', 'medium', 'long']}
                answers={answers}
                setAnswers={setAnswers}
                displayMap={{
                  short: '短篇',
                  medium: '中篇',
                  long: '長篇',
                }}
              />
              <QuestionBlock
                label="語言偏好"
                field="language"
                options={['chinese', 'english', 'japanese']}
                answers={answers}
                setAnswers={setAnswers}
                displayMap={{
                  chinese: '中文',
                  english: '英文',
                  japanese: '日文',
                }}
              />
              <QuestionBlock
                label="系列作偏好"
                field="preference"
                options={['none','standalone', 'series']}
                answers={answers}
                setAnswers={setAnswers}
                displayMap={{
                  none:'不限',
                  standalone: '單行本',
                  series: '系列作',
                }}
              />
              <button type="submit" className="btn btn-outline-dark p-2 w-100 rounded-0 border-2" disabled={!isFormComplete}>送出</button>
            </form>
          ) : (
            <div className="result">
              <h3>推薦給你的書籍是：</h3>
              <p>{recommendMovie()}</p>
            </div>
          )}
        </div>
      </div>
    </div>


  );
}
