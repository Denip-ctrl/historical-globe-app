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

// --- 1. LACAK POSISI KURSOR MOUSE ---
let mouseX = 0;
let mouseY = 0;

document.addEventListener('mousemove', (e) => {
  mouseX = e.clientX;
  mouseY = e.clientY;
});

// Fungsi pembantu untuk mengecek apakah kursor sedang berada di atas elemen UI (Sidebar / Slider)
function isCursorOverUI() {
  const sidebar = document.getElementById('sidebar');
  const slider = document.getElementById('slider-container');
  
  const rectSidebar = sidebar.getBoundingClientRect();
  const rectSlider = slider.getBoundingClientRect();

  const overSidebar = (
    mouseX >= rectSidebar.left &&
    mouseX <= rectSidebar.right &&
    mouseY >= rectSidebar.top &&
    mouseY <= rectSidebar.bottom
  );

  const overSlider = (
    mouseX >= rectSlider.left &&
    mouseX <= rectSlider.right &&
    mouseX >= rectSlider.top &&
    mouseY <= rectSlider.bottom // Perbaikan kecil pada pengecekan bawah slider
  );

  return overSidebar || overSlider;
}


// --- 2. INISIALISASI GLOBE 3D ---
// --- INISIALISASI GLOBE DENGAN UKURAN KONTANER YANG JELAS ---
const container = document.getElementById('globeViz');
const globe = Globe()
  (container)
  .width(container.clientWidth || 900)   // Ambil lebar kontainer secara dinamis
  .height(container.clientHeight || 500) // Ambil tinggi kontainer secara dinamis
  .globeImageUrl('//unpkg.com/three-globe/example/img/earth-day.jpg')
  .bumpImageUrl(null)
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

// Load file GeoJSON Mataram Kuno ke Globe
fetch('geojson/mataram_kuno.geojson')
  .then(res => res.json())
  .then(geojson => {
    globe.polygonsData(geojson.features);
  })
  .catch(err => console.error("Gagal memuat GeoJSON Globe:", err));

// Pengaturan pencahayaan globe
const directionalLight = globe.scene().getObjectByProperty('type', 'DirectionalLight');
if (directionalLight) {
  directionalLight.intensity = 3.0;
}

// Sesuaikan ukuran globe saat jendela di-resize
window.addEventListener('resize', () => {
  const wrapper = document.getElementById('map-container-wrapper');
  if (wrapper) {
    globe.width(wrapper.clientWidth);
    globe.height(wrapper.clientHeight);
  }
});

// --- TAMBAHKAN VARIABEL STATUS DI BAGIAN ATAS ---
let currentActiveDynasty = null;

// --- 3. INISIALISASI PETA 2D (LEAFLET) DI LUAR (GLOBAL) ---
const map2D = L.map('map2D', { zoomControl: false }).setView([-7.7956, 110.3695], 8);

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  maxZoom: 19,
}).addTo(map2D);

// Muat GeoJSON langsung ke peta 2D agar tajam
fetch('geojson/mataram_kuno.geojson')
  .then(res => res.json())
  .then(data => {
    L.geoJSON(data, {
      style: { color: "#ffffff", weight: 2, fillColor: "#ff8800", fillOpacity: 0.4 }
    }).addTo(map2D);
  })
  .catch(err => console.error("Gagal memuat GeoJSON Leaflet:", err));

// --- PEMANTAU ZOOM OUT PETA 2D (KEMBALI KE GLOBE) ---
map2D.on('zoom', () => {
  const currentZoom = map2D.getZoom();
  if (currentZoom < 7) {
    const globeElement = document.getElementById('globeViz');
    const mapElement = document.getElementById('map2D');

    if (globeElement && mapElement && mapElement.style.opacity === '1') {
      globeElement.style.opacity = '1';
      globeElement.style.pointerEvents = 'auto';
      
      mapElement.style.opacity = '0';
      mapElement.style.pointerEvents = 'none';

      globe.pointOfView({ lat: -7.7956, lng: 110.3695, altitude: 0.4 }, 500);
      map2D.setView([-7.7956, 110.3695], 8);
      currentActiveDynasty = null; // Reset status aktif
    }
  }
});

