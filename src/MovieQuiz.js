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

	const handleSliderChange = (field, value) => {
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

	const requiredSingles = ['person', 'afterMovie', 'rating']; // radio、文字…單選必填
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
						/>

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
		<div className="card-footer py-2" style={{backgroundColor:'#C84B53'}}>
		</div>
	</div >


	)
}
