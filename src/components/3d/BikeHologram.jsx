import React, { useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Html, ContactShadows } from '@react-three/drei';
import * as THREE from 'three';

const HologramMaterial = ({ color = '#00f0ff' }) => (
    <meshStandardMaterial
        color={color}
        emissive={color}
        emissiveIntensity={0.6}
        wireframe={true}
        transparent={true}
        opacity={0.8}
    />
);

const PartLabel = ({ text, onClick, visible }) => {
    if (!visible) return null;
    return (
        <Html center distanceFactor={10}>
            <div
                onClick={(e) => {
                    e.stopPropagation();
                    onClick();
                }}
                style={{
                    padding: '0.5rem 1rem',
                    fontSize: '0.8rem',
                    cursor: 'pointer',
                    whiteSpace: 'nowrap',
                    border: '1px solid rgba(0, 240, 255, 0.5)',
                    background: 'rgba(5, 5, 5, 0.8)',
                    color: '#fff',
                    borderRadius: '4px',
                    backdropFilter: 'blur(4px)',
                    fontFamily: 'var(--font-body)'
                }}
            >
                {text}
            </div>
        </Html>
    );
};

const BikeAssembly = ({ exploded, onPartClick }) => {
    const groupRef = useRef();

    // Refs for individual parts
    const chassisRef = useRef();
    const engineRef = useRef();
    const frontWheelRef = useRef();
    const rearWheelRef = useRef();
    const suspensionRef = useRef();

    // Animation factor
    useFrame((state, delta) => {
        const target = exploded ? 1 : 0;
        // Smooth interpolation
        const step = 4 * delta;

        if (chassisRef.current) {
            // Chassis stays mostly central but lifts slightly
            chassisRef.current.position.y = THREE.MathUtils.lerp(chassisRef.current.position.y, target * 1 + 1, step);
        }
        if (engineRef.current) {
            // Engine drops down
            engineRef.current.position.y = THREE.MathUtils.lerp(engineRef.current.position.y, target * -1 + 0.5, step);
            engineRef.current.position.x = THREE.MathUtils.lerp(engineRef.current.position.x, target * 1, step);
        }
        if (frontWheelRef.current) {
            // Front wheel moves forward
            frontWheelRef.current.position.x = THREE.MathUtils.lerp(frontWheelRef.current.position.x, target * 2 + 2, step);
        }
        if (rearWheelRef.current) {
            // Rear wheel moves back
            rearWheelRef.current.position.x = THREE.MathUtils.lerp(rearWheelRef.current.position.x, target * -2 - 1.5, step);
        }
        if (suspensionRef.current) {
            // Suspension moves up and forward
            suspensionRef.current.position.x = THREE.MathUtils.lerp(suspensionRef.current.position.x, target * 1.5 + 1.2, step);
            suspensionRef.current.position.y = THREE.MathUtils.lerp(suspensionRef.current.position.y, target * 2 + 1.5, step);
        }

        // Rotate the whole assembly slowly
        if (!exploded && groupRef.current) {
            groupRef.current.rotation.y += delta * 0.2;
        }
    });

    return (
        <group ref={groupRef}>
            {/* Chassis */}
            <group ref={chassisRef} position={[0, 1, 0]}>
                <mesh position={[0, 0.5, 0]}>
                    <boxGeometry args={[3, 0.5, 0.5]} />
                    <HologramMaterial />
                </mesh>
                <mesh position={[1, 0, 0]} rotation={[0, 0, Math.PI / 4]}>
                    <cylinderGeometry args={[0.2, 0.2, 1.5]} />
                    <HologramMaterial />
                </mesh>
                <PartLabel text="Chassis / Frame" visible={exploded} onClick={() => onPartClick('Chassis')} />
            </group>

            {/* Engine */}
            <group ref={engineRef} position={[0, 0.5, 0]}>
                <mesh>
                    <boxGeometry args={[1.2, 1.2, 0.8]} />
                    <HologramMaterial color="#ff003c" />
                </mesh>
                <PartLabel text="V4 Engine Core" visible={exploded} onClick={() => onPartClick('Engine')} />
            </group>

            {/* Front Wheel */}
            <group ref={frontWheelRef} position={[2, 0, 0]}>
                <mesh rotation={[Math.PI / 2, 0, 0]}>
                    <torusGeometry args={[0.8, 0.15, 16, 32]} />
                    <HologramMaterial />
                </mesh>
                <PartLabel text="Front Wheel & Brakes" visible={exploded} onClick={() => onPartClick('Front Wheel')} />
            </group>

            {/* Rear Wheel */}
            <group ref={rearWheelRef} position={[-1.5, 0, 0]}>
                <mesh rotation={[Math.PI / 2, 0, 0]}>
                    <torusGeometry args={[0.9, 0.2, 16, 32]} />
                    <HologramMaterial />
                </mesh>
                <PartLabel text="Rear Wheel & Chain" visible={exploded} onClick={() => onPartClick('Rear Wheel')} />
            </group>

            {/* Suspension / Forks */}
            <group ref={suspensionRef} position={[1.2, 1.5, 0]}>
                <mesh position={[0, -0.5, 0.3]} rotation={[0, 0, -Math.PI / 6]}>
                    <cylinderGeometry args={[0.08, 0.08, 2]} />
                    <HologramMaterial color="#ffd700" />
                </mesh>
                <mesh position={[0, -0.5, -0.3]} rotation={[0, 0, -Math.PI / 6]}>
                    <cylinderGeometry args={[0.08, 0.08, 2]} />
                    <HologramMaterial color="#ffd700" />
                </mesh>
                <PartLabel text="Ohlins Suspension" visible={exploded} onClick={() => onPartClick('Suspension')} />
            </group>
        </group>
    );
};

