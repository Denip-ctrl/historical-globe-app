// --- 1. MOCKUP DATABASE SEJARAH (WILAYAH & DINASTI/NEGARA) ---
const historicalData = {
  "Nusantara & Asia Tenggara": [
    {
      id: "sriwijaya",
      name: "Kedatuan Sriwijaya",
      start: 683,
      end: 1025,
      lat: -3.3166,
      lng: 104.9053,
      zoomAlt: 1.5,
      desc: "Kerajaan maritim Buddha bersar di Sumatra yang menguasai jalur perdagangan Selat Malaka."
    },
    {
      id: "majapahit",
      name: "Imperium Majapahit",
      start: 1293,
      end: 1527,
      lat: -7.5506,
      lng: 112.2350,
      zoomAlt: 1.5,
      desc: "Kerajaan Hindu-Buddha terakhir yang berpusat di Jawa Timur dan menguasai sebagian besar nusantara."
    },
    {
      id: "mataram_islam",
      name: "Kesultanan Mataram",
      start: 1586,
      end: 1755,
      lat: -7.8014,
      lng: 110.3644,
      zoomAlt: 1.5,
      desc: "Kesultanan besar di Jawa yang mencapai puncak kejayaan pada masa Sultan Agung."
    },
    {
      id: "hindia_belanda",
      name: "Hindia Belanda (Kolonial)",
      start: 1800,
      end: 1942,
      lat: -6.2088,
      lng: 106.8456,
      zoomAlt: 1.5,
      desc: "Wilayah jajahan Imperium Belanda di Nusantara sebelum era kemerdekaan modern."
    },
    {
      id: "indonesia_1945",
      name: "Republik Indonesia (Proklamasi)",
      start: 1945,
      end: 1970,
      lat: -0.7893,
      lng: 113.9213,
      zoomAlt: 1.8,
      desc: "Negara kesatuan merdeka yang lahir setelah memproklamirkan kemerdekaan pada 17 Agustus 1945."
    },
    {
      id: "malaysia_singapura_1965",
      name: "Malaysia & Singapura Modern",
      start: 1965,
      end: 1970,
      lat: 3.1390,
      lng: 101.6869,
      zoomAlt: 1.5,
      desc: "Era pasca-pemisahan Singapura dari Malaysia, membentuk kedaulatan negara modern di Selat Malaka."
    }
  ]
};

// --- 2. INISIALISASI GLOBE 3D ---
const container = document.getElementById('globeViz');
const globe = Globe()
  (container)
  .globeImageUrl('https://unpkg.com/three-globe@2.27.3/example/img/earth-blue-marble.jpg')
  .bumpImageUrl(null)
  .htmlElementsData([]) // Untuk nanti menampilkan label/marker di atas globe
  .htmlLat(d => d.lat)
  .htmlLng(d => d.lng)
  .htmlElement(d => {
    const el = document.createElement('div');
    el.innerHTML = `<div style="background: rgba(255,0,0,0.8); color: white; padding: 4px 8px; border-radius: 4px; font-size: 11px; font-weight: bold; pointer-events: none;">📍 ${d.name}</div>`;
    return el;
  });

// Sesuaikan ukuran globe dengan jendela browser
window.addEventListener('resize', () => {
  globe.width(window.innerWidth);
  globe.height(window.innerHeight);
});

// --- 3. ELEMEN UI DOM ---
const yearSlider = document.getElementById('year-slider');
const yearLabel = document.getElementById('year-label');
const regionListDiv = document.getElementById('region-list');

// --- 4. FUNGSI RENDER MENU BERDASARKAN TAHUN SLIDER ---
function updateApp(currentYear) {
  yearLabel.innerText = currentYear;
  regionListDiv.innerHTML = ''; // Kosongkan daftar wilayah

  let activeMarkers = [];

  // Looping wilayah & dinasti
  for (const [regionName, dynasties] of Object.entries(historicalData)) {
    // Buat wadah kategori wilayah
    const regionBox = document.createElement('div');
    regionBox.style.marginBottom = '15px';
    
    const regionTitle = document.createElement('h4');
    regionTitle.innerText = regionName;
    regionTitle.style.margin = '0 0 5px 0';
    regionTitle.style.color = '#ffcc00';
    regionBox.appendChild(regionTitle);

    let activeCount = 0;

    dynasties.forEach(dynasty => {
      // Cek apakah dinasti hidup/aktif pada tahun yang ditunjukkan slider
      if (currentYear >= dynasty.start && currentYear <= dynasty.end) {
        activeCount++;
        activeMarkers.push(dynasty);

        const btn = document.createElement('button');
        btn.innerText = `${dynasty.name} (${dynasty.start}-${dynasty.end})`;
        btn.style.display = 'block';
        btn.style.width = '100%';
        btn.style.marginBottom = '4px';
        btn.style.padding = '6px';
        btn.style.background = '#333';
        btn.style.color = 'white';
        btn.style.border = '1px solid #555';
        btn.style.cursor = 'pointer';
        btn.style.textAlign = 'left';
        btn.style.borderRadius = '4px';

        // Ketika tombol dinasti diklik: Arahkan kamera globe ke lokasinya
        btn.onclick = () => {
          globe.pointOfView({ lat: dynasty.lat, lng: dynasty.lng, altitude: dynasty.zoomAlt }, 1500);
          
          // Opsional: Tampilkan detail informasi di konsol atau buat panel info khusus
          console.log(`Menampilkan detail: ${dynasty.name} - ${dynasty.desc}`);
        };

        regionBox.appendChild(btn);
      }
    });

    // Jika ada dinasti yang aktif di wilayah ini pada tahun tersebut, tampilkan kotaknya
    if (activeCount > 0) {
      regionListDiv.appendChild(regionBox);
    }
  }

  // Jika di tahun tersebut sama sekali belum ada data
  if (activeMarkers.length === 0) {
    regionListDiv.innerHTML = `<p style="color: #aaa; font-style: italic;">Data wilayah untuk tahun ${currentYear} belum tersedia di database prototype.</p>";`
    globe.htmlElementsData([]); // Bersihkan marker di globe
  } else {
    // Perbarui penanda titik di globe 3D sesuai entitas yang aktif
    globe.htmlElementsData(activeMarkers);
  }
}

// --- 5. EVENT LISTENER SLIDER ---
yearSlider.addEventListener('input', (e) => {
  const selectedYear = parseInt(e.target.value);
  updateApp(selectedYear);
});

// Jalankan saat pertama kali halaman dimuat (default tahun 1350)
updateApp(parseInt(yearSlider.value));
