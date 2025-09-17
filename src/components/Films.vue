<template>
<div class="flex mx-auto justify-center gap-2 max-w-xs md:max-w-lg">
  <input type="file" accept=".zip" @change="handleFileUpload" class="file-input file-input-primary file-input-sm text-base-content" />
  <!-- Export -->
  <div v-if="Object.keys(groupedFilms).length > 0" tabindex="0" role="button" @click="handleDownload" id="download-btn" class="btn btn-sm rounded-sm btn-primary shadow-sm uppercase font-bold tracking-widest">
    <span>
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="size-4">
        <path stroke-linecap="round" stroke-linejoin="round" d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 0 0 1.5-1.5V6a1.5 1.5 0 0 0-1.5-1.5H3.75A1.5 1.5 0 0 0 2.25 6v12a1.5 1.5 0 0 0 1.5 1.5Zm10.5-11.25h.008v.008h-.008V8.25Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
      </svg>
    </span>Save
  </div>
</div>
    
<div class="flex mx-auto justify-center items-center gap-2 w-auto max-w-xs md:max-w-lg">
  <!-- Month Select -->
  <div v-if="Object.keys(groupedFilms).length > 0" class="w-45">
    <select 
      id="month-select" 
      v-model="selectedMonth" 
      class="select select-sm bg-base-100 border-base-content/20 text-base-content text-sm rounded-sm uppercase font-bold tracking-widest max-w-xs"
    >
      <option class="capitalize text-xs bg-base-100 text-base-content font-semibold"
        v-for="monthYear in Object.keys(groupedFilms).sort((a, b) => new Date(b) - new Date(a))" 
        :key="monthYear" 
        :value="monthYear"
      >
        {{ monthYear }}
      </option>
    </select>
  </div>

  <!-- Theme Select -->
  <div v-if="Object.keys(groupedFilms).length > 0" class="dropdown py-4">
    <div tabindex="0" role="button" class="btn bg-base-100 border-base-content/20 rounded-sm btn-sm uppercase font-bold tracking-widest">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="size-3">
        <path fill-rule="evenodd" d="M20.599 1.5c-.376 0-.743.111-1.055.32l-5.08 3.385a18.747 18.747 0 0 0-3.471 2.987 10.04 10.04 0 0 1 4.815 4.815 18.748 18.748 0 0 0 2.987-3.472l3.386-5.079A1.902 1.902 0 0 0 20.599 1.5Zm-8.3 14.025a18.76 18.76 0 0 0 1.896-1.207 8.026 8.026 0 0 0-4.513-4.513A18.75 18.75 0 0 0 8.475 11.7l-.278.5a5.26 5.26 0 0 1 3.601 3.602l.502-.278ZM6.75 13.5A3.75 3.75 0 0 0 3 17.25a1.5 1.5 0 0 1-1.601 1.497.75.75 0 0 0-.7 1.123 5.25 5.25 0 0 0 9.8-2.62 3.75 3.75 0 0 0-3.75-3.75Z" clip-rule="evenodd" />
      </svg> Theme
      <svg width="12px" height="12px" class="inline-block h-2 w-2 fill-current opacity-60" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 2048 2048"><path d="M1799 349l242 241-1017 1017L7 590l242-241 775 775 775-775z"></path></svg>
    </div>
    <ul tabindex="0" class="dropdown-content text-base-content bg-base-100 border border-neutral/30 rounded-sm z-1 w-52 p-2 shadow-2xl">
      <li>
        <input
          type="radio"
          name="theme-dropdown"
          class="theme-controller w-full btn btn-sm btn-block btn-ghost justify-start rounded-sm"
          aria-label="Default"
          value="default" />
      </li>
      <li>
        <input
          type="radio"
          name="theme-dropdown"
          class="theme-controller w-full btn btn-sm btn-block btn-ghost justify-start rounded-sm"
          aria-label="Caramellatte"
          value="caramellatte" />
      </li>
      <li>
        <input
          type="radio"
          name="theme-dropdown"
          class="theme-controller w-full btn btn-sm btn-block btn-ghost justify-start rounded-sm"
          aria-label="Autumn"
          value="autumn" />
      </li>
      <li>
        <input
          type="radio"
          name="theme-dropdown"
          class="theme-controller w-full btn btn-sm btn-block btn-ghost justify-start rounded-sm"
          aria-label="Valentine"
          value="valentine" />
      </li>
      <li>
        <input
          type="radio"
          name="theme-dropdown"
          class="theme-controller w-full btn btn-sm btn-block btn-ghost justify-start rounded-sm"
          aria-label="Lemonade"
          value="lemonade" />
      </li>
      <li>
        <input
          type="radio"
          name="theme-dropdown"
          class="theme-controller w-full btn btn-sm btn-block btn-ghost justify-start rounded-sm"
          aria-label="Resistance"
          value="resistance"></input>
      </li>
        <li>
        <input
          type="radio"
          name="theme-dropdown"
          class="theme-controller w-full btn btn-sm btn-block btn-ghost justify-start rounded-sm"
          aria-label="Dim"
          value="dim" />
      </li>
      <li>
        <input
          type="radio"
          name="theme-dropdown"
          class="theme-controller w-full btn btn-sm btn-block btn-ghost justify-start rounded-sm"
          aria-label="Forest"
          value="forest" />
      </li>
      <li>
        <input
          type="radio"
          name="theme-dropdown"
          class="theme-controller w-full btn btn-sm btn-block btn-ghost justify-start rounded-sm"
          aria-label="Sunset"
          value="sunset" />
      </li>
      <li>
        <input
          type="radio"
          name="theme-dropdown"
          class="theme-controller w-full btn btn-sm btn-block btn-ghost justify-start rounded-sm"
          aria-label="Synthwave"
          value="synthwave" />
      </li>
    </ul>
  </div>
  
  <!-- Options -->
  <div v-if="parsedCsvData.length > 0" class="dropdown">
    <div tabindex="0" role="button" class="btn btn-sm rounded-sm border-base-content/20 uppercase tracking-widest font-bold bg-base-100">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="size-4">
        <path d="M18.75 12.75h1.5a.75.75 0 0 0 0-1.5h-1.5a.75.75 0 0 0 0 1.5ZM12 6a.75.75 0 0 1 .75-.75h7.5a.75.75 0 0 1 0 1.5h-7.5A.75.75 0 0 1 12 6ZM12 18a.75.75 0 0 1 .75-.75h7.5a.75.75 0 0 1 0 1.5h-7.5A.75.75 0 0 1 12 18ZM3.75 6.75h1.5a.75.75 0 1 0 0-1.5h-1.5a.75.75 0 0 0 0 1.5ZM5.25 18.75h-1.5a.75.75 0 0 1 0-1.5h1.5a.75.75 0 0 1 0 1.5ZM3 12a.75.75 0 0 1 .75-.75h7.5a.75.75 0 0 1 0 1.5h-7.5A.75.75 0 0 1 3 12ZM9 3.75a2.25 2.25 0 1 0 0 4.5 2.25 2.25 0 0 0 0-4.5ZM12.75 12a2.25 2.25 0 1 1 4.5 0 2.25 2.25 0 0 1-4.5 0ZM9 15.75a2.25 2.25 0 1 0 0 4.5 2.25 2.25 0 0 0 0-4.5Z" />
      </svg> Options
      <svg width="12px" height="12px" class="inline-block h-2 w-2 fill-current opacity-60" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 2048 2048"><path d="M1799 349l242 241-1017 1017L7 590l242-241 775 775 775-775z"></path></svg>
    </div>
    <ul tabindex="0" class="dropdown-content menu text-xs text-base-content font-semibold bg-base-100 rounded-sm z-1 w-52 p-2 shadow-sm">
      <li>
        <label class="label">
          <input type="checkbox" checked="checked" class="checkbox checkbox-xs" id="showTitleYear" v-model="showTitleYear"/>
          Show title and year
        </label>
      </li>
      <li>
        <label class="label">
          <input type="checkbox" checked="checked" class="checkbox checkbox-xs" id="showRating" v-model="showRating"/>
          Show rating
        </label>
      </li>
      <li>
        <label class="label">
          <input type="checkbox" checked="checked" class="checkbox checkbox-xs" id="showDate" v-model="showDate"/>
          Show date
        </label>
      </li>
    </ul>
  </div>

