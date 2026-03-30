import { useEffect, useState } from 'react'
import axios from 'axios'

function App() {
  const [status, setStatus] = useState("Menghubungkan...")
  const [countdown, setCountdown] = useState(null)
  const [isCapturing, setIsCapturing] = useState(false)
  const [photoUrl, setPhotoUrl] = useState(null) // State untuk simpan hasil foto

  useEffect(() => {
    axios.get('http://localhost:5000/api/status')
      .then(res => setStatus(res.data.message))
      .catch(err => setStatus("Gagal terhubung ke backend"));
  }, [])

  const startPhotoProcess = () => {
    setIsCapturing(true)
    setPhotoUrl(null) // Reset foto lama sebelum jepret baru
    let timer = 3
    setCountdown(timer)

    const interval = setInterval(() => {
      timer--
      setCountdown(timer)

      if (timer === 0) {
        clearInterval(interval)
        setCountdown("CHEESE! 📸")

        // MEMANGGIL BACKEND UNTUK JEPRET KAMERA
        axios.post('http://localhost:5000/api/capture')
          .then(res => {
            // Berhasil jepret, simpan URL fotonya
            setPhotoUrl(res.data.url)
            
            // Tunggu 2 detik agar pesan "CHEESE" terlihat, lalu kembali normal
            setTimeout(() => {
              setCountdown(null)
              setIsCapturing(false)
            }, 2000)
          })
          .catch(err => {
            console.error(err)
            alert("Terjadi kesalahan pada kamera!")
            setCountdown(null)
            setIsCapturing(false)
          })
      }
    }, 1000)
  }

  return (
    <div style={{ textAlign: 'center', marginTop: '50px', fontFamily: 'Arial, sans-serif' }}>
      <h1>📸 SnapBooth System</h1>
      <p>Status Server: <span style={{ color: status.includes('Siap') ? 'green' : 'red', fontWeight: 'bold' }}>{status}</span></p>
      
      <hr style={{ width: '50%', margin: '20px auto', opacity: 0.3 }} />

      {/* Tampilan Hitung Mundur */}
      {countdown ? (
        <div style={{ height: '300px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <h1 style={{ fontSize: '120px', color: '#ff4757', margin: 0 }}>{countdown}</h1>
        </div>
      ) : (
        <div style={{ height: '300px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
          
          {/* Tampilan Hasil Foto Jika Sudah Ada */}
          {photoUrl && (
            <div style={{ marginBottom: '20px' }}>
              <img 
                src={photoUrl} 
                alt="Hasil Foto" 
                style={{ 
                  width: '400px', 
                  borderRadius: '15px', 
                  boxShadow: '0 10px 30px rgba(0,0,0,0.2)',
                  border: '8px solid white' 
                }} 
              />
              <p style={{ color: '#666' }}>Hasil jepretan webcam kamu!</p>
            </div>
          )}

          <button 
            onClick={startPhotoProcess}
            disabled={isCapturing}
            style={{ 
              padding: '25px 50px', 
              fontSize: '24px', 
              borderRadius: '50px', 
              backgroundColor: isCapturing ? '#ccc' : '#1e90ff', 
              color: 'white',
              border: 'none',
              cursor: isCapturing ? 'not-allowed' : 'pointer',
              boxShadow: '0 10px 20px rgba(30, 144, 255, 0.3)',
              transition: 'all 0.3s ease'
            }}
          >
            {isCapturing ? "SEDANG MEMPROSES..." : "MULAI FOTO"}
          </button>
        </div>
      )}

      <footer style={{ marginTop: '50px', fontSize: '12px', color: '#999' }}>
        SnapBooth Project v1.0 - IT & DKV Collaboration
      </footer>
    </div>
  )
}

export default App