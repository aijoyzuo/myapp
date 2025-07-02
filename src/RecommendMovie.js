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
		if (!answers) return;

		const url = `${process.env.PUBLIC_URL}/data/movieList.json`;

		fetch(url)
			.then(r => {
				if (!r.ok) throw new Error(`HTTP ${r.status}`);
				return r.json();
			})
			.then(({ data }) => {
				const scoredMovies = data.map(movie => {
					let score = 0;

					// 片長：只要在 ±30 分鐘以內就算
					if (Math.abs(movie.duration - answers.duration) <= 30) score++;

					// 觀看對象（字串包含）
					if (movie.person.includes(answers.person)) score++;

					// 分級布林判斷
					if (movie.rating === (answers.rating === "high")) score++;

					// 語言：只要勾選的語言中有一種 match 就加分
					if (
						answers.language.some(lang =>
							(lang === "western" && movie.language === "歐美") ||
							(lang === "japanese" && movie.language === "日文")
						)
					) score++;

					// 心情：使用者選的 mood 包含這部電影的 mood 就加分
					if (answers.mood.includes(movie.mood)) score++;

					return { ...movie, score };
				});

				// 篩選得分 > 0 的，取前 3 名
				const topMovies = scoredMovies
					.filter(m => m.score > 0)
					.sort((a, b) => b.score - a.score)
					.slice(0, 3);

				setRecommended(topMovies);
			})
			.catch(err => {
				console.error("載入 movieList.json 失敗 👉", err);
			});
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
