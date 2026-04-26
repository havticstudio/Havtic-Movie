import { Link } from "react-router-dom";

const Genres = () => {
  const genres = [
    { id: 28, name: "Action" },
    { id: 12, name: "Adventure" },
    { id: 16, name: "Animation" },
    { id: 35, name: "Comedy" },
    { id: 80, name: "Crime" },
    { id: 99, name: "Documentary" },
    { id: 18, name: "Drama" },
    { id: 10751, name: "Family" },
    { id: 14, name: "Fantasy" },
    { id: 36, name: "History" },
    { id: 27, name: "Horror" },
    { id: 10402, name: "Music" },
    { id: 9648, name: "Mystery" },
    { id: 10749, name: "Romance" },
    { id: 878, name: "Science Fiction" },
    { id: 10770, name: "TV Movie" },
    { id: 53, name: "Thriller" },
    { id: 10752, name: "War" },
    { id: 37, name: "Western" },
  ];

  return (
    <div className="p-6">
      <h2 className="text-3xl font-bold mb-4">Movie Genres</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {genres.map((genre) => (
          <Link
            key={genre.id}
            to={`/genre/${genre.id}`}
            className="bg-blue-500 text-white p-4 rounded hover:bg-blue-700 text-center"
          >
            {genre.name}
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Genres;
