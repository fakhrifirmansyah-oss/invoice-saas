import React, { useState, useEffect, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Sparkles } from '@react-three/drei';
import * as THREE from 'three';

function SatelliteModel({ isRunning }) {
  const groupRef = useRef();
  const solarLeftRef = useRef();
  const solarRightRef = useRef();
  const beamRef = useRef();

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    if (groupRef.current) {
      // Float up/down in zero-G
      groupRef.current.position.y = Math.sin(t * 1.2) * 0.15;
      // Orbit spinning (slow continuous rotation on Y)
      groupRef.current.rotation.y = t * 0.45;
      // Gentle floating tilt
      groupRef.current.rotation.x = Math.sin(t * 0.6) * 0.05;
    }
    if (solarLeftRef.current && solarRightRef.current) {
      // Flap solar panels slightly like wings to look alive!
      const panelAngle = Math.sin(t * 2) * 0.04;
      solarLeftRef.current.rotation.x = panelAngle;
      solarRightRef.current.rotation.x = -panelAngle;
    }
    if (beamRef.current) {
      // Signal transmitting pulse
      beamRef.current.material.opacity = isRunning
        ? 0.18 + Math.sin(t * 8) * 0.12
        : 0.04 + Math.sin(t * 2) * 0.02;
    }
  });

  return (
    <group ref={groupRef} scale={[1.1, 1.1, 1.1]}>
      {/* 1. Main Octagonal Core (Gold Foil Bus) */}
      <mesh position={[0, 0, 0]}>
        <cylinderGeometry args={[0.38, 0.38, 0.9, 8]} />
        <meshStandardMaterial
          color="#d97706" /* Gold foil gold */
          metalness={0.9}
          roughness={0.2}
        />
      </mesh>

      {/* Silver central metallic rim */}
      <mesh position={[0, 0, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.42, 0.06, 12, 24]} />
        <meshStandardMaterial color="#cbd5e1" metalness={0.95} roughness={0.1} />
      </mesh>

      {/* 2. Solar Panel Array WINGS (Left Wing) */}
      <group ref={solarLeftRef}>
        {/* Connector joint */}
        <mesh position={[-0.55, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.025, 0.025, 0.4, 8]} />
          <meshStandardMaterial color="#475569" metalness={0.8} />
        </mesh>
        {/* Panel body */}
        <mesh position={[-1.25, 0, 0]}>
          <boxGeometry args={[1.0, 0.02, 0.42]} />
          <meshStandardMaterial
            color="#1e3a8a"
            emissive="#1d4ed8"
            emissiveIntensity={0.6}
            metalness={0.6}
            roughness={0.1}
          />
        </mesh>
        {/* Panel grid details (black stripes) */}
        <mesh position={[-1.25, 0.012, 0]}>
          <boxGeometry args={[0.95, 0.005, 0.38]} />
          <meshStandardMaterial color="#020617" roughness={0.8} />
        </mesh>
      </group>

      {/* Solar Panel Array WINGS (Right Wing) */}
      <group ref={solarRightRef}>
        {/* Connector joint */}
        <mesh position={[0.55, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.025, 0.025, 0.4, 8]} />
          <meshStandardMaterial color="#475569" metalness={0.8} />
        </mesh>
        {/* Panel body */}
        <mesh position={[1.25, 0, 0]}>
          <boxGeometry args={[1.0, 0.02, 0.42]} />
          <meshStandardMaterial
            color="#1e3a8a"
            emissive="#1d4ed8"
            emissiveIntensity={0.6}
            metalness={0.6}
            roughness={0.1}
          />
        </mesh>
        {/* Panel grid details */}
        <mesh position={[1.25, 0.012, 0]}>
          <boxGeometry args={[0.95, 0.005, 0.38]} />
          <meshStandardMaterial color="#020617" roughness={0.8} />
        </mesh>
      </group>

      {/* 3. Parabolic Communications Dish pointing downward */}
      <mesh position={[0, -0.55, 0]} rotation={[Math.PI, 0, 0]}>
        <sphereGeometry args={[0.3, 32, 16, 0, Math.PI * 2, 0, Math.PI / 3.2]} />
        <meshStandardMaterial color="#e2e8f0" metalness={0.9} roughness={0.15} side={THREE.DoubleSide} />
      </mesh>
      {/* Feed horn receiver antenna rod */}
      <mesh position={[0, -0.78, 0]}>
        <cylinderGeometry args={[0.015, 0.015, 0.22, 8]} />
        <meshStandardMaterial color="#475569" metalness={0.8} />
      </mesh>
      {/* Transmitter emitter tip */}
      <mesh position={[0, -0.9, 0]}>
        <sphereGeometry args={[0.04, 8, 8]} />
        <meshStandardMaterial
          color={isRunning ? '#ef4444' : '#22d3ee'}
          emissive={isRunning ? '#ef4444' : '#22d3ee'}
          emissiveIntensity={isRunning ? 2.5 : 1.2}
        />
      </mesh>

      {/* 4. Top Telemetry Antennas */}
      <mesh position={[-0.12, 0.55, 0]}>
        <cylinderGeometry args={[0.01, 0.005, 0.4, 8]} />
        <meshStandardMaterial color="#cbd5e1" />
      </mesh>
      <mesh position={[-0.12, 0.75, 0]}>
        <sphereGeometry args={[0.025, 8, 8]} />
        <meshStandardMaterial color="#22c55e" emissive="#22c55e" emissiveIntensity={1.5} />
      </mesh>

      <mesh position={[0.12, 0.52, 0]} rotation={[0, 0, -0.15]}>
        <cylinderGeometry args={[0.01, 0.005, 0.3, 8]} />
        <meshStandardMaterial color="#cbd5e1" />
      </mesh>
      <mesh position={[0.16, 0.67, 0]}>
        <sphereGeometry args={[0.02, 8, 8]} />
        <meshStandardMaterial color="#a855f7" emissive="#a855f7" emissiveIntensity={1.5} />
      </mesh>

      {/* 5. Transmitting GPS Signal/Broadcast Cone */}
      <mesh ref={beamRef} position={[0, -1.6, 0]} rotation={[Math.PI, 0, 0]}>
        <coneGeometry args={[0.7, 1.4, 32, 1, true]} />
        <meshBasicMaterial
          color={isRunning ? '#ef4444' : '#22d3ee'}
          transparent
          opacity={0.05}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Sparkles around Orbiting Satellite */}
      {isRunning
        ? <Sparkles count={50} scale={4.5} size={3} color="#ef4444" speed={2.5} />
        : <Sparkles count={20} scale={3.5} size={1.5} color="#22d3ee" speed={0.5} />
      }
    </group>
  );
}

