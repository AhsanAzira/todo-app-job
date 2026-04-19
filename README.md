# 🌌 Manajemen Tugas Kuliah (Space-Themed To-Do App)

Aplikasi web manajemen tugas (To-Do List) modern yang dirancang khusus untuk membantu mahasiswa tetap terorganisir. Dilengkapi dengan latar belakang *canvas* luar angkasa yang interaktif, manajemen mata kuliah dinamis, dan pelacakan tenggat waktu.

## ✨ Fitur Utama

- **Latar Belakang Interaktif:** Animasi rasi bintang di latar belakang yang bereaksi terhadap pergerakan kursor mouse pengguna.
- **Manajemen Mata Kuliah Dinamis:** Pengguna dapat menambah (bahkan banyak sekaligus menggunakan pemisah koma) dan menghapus daftar mata kuliah sesuai jadwal semester.
- **Pelacakan Status Tugas:** Pemisahan tab antara tugas yang masih **Aktif** dan yang sudah **Selesai**.
- **Indikator Tenggat Waktu & Prioritas:** Menampilkan penanda khusus untuk tugas dengan prioritas tinggi dan peringatan teks merah untuk tugas yang sudah melewati tenggat waktu (*overdue*).
- **Catatan Detail:** Mendukung penambahan instruksi atau catatan panjang untuk setiap tugas.
- **Penyimpanan Lokal (Offline Ready):** Seluruh data tugas dan daftar mata kuliah tersimpan aman di dalam *browser* menggunakan Local Storage API, sehingga data tidak hilang saat halaman dimuat ulang.
- **Desain Responsif:** Tampilan *Glassmorphism* elegan yang nyaman digunakan baik di layar laptop maupun *smartphone*.

## 🛠️ Teknologi yang Digunakan

Aplikasi ini dibangun murni menggunakan teknologi *Front-End* tanpa *framework* (Vanilla), memastikan performa yang sangat ringan dan cepat:

- **HTML5:** Struktur semantik halaman.
- **CSS3:** *Styling*, variabel CSS, efek *Glassmorphism* (backdrop-filter), dan animasi.
- **Vanilla JavaScript:** Manipulasi DOM, logika aplikasi, manajemen *state*, dan animasi *Canvas* API.
- **Local Storage API:** Penyimpanan data sisi klien (*Client-side database*).

## 🚀 Cara Menjalankan Secara Lokal

Karena aplikasi ini sepenuhnya statis (tidak menggunakan *backend* server tradisional), cara menjalankannya sangat mudah:

1. **Clone repositori ini** ke komputer Anda:
   ```bash
   git clone [https://github.com/UsernameAnda/NamaRepositoriAnda.git](https://github.com/UsernameAnda/NamaRepositoriAnda.git)
