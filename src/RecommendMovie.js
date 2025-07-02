import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

export default function RecommendMovie() {
	const location = useLocation();
	const navigate = useNavigate();

	const { answers } = location.state || {};
	const [allMovies, setAllMovies] = useState([]);
	const [recommended, setRecommended] = useState([]);

	const url = `${process.env.PUBLIC_URL}/data/moviedata.json`;

	useEffect(() => {
		if (!answers) {
			navigate('/quiz/movie');
			return;
		}

		fetch(url)
			.then(res => res.json())
			.then(({ data }) => {
				setAllMovies(data);

				const result = data.filter(movie => {
					const matchDuration = movie.duration === answers.duration;
					const matchPerson = movie.person.includes(answers.person);
					const matchRating = movie.rating === (answers.rating === "high");

					const matchLanguage = answers.language.some(lang =>
						(lang === "western" && movie.language === "歐美") ||
						(lang === "japanese" && movie.language === "日文")
					);

					const matchMood = answers.mood.includes(movie.mood);

					return (
						matchDuration &&
						matchPerson &&
						matchRating &&
						matchLanguage &&
						matchMood
					);
				});

				setRecommended(result.slice(0, 3)); // 最多顯示三部推薦
			})
			.catch(err => console.error("讀取電影資料失敗", err));
	}, [answers]);

	if (!answers) return null;

	return (
		<div className="container py-4">
			<h2 className="text-center mb-4">🎥 為你推薦的電影</h2>

			<div className="row">
				{recommended.map(movie => (
					<div className="col-md-4 mb-4" key={movie.id}>
						<div className="card h-100">
							<img src={movie.image} className="card-img-top" alt={movie.title} />
							<div className="card-body">
								<h5 className="card-title">{movie.title}</h5>
								<p className="card-text">{movie.description}</p>
								<p className="card-text"><small className="text-muted">語言：{movie.language}</small></p>
							</div>
						</div>
					</div>
				))}
			</div>

			{recommended.length === 0 && (
				<div className="alert alert-warning text-center mt-4">
					很抱歉，沒有符合條件的電影 😢
				</div>
			)}
		</div>
	);
}