</div>

<!-- Films -->
<div class="flex mx-auto ring-1 bg-base-100 ring-base-content/20 w-auto max-w-xs md:max-w-lg" v-if="parsedCsvData.length > 0">
  <div ref="captureRef" id="capture" class="bg-base-100">
      <!-- Head -->
      <div>
          <div class="flex text-[7px] md:text-xs text-base-content/60 tracking-widest -mb-5 md:-mb-4 mt-4 px-4">
              {{ profileInfo['Given Name'] || profileInfo['Username'] }}'s Films
          </div>
          <div class="flex justify-between mx-4 py-2 border-b border-base-content/20">
              <h1 class="text-lg md:text-3xl mt-2 text-base-content tracking-wide uppercase font-bold">{{ selectedMonth }}</h1>
              <span class="text-[7px] md:text-xs mb-1 text-base-content/60 tracking-widest my-auto">{{ groupedFilms[selectedMonth].length }} {{ groupedFilms[selectedMonth].length > 1 ? 'films' : 'film' }}</span>
          </div>
      </div>
      <!-- Grid -->
      <div class="grid gap-1 p-4" :class="groupedFilms[selectedMonth].length > 12 ? 'grid-cols-6' : 'grid-cols-4'">
          <div v-for="film in groupedFilms[selectedMonth]" :key="film.Name">
              <!-- Poster -->
              <div class="relative aspect-2/3">
                <div v-if="showDate" class="z-50 absolute text-[10px] text-neutral-content text-shadow-xs shadow-black font-bold p-1">{{ film['Watched Date'].slice(8, 10) }}</div>
                <div class="skeleton w-full h-full absolute inset-0 rounded-sm"></div>
                <img
                  @load="film.isPosterLoaded = true" @click="openPosterModal(film)" class="relative w-full h-full object-cover border-1 border-base-content/20 hover:ring-1 hover:ring-primary hover:border-primary rounded-sm cursor-pointer transition-opacity duration-300"
                  :class="{ 'opacity-0': !film.isPosterLoaded }"
                  :src="film.posterUrl"
                />
              </div>
              <!-- Title -->
              <div v-if="showTitleYear" class="mt-[2px] text-[5px] md:text-[8px] text-base-content uppercase font-semibold tracking-wider"><a class="hover:text-primary transition duration-150 ease-in-out" :href="film['Letterboxd URI']" target="_blank">{{ film.Name }}</a> <span class="opacity-60">{{ film.Year }}</span></div>
              <!-- Rating, Like, Rewatch -->
              <div v-if="showRating" class="text-sm text-primary -mt-[8px] md:-mt-1">
                <div class="material-icons inline-block" v-html="getStarIcons(film.Rating).join('')"></div>
                <span v-if="film.isLiked" class="material-icons text-secondary mr-[2px] ml-[2px]">&#xe87d;</span>
                <span v-if="film.Rewatch === 'Yes'" class="material-icons text-base-content/70">&#xe86a;</span>           
              </div>
          </div>
      </div>
  </div>
