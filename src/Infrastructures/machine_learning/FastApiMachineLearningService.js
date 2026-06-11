export const makeFastApiMachineLearningService = () => {
  const predictRisk = async (sensorData) => {
    try {
      // Mencoba menelepon server Python FastAPI
      const response = await fetch('http://localhost:8000/predict', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(sensorData),
      });

      if (!response.ok) {
        throw new Error('Gagal mendapatkan prediksi dari ML');
      }

      const responseJson = await response.json();
      return responseJson.kategori_risiko;

    } catch (error) {
      // MOCKING SEMENTARA: Jika server Python belum nyala,
      // jangan throw error, tapi kembalikan nilai default agar Postman bisa lanjut jalan.
      console.log('⚠️ [WARNING] Server Python ML mati. Menggunakan hasil prediksi default.');
      return 'Risiko Sedang (Bypass Sementara)';
    }
  };

  return { predictRisk };
};

// /* eslint-disable preserve-caught-error */
// /**
//  * Bertugas menghubungi server Python FastAPI.
//  * @param {string} baseUrl - Alamat server ML (dari .env)
//  */
// export const makeFastApiMachineLearningService = (baseUrl) => {
//   const predictRisk = async (payload) => {
//     try {
//       const response = await fetch(`${baseUrl}/predict`, {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify(payload), // Berisi umur, bb, tb, dan data sensor
//       });

//       if (!response.ok) {
//         throw new Error(`HTTP Error dari ML Service: ${response.status}`);
//       }

//       const result = await response.json();
//       return result.klasifikasi; // Mengembalikan string, misal: "Risiko Sedang"

//     } catch (error) {
//       throw new Error(`Gagal menghubungi ML Service: ${error.message}`);
//     }
//   };

//   return { predictRisk };
// };