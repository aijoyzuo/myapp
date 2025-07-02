import { useState, useEffect, useMemo } from 'react';
import SliderQuestion from './component/SliderQuestion';
import RadioQuestion from './component/RadioQuestion';
import CheckboxQuestion from './component/CheckboxQuestion';
import { useNavigate } from 'react-router-dom';

export default function FoodQuiz() {
	/* ---------- 載入資料 ---------- */
	const [title, setTitle] = useState(''); //問卷標題
	const [titlePic, setTitlePic] = useState('');
	const [qData, setQData] = useState(null);   // 問卷題目 & 必填規則
	const navigate = useNavigate();

	const url = `${process.env.PUBLIC_URL}/data/food.json`;//用環境變數


	useEffect(() => {
		fetch(url)
			.then(r => {
				if (!r.ok) throw new Error(`HTTP ${r.status}`);
				return r.json();
			})
			.then(json => {
				setTitle(json.data.title);
				setTitlePic(json.data.titlePic);
				setQData(json.data);
			})
			.catch(err => {
				console.error('載入 food.json 失敗 👉', err);
			});
	}, []);

	/* ---------- 表單答案 ---------- */
	const [answers, setAnswers] = useState({ //宣告一個 answers 狀態物件，用來儲存使用者的回答。
		duration: 90,
		person: '',
		diet: '',
		rating: '',
		preference: [],
		occasion: [],
		fillPerson: '',
		fillDate: ''
	});

	/* ---------- 動態驗證 ---------- */
	const isFormComplete = useMemo(() => {
		if (!qData) return false;

		// 遍歷所有題目
		return qData.questions.every(q => {
			const val = answers[q.field];

			if (q.required && q.type === 'radio') {
				return val !== '';
			}

			if (q.required && q.type === 'range') {
				return typeof val === 'number'; // 或可加入範圍驗證
			}

			if (q.type === 'checkbox' && q.minSelect) {
				return Array.isArray(val) && val.length >= q.minSelect;
			}

			return true; // 非必填題都算通過
		});
	}, [answers, qData]);

	/* ---------- 送出時用答案篩----*/

	const handleSubmit = e => {
		e.preventDefault();

		if (!isFormComplete) {
			alert('請完成所有問題');
			return;
		}

		// 導向下一頁，同時用 state 傳遞答案物件
		navigate('/recommendMovie', { state: { answers } });
	};


	/* ---------- 等 fetch 完再渲染 ---------- */
	if (!qData) return <p>Loading questionnaire…</p>;//資料尚未載入時，顯示loading

	return (
		<div className="food-quiz">
			<div className="container py-3">
				<div className="card">
					<img src={titlePic} className="card-img-top w-100" alt="theater" style={{ maxHeight: "300px", objectFit: "cover" }} />
					<div className="card-body">
						<div className="card-title text-center mb-5">
							<h3>{title}</h3>
						</div>
						<form onSubmit={handleSubmit}>
							<div className="row pb-4 border-bottom">
								<div className="col-md-6 py-2">
									<label htmlFor="fillPerson" className="h5 form-label">暱稱<span className="text-danger">*</span></label>
									<input type="text"
										className="form-control py-3"
										id="fillPerson"
										required
										value={answers.fillPerson}
										onChange={e => setAnswers(a => ({ ...a, fillPerson: e.target.value }))} />
								</div>
								<div className="col-md-6 py-2">
									<label htmlFor="fillDate" className="h5 form-label">問卷填寫日期<span className="text-danger">*</span></label>
									<input type="date"
										className="form-control py-3"
										id="fillDate"
										placeholder="yyyy/mm/dd"
										required
										value={answers.fillDate}
										onChange={e => setAnswers(a => ({ ...a, fillDate: e.target.value }))} />
								</div>
							</div>
							{qData.questions.filter(q => q.type === 'range').map(q => (
								<SliderQuestion
									key={q.id}
									label={q.label}
									field={q.field}
									value={answers[q.field]}
									min={q.min}
									max={q.max}
									step={q.step}
									onChange={(f, val) => setAnswers(a => ({ ...a, [f]: val }))}
									sliderClassName="slider-food"
								/>
							))}

							{/* Radio & Checkbox 通用渲染 */}
							{qData.questions.filter(q => q.type === 'radio').map(q => (
								<RadioQuestion
									key={q.id}
									question={q.label}
									options={q.options}
									field={q.field}
									value={answers[q.field]}
									onChange={val => setAnswers(a => ({ ...a, [q.field]: val }))}
								/>
							))}
							{qData.questions.filter(q => q.type === 'checkbox').map(q => (
								<CheckboxQuestion
									key={q.id}
									question={q.label}
									options={q.options}
									field={q.field}
									value={answers[q.field]}
									onChange={(id, checked) => {
										setAnswers(prev => {
											const set = new Set(prev[q.field]);
											checked ? set.add(id) : set.delete(id);
											return { ...prev, [q.field]: Array.from(set) };
										});
									}}
								/>
							))}

							<button type="submit" className="btn btn-outline-dark p-2 mt-2  w-100 border-2" disabled={!isFormComplete}>送出</button>
						</form>
					</div>

				</div>
			</div>
			<div className="card-footer py-2" style={{ backgroundColor: '#EDBF8D' }}>
			</div>

		</div>

	)

}