</div>
<!-- Modal -->
<dialog id="my_modal_2" ref="modalRef" class="modal">
    <div  class="modal-box rounded-sm">
        <form method="dialog">
            <button class="btn btn-sm btn-circle text-base-content btn-ghost absolute right-2 top-2">✕</button>
        </form>
        <h3 class="text-md text-base-content tracking-wider">Change Poster</h3>
        <div class="grid grid-cols-4 gap-1 p-4">
            <div v-for="(poster, index) in paginatedPosters" :key="index" class="relative aspect-2/3">
                <div class="skeleton w-full h-full absolute inset-0 rounded-sm"></div>
                <img @load="poster.isLoaded = true" :class="{ 'opacity-0': !poster.isLoaded }"  class="relative w-full h-full object-cover border-1 border-base-content/20 hover:border-primary hover:ring-1 hover:ring-primary rounded-sm cursor-pointer transition-opacity duration-300" :src="poster.url" @click="selectAlternatePoster(poster.url)"></img>
            </div>
        </div>
        <div v-if="totalPages > 1" class="modal-action">
          <div class="join">
            <button 
              class="join-item btn rounded-l-sm" 
              @click="currentPage--" 
              :disabled="currentPage === 1"
            >
              «
            </button>
            <button class="join-item btn">
              Page {{ currentPage }} of {{ totalPages }}
            </button>
            <button 
              class="join-item btn rounded-r-sm" 
              @click="currentPage++" 
              :disabled="currentPage === totalPages"
            >
              »
            </button>
          </div>
        </div>
    </div>
    <form method="dialog" class="modal-backdrop">
        <button>close</button>
    </form>
