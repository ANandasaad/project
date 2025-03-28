import React, { useState } from "react";
import { Search, Film } from "lucide-react";

function App() {
  const [searchTerm, setSearchTerm] = useState("");
  const [movies, setMovies] = useState([]);
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const API_KEY = "a8c08729"; // <--- Better to store it once

  const searchMovies = async (e) => {
    e.preventDefault();
    if (!searchTerm) return;

    setLoading(true);
    setError("");
    setSelectedMovie(null);

    try {
      const response = await fetch(
        `https://www.omdbapi.com/?s=${searchTerm}&apikey=${API_KEY}`
      );
      const data = await response.json();
      console.log(data);

      if (data.Response === "True") {
        setMovies(data.Search);
      } else {
        setError(data.Error);
        setMovies([]);
      }
    } catch (err) {
      setError("Failed to fetch movies");
      setMovies([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchMovieDetails = async (imdbID) => {
    setLoading(true);
    try {
      const response = await fetch(
        `https://www.omdbapi.com/?i=${imdbID}&apikey=${API_KEY}` // ✅ fixed
      );
      const data = await response.json();

      if (data.Response === "True") {
        setSelectedMovie(data);
      }
    } catch (err) {
      setError("Failed to fetch movie details");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col items-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-6 flex items-center gap-2">
            <Film className="w-8 h-8" />
            Movie Search
          </h1>

          <form onSubmit={searchMovies} className="w-full max-w-xl">
            <div className="relative">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search for movies..."
                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 pl-10"
              />
              <Search className="absolute left-3 top-2.5 text-gray-400 w-5 h-5" />
            </div>
          </form>
        </div>

        {loading && (
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
          </div>
        )}

        {error && <div className="text-red-500 text-center mb-4">{error}</div>}

        {selectedMovie ? (
          <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
            <button
              onClick={() => setSelectedMovie(null)}
              className="mb-4 text-blue-500 hover:text-blue-700"
            >
              ← Back to results
            </button>
            <div className="flex flex-col md:flex-row gap-8">
              <img
                src={
                  selectedMovie.Poster !== "N/A"
                    ? selectedMovie.Poster
                    : "https://via.placeholder.com/300x450?text=No+Poster"
                }
                alt={selectedMovie.Title}
                className="w-full md:w-80 rounded-lg shadow-md"
              />
              <div>
                <h2 className="text-3xl font-bold mb-4">
                  {selectedMovie.Title} ({selectedMovie.Year})
                </h2>
                <div className="space-y-4">
                  <p>
                    <span className="font-semibold">Rating:</span> ⭐{" "}
                    {selectedMovie.imdbRating}
                  </p>
                  <p>
                    <span className="font-semibold">Runtime:</span>{" "}
                    {selectedMovie.Runtime}
                  </p>
                  <p>
                    <span className="font-semibold">Genre:</span>{" "}
                    {selectedMovie.Genre}
                  </p>
                  <p>
                    <span className="font-semibold">Director:</span>{" "}
                    {selectedMovie.Director}
                  </p>
                  <p>
                    <span className="font-semibold">Cast:</span>{" "}
                    {selectedMovie.Actors}
                  </p>
                  <p>
                    <span className="font-semibold">Plot:</span>{" "}
                    {selectedMovie.Plot}
                  </p>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {movies.map((movie) => (
              <div
                key={movie.imdbID}
                className="bg-white rounded-lg shadow-lg overflow-hidden cursor-pointer transform transition-transform hover:scale-105"
                onClick={() => fetchMovieDetails(movie.imdbID)}
              >
                <img
                  src={
                    movie.Poster !== "N/A"
                      ? movie.Poster
                      : "https://via.placeholder.com/300x450?text=No+Poster"
                  }
                  alt={movie.Title}
                  className="w-full h-96 object-cover"
                />
                <div className="p-4">
                  <h3 className="text-lg font-semibold mb-1">{movie.Title}</h3>
                  <p className="text-gray-600">{movie.Year}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
