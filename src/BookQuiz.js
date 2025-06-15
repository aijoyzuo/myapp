import { useState, useMemo } from 'react';
import SliderQuestion from './component/SliderQuestion';
import RadioQuestion from './component/RadioQuestion';
import CheckboxQuestion from './component/CheckboxQuestion';

export default function BookQuiz() {
  const [answers, setAnswers] = useState({
    book: 90,
    genre: '',
    preference: '',
    rating: '',
    language: [],
    mood: []
  });

  const handleSliderChange = (field, value) => {
    setAnswers(a => ({ ...a, [field]: value }));

  };




  const radioQuestion = [
    {
      id: "genre",
      field: "genre",
      question: "你的閱讀偏好？",
      options: [
        { id: "fiction", label: "小說" },
        { id: "history", label: "歷史" },
        { id: "inspiration", label: "勵志" },
        { id: "mystery", label: "懸疑" },

      ]
    },
    {
      id: "preference",
      field: "preference",
      question: "系列作偏好",
      options: [
        { id: "none", label: "不限" },
        { id: "standalone", label: "單行本" },
        { id: "series", label: "系列作" },
      ]
    },
    {
      id: "rating",
      field: "rating",
      question: "書籍年齡層",
      options: [
        { id: "child", label: "兒童讀物" },
        { id: "general", label: "普遍級" },
        { id: "restricted", label: "限制級" },
      ]
    },
  ]
  const checkQuestion = [
    {
      id: "language",
      field: "language",
      question: "語系偏好(複選)",
      options: [
        { id: "western", label: "歐美" },
        { id: "Japanese", label: "日文" },
        { id: "korean", label: "韓文" },
        { id: "mandarin", label: "華文" },
      ]
    },
    {
      id: "mood",
      field: "mood",
      question: "現在想要(複選)",
      options: [
        { id: "emotional", label: "感性一下" },
        { id: "relaxing", label: "放鬆一下" },
        { id: "thrilling", label: "刺激一下" },
      ]
    }
  ]

  const requiredSingles = ['genre', 'preference', 'rating']; // radio、文字…單選必填
  const requiredAtLeastOne = ['language', 'mood'];
  const isFormComplete = useMemo(() => {
    const singlesOk = requiredSingles.every(f => answers[f]);
    const checksOk = requiredAtLeastOne.every(f => answers[f].length > 0);
    return singlesOk && checksOk;
  }, [answers]);

  const handleSubmit = e => {
    e.preventDefault();
    if (!isFormComplete) {
      alert("請完成所有問題");
      return;
    }
    console.log("Answers submitted:", answers);
    // TODO: 發送 API 或其他處理
  };

  return (<div className="book-quiz">
    <div className="container py-3">
      <div className="card">
        <img src="https://images.plurk.com/7EcCdUS4IqxDzf03xeKeag.jpg  " className="card-img-top w-100" alt="theater" style={{ maxHeight: "300px", objectFit: "cover" }} />
        <div className="card-body">
          <div className="card-title text-center mb-5">
            <h3>懶惰書迷看什麼？</h3>
          </div>
          <div className="row pb-4 border-bottom">
            <div className="col-md-6 py-2">
              <label htmlFor="fillPerson" className="h5 form-label">暱稱</label>
              <input type="text" className="form-control py-3" id="fillPerson" placeholder="" required />
            </div>
            <div className="col-md-6 py-2">
              <label htmlFor="fillDate" className="h5 form-label">問卷填寫日期</label>
              <input type="date" className="form-control py-3" id="fillDate" placeholder="yyyy/mm/dd" required />
            </div>
          </div>
          <form onSubmit={handleSubmit}>
            <SliderQuestion
              label="你有多少時間可以看書？"
              field="book"
              value={answers.book}
              onChange={handleSliderChange} />

            {radioQuestion.map((question) => (
              <RadioQuestion
                key={question.id}
                question={question.question}
                options={question.options}
                field={question.field}
                value={answers[question.field]}
                onChange={(val) =>
                  setAnswers((prev) => ({ ...prev, [question.field]: val }))
                }
              />
            ))}
            {checkQuestion.map((question) => (
              <CheckboxQuestion
                key={question.id}
                question={question.question}
                options={question.options}
                field={question.field}
                value={answers[question.field]}
                onChange={(id, checked) => {
                  setAnswers((prev) => {
                    const current = new Set(prev[question.field]);
                    if (checked) current.add(id);
                    else current.delete(id);
                    return { ...prev, [question.field]: Array.from(current) };
                  });
                }}
              />
            ))}
            <button type="submit" className="btn btn-outline-dark p-2 w-100 rounded-0 border-2" disabled={!isFormComplete}>送出</button>
          </form>

        </div>
      </div>


    </div >
    <div className="card-footer py-2" style={{ backgroundColor: '#4D606E' }}>
    </div>
  </div >


  )
}