</dialog>
</template>

<script setup>
import { ref, watch, computed } from 'vue';
import Papa from 'papaparse';
import JSZip from 'jszip';
import html2canvas from 'html2canvas-pro';

const showTitleYear = ref(null);
const showRating = ref(null);
const showDate = ref(null);

// Pagination
const currentPage = ref(1);
const postersPerPage = ref(16); // Show 8 posters per page
const totalPages = computed(() => {
  if (postersForModal.value.length === 0) return 1;
  return Math.ceil(postersForModal.value.length / postersPerPage.value);
});

const paginatedPosters = computed(() => {
  const start = (currentPage.value - 1) * postersPerPage.value;
  const end = start + postersPerPage.value;
  return postersForModal.value.slice(start, end);
});

// Modal
const modalRef = ref(null); // A ref to hold the <dialog> element
const postersForModal = ref([]);
const filmToUpdate = ref(null); // Keep track of which film is being edited
const openPosterModal = (film) => {
  if (film.alternatePosters && film.alternatePosters.length > 0) {
    currentPage.value = 1;
    postersForModal.value = film.alternatePosters;
    filmToUpdate.value = film; // Remember which film we're updating
    modalRef.value?.showModal(); // Use the .showModal() method
  }
};
const selectAlternatePoster = (newPosterUrl) => {
  if (filmToUpdate.value) {
    filmToUpdate.value.posterUrl = newPosterUrl; // Update the main poster
  }
  modalRef.value?.close(); // Close the modal
};

// Upload file
const parsedCsvData = ref([]);
const likedFilmsSet = ref(new Set());
const parsingErrors = ref([]);
const profileInfo = ref(null);

const handleFileUpload = async (event) => {
  const file = event.target.files[0];
  if (!file) return;

  try {
    const zip = await JSZip.loadAsync(file);
    // Films.csv
    const likesFile = zip.file('likes/films.csv');
    const likesCsvText = await likesFile.async('string');
    // Parse the likes CSV to populate our Set
    const likesData = Papa.parse(likesCsvText, { header: true, skipEmptyLines: true }).data;
    const names = likesData.map(film => film.Name);
    likedFilmsSet.value = new Set(names);

    // Diary.csv
    const diaryFile = zip.file('diary.csv');
    const diaryCsvText = await diaryFile.async('string');
    const diaryData = Papa.parse(diaryCsvText, { header: true, skipEmptyLines: true }).data;
    parsedCsvData.value = diaryData.map(film => ({
      ...film,
      isLiked: likedFilmsSet.value.has(film.Name),
      posterUrl: null,
      alternatePosters: [],
      isPosterLoaded: false
    }));

    // Profile.csv
    const profileFile = zip.file('profile.csv');
    const profileCsvText = await profileFile.async('string');
    const profileData = Papa.parse(profileCsvText, { header: true, skipEmptyLines: true }).data;
    profileInfo.value = profileData[0];
  } catch (error) {
    console.error('Failed to process zip file:', error);
    // Handle error state in UI
  }
};

const groupedFilms = computed(() => {
  if (!parsedCsvData.value.length) {
    return {};
  }
  return parsedCsvData.value.reduce((acc, film) => {
    if (!film.Date) {
      return acc;
    }
    const date = new Date(film["Watched Date"]);
    const monthYear = date.toLocaleDateString('en-US', {
      month: 'long',
      year: 'numeric',
    });
    if (!acc[monthYear]) {
      acc[monthYear] = [];
    }
    acc[monthYear].push(film);
    return acc;
  }, {});
});

