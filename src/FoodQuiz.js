import { useState } from 'react';
import QuestionBlock from './component/QuestionBlock';

export default function FoodQuiz() {
  const [answers, setAnswers] = useState({// 初始問卷答案（5 題）
    person: '',
    preference: '',
    range: '',
    occasion: '',
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
          <h2 className="text-center">懶惰吃貨吃什麼</h2>

          {!submitted ? (
            <form onSubmit={handleSubmit}>
              <QuestionBlock
                label="今日吃貨有幾位"
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
                label="飲食偏好"
                field="preference"
                options={['thai', 'japanese', 'korean', 'iItalian', 'chinese']}
                answers={answers}
                setAnswers={setAnswers}
                displayMap={{
                  thai: '泰式',
                  japanese: '日式',
                  korean: '韓式',
                  iItalian:'義式',
                  chinese:'中式',
                }}
              />
              <QuestionBlock
                label="預算範圍"
                field="range"
                options={['budget', 'medium', 'premium']}
                answers={answers}
                setAnswers={setAnswers}
                displayMap={{
                  budget: '平價',
                  medium: '中等',
                  premium: '高價',
                }}
              />
              <QuestionBlock
                label="用餐場合"
                field="occasion"
                options={['casual', 'romantic', 'family']}
                answers={answers}
                setAnswers={setAnswers}
                displayMap={{
                  casual: '日常',
                  romantic: '約會',
                  family:'家人',
                }}
              />
              <QuestionBlock
                label="飲食限制"
                field="diet"
                options={['none', 'vegetarian']}
                answers={answers}
                setAnswers={setAnswers}
                displayMap={{
                  none: '不限',
                  vegetarian: '素食',
                }}
              />
              <button type="submit" className="btn btn-outline-dark p-2 w-100 rounded-0 border-2" disabled={!isFormComplete}>送出</button>
            </form>
          ) : (
            <div className="result">
              <h3>推薦給你的食物是：</h3>
              <p>{recommendMovie()}</p>
            </div>
          )}
        </div>
      </div>
    </div>


  );
}
