# User Management Dashboard 📊

Aplikasi dashboard manajemen pengguna yang dibangun dengan React.js, memungkinkan pengguna untuk melihat, menambahkan, mengedit, dan menghapus data pengguna. Aplikasi ini mengambil data dari API eksternal dan mengelola state menggunakan Redux Toolkit.

## Teknologi yang Digunakan 🛠️

- **React.js** - Library frontend
- **Redux Toolkit** - Manajemen state
- **Tailwind CSS** - Styling
- **RSuite** - Library komponen UI
- **Axios** - HTTP client
- **React Router** - Navigasi

## Fitur-fitur ✨

- **Tampilan Daftar Pengguna**
  - Melihat pengguna dalam format tabel
  - Data diambil dari JSONPlaceholder API
  - Kolom: ID, Nama, Email, Perusahaan, Aksi

- **Fungsi Pencarian**
  - Mencari pengguna berdasarkan nama atau email
  - Penyaringan secara real-time
  - State pencarian dikelola oleh Redux

- **Manajemen Pengguna**
  - Menambahkan pengguna baru
  - Mengedit detail pengguna yang ada
  - Menghapus pengguna dengan konfirmasi
  - Validasi formulir

- **Desain Responsif**
  - Antarmuka yang ramah seluler
  - Tata letak adaptif untuk berbagai ukuran layar

## Instalasi 🚀

1. Clone repository:
```bash
git clone [repository-url]
```

2. Install dependencies:
```bash
npm install
```

3. Jalankan server development:
```bash
npm run dev
```

## Cara Penggunaan 💡

1. **Melihat Pengguna**
   - Buka dashboard utama
   - Lihat semua pengguna dalam format tabel
   - Gunakan kolom pencarian untuk menyaring pengguna

2. **Menambah Pengguna**
   - Klik tombol "Tambah Pengguna"
   - Isi informasi yang diperlukan
   - Submit formulir

3. **Mengedit Pengguna**
   - Klik tombol "Edit" pada baris pengguna
   - Ubah informasi pengguna
   - Simpan perubahan

4. **Menghapus Pengguna**
   - Klik tombol "Hapus" pada baris pengguna
   - Konfirmasi penghapusan di popup
   - Pengguna akan dihapus dari daftar

## Integrasi API 🔌

Aplikasi menggunakan JSONPlaceholder API:
- Endpoint: `https://jsonplaceholder.typicode.com/users`
- Metode: GET
- Format data: JSON

## Lisensi 📄

Proyek ini dilisensikan di bawah Lisensi MIT - lihat file LICENSE untuk detail.

## Kontak 📬

Brahmasta Bagus Aryandra - brahmastabagus@gmail.com

Link Proyek: https://bit.ly/PortfolioBrahmasta

---

Selamat mencoba! 🚀