const selectedMonth = ref(null);
watch(groupedFilms, (newlyGroupedData) => {
  const months = Object.keys(newlyGroupedData);
  if (months.length > 0) {
    // Set the default selection to the first month in the list
    selectedMonth.value = months[months.length - 1];
  } else {
    selectedMonth.value = null;
  }
});

// Poster
const TMDB_API_KEY = '2b2a7c69c8f7e4c992bd0f66bffbdf71';
const posterUrl = ref(null);
const imageSrc = ref('https://placehold.co/160x240/374151/FFF');

const fetchPoster = async (film) => {
  try {
    const query = encodeURIComponent(film.Name);
    const searchUrl = `https://api.themoviedb.org/3/search/movie?api_key=${TMDB_API_KEY}&query=${query}&year=${film.Year}`;
    const res = await fetch(searchUrl);
    const data = await res.json();

    if (data.results && data.results.length > 0 && data.results[0].poster_path) {
      const path = data.results[0].poster_path;
      const id = data.results[0].id;
      // Add the posterUrl directly to the film object
      film.posterUrl = `https://images.weserv.nl/?url=https://image.tmdb.org/t/p/w500${path}`;

      if (id) {
        const imagesUrl = `https://api.themoviedb.org/3/movie/${id}/images?api_key=${TMDB_API_KEY}`;
        const imagesRes = await fetch(imagesUrl);
        const imagesData = await imagesRes.json();

        if (imagesData.posters) {
          film.alternatePosters = imagesData.posters.map(p => ({
            url: `https://images.weserv.nl/?url=https://image.tmdb.org/t/p/w500${p.file_path}`,
            isLoaded: false
          }));
        }
      }
    } else {
      film.posterUrl = 'https://placehold.co/160x240/374151/FFF?text=Not+Found';
    }
  } catch (err) {
    console.error(`Failed to fetch poster for ${film.Name}:`, err);
    film.posterUrl = 'https://placehold.co/160x240/374151/FFF?text=Error';
  }
};
watch(parsedCsvData, async (newFilms) => {
  if (newFilms.length > 0) {
    // Create an array of fetch promises and run them concurrently
    const fetchPromises = newFilms.map(film => fetchPoster(film));
    await Promise.all(fetchPromises);
  }
});

// Rating
function getStarIcons(rating, maxStars = 5) {
  const fullStars = Math.floor(rating);
  const halfStar = rating % 1 >= 0.5;
  const emptyStars = maxStars - fullStars - (halfStar ? 1 : 0);

  // return [
  //   ...Array(fullStars).fill('★'),       // full stars
  //   ...(halfStar ? ['½'] : []),          // half star
  // ];

  const icons = [];
  // Full stars
  for (let i = 0; i < fullStars; i++) {
    icons.push('&#xE838;');
  }
  // Half star
  if (halfStar) icons.push('&#xE839;');
  return icons;
}

// Rewatch
function getRewatchIcon(rewatchStatus) {
  if (rewatchStatus === 'Yes') {
    return '🔁'; 
  }
  return null;
}

// Likes
function getLikeIcon(isLiked) {
  if (isLiked) {
    return '♡';
  }
  return null;
}

// Export
const captureRef = ref(null)

const handleDownload = async () => {
  const node = captureRef.value
  try {
    const canvas = await html2canvas(node, {
      useCORS: true,
      scale: 2, // or window.devicePixelRatio
    })

    // ✂️ Trim 1px–2px from bottom to remove line artifact
    const trimmed = document.createElement('canvas')
    trimmed.width = canvas.width
    trimmed.height = canvas.height - 1 // cut off bottom 2px (adjust if needed)

    const ctx = trimmed.getContext('2d')
    ctx.drawImage(canvas, 0, 0)

    const link = document.createElement('a')
    link.href = trimmed.toDataURL('image/png')
    link.download = `Wrappedboxd_${selectedMonth.value.replace(' ', '_') || 'download'}.png`
    link.click()
  } catch (err) {
    console.error('Export failed:', err)
  }
}
</script>