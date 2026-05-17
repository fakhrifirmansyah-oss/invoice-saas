import React, { useState, useEffect, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Sparkles } from '@react-three/drei';
import * as THREE from 'three';

function UFOLight({ angle, isRunning }) {
  const r = 1.35;
  const x = Math.cos(angle) * r;
  const z = Math.sin(angle) * r;
  return (
    <mesh position={[x, -0.08, z]}>
      <sphereGeometry args={[0.1, 8, 8]} />
      <meshStandardMaterial
        color={isRunning ? '#ef4444' : ['#00ffff', '#ff00ff', '#ffff00', '#00ff88'][Math.floor(angle * 2) % 4]}
        emissive={isRunning ? '#ef4444' : '#00ffff'}
        emissiveIntensity={2}
      />
    </mesh>
  );
}

function UFOCore({ isRunning }) {
  const groupRef = useRef();
  const domeRef = useRef();
  const lightRingRef = useRef();
  const beamRef = useRef();

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    if (groupRef.current) {
      // Hovering up/down
      groupRef.current.position.y = Math.sin(t * 1.5) * 0.18;
      // Gentle tilt
      groupRef.current.rotation.z = Math.sin(t * 0.8) * 0.06;
    }
    if (lightRingRef.current) {
      // Spin the light ring
      lightRingRef.current.rotation.y += isRunning ? 0.08 : 0.025;
    }
    if (domeRef.current) {
      // Dome pulses when running
      const scale = isRunning ? 1 + Math.sin(t * 8) * 0.05 : 1;
      domeRef.current.scale.set(scale, scale, scale);
    }
    if (beamRef.current) {
      beamRef.current.material.opacity = isRunning
        ? 0.15 + Math.sin(t * 6) * 0.1
        : 0.05 + Math.sin(t * 2) * 0.03;
    }
  });

  const numLights = 12;

  return (
    <group ref={groupRef}>
      {/* Main Saucer Disc — bottom flat part */}
      <mesh position={[0, 0, 0]}>
        <cylinderGeometry args={[1.5, 1.0, 0.22, 48]} />
        <meshStandardMaterial
          color="#94a3b8"
          metalness={0.9}
          roughness={0.15}
          envMapIntensity={1}
        />
      </mesh>

      {/* Upper rim ridge */}
      <mesh position={[0, 0.1, 0]}>
        <torusGeometry args={[1.38, 0.12, 12, 48]} />
        <meshStandardMaterial color="#64748b" metalness={0.95} roughness={0.1} />
      </mesh>

      {/* Spinning light ring */}
      <group ref={lightRingRef}>
        {Array.from({ length: numLights }).map((_, i) => (
          <UFOLight
            key={i}
            angle={(i / numLights) * Math.PI * 2}
            isRunning={isRunning}
          />
        ))}
      </group>

      {/* Glass Dome */}
      <mesh ref={domeRef} position={[0, 0.38, 0]}>
        <sphereGeometry args={[0.75, 32, 32, 0, Math.PI * 2, 0, Math.PI / 2]} />
        <meshPhysicalMaterial
          color={isRunning ? '#ff6666' : '#a5f3fc'}
          transparent
          opacity={0.45}
          metalness={0.1}
          roughness={0}
          transmission={0.5}
          emissive={isRunning ? '#ff2222' : '#0ea5e9'}
          emissiveIntensity={isRunning ? 0.8 : 0.3}
        />
      </mesh>

      {/* Alien silhouette inside dome (little alien head!) */}
      <mesh position={[0, 0.42, 0]}>
        <sphereGeometry args={[0.28, 16, 16]} />
        <meshStandardMaterial color="#4ade80" emissive="#4ade80" emissiveIntensity={0.4} />
      </mesh>
      {/* Alien eyes */}
      <mesh position={[-0.1, 0.52, 0.22]}>
        <sphereGeometry args={[0.07, 8, 8]} />
        <meshStandardMaterial color="#000" emissive="#00ffcc" emissiveIntensity={2} />
      </mesh>
      <mesh position={[0.1, 0.52, 0.22]}>
        <sphereGeometry args={[0.07, 8, 8]} />
        <meshStandardMaterial color="#000" emissive="#00ffcc" emissiveIntensity={2} />
      </mesh>

      {/* Tractor beam (cone going down) */}
      <mesh ref={beamRef} position={[0, -0.8, 0]} rotation={[Math.PI, 0, 0]}>
        <coneGeometry args={[1.1, 1.4, 32, 1, true]} />
        <meshBasicMaterial
          color={isRunning ? '#ff4444' : '#00ffff'}
          transparent
          opacity={0.08}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Engine glow under disc */}
      <mesh position={[0, -0.14, 0]}>
        <cylinderGeometry args={[0.7, 0.7, 0.04, 32]} />
        <meshStandardMaterial
          color={isRunning ? '#ef4444' : '#06b6d4'}
          emissive={isRunning ? '#ef4444' : '#06b6d4'}
          emissiveIntensity={isRunning ? 3 : 1.5}
        />
      </mesh>

      {/* Sparkles around UFO */}
      {isRunning
        ? <Sparkles count={60} scale={5} size={4} color="#ff4444" speed={3} />
        : <Sparkles count={25} scale={4} size={2} color="#00ffff" speed={0.6} />
      }
    </group>
  );
}

