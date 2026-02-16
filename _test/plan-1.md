### Phase 1: Persiapan "Hidden Origin" di Cloudflare Tunnel

Langkah ini bertujuan untuk memindahkan domain utama kamu dari jalur langsung Tunnel agar bisa "dijaga" oleh Worker.

1. Buka dashboard **Cloudflare Zero Trust** > **Networks** > **Tunnels**.
2. Pilih tunnel **vm-clawser** dan klik **Edit**.
3. Buka tab **Public Hostname**.
4. Cari baris `iseries.my.id` dan klik **Edit**.
5. Ubah **Public Hostname** dari `iseries.my.id` menjadi `origin-rabastrim.iseries.my.id`.
6. Pastikan **Service** tetap mengarah ke `http://localhost:3001`.
7. Klik **Save**.

---

### Phase 2: Implementasi Script Failover di Cloudflare Workers

Sekarang kita akan memasang logika "satpam" pada Worker kamu.

1. Buka dashboard **Workers & Pages** dan pilih worker `under-maintenance`.
2. Klik **Edit Code** dan masukkan script berikut:

```javascript
export default {
  async fetch(request, env) {
    // 1. Alamat origin rahasia kamu yang baru saja dibuat
    const originURL = "https://origin-rabastrim.iseries.my.id";
    
    // 2. Alamat halaman maintenance kamu
    const maintenanceURL = "https://under-maintenance.atokurn.workers.dev/";

    try {
      // Coba ambil data dari server VM kamu
      const response = await fetch(originURL, request);

      // Jika server VM merespons dengan error (Bad Gateway / Timeout)
      if (response.status === 502 || response.status === 504 || response.status === 503) {
        return await fetch(maintenanceURL);
      }

      return response;
    } catch (e) {
      // Jika Tunnel benar-benar mati total atau koneksi gagal
      return await fetch(maintenanceURL);
    }
  }
}

```

---

### Phase 3: Menghubungkan Worker ke Domain Utama

Agar Worker ini menjadi gerbang utama untuk `iseries.my.id`.

1. Masih di menu Worker, buka tab **Settings** > **Domains & Routes**.
2. Klik **Add Custom Domain**.
3. Masukkan `iseries.my.id`.
4. Cloudflare akan mengonfigurasi DNS secara otomatis untuk mengarahkan trafik domain tersebut ke Worker ini.

---

### Phase 4: Skenario Pengujian (Testing)

Kamu perlu memastikan sistem ini bekerja sebelum benar-benar melakukan perbaikan besar pada VM Ubuntu dengan RAM **1.91 GB** tersebut.

| Aksi | Hasil yang Diharapkan |
| --- | --- |
| **Server Nyala (`pm2 start rabastrim`)** | Website `iseries.my.id` terbuka normal. |
| **Server Mati (`pm2 stop rabastrim`)** | Website otomatis menampilkan halaman maintenance kamu. |
| **Koneksi Tunnel Putus (`sudo systemctl stop cloudflared`)** | Website otomatis menampilkan halaman maintenance. |