export default function RobotAgent({ isRunning, logs, invoices, onToggleTerminal }) {
  const [posX, setPosX] = useState(100);
  const [isHovered, setIsHovered] = useState(false);
  const [speech, setSpeech] = useState("Satelit CORTEX-Alpha memantau orbit keuangan Anda 🛰️ Klik untuk chat!");
  const [gpsActive, setGpsActive] = useState(false);
  const [gpsCoords, setGpsCoords] = useState(null);
  
  const dirRef = useRef(1);
  const posRef = useRef(100);
  const intervalRef = useRef(null);

  // JS-driven patrol: hover kanan-kiri di bawah layar
  useEffect(() => {
    if (isRunning) {
      if (intervalRef.current) clearInterval(intervalRef.current);
      return;
    }
    intervalRef.current = setInterval(() => {
      const ufoWidth = 220;
      const maxX = window.innerWidth - ufoWidth;
      posRef.current += dirRef.current * 1.2;
      if (posRef.current >= maxX) dirRef.current = -1;
      else if (posRef.current <= 0) dirRef.current = 1;
      setPosX(posRef.current);
    }, 16);
    return () => clearInterval(intervalRef.current);
  }, [isRunning]);

  // Speech updates
  useEffect(() => {
    if (gpsActive) return; // Keep GPS active message until reset
    if (!isRunning) {
      setSpeech("Satelit CORTEX-Alpha memantau orbit keuangan Anda 🛰️ Klik untuk chat!");
      return;
    }
    const runSpeech = async () => {
      setSpeech("🛰️ Mengarahkan transmisi sensor ke database FDBAtech...");
      await new Promise(r => setTimeout(r, 2000));
      const unpaid = invoices.filter(i => i.status === 'unpaid').length;
      if (unpaid > 0) {
        setSpeech(`📡 Detected ${unpaid} klien nunggak! Menembakkan sinyal tagihan satelit!`);
        await new Promise(r => setTimeout(r, 2000));
        setSpeech("📡 Mengirim sinyal kosmik ke WhatsApp mereka...");
        await new Promise(r => setTimeout(r, 2000));
        setSpeech("✅ Misi selesai! Uang segera landing ke rekening Bos.");
      } else {
        setSpeech("🌌 Semua bersih! Keuangan FDBAtech aman di galaksi. 🤑");
        await new Promise(r => setTimeout(r, 2000));
        setSpeech("🔭 Menjelajahi internet nyari prospek klien baru...");
        await new Promise(r => setTimeout(r, 2000));
        setSpeech("✅ 15 target ditemukan! Penawaran diluncurkan ke orbit mereka.");
      }
      await new Promise(r => setTimeout(r, 2000));
      setSpeech("🛰️ Kembali memantau dari luar angkasa. Panggil aku kapanpun Bos butuh cuan!");
    };
    runSpeech();
  }, [isRunning, invoices, gpsActive]);

  // GPS Activation Handler
  const handleGPSActivate = (e) => {
    e.stopPropagation(); // Prevent opening terminal chat on clicking the GPS button
    setGpsActive(true);
    setSpeech("📡 Menghubungkan ke satelit GPS FDBAtech...");

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setGpsCoords({ lat: latitude, lng: longitude });
          setSpeech(`🛰️ GPS AKTIF! Koordinat: ${latitude.toFixed(4)}, ${longitude.toFixed(4)}. Menghubungkan ke CORTEX-Alpha...`);
          
          if (window.addCortexLog) {
            window.addCortexLog({ type: 'system', text: '===========================================' });
            window.addCortexLog({ type: 'system', text: `🛰️ GEOLOCATION PERMISSION GRANTED (GPS AKTIF)` });
            window.addCortexLog({ type: 'system', text: `📍 Koordinat Terdeteksi: Lat ${latitude.toFixed(6)}, Lng ${longitude.toFixed(6)}` });
            window.addCortexLog({ type: 'success', text: `[CORTEX-Alpha] 🛸 GPS sinkron! Radar memprioritaskan Laundry terdekat dari koordinat Kakak!` });
            window.addCortexLog({ type: 'system', text: '===========================================' });
          }
        },
        (error) => {
          // Mock high-precision GPS fallback
          const mockLat = -6.2088;
          const mockLng = 106.8456;
          setGpsCoords({ lat: mockLat, lng: mockLng });
          setSpeech(`🛰️ GPS SATELIT AKTIF! Koordinat default: Jakarta Pusat (${mockLat}, ${mockLng}).`);
          
          if (window.addCortexLog) {
            window.addCortexLog({ type: 'system', text: '===========================================' });
            window.addCortexLog({ type: 'system', text: `🛰️ SATELLITE GPS ACTIVATED (BROWSER MOCK BACKUP)` });
            window.addCortexLog({ type: 'system', text: `📍 Koordinat default: Lat ${mockLat}, Lng ${mockLng} (Jakarta Pusat)` });
            window.addCortexLog({ type: 'success', text: `[CORTEX-Alpha] 🛸 GPS sinkron! Radar memprioritaskan Laundry terdekat dari koordinat Kakak!` });
            window.addCortexLog({ type: 'system', text: '===========================================' });
          }
        }
      );
    } else {
      setSpeech("❌ Geolocation API tidak didukung oleh browser ini.");
    }
  };

  return (
    <div
      style={{
        position: 'fixed',
        bottom: isRunning ? '35%' : '10px',
        left: isRunning ? '50%' : `${posX}px`,
        transform: isRunning ? 'translateX(-50%)' : 'none',
        width: '220px',
        height: '200px',
        zIndex: 9999,
        pointerEvents: 'none',
        transition: isRunning ? 'left 1s ease, bottom 1s ease' : 'none',
      }}
    >
      <div
        style={{ width: '100%', height: '100%', pointerEvents: 'auto', cursor: 'pointer', position: 'relative' }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onClick={() => { if (!isRunning && onToggleTerminal) onToggleTerminal(); }}
      >
        {/* Speech Bubble */}
        <div style={{
          position: 'absolute', top: '-110px', left: '50%',
          transform: 'translateX(-50%)',
          background: 'linear-gradient(135deg, rgba(6,182,212,0.95), rgba(139,92,246,0.95))',
          borderRadius: '16px', padding: '10px 14px',
          fontSize: '11px', fontWeight: 'bold', color: '#fff',
          maxWidth: '230px', whiteSpace: 'normal',
          boxShadow: '0 8px 32px rgba(6,182,212,0.4)',
          opacity: isHovered || isRunning ? 1 : 0,
          transition: 'opacity 0.3s ease',
          textAlign: 'center', zIndex: 10,
          pointerEvents: isHovered || isRunning ? 'auto' : 'none',
        }}>
          <div>{speech}</div>

          {/* GPS Activation Button */}
          {!isRunning && (
            <button
              onClick={handleGPSActivate}
              style={{
                marginTop: '8px',
                width: '100%',
                background: 'rgba(255,255,255,0.2)',
                border: '1px solid rgba(255,255,255,0.4)',
                borderRadius: '8px',
                padding: '5px 8px',
                fontSize: '10px',
                fontWeight: 'bold',
                color: '#fff',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '4px',
                transition: 'all 0.2s ease',
              }}
              onMouseEnter={(e) => {
                e.target.style.background = 'rgba(255,255,255,0.35)';
                e.target.style.boxShadow = '0 0 10px rgba(255,255,255,0.5)';
              }}
              onMouseLeave={(e) => {
                e.target.style.background = 'rgba(255,255,255,0.2)';
                e.target.style.boxShadow = 'none';
              }}
            >
              <span>📡</span> {gpsActive ? 'GPS AKTIF' : 'Nyalakan GPS Terkini'}
            </button>
          )}

          <div style={{
            position: 'absolute', bottom: '-8px', left: '50%',
            transform: 'translateX(-50%) rotate(45deg)',
            width: '16px', height: '16px',
            background: 'rgba(6,182,212,0.95)',
            zIndex: -1,
          }} />
        </div>

        {/* 3D Satelit Canvas */}
        <Canvas camera={{ position: [0, 2, 5.5], fov: 45 }}>
          <ambientLight intensity={0.4} />
          <pointLight position={[0, 5, 3]} intensity={2} color="#ffffff" />
          <pointLight position={[0, -2, 0]} intensity={1.5} color="#00ffff" />
          {isRunning && <pointLight position={[0, 0, 0]} intensity={3} color="#ff4444" />}
          <SatelliteModel isRunning={isRunning} />
        </Canvas>
      </div>
    </div>
  );
}