export default function RobotAgent({ isRunning, logs, invoices, onToggleTerminal }) {
  const [posX, setPosX] = useState(100);
  const [isHovered, setIsHovered] = useState(false);
  const [speech, setSpeech] = useState("UFO CORTEX-Alpha melakukan patroli galaksi 👽 Klik untuk chat!");
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
    if (!isRunning) {
      setSpeech("UFO CORTEX-Alpha melakukan patroli galaksi 👽 Klik untuk chat!");
      return;
    }
    const runSpeech = async () => {
      setSpeech("🛸 Mengarahkan sinar abduction ke database FDBAtech...");
      await new Promise(r => setTimeout(r, 2000));
      const unpaid = invoices.filter(i => i.status === 'unpaid').length;
      if (unpaid > 0) {
        setSpeech(`👽 Detected ${unpaid} klien nunggak! Mengaktifkan tractor beam penagihan!`);
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
      setSpeech("🛸 Kembali ke orbit patroli. Panggil aku kapanpun Bos butuh cuan!");
    };
    runSpeech();
  }, [isRunning, invoices]);

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
          position: 'absolute', top: '-80px', left: '50%',
          transform: 'translateX(-50%)',
          background: 'linear-gradient(135deg, rgba(6,182,212,0.95), rgba(139,92,246,0.95))',
          borderRadius: '16px', padding: '10px 14px',
          fontSize: '11px', fontWeight: 'bold', color: '#fff',
          maxWidth: '230px', whiteSpace: 'normal',
          boxShadow: '0 8px 32px rgba(6,182,212,0.4)',
          opacity: isHovered || isRunning ? 1 : 0,
          transition: 'opacity 0.3s ease',
          textAlign: 'center', zIndex: 10, pointerEvents: 'none',
        }}>
          {speech}
          <div style={{
            position: 'absolute', bottom: '-8px', left: '50%',
            transform: 'translateX(-50%) rotate(45deg)',
            width: '16px', height: '16px',
            background: 'rgba(6,182,212,0.95)',
          }} />
        </div>

        {/* 3D UFO Canvas */}
        <Canvas camera={{ position: [0, 2, 5.5], fov: 45 }}>
          <ambientLight intensity={0.4} />
          <pointLight position={[0, 5, 3]} intensity={2} color="#ffffff" />
          <pointLight position={[0, -2, 0]} intensity={1.5} color="#00ffff" />
          {isRunning && <pointLight position={[0, 0, 0]} intensity={3} color="#ff4444" />}
          <UFOCore isRunning={isRunning} />
        </Canvas>
      </div>
    </div>
  );
}
