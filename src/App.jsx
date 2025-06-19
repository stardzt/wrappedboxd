import { useState } from 'react'
import './App.css'
import Papa from 'papaparse';
import TMDBPoster from './TMDBPoster';
import Modal from './Modal';
import html2canvas from 'html2canvas-pro';
import JSZip from 'jszip';

function StarRating({ rating, max = 5 }) {
  const filledStars = Math.floor(rating);
  const hasHalfStar = rating - filledStars >= 0.5;
  return (
    <div className="flex justify-center text-green-600 text-[12px] sm:text-lg">
      {[...Array(filledStars)].map((_, i) => (
        <span key={i}>★</span>
      ))}
      {hasHalfStar && <span>½</span>}

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
    <>
      <h2 className='text-slate-300 font-bold text-4xl uppercase'>Wrappedboxd<span className='px-1 text-sm'>v1.0</span></h2>
      <h2 className='mt-2 text-slate-300 uppercase'>View your Letterboxd monthly watches.</h2>
      <h3 className='mt-2 text-slate-500 mb-30'>by @dreamydxte</h3>
      {data.length === 0 && (
      <div>
        <p className='mb-4'>Add your Letterboxd's account data to get started. <a onClick={(e) => { e.preventDefault(); setModalOpen(true); }}className='text-sm'>(How to get your data)</a></p>
        <Modal isOpen={isModalOpen} onClose={() => setModalOpen(false)}>
          <ul className="list-decimal text-start text-sm mx-5">
              <li className='pl-2'>Navigate through your Letterboxd <a target="_blank" rel="noopener noreferrer" href='https://letterboxd.com/settings/data/'>account settings</a>.</li>
              <li className='pl-2'>Inside the 'data' tab, export your data.</li>
              <li className='pl-2'>Add the downloaded <code>.zip</code> file into Wrappedboxd.</li>
          </ul>
        </Modal>
      </div>
      )}
      <div className="flex flex-wrap gap-2 items-center justify-center text-center">
        <div>
          <label htmlFor="file-upload" className="inline-flex items-center gap-1 px-2 py-1 mb-8 bg-green-600 hover:bg-green-700 cursor-pointer text-slate-200 tracking-widest text-sm uppercase shadow-sm font-bold rounded-sm transition">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
            </svg>
            Add file
          </label>
          <input type="file" id="file-upload" accept='.zip' className="hidden" onChange={handleZipUpload}/> 
        </div>

        {Object.keys(moviesByMonth).length > 0 && (
          <div className="mb-8">
            <select
              className="font-bold text-sm uppercase p-1 bg-slate-600 hover:bg-slate-700 text-gray-300 tracking-widest rounded cursor-pointer shadow-sm"
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
            >
              {Object.keys(moviesByMonth).map((month) => (
                <option key={month} value={month} className="bg-slate-600 text-gray-300 capitalize">
                  {month}
                </option>
              ))}
            </select>
          </div>
        )}
        
        {selectedMonth && (
          <button
            onClick={handleDownload}
            className="flex flex-wrap gap-2 items-center justify-center text-center px-3 py-1 mb-8 text-sm font-bold tracking-widest uppercase bg-slate-600 hover:bg-slate-700 text-gray-300 rounded-sm shadow-sm cursor-pointer"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 0 0 1.5-1.5V6a1.5 1.5 0 0 0-1.5-1.5H3.75A1.5 1.5 0 0 0 2.25 6v12a1.5 1.5 0 0 0 1.5 1.5Zm10.5-11.25h.008v.008h-.008V8.25Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
            </svg>

            Export
          </button>
        )}
        
      </div>
      {selectedMonth && (
      <div>
        <label className='mr-4 text-sm text-gray-300'>
          <input className='mr-1' type="checkbox" checked={showTitle} onChange={() => setShowTitle(!showTitle)} />
          Show title
        </label>
        <label className='mr-4 text-sm text-gray-300'>
          <input className='mr-1' type="checkbox" checked={showRating} onChange={() => setShowRating(!showRating)} />
          Show rating
        </label>
        <label className='mr-4 text-sm text-gray-300'>
          <input className='mr-1' type="checkbox" checked={showRewatch} onChange={() => setShowRewatch(!showRewatch)}/>
          Show rewatch
        </label>
        <label className='mr-4 text-sm text-gray-300'>
          <input className='mr-1' type="checkbox" checked={showLikes} onChange={() => setShowLikes(!showLikes)}/>
          Show like
        </label> 
        <label className='mr-4 text-sm text-gray-300'>
          <input className='mr-1' type="checkbox" checked={showDate} onChange={() => setShowDate(!showDate)} />
          Show date
        </label>
      </div>
      )}
      {selectedMonth && (
        <div id="capture" className='p-4 lg:w-2xl'>
          <div className="flex">
            <div>
              <div className="text-start text-xs md:text-sm text-gray-600 uppercase tracking-wider">{(profileInfo['Given Name'] || profileInfo['Username'])}'s</div>
              <h2 className="text-start text-xl md:text-2xl mb-2 text-slate-300 font-bold uppercase tracking-wider">{selectedMonth}  Films</h2>
            </div>
            <p className="text-xs md:text-sm text-gray-600 ml-auto mt-6">{moviesByMonth[selectedMonth]?.length} {moviesByMonth[selectedMonth]?.length === 1 ? 'film' : 'films'}</p>
          </div>
          <div className="border-b border-gray-700 mb-5"></div>        
          <div className="max-w-2xl grid grid-cols-4 gap-1.5 md:gap-2 lg:gap-2 xl:gap-2">
            {moviesByMonth[selectedMonth]?.map((movie, idx) => (
              <div key={idx} className="rounded shadow">
                <div className='relative'>
                  {showDate && (
                    <div className="absolute bg-slate-600 font-bold text-gray-300 text-[10px] w-6 h-5 flex items-center justify-center rounded-tl-sm rounded-br-sm z-50">
                      {new Date(movie['Watched Date']).getDate()}
                    </div>
                  )}
                  <a href={movie['Letterboxd URI']} target="_blank" rel="noopener noreferrer">
                    <TMDBPoster 
                      title ={movie['Name']} year={movie['Year']?.slice(0, 4)}
                    />
                  </a>
                </div>
                {showTitle && (
                  <p className="text-slate-300 text-[8px] sm:text-xs font-semibold line-clamp-1 uppercase tracking-wider">{movie['Name']}</p>
                )}
                <div className="flex items-center justify-center">
                  {showRating && (
                    <p>
                      {movie.Rating ? (
                        <StarRating rating={parseFloat(movie.Rating)} />
                      ) : (
                        <p className="text-sm text-gray-400">No rating</p>
                      )}
                    </p>
                  )}
                  {showRewatch && movie['Rewatch'] && (
                    <img
                      src="public/replay.png"
                      alt="Rewatched"
                      title="Rewatched"
                      className="w-2 h-2 sm:w-3 sm:h-3 inline-block mt-[4px] ml-1"
                    />
                  )}
                  {showLikes && movie.liked && (
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-2 sm:size-4 text-orange-500 mt-[4px] ml-1">
                      <path d="m11.645 20.91-.007-.003-.022-.012a15.247 15.247 0 0 1-.383-.218 25.18 25.18 0 0 1-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0 1 12 5.052 5.5 5.5 0 0 1 16.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 0 1-4.244 3.17 15.247 15.247 0 0 1-.383.219l-.022.012-.007.004-.003.001a.752.752 0 0 1-.704 0l-.003-.001Z" />
                    </svg>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </>
  )
}

export default App
