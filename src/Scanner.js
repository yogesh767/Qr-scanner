import React, { useEffect, useState, useRef } from "react";
import QrScanner from "qr-scanner";
import userData from './userData.json'


const QRScanner = () => {
  const [scanResult, setScanResult] = useState(null);
  const [error, setError] = useState(null);
  const [user,setUser]=useState(null)
  const videoRef = useRef(null);
  const fileInputRef = useRef(null);
  console.log("scanResult",scanResult)
useEffect(()=>{
  setUser(userData.filter(item=> item.qr_code_id == scanResult))
},[scanResult,userData])
  useEffect(() => {
    const scanner = new QrScanner(
      videoRef.current,
      (result) => {
        setScanResult(result.data);
        scanner.stop(); // Stop scanning after successful read
      },
      {
        returnDetailedScanResult: true,
        highlightScanRegion: true,
        highlightCodeOutline: true,
      }
    );

    scanner.start().catch((err) => setError("Camera not accessible"));

    return () => scanner.stop(); // Cleanup when unmounting
  }, []);

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    try {
      const result = await QrScanner.scanImage(file);
      setScanResult(result);
    } catch (err) {
      setError("No QR code found in the image");
    }
  };

  return (
    <div className="qr-container">
      <h2>QR Code Scanner</h2>

      {/* Live Camera Preview */}
      <video ref={videoRef} style={{ width: "100%", height: "300px", background: "#eee" }}></video>

      {/* Upload Image to Scan QR */}
      <input
        type="file"
        accept="image/*"
        ref={fileInputRef}
        onChange={handleFileUpload}
        style={{ marginTop: "10px" }}
      />

      {/* Show Scanned Result */}
      {scanResult && <p className="qr-result">✅ Scanned Data: {JSON.stringify(user)}</p>}
      {error && <p className="qr-error">⚠️ {error}</p>}
    </div>
  );
};

export default QRScanner;
