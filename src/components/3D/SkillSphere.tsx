import { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Text, Sphere } from '@react-three/drei';
import * as THREE from 'three';
import type { Skill } from '@/types/database';

interface SkillSphereProps {
  skills: Skill[];
}

function SkillOrb({ skill, position }: { skill: Skill; position: [number, number, number] }) {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.x = state.clock.elapsedTime * 0.5;
      meshRef.current.rotation.y = state.clock.elapsedTime * 0.3;
    }
  });

  return (
    <group position={position}>
      <Sphere ref={meshRef} args={[0.2, 16, 16]}>
        <meshStandardMaterial
          color={`hsl(${(skill.level * 2.4) % 360}, 70%, 60%)`}
          emissive={`hsl(${(skill.level * 2.4) % 360}, 70%, 40%)`}
          emissiveIntensity={0.5}
        />
      </Sphere>
      <Text
        position={[0, -0.5, 0]}
        fontSize={0.1}
        color="#ffffff"
        anchorX="center"
        anchorY="middle"
      >
        {skill.name}
      </Text>
    </group>
  );
}

function SkillSphereInner({ skills }: SkillSphereProps) {
  const skillPositions = useMemo(() => {
    const positions: [number, number, number][] = [];
    const radius = 2;
    const count = Math.min(skills.length, 20); // Limit to 20 skills for performance

    for (let i = 0; i < count; i++) {
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(Math.random() * 2 - 1);
      const x = radius * Math.sin(phi) * Math.cos(theta);
      const y = radius * Math.sin(phi) * Math.sin(theta);
      const z = radius * Math.cos(phi);
      positions.push([x, y, z]);
    }
    return positions;
  }, [skills]);

  const sphereRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (sphereRef.current) {
      sphereRef.current.rotation.y = state.clock.elapsedTime * 0.1;
    }
  });

  return (
    <>
      <Sphere ref={sphereRef} args={[2.5, 32, 32]}>
        <meshStandardMaterial
          color="#1e3a8a"
          wireframe
          transparent
          opacity={0.1}
        />
      </Sphere>
      {skills.slice(0, 20).map((skill, index) => (
        <SkillOrb key={skill.id} skill={skill} position={skillPositions[index]} />
      ))}
      <pointLight position={[5, 5, 5]} intensity={1} />
      <pointLight position={[-5, -5, -5]} intensity={0.5} />
    </>
  );
}

export function SkillSphere({ skills }: SkillSphereProps) {
  if (skills.length === 0) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <p className="text-foreground/50">No skills to display</p>
      </div>
    );
  }

  return (
    <Canvas camera={{ position: [0, 0, 8] }}>
      <ambientLight intensity={0.5} />
      <SkillSphereInner skills={skills} />
      <OrbitControls enableZoom={false} autoRotate autoRotateSpeed={0.2} />
    </Canvas>
  );
}

