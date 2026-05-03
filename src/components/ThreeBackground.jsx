import { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Points, PointMaterial } from '@react-three/drei';
import * as THREE from 'three';

function Starfield({ scrollRef }) {
  const ref = useRef();
  
  // Generate random positions for 3000 particles
  const positions = useMemo(() => {
    const count = 3000;
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 20;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 20;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 20;
    }
    return pos;
  }, []);

  useFrame((state, delta) => {
    if (!ref.current) return;
    
    // Constant slow ambient rotation
    ref.current.rotation.y -= delta * 0.05;
    
    // Scroll-based rotation
    const scroll = scrollRef.current ? scrollRef.current.scrollTop : 0;
    ref.current.rotation.x = scroll * 0.0003;
  });

  return (
    <group rotation={[0, 0, Math.PI / 4]}>
      <Points ref={ref} positions={positions} stride={3} frustumCulled={false}>
        <PointMaterial 
          transparent 
          opacity={0.3}
          color="#ef4444" 
          size={0.04} 
          sizeAttenuation={true} 
          depthWrite={false} 
          blending={THREE.AdditiveBlending}
        />
      </Points>
    </group>
  );
}

export default function ThreeBackground({ scrollRef }) {
  return (
    <div className="fixed inset-0 z-0 pointer-events-none">
      <Canvas camera={{ position: [0, 0, 5], fov: 60 }}>
        <Starfield scrollRef={scrollRef} />
      </Canvas>
    </div>
  );
}