// --- PEMANTAU ZOOM IN MANUAL PADA GLOBE (DENGAN VALIDASI LOKASI) ---
// --- PEMANTAU ZOOM IN MANUAL PADA GLOBE ---
setInterval(() => {
  const pov = globe.pointOfView();
  const globeElement = document.getElementById('globeViz');
  const mapElement = document.getElementById('map2D');

  if (pov && globeElement && mapElement && globeElement.style.opacity === '1') {
    
    // JIKA KURSOR BERADA DI ATAS SIDEBAR ATAU SLIDER, ABAIKAN PERUBAHAN ZOOM
    if (isCursorOverUI()) {
      return; 
    }

    const isNearMedang = Math.abs(pov.lat - (-7.7956)) < 10 && Math.abs(pov.lng - 110.3695) < 10;

    if (pov.altitude < 0.25 && isNearMedang && currentActiveDynasty === 'medang') {
      globeElement.style.opacity = '0';
      globeElement.style.pointerEvents = 'none';
      
      mapElement.style.opacity = '1';
      mapElement.style.pointerEvents = 'auto';

      if (typeof map2D !== 'undefined') {
        map2D.invalidateSize();
      }
    }
  }
}, 300);


// --- 4. ELEMEN UI DOM & RENDER APLIKASI ---
const yearSlider = document.getElementById('year-slider');
const yearLabel = document.getElementById('year-label');
const regionListDiv = document.getElementById('region-list');

function updateApp(currentYear) {
  yearLabel.innerText = currentYear;
  regionListDiv.innerHTML = '';

  let activeMarkers = [];

  for (const [regionName, dynasties] of Object.entries(historicalData)) {
    const regionBox = document.createElement('div');
    regionBox.style.marginBottom = '15px';
    
    const regionTitle = document.createElement('h4');
    regionTitle.innerText = regionName;
    regionTitle.style.margin = '0 0 5px 0';
    regionTitle.style.color = '#ffcc00';
    regionBox.appendChild(regionTitle);

    let activeCount = 0;

    dynasties.forEach(dynasty => {
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

        // Event Klik Tombol Dinasti
        // Event Klik Tombol Dinasti
        btn.onclick = () => {
          const globeElement = document.getElementById('globeViz');
          const mapElement = document.getElementById('map2D');

          currentActiveDynasty = dynasty.id; // Catat dinasti yang sedang dipilih

          if (dynasty.id === 'medang') {
            globe.pointOfView({ lat: dynasty.lat, lng: dynasty.lng, altitude: 0.15 }, 1500);

            setTimeout(() => {
              if (globeElement && mapElement) {
                globeElement.style.opacity = '0';
                globeElement.style.pointerEvents = 'none';
                
                mapElement.style.opacity = '1';
                mapElement.style.pointerEvents = 'auto';

                if (typeof map2D !== 'undefined') {
                  map2D.invalidateSize();
                }
              }
            }, 1500);
          } else {
            // Jika klik dinasti selain Medang, paksa tutup peta 2D dan kembali ke globe
            if (globeElement && mapElement) {
              globeElement.style.opacity = '1';
              globeElement.style.pointerEvents = 'auto';
              
              mapElement.style.opacity = '0';
              mapElement.style.pointerEvents = 'none';
            }

            globe.pointOfView({ lat: dynasty.lat, lng: dynasty.lng, altitude: dynasty.zoomAlt }, 1500);
          }

          console.log(`Menampilkan detail: ${dynasty.name} - ${dynasty.desc}`);
        };
        
        regionBox.appendChild(btn);
      }
    });

    if (activeCount > 0) {
      regionListDiv.appendChild(regionBox);
    }
  }

  if (activeMarkers.length === 0) {
    regionListDiv.innerHTML = `<p style="color: #aaa; font-style: italic;">Data wilayah untuk tahun ${currentYear} belum tersedia di database prototype.</p>`;
    globe.htmlElementsData([]);
  } else {
    globe.htmlElementsData(activeMarkers);
  }
}

// --- 5. EVENT LISTENER SLIDER ---
yearSlider.addEventListener('input', (e) => {
  const selectedYear = parseInt(e.target.value);
  updateApp(selectedYear);
});

// Jalankan saat pertama kali halaman dimuat
updateApp(parseInt(yearSlider.value));

// --- PAKSA STATUS AWAL AMAN SAAT HALAMAN DIMUAT ---
document.addEventListener("DOMContentLoaded", () => {
  const globeElement = document.getElementById('globeViz');
  const mapElement = document.getElementById('map2D');
  if (globeElement && mapElement) {
    globeElement.style.opacity = '1';
    globeElement.style.pointerEvents = 'auto';
    mapElement.style.opacity = '0';
    mapElement.style.pointerEvents = 'none';
  }
});