const BikeHologram = () => {
    const [exploded, setExploded] = useState(false);
    const [activePart, setActivePart] = useState(null);

    const handlePartClick = (part) => {
        setActivePart(part);
    };

    return (
        <div style={{ width: '100%', height: '100%', position: 'relative' }}>
            <Canvas camera={{ position: [5, 3, 5], fov: 50 }}>
                <color attach="background" args={['#050505']} />
                <ambientLight intensity={0.5} />
                <pointLight position={[10, 10, 10]} intensity={1} color="#00f0ff" />
                <pointLight position={[-10, -10, -10]} intensity={0.5} color="#ff003c" />

                <BikeAssembly exploded={exploded} onPartClick={handlePartClick} />

                <ContactShadows position={[0, -1.5, 0]} opacity={0.4} scale={10} blur={2} far={4} color="#00f0ff" />
                <OrbitControls enablePan={false} enableZoom={false} maxPolarAngle={Math.PI / 2 + 0.1} minPolarAngle={Math.PI / 3} />
            </Canvas>

            {/* UI Controls Overlay */}
            <div style={{ position: 'absolute', bottom: '2rem', left: '50%', transform: 'translateX(-50%)', display: 'flex', gap: '1rem', flexDirection: 'column', alignItems: 'center' }}>
                {activePart && (
                    <div className="glass-panel" style={{ padding: '0.5rem 1.5rem', marginBottom: '1rem', animation: 'fadeIn 0.3s ease' }}>
                        <span style={{ color: 'var(--text-secondary)' }}>Selected Part: </span>
                        <span style={{ color: 'var(--accent-color)', fontWeight: 'bold' }}>{activePart}</span>
                    </div>
                )}
                <button
                    className="glass-button primary"
                    onClick={() => {
                        setExploded(!exploded);
                        if (exploded) setActivePart(null);
                    }}
                >
                    {exploded ? 'Collapse View' : 'Explode Parts'}
                </button>
            </div>
        </div>
    );
};

export default BikeHologram;
