import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Color, Vector3 } from 'three';
import { Effects } from './Effects';
import { CameraTarget } from '../types';

// Augment JSX namespace for Three.js elements used in R3F
declare global {
  namespace JSX {
    interface IntrinsicElements {
      mesh: any;
      dodecahedronGeometry: any;
      meshStandardMaterial: any;
      group: any;
      ambientLight: any;
      pointLight: any;
      color: any;
    }
  }
}

// Also augment React.JSX namespace for newer React/TS versions
declare module 'react' {
  namespace JSX {
    interface IntrinsicElements {
      mesh: any;
      dodecahedronGeometry: any;
      meshStandardMaterial: any;
      group: any;
      ambientLight: any;
      pointLight: any;
      color: any;
    }
  }
}

// Simple floating geometry to represent a "Data Node"
const DataNode = ({ position, color, speed }: { position: [number, number, number]; color: string; speed: number }) => {
  const meshRef = useRef<any>(null);
  
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.x += 0.01 * speed;
      meshRef.current.rotation.y += 0.015 * speed;
      // Floating effect
      meshRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * speed) * 0.5;
    }
  });

  return (
    <mesh ref={meshRef} position={position}>
      <dodecahedronGeometry args={[0.8, 0]} />
      <meshStandardMaterial 
        color={color} 
        emissive={color} 
        emissiveIntensity={1.5} 
        wireframe 
        transparent
        opacity={0.6}
      />
    </mesh>
  );
};

// Controls the camera movement based on the current UI state
const CameraController = ({ target }: { target: CameraTarget }) => {
  const vec = new Vector3();

  useFrame((state) => {
    let x = 0, y = 0, z = 10;
    
    // Warp logic based on target
    switch (target) {
      case 'PROJECTS':
        x = 5;
        y = 2;
        z = 6;
        break;
      case 'ABOUT':
        x = -5;
        y = -2;
        z = 6;
        break;
      case 'CONTACT':
        x = 0;
        y = 5;
        z = 8;
        break;
      case 'IDLE':
      default:
        x = 0;
        y = 0;
        z = 10;
        break;
    }

    // Smooth transition (Lerp)
    state.camera.position.lerp(vec.set(x, y, z), 0.05);
    state.camera.lookAt(0, 0, 0);
  });

  return null;
};

// Randomly generated nodes
const Cluster = () => {
  const nodes = useMemo(() => {
    const temp = [];
    // Monochrome Palette: White, Silver, Dark Gray
    const colors = ['#FFFFFF', '#D4D4D8', '#A1A1AA', '#52525B'];
    for (let i = 0; i < 30; i++) {
      const x = (Math.random() - 0.5) * 20;
      const y = (Math.random() - 0.5) * 20;
      const z = (Math.random() - 0.5) * 10 - 5; // Behind the center
      const color = colors[Math.floor(Math.random() * colors.length)];
      temp.push({ pos: [x, y, z] as [number, number, number], color, speed: Math.random() * 0.5 + 0.2 });
    }
    return temp;
  }, []);

  return (
    <group>
      {nodes.map((node, i) => (
        <DataNode key={i} position={node.pos} color={node.color} speed={node.speed} />
      ))}
    </group>
  );
};

interface SceneProps {
  cameraTarget: CameraTarget;
}

export const Scene: React.FC<SceneProps> = ({ cameraTarget }) => {
  return (
    <div className="absolute inset-0 z-0 bg-black">
      <Canvas camera={{ position: [0, 0, 10], fov: 50 }}>
        <color attach="background" args={['#000000']} />
        
        {/* Lights - Cold White */}
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} intensity={1.5} color="#FFFFFF" />
        <pointLight position={[-10, -10, -10]} intensity={0.5} color="#A1A1AA" />

        <Cluster />
        
        <CameraController target={cameraTarget} />
        <Effects />
      </Canvas>
    </div>
  );
};