import { useState, useMemo } from 'react';
import SliderQuestion from './component/SliderQuestion';
import RadioQuestion from './component/RadioQuestion';
import CheckboxQuestion from './component/CheckboxQuestion';

export default function FoodQuiz() {
  const [answers, setAnswers] = useState({
    food: 90,
    person: '',
    diet: '',
    rating: '',
    preference: [],
    occasion: []
  });

  const handleSliderChange = (field, value) => {
    setAnswers(a => ({ ...a, [field]: value }));

  };


  const radioQuestion = [
    {
      id: "person",
      field: "person",
      question: "今日吃貨有幾位？",
      options: [
        { id: "single", label: "一人" },
        { id: "double", label: "雙人" },
        { id: "group", label: "多人" },
      ]
    },
    {
      id: "diet",
      field: "diet",
      question: "電影之後的行程？",
      options: [
        { id: "none", label: "不限" },
        { id: "vegetarian", label: "素食" },
      ]
    },
    {
      id: "rating",
      field: "rating",
      question: "預算範圍",
      options: [
        { id: "budget", label: "平價" },
        { id: "medium", label: "中等" },
        { id: "premium", label: "高價" },
      ]
    },
  ]

  const checkQuestion = [
    {
      id: "preference",
      field: "preference",
      question: "飲食偏好(複選)",
      options: [
        { id: "thai", label: "泰式" },
        { id: "Japanese", label: "日式" },
        { id: "korean", label: "韓式" },
        { id: "iItalian", label: "義式" },
        { id: "chinese", label: "中式" },
      ]
    },
    {
      id: "occasion",
      field: "occasion",
      question: "用餐場合(複選)",
      options: [
        { id: "casual", label: "日常" },
        { id: "celebrate", label: "慶祝" },
        { id: "romantic", label: "約會" },
        { id: "family", label: "家人" },
      ]
    }
  ]

  const requiredSingles = ['person', 'diet', 'rating']; // radio、文字…單選必填
  const requiredAtLeastOne = ['preference', 'occasion'];
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

  return (<div className="food-quiz">
    <div className="container py-3">
      <div className="card">
        <img src="https://images.plurk.com/7bOPDHtObBCchJ8xKdtdHJ.jpg  " className="card-img-top w-100" alt="theater" style={{ maxHeight: "300px", objectFit: "cover" }} />
        <div className="card-body">
          <div className="card-title text-center mb-5">
            <h3>今天你要吃什麼？</h3>
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
              label="你有多少時間可以用餐？"
              field="food"
              value={answers.food}
              onChange={handleSliderChange}
              sliderClassName="slider-food" />

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
    <div className="card-footer py-2" style={{ backgroundColor: "#EDBF8D" }}>
    </div>
  </div >


  )
}

