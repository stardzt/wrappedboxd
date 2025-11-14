import { useState } from 'react'
import './App.css'
import Papa from 'papaparse';
import TMDBPoster from './TMDBPoster';
import Modal from './Modal';
import MonthDropdown from './MonthDropdown';
import html2canvas from 'html2canvas-pro';
import JSZip from 'jszip';
import StarIcon from '@mui/icons-material/Star';
import StarHalfIcon from '@mui/icons-material/StarHalf';
import FavoriteIcon from '@mui/icons-material/Favorite';
function StarRating({ rating, max = 5 }) {
  const filledStars = Math.floor(rating);
  const hasHalfStar = rating - filledStars >= 0.5;
  return (
    <div className="flex justify-center text-green-600">
      {[...Array(filledStars)].map((_, i) => (
        <span key={i}>
          <StarIcon sx={{ fontSize: 12 }}/>
        </span>
      ))}
      {hasHalfStar && <span><StarHalfIcon sx={{ fontSize: 12 }}/></span>}

    </div>
  );
}  


function App() {
  const [data, setData] = useState([]);
  const [moviesByMonth, setMoviesByMonth] = useState({});
  const [selectedMonth, setSelectedMonth] = useState('');
  const [profileInfo, setProfileInfo] = useState({}); // new state for profile.csv
  const [isModalOpen, setModalOpen] = useState(false);
  const [showTitle, setShowTitle] = useState(true);
  const [showRating, setShowRating] = useState(true);
  const [showDate, setShowDate] = useState(true);
  const [showRewatch, setShowRewatch] = useState(true);
  const [showLikes, setShowLikes] = useState(true);
  const [showYear, setShowYear] = useState(true);
  const [showDropdown, setShowDropdown] = useState(false);
  const [selectedMovie, setSelectedMovie] = useState(null);


  const handleZipUpload = async (e) => {
    const file = e.target.files[0];
    if (!file || !file.name.endsWith('.zip')) {
      alert('Please upload a valid Letterboxd .zip file.');
      return;
    }

    try {
      const zip = await JSZip.loadAsync(file);

    // === Handle diary.csv ===
    if (zip.file('diary.csv')) {
      const diaryText = await zip.file('diary.csv').async('string');
      const parsedDiary = Papa.parse(diaryText, {
        header: true,
        skipEmptyLines: true,
      });

      const movies = parsedDiary.data;

      // === Handle likes/films.csv BEFORE grouping ===
      let likedTitles = new Set();

      if (zip.file('likes/films.csv')) {
        const likesText = await zip.file('likes/films.csv').async('string');
        const parsedLikes = Papa.parse(likesText, {
          header: true,
          skipEmptyLines: true,
        });

        likedTitles = new Set(
          parsedLikes.data.map((like) => like['Name']?.trim().toLowerCase())
        );
      }

      // Add a `liked` flag to each diary movie
      const enrichedMovies = movies.map((movie) => ({
        ...movie,
        liked: likedTitles.has(movie['Name']?.trim().toLowerCase()),
      }));

      setData(enrichedMovies);

      const grouped = {};
      enrichedMovies.forEach((movie) => {
        const date = new Date(movie['Watched Date']);
        if (isNaN(date)) return;

        const key = date.toLocaleString('default', { month: 'long', year: 'numeric' });
        if (!grouped[key]) grouped[key] = [];
        grouped[key].push(movie);
      });

      setMoviesByMonth(grouped);

      const months = Object.keys(grouped).sort((a, b) => new Date(b) - new Date(a));
      if (months.length > 0) setSelectedMonth(months[0]);
    }

      // === Handle profile.csv ===
      if (zip.file('profile.csv')) {
        const profileText = await zip.file('profile.csv').async('string');
        const parsedProfile = Papa.parse(profileText, {
          header: true,
          skipEmptyLines: true,
        });

        if (parsedProfile.data.length > 0) {
          setProfileInfo(parsedProfile.data[0]); // Usually only 1 row
        }
      }

    } catch (err) {
      console.error('Error handling ZIP:', err);
      alert('Failed to read the ZIP file.');
    }
  };

  
const handleDownload = async () => {
  const node = document.getElementById('capture');
  if (!node) {
    console.error("Element #capture not found.");
    return;
  }

  try {
    const canvas = await html2canvas(node, {
      backgroundColor: '#14171C', // Tailwind dark bg fallback
      useCORS: true,
      scale: 2 // Higher resolution
    });
    const dataUrl = canvas.toDataURL('image/png');

    const link = document.createElement('a');
    link.href = dataUrl;
    link.download = `Wrappedboxd_${selectedMonth?.replace(' ', '_') || 'download'}.png`;
    link.click();
  } catch (error) {
    console.error('Export failed:', error);
  }
};

  return (
    <div>
      <h3 className='text-slate-300 font-bold text-3xl mt-10 tracking-wider uppercase'>Wrappedboxd<span className='px-1 text-sm'>v1.2</span></h3>
      <h3 className='mt-2 text-slate-300'>Wrap your Letterboxd monthly watches</h3>
      <h3 className='mt-2 text-gray-500 text-xs uppercase tracking-widest mb-10'>by <a target="_blank" rel="noopener noreferrer" href="https://letterboxd.com/stardzt/">@dreamydxte</a></h3>
      {data.length === 0 && (
      <div>
        <p className='mb-4'>Add your Letterboxd's account data to get started. <a onClick={(e) => { e.preventDefault(); setModalOpen(true); }}className='text-sm'>(How to get your data)</a></p>
        <Modal isOpen={isModalOpen} onClose={() => setModalOpen(false)}>
          <ul className="list-decimal text-start text-sm mx-5">
              <li className='pl-2'>Navigate through your Letterboxd <a target="_blank" rel="noopener noreferrer" href='https://letterboxd.com/settings/data/'>account settings</a>.</li>
              <li className='pl-2'>Export your data inside the 'data' tab.</li>
              <li className='pl-2'>Add the downloaded <code>.zip</code> file into Wrappedboxd.</li>
          </ul>
        </Modal>
      </div>
      )}
      <div className="mb-15 flex flex-wrap gap-2 items-center justify-center text-center">
        <div>
          <label htmlFor="file-upload" className="inline-flex items-center gap-1 px-2 py-1 bg-green-600 hover:bg-green-700 cursor-pointer text-slate-200 tracking-widest text-sm uppercase shadow-sm font-bold rounded-sm transition">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
            </svg>
            Add file
          </label>
          <input type="file" id="file-upload" accept='.zip' className="hidden" onChange={handleZipUpload}/> 
        </div>

        {selectedMonth && (
          <button
            onClick={handleDownload}
            className="flex flex-wrap gap-2 items-center justify-center text-center px-2 py-1 text-sm font-bold tracking-widest uppercase bg-slate-600 hover:bg-slate-700 text-gray-300 rounded-sm shadow-sm cursor-pointer"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 0 0 1.5-1.5V6a1.5 1.5 0 0 0-1.5-1.5H3.75A1.5 1.5 0 0 0 2.25 6v12a1.5 1.5 0 0 0 1.5 1.5Zm10.5-11.25h.008v.008h-.008V8.25Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
            </svg>

            Export
          </button>
        )}
      </div>

      <div className="flex flex-wrap gap-2 items-center justify-end text-center">
        {Object.keys(moviesByMonth).length > 0 && (
          <MonthDropdown
            moviesByMonth={moviesByMonth}
            selectedMonth={selectedMonth}
            setSelectedMonth={setSelectedMonth}
          />
        )}

        {selectedMonth && (
        <div className="relative inline-block text-left">
          <button
            className="flex items-center cursor-pointer px-3 py-1 rounded-sm text-xs font-bold tracking-widest uppercase text-gray-300"
            onClick={() => setShowDropdown(prev => !prev)}
          >
            Show/Hide
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="size-5 ml-1">
              <path fillRule="evenodd" d="M5.22 8.22a.75.75 0 0 1 1.06 0L10 11.94l3.72-3.72a.75.75 0 1 1 1.06 1.06l-4.25 4.25a.75.75 0 0 1-1.06 0L5.22 9.28a.75.75 0 0 1 0-1.06Z" clipRule="evenodd" />
            </svg>
          </button>

          {showDropdown && (
            <div className="absolute left-0 z-60 mt-2 w-25 origin-top-left rounded-sm bg-slate-700 p-3 shadow-md">
              <div className="flex flex-col gap-2 text-xs text-gray-300">
                <label className="flex items-center">
                  <input className="mr-2" type="checkbox" checked={showTitle} onChange={() => setShowTitle(!showTitle)} />
                  Title
                </label>
                <label className="flex items-center">
                  <input className="mr-2" type="checkbox" checked={showYear} onChange={() => setShowYear(!showYear)} />
                  Release Year
                </label>
                <label className="flex items-center">
                  <input className="mr-2" type="checkbox" checked={showRating} onChange={() => setShowRating(!showRating)} />
                  Rating
                </label>
                <label className="flex items-center">
                  <input className="mr-2" type="checkbox" checked={showRewatch} onChange={() => setShowRewatch(!showRewatch)} />
                  Rewatch
                </label>
                <label className="flex items-center">
                  <input className="mr-2" type="checkbox" checked={showLikes} onChange={() => setShowLikes(!showLikes)} />
                  Like
                </label>
                <label className="flex items-center">
                  <input className="mr-2" type="checkbox" checked={showDate} onChange={() => setShowDate(!showDate)} />
                  Watched Date
                </label>
              </div>
            </div>
          )}
        </div>
        )}
      </div>

      {selectedMonth && (
        <div className='md:ring-1 w-xl rounded-sm mb-4 ring-slate-400/25'>
        <div id="capture" className='p-4 lg:w-[2xl]'>
          <div className="flex">
            <div>
              <div className="text-start text-xs text-gray-500 uppercase tracking-wider">{(profileInfo['Given Name'] || profileInfo['Username'])}'s  Films</div>
              <h2 className="text-start text-2xl mb-2 text-slate-300 font-bold uppercase tracking-wider">{selectedMonth}</h2>
            </div>
            <p className="text-xs text-gray-500 ml-auto mt-6 uppercase tracking-wider">{moviesByMonth[selectedMonth]?.length} {moviesByMonth[selectedMonth]?.length === 1 ? 'film' : 'films'}</p>
          </div>
          <div className="border-b border-gray-700 mb-4"></div>        
          <div
            className={`w-full grid gap-1 ${
              (moviesByMonth[selectedMonth]?.length || 0) > 12
                ? 'grid-cols-6'
                : 'grid-cols-4'
            }`}
          >
              {moviesByMonth[selectedMonth]?.map((movie, idx) => (
              <div key={idx}>
                <div className='relative'>
                  {showDate && (
                    <div className="absolute font-bold text-gray-300 text-[8px] tracking-widest w-5 h-4 flex items-center justify-center z-1">
                      {new Date(movie['Watched Date']).getDate()}
                    </div>
                  )}
                <div onClick={() => setSelectedMovie(movie)} className="cursor-pointer">
                  <TMDBPoster 
                    title={movie['Name']} 
                    year={movie['Year']?.slice(0, 4)}
                  />
                </div>
                </div>
                {showTitle && (
                  <p className="text-slate-300 text-[8px] mt-1 font-semibold uppercase tracking-wider">
                    {(movie['Name']?.length > (showYear ? 100 : 100)
                      ? movie['Name'].slice(0, showYear ? 100 : 100) + '...'
                      : movie['Name'])}
                    {showYear && (
                      <span className='text-gray-500'> {movie['Year']}</span>
                    )}
                  </p>
                )}
                <div className="flex items-center justify-center -mt-2">
                  {showRating && (
                    <div>
                      {movie.Rating ? (
                        <StarRating rating={parseFloat(movie.Rating)} />
                      ) : (
                        <p className="text-[6px] sm:text-[10px] text-gray-400">No rating</p>
                      )}
                    </div>
                  )}
                  {showLikes && movie.liked && (
                    <img src="/heart.png" alt="Rewatched" title="Rewatched" className="w-[8px] h-[8px] mt-[5px] sm:ml-1 inline-block ml-1"
                    />
                  )}
                  {showRewatch && movie['Rewatch'] && (
                    <img src="/replay.png" alt="Rewatched" title="Rewatched" className="w-[8px] h-[8px] mt-1 sm:ml-1 inline-block ml-1"
                    />
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
        </div>
      )}
    </div>
  )
}

export default App
