import './assets/all.scss';
import { Routes, Route } from "react-router-dom";
import HomePage from './HomePage';
import BookQuiz from './BookQuiz';
import MovieQuiz from './MovieQuiz';
import FoodQuiz from './FoodQuiz';
import RecommendMovie from './RecommendMovie';



function App() {
	return (
		<div className="App">
			<Routes>
				<Route path="/" element={<HomePage />} ></Route>
				<Route path="/quiz/book" element={<BookQuiz />} ></Route>
				<Route path="/quiz/movie" element={<MovieQuiz />} ></Route>
				<Route path="/quiz/food" element={<FoodQuiz />} ></Route>
				<Route path="/quiz/recommendMovie" element={<RecommendMovie />} ></Route>
			</Routes>
		</div>
	);
}

export default App;
