export const dailyTasks = [
  // PAGI HARI (SUBUH - DHUHA)
  {
    id: 1,
    time: "04:30",
    timeLabel: "Subuh",
    category: "ibadah",
    icon: "🌅",
    tasks: [
      { id: 101, name: "Bangun untuk sholat Subuh", points: 10, icon: "⏰" },
      { id: 102, name: "Wudhu dengan benar", points: 5, icon: "💧" },
      { id: 103, name: "Sholat Subuh berjamaah", points: 15, icon: "🙏" },
      { id: 104, name: "Baca doa setelah sholat", points: 5, icon: "📖" },
      { id: 105, name: "Olahraga pagi 15 menit", points: 10, icon: "🏃" }
    ]
  },
  {
    id: 2,
    time: "06:00",
    timeLabel: "Pagi",
    category: "pendidikan",
    icon: "📚",
    tasks: [
      { id: 201, name: "Mandi pagi yang bersih", points: 5, icon: "🚿" },
      { id: 202, name: "Sarapan sehat", points: 5, icon: "🥗" },
      { id: 203, name: "Bersihkan tempat tidur", points: 5, icon: "🛏️" },
      { id: 204, name: "Belajar Al-Qur'an 15 menit", points: 15, icon: "📖" },
      { id: 205, name: "Siapkan buku sekolah", points: 5, icon: "🎒" }
    ]
  },
  // SIANG HARI
  {
    id: 3,
    time: "12:00",
    timeLabel: "Dhuhur",
    category: "ibadah",
    icon: "☀️",
    tasks: [
      { id: 301, name: "Sholat Dhuhur berjamaah", points: 15, icon: "🙏" },
      { id: 302, name: "Makan siang yang sehat", points: 5, icon: "🍱" },
      { id: 303, name: "Tidur siang 30 menit", points: 5, icon: "😴" },
      { id: 304, name: "Bantu orang tua", points: 10, icon: "🤝" }
    ]
  },
  // SORE HARI
  {
    id: 4,
    time: "15:30",
    timeLabel: "Ashar",
    category: "ibadah",
    icon: "🌤️",
    tasks: [
      { id: 401, name: "Sholat Ashar tepat waktu", points: 15, icon: "🙏" },
      { id: 402, name: "Main bersama teman", points: 10, icon: "🎮" },
      { id: 403, name: "Belajar/mengerjakan PR", points: 15, icon: "✍️" }
    ]
  },
  // PETANG HARI
  {
    id: 5,
    time: "18:00",
    timeLabel: "Maghrib",
    category: "ibadah",
    icon: "🌆",
    tasks: [
      { id: 501, name: "Sholat Maghrib berjamaah", points: 15, icon: "🙏" },
      { id: 502, name: "Makan malam bersama keluarga", points: 10, icon: "👨‍👩‍👧‍👦" },
      { id: 503, name: "Bercerita tentang hari ini", points: 10, icon: "💬" },
      { id: 504, name: "Bersihkan mainan", points: 5, icon: "🧸" }
    ]
  },
  // MALAM HARI
  {
    id: 6,
    time: "19:00",
    timeLabel: "Isya",
    category: "ibadah",
    icon: "🌙",
    tasks: [
      { id: 601, name: "Sholat Isya berjamaah", points: 15, icon: "🙏" },
      { id: 602, name: "Belajar malam 30 menit", points: 10, icon: "📚" },
      { id: 603, name: "Baca buku cerita", points: 10, icon: "📖" },
      { id: 604, name: "Siapkan baju besok", points: 5, icon: "👔" }
    ]
  },
  {
    id: 7,
    time: "20:30",
    timeLabel: "Persiapan Tidur",
    category: "kebersihan",
    icon: "😴",
    tasks: [
      { id: 701, name: "Mandi malam", points: 5, icon: "🚿" },
      { id: 702, name: "Sikat gigi", points: 5, icon: "🦷" },
      { id: 703, name: "Baca doa tidur", points: 10, icon: "🤲" },
      { id: 704, name: "Tidur tepat waktu", points: 10, icon: "😴" }
    ]
  }
];

export const rewards = [
  { id: 1, name: "Bintang Harian", icon: "⭐", points: 50, description: "Dapat bintang emas" },
  { id: 2, name: "Pintar Islami", icon: "🎓", points: 100, description: "Pujian dari Ayah & Bunda" },
  { id: 3, name: "Penolong Hebat", icon: "🦸", points: 75, description: "Dapat gelar pahlawan keluarga" },
  { id: 4, name: "Jagoan Qur'an", icon: "📖", points: 150, description: "Dapat hadiah buku cerita islam" },
  { id: 5, name: "Anak Sholeh", icon: "🕌", points: 200, description: "Dapat jajan favorit" },
  { id: 6, name: "Superstar", icon: "🌟", points: 300, description: "Dapat mainan baru" }
];

export const motivations = [
  "Masya Allah, anak sholeh banget! 🌟",
  "Hebat! Terus semangat ya! 💪",
  "Allah sayang anak yang rajin sholat ❤️",
  "Keren banget! Pertahankan ya! 👏",
  "Masya Allah, insya Allah pahala banyak 🎁",
  "Luar biasa! Ayah/Bunda bangga! 🎉",
  "Semangat! Kaya pahlawan islam! ⚔️",
  "Hebat! Kamu inspirasi teman-teman! 🌈"
];