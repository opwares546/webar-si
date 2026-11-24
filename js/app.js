document.addEventListener("DOMContentLoaded", () => {
  const splash = document.getElementById("splash-screen");
  const btnStart = document.getElementById("btn-start-ar");
  const topHud = document.getElementById("top-hud");
  const statusDot = document.getElementById("status-dot");
  const statusText = document.getElementById("status-text");
  const scannerOverlay = document.getElementById("scanner-overlay");
  const sideControls = document.getElementById("side-controls");
  const hudNav = document.getElementById("hud-nav");
  const hudButtons = document.querySelectorAll(".hud-btn");

  const infoCard = document.getElementById("info-card");
  const cardTitle = document.getElementById("card-title");
  const cardDesc = document.getElementById("card-desc");
  const cardLink = document.getElementById("card-link");
  const btnCloseCard = document.getElementById("btn-close-card");
  const karyaPillsBox = document.getElementById("karya-pills");
  const karyaPills = document.querySelectorAll(".karya-pill");

  const sceneEl = document.getElementById("ar-scene");
  const targetEl = document.getElementById("ar-target");
  const arStage = document.getElementById("ar-stage");
  const karya3dObj = document.getElementById("karya-3d-obj");
  const karya3dLabel = document.getElementById("karya-3d-label");
  const heroObj = document.getElementById("interactive-hero");

  const btnSound = document.getElementById("btn-sound");
  const btnPhoto = document.getElementById("btn-photo");
  const btnZoomIn = document.getElementById("btn-zoom-in");
  const btnZoomOut = document.getElementById("btn-zoom-out");
  const btnSpin = document.getElementById("btn-spin");
  const cameraFlash = document.getElementById("camera-flash");

  // ==================== SFX ENGINE (WEB AUDIO API) ====================
  let soundEnabled = true;
  let audioCtx = null;

  const playTone = (freq = 580, duration = 0.08, type = "sine") => {
    if (!soundEnabled) return;
    try {
      if (!audioCtx)
        audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = type;
      osc.frequency.setValueAtTime(freq, audioCtx.currentTime);
      gain.gain.setValueAtTime(0.08, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(
        0.001,
        audioCtx.currentTime + duration,
      );
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start();
      osc.stop(audioCtx.currentTime + duration);
    } catch (e) {}
  };

  btnSound.addEventListener("click", () => {
    soundEnabled = !soundEnabled;
    btnSound.textContent = soundEnabled ? "🔊" : "🔇";
    if (soundEnabled) playTone(660, 0.08);
  });

  // ==================== DATA KONTEN ====================
  const menuData = {
    utama: {
      title: "Selamat Datang di Prodi SI",
      desc: "Sentuh objek 3D atau pilih menu di bawah untuk menjelajahi profil, jalur masuk, prospek karir, dan inovasi mahasiswa.",
      link: null,
    },
    profil: {
      title: "Profil Prodi Sistem Informasi",
      desc: "Berada di bawah Fakultas Ekonomi dan Bisnis Islam (FEBI) UIN Mahmud Yunus Batusangkar. Memadukan teknologi informasi, manajemen, dan bisnis digital.",
      link: "https://uinmybatusangkar.ac.id",
    },
    daftar: {
      title: "Info Pendaftaran Mahasiswa Baru",
      desc: "Penerimaan dibuka melalui jalur SPAN-PTKIN, UM-PTKIN, dan Jalur Mandiri. Klik tombol di bawah untuk info jadwal & syarat resmi.",
      link: "https://pmb.uinmybatusangkar.ac.id",
    },
    karir: {
      title: "Prospek Karir Lulusan SI",
      desc: "Siap berkarir sebagai System Analyst, Full-Stack Developer, UI/UX Designer, Data Analyst, ERP Consultant, hingga IT Project Manager.",
      link: null,
    },
    karya: {
      title: "Showcase Karya Mahasiswa",
      desc: "Pilih salah satu proyek unggulan di atas untuk melihat detail inovasi mahasiswa Sistem Informasi.",
      link: null,
    },
    hmps: {
      title: "Kegiatan HMPS SI",
      desc: "Aktif menggelar IT FEST, workshop pemrograman & desain grafis, pengabdian masyarakat, serta kegiatan pengembangan soft-skill mahasiswa.",
      link: "https://instagram.com",
    },
  };

  const karyaData = {
    koperasiku: {
      title: "Koperasiku (Web App)",
      desc: "Sistem manajemen koperasi digital berbasis Laravel untuk pencatatan simpan pinjam dan laporan keuangan transparan.",
      color: "#10b981",
      label: "KOPERASIKU\nManajemen Koperasi Digital",
    },
    juragantani: {
      title: "Juragantani (Agri-Tech)",
      desc: "Platform direktori pertanian yang menghubungkan petani langsung dengan pengepul hasil bumi terverifikasi.",
      color: "#84cc16",
      label: "JURAGANTANI\nPlatform Direktori Pertanian",
    },
    ews: {
      title: "EWS Anti-Drone (IoT + AI)",
      desc: "Sistem peringatan dini pendeteksi drone menggabungkan sensor radar ESP8266, computer vision YOLOv8, dan pelacakan kamera otomatis.",
      color: "#f43f5e",
      label: "EWS ANTI-DRONE\nIoT Radar & YOLOv8 AI",
    },
    smartcar: {
      title: "Smart Robot Car (IoT)",
      desc: "Mobil robot pintar berbasis ESP8266 Wi-Fi dengan layar OLED ekspresif yang dikembangkan untuk pameran teknologi kampus.",
      color: "#38bdf8",
      label: "SMART ROBOT CAR\nESP8266 Wi-Fi + OLED",
    },
  };

  const scenes = {
    utama: document.getElementById("scene-utama"),
    profil: document.getElementById("scene-profil"),
    daftar: document.getElementById("scene-daftar"),
    karir: document.getElementById("scene-karir"),
    karya: document.getElementById("scene-karya"),
    hmps: document.getElementById("scene-hmps"),
  };

  // ==================== MULAI KAMERA AR ====================
  btnStart.addEventListener("click", async () => {
    playTone(520, 0.1);
    splash.classList.add("hidden");
    topHud.style.display = "flex";
    scannerOverlay.style.display = "flex";

    const arSystem = sceneEl.systems["mindar-image-system"];
    if (arSystem) {
      await arSystem.start();
    }
  });

  // ==================== EVENT MARKER ====================
  targetEl.addEventListener("targetFound", () => {
    playTone(880, 0.12, "triangle");
    scannerOverlay.style.display = "none";
    hudNav.style.display = "flex";
    sideControls.style.display = "flex";
    statusDot.classList.add("found");
    statusText.textContent = "Marker Terdeteksi";
  });

  targetEl.addEventListener("targetLost", () => {
    scannerOverlay.style.display = "flex";
    statusDot.classList.remove("found");
    statusText.textContent = "Mencari Marker...";
  });

  // ==================== GANTI 6 MENU ====================
  const switchMenu = (key) => {
    playTone(620, 0.07);

    Object.entries(scenes).forEach(([k, el]) => {
      if (el) el.setAttribute("visible", k === key);
    });

    hudButtons.forEach((btn) => {
      btn.classList.toggle("active", btn.dataset.menu === key);
    });

    if (key === "karya") {
      karyaPillsBox.style.display = "flex";
      selectKarya("koperasiku");
    } else {
      karyaPillsBox.style.display = "none";
      const data = menuData[key];
      if (data) {
        cardTitle.textContent = data.title;
        cardDesc.textContent = data.desc;
        if (data.link) {
          cardLink.href = data.link;
          cardLink.style.display = "inline-block";
        } else {
          cardLink.style.display = "none";
        }
      }
    }

    infoCard.classList.add("show");
  };

  const selectKarya = (karyaKey) => {
    const item = karyaData[karyaKey];
    if (!item) return;

    karyaPills.forEach((p) =>
      p.classList.toggle("active", p.dataset.karya === karyaKey),
    );
    cardTitle.textContent = item.title;
    cardDesc.textContent = item.desc;
    cardLink.style.display = "none";

    karya3dObj.setAttribute("color", item.color);
    karya3dLabel.setAttribute("value", item.label);
  };

  hudButtons.forEach((btn) => {
    btn.addEventListener("click", () => switchMenu(btn.dataset.menu));
  });

  karyaPills.forEach((pill) => {
    pill.addEventListener("click", () => {
      playTone(720, 0.06);
      selectKarya(pill.dataset.karya);
    });
  });

  btnCloseCard.addEventListener("click", () => {
    playTone(400, 0.06);
    infoCard.classList.remove("show");
  });

  // Klik langsung objek 3D utama -> buka info & efek loncat
  heroObj?.addEventListener("click", () => {
    playTone(920, 0.1, "triangle");
    switchMenu("utama");
  });

  // ==================== KONTROL 3D (ZOOM & PUTAR) ====================
  let currentScale = 1;
  let currentRotY = 0;

  btnZoomIn.addEventListener("click", () => {
    playTone(700, 0.05);
    currentScale = Math.min(1.8, +(currentScale + 0.15).toFixed(2));
    arStage.setAttribute(
      "scale",
      `${currentScale} ${currentScale} ${currentScale}`,
    );
  });

  btnZoomOut.addEventListener("click", () => {
    playTone(480, 0.05);
    currentScale = Math.max(0.5, +(currentScale - 0.15).toFixed(2));
    arStage.setAttribute(
      "scale",
      `${currentScale} ${currentScale} ${currentScale}`,
    );
  });

  btnSpin.addEventListener("click", () => {
    playTone(600, 0.06);
    currentRotY = (currentRotY + 90) % 360;
    arStage.setAttribute("rotation", `0 ${currentRotY} 0`);
  });

  // ==================== AMBIL FOTO / SCREENSHOT AR ====================
  btnPhoto.addEventListener("click", () => {
    playTone(1000, 0.06, "square");
    cameraFlash.classList.add("flash");
    setTimeout(() => cameraFlash.classList.remove("flash"), 160);

    const video = document.querySelector("video");
    const glCanvas = sceneEl.canvas;
    if (!video || !glCanvas) return;

    const outCanvas = document.createElement("canvas");
    outCanvas.width = glCanvas.width;
    outCanvas.height = glCanvas.height;
    const ctx = outCanvas.getContext("2d");

    // Gambar feed kamera lalu tumpuk dengan layer 3D WebGL
    ctx.drawImage(video, 0, 0, outCanvas.width, outCanvas.height);
    ctx.drawImage(glCanvas, 0, 0, outCanvas.width, outCanvas.height);

    // Watermark kecil di pojok bawah
    ctx.fillStyle = "rgba(2, 6, 23, 0.65)";
    ctx.fillRect(16, outCanvas.height - 46, 270, 30);
    ctx.fillStyle = "#34d399";
    ctx.font = "bold 14px Poppins, sans-serif";
    ctx.fillText("WebAR Prodi SI • UINMYBSK", 26, outCanvas.height - 26);

    const link = document.createElement("a");
    link.download = `WebAR-SI-UINMYBSK-${Date.now()}.png`;
    link.href = outCanvas.toDataURL("image/png");
    link.click();
  });
});
