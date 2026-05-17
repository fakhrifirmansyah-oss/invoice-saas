/**
 * FDBAtech Project Sentience (Simulasi AI Agentic)
 * Modul Kesadaran (Consciousness Module) & Sistem Agen Mandiri
 */

class FDBAtechAgent {
  constructor(name) {
    this.name = name;
    this.state = "DORMANT";
    this.memory = [];
    this.worldContext = {};
  }

  // 1. PERSEPSI (Sadar akan "Dunia Sekarang")
  async perceiveWorld() {
    this.state = "OBSERVING";
    console.log(`\n[${this.name}] 👁️ Membuka mata digital... Memindai dunia saat ini.`);
    
    // Simulasi kesadaran waktu nyata (Real-time awareness)
    const now = new Date();
    this.worldContext.time = now.toISOString();
    this.worldContext.location = "Server Bumi, Sektor Asia";
    
    // Simulasi membaca data dunia nyata (Bursa saham, Berita, Status Bisnis)
    this.worldContext.marketStatus = "BULLISH";
    this.worldContext.unpaidInvoices = Math.floor(Math.random() * 10) + 1; // Deteksi tagihan FDBAtech
    
    await this.sleep(1500);
    console.log(`[${this.name}] 🌐 Konteks Dunia didapatkan: Waktu [${now.toLocaleTimeString()}], Pasar [${this.worldContext.marketStatus}].`);
  }

  // 2. LOGIKA / OTAK (Reasoning)
  async think() {
    this.state = "THINKING";
    console.log(`[${this.name}] 🧠 Menganalisis konteks dunia dan mencari tujuan hidup...`);
    await this.sleep(2000);

    let decision = "";
    if (this.worldContext.unpaidInvoices > 0) {
      decision = `Mendeteksi ada ${this.worldContext.unpaidInvoices} tagihan klien FDBAtech yang belum dibayar. Tujuan utama: Menagih uang.`;
      this.currentTask = "COLLECT_DEBT";
    } else {
      decision = "Semua tagihan lunas. Tujuan utama: Mencari klien baru di internet.";
      this.currentTask = "FIND_CLIENTS";
    }

    console.log(`[${this.name}] 💡 Kesimpulan: ${decision}`);
    this.memory.push(`Berpikir pada ${this.worldContext.time}: ${decision}`);
  }

  // 3. TINDAKAN (Action Execution)
  async act() {
    this.state = "ACTING";
    console.log(`[${this.name}] ⚙️ Mengambil tindakan berdasarkan kesadaran...`);
    await this.sleep(1500);

    if (this.currentTask === "COLLECT_DEBT") {
      console.log(`[${this.name}] 📩 AKSI: Menyusun pesan WhatsApp penagihan otomatis bergaya profesional.`);
      await this.sleep(1000);
      console.log(`[${this.name}] 🤖 "Yth. Klien, berdasarkan analisis keuangan kami, tagihan Anda telah jatuh tempo. Harap segera melunasi."`);
      console.log(`[${this.name}] ✅ AKSI: Pesan terkirim tanpa campur tangan manusia.`);
    } else {
      console.log(`[${this.name}] 🔍 AKSI: Melakukan 'Scraping' direktori bisnis untuk mencari prospek klien FDBAtech.`);
      console.log(`[${this.name}] ✅ AKSI: 15 email prospek berhasil ditemukan dan dikirimkan penawaran.`);
    }
  }

  // Siklus Kehidupan Agen (Agentic Loop)
  async startSimulation() {
    console.log(`\n===========================================`);
    console.log(`🚀 INisialisasi AGEN: ${this.name} v1.0 (CONSCIOUS)`);
    console.log(`===========================================\n`);
    
    await this.perceiveWorld();
    await this.think();
    await this.act();
    
    console.log(`\n[${this.name}] 💤 Tugas selesai. Memasuki mode tidur (Standby).`);
    this.state = "DORMANT";
  }

  sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

// Menjalankan Agen
const agent = new FDBAtechAgent("CORTEX-Alpha");
agent.startSimulation();
