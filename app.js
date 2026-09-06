// --- 1. MOCKUP DATABASE SEJARAH (WILAYAH & DINASTI/NEGARA) ---
const historicalData = {
  "Nusantara & Asia Tenggara": [
    {
      id: "tarumanagara",
      name: "Tarumanagara",
      start: 400,
      end: 669,
      lat: -6.4058,
      lng: 106.8584,
      zoomAlt: 1.5,
      desc: "Salah satu kerajaan Hindu tertua di pulau Jawa yang berpusat di dekat Bogor/Bekasi."
    },
    {
      id: "sriwijaya",
      name: "Kedatuan Sriwijaya",
      start: 683,
      end: 1025,
      lat: -3.3166,
      lng: 104.9053,
      zoomAlt: 1.5,
      desc: "Kerajaan maritim Buddha besar di Sumatra yang menguasai jalur perdagangan Selat Malaka."
    },
    {
      id: "medang",
      name: "Kerajaan Medang (Mataram Kuno)",
      start: 732,
      end: 1016,
      lat: -7.7956,
      lng: 110.3695,
      zoomAlt: 1.5,
      desc: "Kerajaan di Jawa Tengah dan Timur yang membangun banyak candi megah termasuk Borobudur dan Prambanan."
    },
    {
      id: "kediri",
      name: "Kerajaan Kediri (Panjalu)",
      start: 1042,
      end: 1222,
      lat: -7.8166,
      lng: 112.0117,
      zoomAlt: 1.5,
      desc: "Kerajaan agraris dan maritim di Jawa Timur yang terkenal dengan kesusastraannya."
    },
    {
      id: "singasari",
      name: "Kerajaan Singasari",
      start: 1222,
      end: 1292,
      lat: -7.9425,
      lng: 112.5954,
      zoomAlt: 1.5,
      desc: "Kerajaan yang didirikan oleh Ken Arok dan memperluas pengaruhnya hingga ekspedisi Pamalayu."
    },
    {
      id: "majapahit",
      name: "Imperium Majapahit",
      start: 1293,
      end: 1527,
      lat: -7.5506,
      lng: 112.2350,
      zoomAlt: 1.5,
      desc: "Kerajaan Hindu-Buddha terakhir yang berpusat di Jawa Timur dan menyatukan nusantara."
    },
    {
      id: "demak",
      name: "Kesultanan Demak",
      start: 1475,
      end: 1554,
      lat: -6.8947,
      lng: 110.6384,
      zoomAlt: 1.5,
      desc: "Kesultanan Islam pertama di Jawa yang berperan besar dalam penyebaran agama Islam di Nusantara."
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
    }
  ]
};

// --- 2. INISIALISASI GLOBE 3D ---
const container = document.getElementById('globeViz');
const globe = Globe()
  (container)
  // Gunakan file gambar tekstur tunggal yang cerah
  .globeImageUrl('//unpkg.com/three-globe/example/img/earth-day.jpg')
  .bumpImageUrl(null)

  // TAMBAHKAN BAGIAN INI UNTUK POLIGON:
  .polygonsData([]) 
  .polygonAltitude(0.01) 
  .polygonCapColor(() => 'rgba(0, 100, 255, 0.1)') 
  .polygonSideColor(() => 'rgba(0, 100, 255, 0.2)')
  .polygonStrokeColor(() => '#ffffff')
  
  .htmlElementsData([])
  .htmlLat(d => d.lat)
  .htmlLng(d => d.lng)
  .htmlElement(d => {
    const el = document.createElement('div');
    el.innerHTML = `<div style="background: rgba(255,0,0,0.8); color: white; padding: 4px 8px; border-radius: 4px; font-size: 11px; font-weight: bold; pointer-events: none;">📍 ${d.name}</div>`;
    return el;
  });

// Load file GeoJSON Mataram Kuno
fetch('geojson/mataram_kuno.geojson')
  .then(res => res.json())
  .then(geojson => {
    // Masukkan data poligon ke globe
    globe.polygonsData(geojson.features);
  })
  .catch(err => console.error("Gagal memuat GeoJSON:", err));

// Mengatur pencahayaan agar lebih terang merata menggunakan fungsi internal globe
const directionalLight = globe.scene().getObjectByProperty('type', 'DirectionalLight');
if (directionalLight) {
  directionalLight.intensity = 3.0; // Perkuat cahaya utama agar sangat terang
}

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
       // Ketika tombol dinasti diklik: Arahkan kamera globe ke lokasinya
btn.onclick = () => {
  // Gunakan altitude yang pas (misal 0.5 atau 0.8) agar posisinya ideal (tidak terlalu dekat/kuning pekat, tapi tidak terlalu jauh)
  globe.pointOfView({ lat: dynasty.lat, lng: dynasty.lng, altitude: 0.6 }, 1500);
  
  // Jika Anda ingin memuat atau menampilkan polygon khusus saat tombol diklik:
  fetch('geojson/mataram_kuno.geojson')
    .then(res => res.json())
    .then(geojson => {
      globe.polygonsData(geojson.features);
    });

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
