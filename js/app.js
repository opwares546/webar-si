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

  const profilPillsBox = document.getElementById("profil-pills");
  const profilPills = document.querySelectorAll(".profil-pill");
  const karyaPillsBox = document.getElementById("karya-pills");
  const karyaPills = document.querySelectorAll(".karya-pill[data-karya]");

  const sceneEl = document.getElementById("ar-scene");
  const targetEl = document.getElementById("ar-target");
  const arStage = document.getElementById("ar-stage");
  const pedestalRing = document.getElementById("pedestal-ring");
  const accentLight = document.getElementById("accent-light");
  const heroObj = document.getElementById("interactive-hero");

  // Elemen Profil 3D
  const profil3dBadge = document.getElementById("profil-3d-badge");
  const profil3dText = document.getElementById("profil-3d-text");

  // Elemen Karya (Video Web + Model 3D IoT)
  const karyaVideoWrapper = document.getElementById("karya-video-wrapper");
  const karyaVideoFrame = document.getElementById("karya-video-frame");
  const karyaVideoScreen = document.getElementById("karya-video-screen");
  const karyaVideoBadgeBg = document.getElementById("karya-video-badge-bg");
  const karyaVideoBadge = document.getElementById("karya-video-badge");

  const karyaModelWrapper = document.getElementById("karya-model-wrapper");
  const karyaLabelBox = document.getElementById("karya-label-box");
  const karya3dLabel = document.getElementById("karya-3d-label");

  const karyaModels = {
    drone: document.getElementById("karya-model-drone"),
    robot: document.getElementById("karya-model-robot"),
  };

  const videos = {
    "vid-1": document.getElementById("vid-1"),
    "vid-2": document.getElementById("vid-2"),
    "vid-3": document.getElementById("vid-3"),
  };

  const bgmMars = document.getElementById("bgm-mars");
  const btnSound = document.getElementById("btn-sound");
  const btnPhoto = document.getElementById("btn-photo");
  const btnZoomIn = document.getElementById("btn-zoom-in");
  const btnZoomOut = document.getElementById("btn-zoom-out");
  const btnSpin = document.getElementById("btn-spin");
  const cameraFlash = document.getElementById("camera-flash");

  // ==================== AUDIO MARS UIN + SFX KLIK ====================
  let soundEnabled = true;
  let isTargetVisible = false;
  let audioCtx = null;

  if (bgmMars) {
    bgmMars.volume = 0.55;
  }

  const playTone = (freq = 580, duration = 0.07, type = "sine") => {
    if (!soundEnabled) return;
    try {
      if (!audioCtx)
        audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = type;
      osc.frequency.setValueAtTime(freq, audioCtx.currentTime);
      gain.gain.setValueAtTime(0.06, audioCtx.currentTime);
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

  const syncMarsAudio = () => {
    if (!bgmMars) return;
    if (soundEnabled && isTargetVisible) {
      bgmMars.play().catch(() => {});
    } else {
      bgmMars.pause();
    }
  };

  btnSound.addEventListener("click", () => {
    soundEnabled = !soundEnabled;
    btnSound.textContent = soundEnabled ? "🔊" : "🔇";
    btnSound.title = soundEnabled ? "Mars UIN Aktif" : "Suara Dimatikan";
    syncMarsAudio();
    if (soundEnabled) playTone(680, 0.06);
  });

  // ==================== KONTROL VIDEO DEMO WEB ====================
  const playWebVideo = (vidId) => {
    Object.entries(videos).forEach(([id, el]) => {
      if (!el) return;
      if (id === vidId && isTargetVisible) {
        el.play().catch(() => {});
      } else {
        el.pause();
      }
    });
    karyaVideoScreen?.setAttribute("src", `#${vidId}`);
  };

  const pauseAllVideos = () => {
    Object.values(videos).forEach((el) => el?.pause());
  };

  // ==================== DATA KONTEN ====================
  const menuData = {
    utama: {
      title: "Selamat Datang di Prodi SI",
      desc: "Sentuh Medali 3D atau pilih menu di bawah untuk menjelajahi profil, jalur masuk, prospek karir, dan inovasi mahasiswa.",
      link: null,
      accent: "#10b981",
    },
    profil: {
      title: "Visi Prodi Sistem Informasi",
      desc: "Unggul dalam Bidang Sistem Informasi yang bereputasi Global yang Terintegrasi dengan Nilai-nilai Keislaman, Teknologi Terkini, dan Kebutuhan Industri.",
      link: "https://uinmybatusangkar.ac.id",
      accent: "#38bdf8",
    },
    daftar: {
      title: "Info Pendaftaran Mahasiswa Baru",
      desc: "Penerimaan dibuka melalui jalur SPAN-PTKIN, UM-PTKIN, dan Jalur Mandiri. Klik tombol di bawah untuk info jadwal & syarat resmi.",
      link: "https://pmb.uinmybatusangkar.ac.id",
      accent: "#10b981",
    },
    karir: {
      title: "Prospek Karir Lulusan SI",
      desc: "Siap berkarir sebagai System Analyst, Full-Stack Developer, UI/UX Designer, Data Analyst, ERP Consultant, hingga IT Project Manager.",
      link: null,
      accent: "#818cf8",
    },
    karya: {
      title: "Showcase Karya Mahasiswa",
      desc: "Pilih salah satu proyek di atas untuk melihat demo aplikasi web dan prototipe IoT mahasiswa Sistem Informasi.",
      link: null,
      accent: "#10b981",
    },
    hmps: {
      title: "Kegiatan HMPS SI",
      desc: "Aktif menggelar IT FEST, workshop pemrograman & desain grafis, pengabdian masyarakat, serta kegiatan pengembangan soft-skill mahasiswa.",
      link: "https://instagram.com",
      accent: "#f43f5e",
    },
  };

  const profilData = {
    visi: {
      title: "Visi Prodi Sistem Informasi",
      desc: "Unggul dalam Bidang Sistem Informasi yang bereputasi Global yang Terintegrasi dengan Nilai-nilai Keislaman, Teknologi Terkini, dan Kebutuhan Industri.",
      badge3d: "VISI PRODI SI",
      text3d:
        "Unggul dalam Bidang Sistem Informasi\nyang bereputasi Global yang Terintegrasi\ndengan Nilai-nilai Keislaman,\nTeknologi Terkini, dan Kebutuhan Industri.",
    },
    misi: {
      title: "Misi Prodi Sistem Informasi",
      desc: "1. Menyelenggarakan pendidikan bermutu dalam bidang sistem informasi terintegrasi nilai-nilai keislaman.\n2. Mengelola program studi secara profesional, kompeten, dan berdaya saing nasional & internasional.\n3. Melaksanakan pengabdian masyarakat berorientasi pengembangan IPTEK di bidang Sistem Informasi.\n4. Melaksanakan penelitian keilmuan Sistem Informasi yang integratif.\n5. Menjalin kerjasama strategis dengan pemerintah, industri, dan institusi pendidikan dalam & luar negeri.",
      badge3d: "MISI PRODI SI",
      text3d:
        "1. Pendidikan bermutu bernilai keislaman\n2. Tata kelola profesional & berdaya saing\n3. Pengabdian masyarakat berbasis IPTEK SI\n4. Penelitian keilmuan SI yang integratif\n5. Kerjasama strategis dalam & luar negeri",
    },
    tujuan: {
      title: "Tujuan Prodi Sistem Informasi",
      desc: "1. Menghasilkan lulusan berkompetensi tinggi dalam pengembangan & penerapan SI sesuai kebutuhan industri dan ekonomi syariah.\n2. Menghasilkan karya ilmiah inovatif yang berkontribusi di bidang ekonomi dan bisnis.\n3. Meningkatkan pengabdian masyarakat melalui pemanfaatan TI untuk ekonomi berbasis keislaman.\n4. Mewujudkan tata kelola program studi yang transparan, akuntabel, dan berkeadilan.",
      badge3d: "TUJUAN PRODI SI",
      text3d:
        "1. Lulusan kompeten di industri & ekonomi syariah\n2. Karya ilmiah inovatif di ekonomi & bisnis\n3. Pemanfaatan TI untuk ekonomi keislaman\n4. Tata kelola transparan, akuntabel & adil",
    },
  };

  const karyaData = {
    koperasiku: {
      title: "Koperasiku (Web App)",
      desc: "Aplikasi manajemen koperasi digital berbasis Laravel, Inertia.js, dan Vue.js untuk pengelolaan data anggota serta transaksi simpan pinjam.",
      color: "#10b981",
      mediaType: "video",
      videoId: "vid-1",
      badge: "DEMO WEB • KOPERASIKU",
      link: null,
    },
    egoosport: {
      title: "Egoo Sport (E-Commerce)",
      desc: "Platform e-commerce perlengkapan olahraga berbasis PHP & MySQL dengan katalog interaktif dan sistem keranjang belanja.",
      color: "#f97316",
      mediaType: "video",
      videoId: "vid-2",
      badge: "DEMO WEB • EGOO SPORT",
      link: null,
    },
    spksmart: {
      title: "SPK MVP La Liga (SMART)",
      desc: "Sistem Penunjang Keputusan berbasis Laravel & Vue.js menggunakan metode SMART, lengkap dengan grafik interaktif dan ekspor PDF.",
      color: "#eab308",
      mediaType: "video",
      videoId: "vid-3",
      badge: "DEMO WEB • SPK SMART",
      link: "https://github.com/opwares546/spk-laliga",
    },
    ews: {
      title: "EWS Anti-Drone (IoT + AI)",
      desc: "Sistem peringatan dini pendeteksi drone menggabungkan sensor radar ESP8266, computer vision YOLOv8, dan pelacakan kamera otomatis.",
      color: "#f43f5e",
      mediaType: "model",
      model: "drone",
      label: "EWS ANTI-DRONE\nIoT Radar & YOLOv8 AI",
      link: null,
    },
    smartcar: {
      title: "Smart Robot Car (IoT)",
      desc: "Mobil robot pintar berbasis ESP8266 Wi-Fi dengan layar OLED ekspresif yang dikembangkan untuk pameran teknologi kampus.",
      color: "#38bdf8",
      mediaType: "model",
      model: "robot",
      label: "SMART ROBOT CAR\nESP8266 Wi-Fi + OLED",
      link: null,
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

  let currentMenu = "utama";
  let activeProfilKey = "visi";
  let activeKaryaKey = "koperasiku";

  // ==================== MULAI KAMERA AR ====================
  btnStart.addEventListener("click", async () => {
    playTone(520, 0.09);

    if (bgmMars) {
      bgmMars
        .play()
        .then(() => {
          bgmMars.pause();
          bgmMars.currentTime = 0;
        })
        .catch(() => {});
    }
    Object.values(videos).forEach((v) => {
      if (!v) return;
      v.play()
        .then(() => {
          v.pause();
          v.currentTime = 0;
        })
        .catch(() => {});
    });

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
    isTargetVisible = true;
    scannerOverlay.style.display = "none";
    hudNav.style.display = "flex";
    sideControls.style.display = "flex";
    statusDot.classList.add("found");
    statusText.textContent = "Marker Terdeteksi";

    scenes[currentMenu]?.emit("popin");
    syncMarsAudio();

    if (currentMenu === "karya") {
      const currentItem = karyaData[activeKaryaKey];
      if (currentItem?.mediaType === "video") {
        playWebVideo(currentItem.videoId);
      }
    }
  });

  targetEl.addEventListener("targetLost", () => {
    isTargetVisible = false;
    scannerOverlay.style.display = "flex";
    statusDot.classList.remove("found");
    statusText.textContent = "Mencari Marker...";

    syncMarsAudio();
    pauseAllVideos();
  });

  // ==================== GANTI 6 MENU ====================
  const switchMenu = (key) => {
    currentMenu = key;
    playTone(620, 0.06);

    Object.entries(scenes).forEach(([k, el]) => {
      if (!el) return;
      const active = k === key;
      el.setAttribute("visible", active);
      if (active) el.emit("popin");
    });

    hudButtons.forEach((btn) => {
      btn.classList.toggle("active", btn.dataset.menu === key);
    });

    const data = menuData[key];
    if (data?.accent) {
      pedestalRing?.setAttribute("color", data.accent);
      accentLight?.setAttribute("color", data.accent);
    }

    // Atur visibilitas sub-menu Profil & Karya
    profilPillsBox.style.display = key === "profil" ? "flex" : "none";
    karyaPillsBox.style.display = key === "karya" ? "flex" : "none";

    if (key === "profil") {
      pauseAllVideos();
      selectProfil(activeProfilKey);
    } else if (key === "karya") {
      selectKarya(activeKaryaKey);
    } else {
      pauseAllVideos();
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

  const selectProfil = (profilKey) => {
    const item = profilData[profilKey];
    if (!item) return;

    activeProfilKey = profilKey;
    profilPills.forEach((p) =>
      p.classList.toggle("active", p.dataset.profil === profilKey),
    );
    cardTitle.textContent = item.title;
    cardDesc.textContent = item.desc;

    cardLink.href = menuData.profil.link;
    cardLink.style.display = "inline-block";

    profil3dBadge?.setAttribute("value", item.badge3d);
    profil3dText?.setAttribute("value", item.text3d);
    scenes.profil?.emit("popin");
  };

  const selectKarya = (karyaKey) => {
    const item = karyaData[karyaKey];
    if (!item) return;

    activeKaryaKey = karyaKey;
    karyaPills.forEach((p) =>
      p.classList.toggle("active", p.dataset.karya === karyaKey),
    );
    cardTitle.textContent = item.title;
    cardDesc.textContent = item.desc;

    if (item.link) {
      cardLink.href = item.link;
      cardLink.style.display = "inline-block";
    } else {
      cardLink.style.display = "none";
    }

    pedestalRing?.setAttribute("color", item.color);
    accentLight?.setAttribute("color", item.color);

    if (item.mediaType === "video") {
      karyaVideoWrapper?.setAttribute("visible", true);
      karyaModelWrapper?.setAttribute("visible", false);
      karyaLabelBox?.setAttribute("visible", false);

      karyaVideoFrame?.setAttribute("color", item.color);
      karyaVideoBadgeBg?.setAttribute("color", item.color);
      karyaVideoBadge?.setAttribute("value", item.badge);
      playWebVideo(item.videoId);
    } else {
      pauseAllVideos();
      karyaVideoWrapper?.setAttribute("visible", false);
      karyaModelWrapper?.setAttribute("visible", true);
      karyaLabelBox?.setAttribute("visible", true);

      Object.entries(karyaModels).forEach(([mKey, mEl]) => {
        if (mEl) mEl.setAttribute("visible", mKey === item.model);
      });
      karya3dLabel?.setAttribute("value", item.label);
    }

    scenes.karya?.emit("popin");
  };

  hudButtons.forEach((btn) => {
    btn.addEventListener("click", () => switchMenu(btn.dataset.menu));
  });

  profilPills.forEach((pill) => {
    pill.addEventListener("click", () => {
      playTone(720, 0.05);
      selectProfil(pill.dataset.profil);
    });
  });

  karyaPills.forEach((pill) => {
    pill.addEventListener("click", () => {
      playTone(720, 0.05);
      selectKarya(pill.dataset.karya);
    });
  });

  btnCloseCard.addEventListener("click", () => {
    playTone(400, 0.05);
    infoCard.classList.remove("show");
  });

  heroObj?.addEventListener("click", () => {
    playTone(900, 0.09, "triangle");
    heroObj.emit("tapped");
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
    playTone(600, 0.05);
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

    ctx.drawImage(video, 0, 0, outCanvas.width, outCanvas.height);
    ctx.drawImage(glCanvas, 0, 0, outCanvas.width, outCanvas.height);

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
