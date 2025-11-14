import { useEffect, useRef, useState } from 'react';

function TMDBPoster({ title, year }) {
  const [posterUrl, setPosterUrl] = useState(null);
  const [customImages, setCustomImages] = useState({});
  const fileInputRef = useRef(null);
  const [alternatePosters, setAlternatePosters] = useState([]);
  const [showPosterPicker, setShowPosterPicker] = useState(false);
  const key = `${title}_${year}`; // unique identifier

  const TMDB_API_KEY = '2b2a7c69c8f7e4c992bd0f66bffbdf71';

  useEffect(() => {
    const fetchPosters = async () => {
      try {
        // Step 1: Search movie to get ID
        const searchRes = await fetch(
          `https://api.themoviedb.org/3/search/movie?api_key=${TMDB_API_KEY}&query=${encodeURIComponent(title)}${year ? `&year=${year}` : ''}`
        );
        const data = await res.json();
        if (data.results && data.results.length > 0 && data.results[0].poster_path) {
          const path = data.results[0].poster_path;
          const originalUrl = `image.tmdb.org/t/p/w500${path}`;
          const proxyUrl = `https://images.weserv.nl/?url=${encodeURIComponent(originalUrl)}`;
          setPosterUrl(proxyUrl);
        } else {
          setPosterUrl(null);
        }
      } catch (err) {
        console.error('TMDB fetch failed for:', title, err);
        setPosterUrl(null);
      }
    };

    if (!customImages[key]) {
      fetchPosters();
    } else {
      setPosterUrl(customImages[key]);
    }
  }, [title, year]);

  const handleUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const objectUrl = URL.createObjectURL(file);
      setCustomImages((prev) => {
        // cleanup old URL if already set
        if (prev[key]) URL.revokeObjectURL(prev[key]);
        return { ...prev, [key]: objectUrl };
      });
      e.target.value = '';
    }
  };

  const handleImageClick = () => {
    setShowPosterPicker(true);
  };

  const imageSrc = customImages[key] || posterUrl || `https://placehold.co/160x240/374151/FFF?text=${encodeURIComponent(title)}`;
  const hasCustom = !!customImages[key];

  return (
    <>
      <div className="relative group w-full max-w-[240px] aspect-[2/3] cursor-pointer">
        <img
          title={hasCustom ? 'Remove custom poster' : 'Change poster'}          
          src={imageSrc}
          alt={`${title} (${year})`}
          onClick={handleImageClick}
          className="w-full h-full object-cover transition-transform duration-300 border border-gray-700/25 shadow-md focus:outline-none focus:ring-2 focus:ring-green-600 ring-offset-0 rounded-xs sm:rounded-sm"
        />
        {showPosterPicker && (
          <div className="fixed inset-0 bg-black bg-opacity-70 z-50 flex items-center justify-center">
            <div className="bg-gray-900 p-4 rounded max-h-[90vh] overflow-y-auto max-w-3xl w-full">
              <div className="text-white text-lg font-semibold mb-4">Choose a Poster</div>
              <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3">
                {alternatePosters.map((url, idx) => (
                  <img
                    key={idx}
                    src={url}
                    alt={`Poster ${idx}`}
                    onClick={() => {
                      setPosterUrl(url);
                      setCustomImages((prev) => ({ ...prev, [key]: url }));
                      setShowPosterPicker(false);
                    }}
                    className="w-full cursor-pointer border border-gray-600 hover:opacity-80 transition rounded"
                  />
                ))}
              </div>
              <button
                onClick={() => setShowPosterPicker(false)}
                className="mt-4 px-4 py-2 bg-gray-700 text-white rounded hover:bg-gray-600"
              >
                Cancel
              </button>
            </div>
          </div>
        )}
        {/* Overlay */}
        <div className="z-10 absolute inset-0 bg-black opacity-0 group-hover:opacity-70 transition duration-300 rounded-xs sm:rounded-sm flex items-center justify-center pointer-events-none">
          <div className="pointer-events-auto">
            {hasCustom ? (
              // 🗑 Remove Icon
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
              </svg>
            ) : (
              // ✏️ Edit Icon
              <svg xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-6 h-6 text-white">
                <path strokeLinecap="round" strokeLinejoin="round"
                  d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
              </svg>
            )}
          </div>
        </div>
      </div>

      <input
        type="file"
        accept="image/*"
        ref={fileInputRef}
        onChange={handleUpload}
        className="hidden"
      />
    </>
  );
}

export default TMDBPoster;
