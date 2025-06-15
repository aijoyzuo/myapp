import { useState, useMemo } from 'react';
import SliderQuestion from './component/SliderQuestion';
import RadioQuestion from './component/RadioQuestion';
import CheckboxQuestion from './component/CheckboxQuestion';

export default function MovieQuiz() {
	const [answers, setAnswers] = useState({
		movie: 90,
		person: '',
		afterMovie: '',
		rating: '',
		language: [],
		mood: []
	});

	const handleSliderChange = (field, value) => { //當滑桿變動時，用 field 當 key 更新對應答案
		setAnswers(a => ({ ...a, [field]: value }));

	};

	const radioQuestion = [
		{
			id: "person",
			field: "person",
			question: "今日影迷有幾位？",
			options: [
				{ id: "single", label: "一人" },
				{ id: "double", label: "雙人" },
				{ id: "group", label: "多人" },
			]
		},
		{
			id: "afterMovie",
			field: "afterMovie",
			question: "電影之後的行程？",
			options: [
				{ id: "sleep", label: "躺平" },
				{ id: "dining", label: "用餐" },
				{ id: "outdoor", label: "戶外活動" },
			]
		},
		{
			id: "rating",
			field: "rating",
			question: "電影評價選擇",
			options: [
				{ id: "dontcare", label: "都可以" },
				{ id: "high", label: "高於六分" },
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
			question: "今天想要(複選)",
			options: [
				{ id: "cry", label: "哭哭啼啼" },
				{ id: "laugh", label: "放聲大笑" },
				{ id: "shock", label: "來點驚嚇" },
			]
		}
	]

//表單驗證
	const requiredSingles = ['person', 'afterMovie', 'rating']; // radio、文字…單選必填
	const requiredAtLeastOne = ['language', 'mood'];
	const isFormComplete = useMemo(() => {//只有當依賴的變數（這裡是 answers）改變時，才重新執行函式、重新計算
		const singlesOk = requiredSingles.every(f => answers[f]);//.every() 是陣列方法，只有全部都滿足條件時才回傳 true;answers[f] 表示該題的作答內容，只要是非空字串（truthy）就算有填
		const checksOk = requiredAtLeastOne.every(f => answers[f].length > 0);
		return singlesOk && checksOk;//如果兩個條件都通過，整個問卷才算完成
	}, [answers]);//useMemo 的依賴陣列，只有當 answers 改變時，才重新評估上面的邏輯

	const handleSubmit = e => {
		e.preventDefault();
		if (!isFormComplete) {
			alert("請完成所有問題");
			return;
		}
		console.log("Answers submitted:", answers);
		// TODO: 發送 API 或其他處理
	};

	return (<div className="movie-quiz">
		<div className="container py-3">
			<div className="card">
				<img src="https://images.plurk.com/5z4IlpXfbtkOs151EpW2Kc.jpg " className="card-img-top w-100" alt="theater" style={{ maxHeight: "300px", objectFit: "cover" }} />
				<div className="card-body">
					<div className="card-title text-center mb-5">
						<h3>懶惰影迷看什麼？</h3>
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
							label="你有多少時間可以看電影？"
							field="movie"
							value={answers.movie}
							onChange={handleSliderChange}
							sliderClassName="slider-movie"//用來變更css
						/>

						{radioQuestion.map((question) => (
							<RadioQuestion
								key={question.id}
								question={question.question}
								options={question.options}
								field={question.field}
								value={answers[question.field]}//將當前欄位的答案作為 value
								onChange={(val) =>
									setAnswers((prev) => ({ ...prev, [question.field]: val }))//用變數當作欄位名（例如 "person"），將其值設為 val（選到的選項 id）
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
								onChange={(id, checked) => { //這是傳給 CheckboxQuestion 元件的 onChange 回調函式,接收兩個參數：id: 被改變的選項 ID（例如 "korean"）checked: 布林值，表示是否勾選（true 表示勾起，false 表示取消）
									setAnswers((prev) => {
										const current = new Set(prev[question.field]);//prev[question.field] 取得目前這題對應的陣列（如 answers["mood"]）,用 Set 封裝
										// (Set 是一種集合物件，它可以儲存任意數量的唯一值（不重複）)
										if (checked) current.add(id);//如果勾選這個選項，就加進去
										else current.delete(id);//如果取消勾選，就移除
										return { ...prev, [question.field]: Array.from(current) };//把 Set 轉回 Array（因為 answers 中應該存的是 array）
									});
								}}
							/>
						))}
						<button type="submit" className="btn btn-outline-dark p-2 w-100 rounded-0 border-2" disabled={!isFormComplete}>送出</button>
					</form>
				</div>
			</div>
		</div >
		<div className="card-footer py-2" style={{ backgroundColor: '#C84B53' }}>
		</div>
	</div >
	)
}
