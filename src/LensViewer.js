import { Canvas, useFrame } from '@react-three/fiber';
import { useGLTF, OrbitControls, Environment } from '@react-three/drei';
import { useRef, useState, Suspense, useEffect } from 'react';
import * as THREE from 'three';

function Lens({ url }) {
  const { scene } = useGLTF(url);
  const ref = useRef();
  const [targetRotationY, setTargetRotationY] = useState(0);

  useEffect(() => {
    // 모델 중심 맞추기
    const box = new THREE.Box3().setFromObject(scene);
    const center = new THREE.Vector3();
    box.getCenter(center);
    scene.position.sub(center);
  }, [scene]);

  // 하위 메시 추출
  const mesh = scene.getObjectByProperty("type", "Mesh");

  useFrame(() => {
    if (mesh) {
      mesh.rotation.y += (targetRotationY - mesh.rotation.y) * 0.05;
    }
  });

  const handleMouseMove = (e) => {
    const x = e.clientX / window.innerWidth;
    const rotation = (x - 0.5) * Math.PI;
    setTargetRotationY(rotation);
  };

  return (
    <primitive
      object={scene}
      scale={2.5}
      position={[0, -0.4, 0]}
      onPointerMove={handleMouseMove}
    />
  );
}

export default function LensViewer() {
  return (
    <div className="absolute w-screen h-full overflow-hidden">

      {/* 텍스트 레이어 (스크롤 가능) */}
      <div className="absolute z-0 w-full h-full overflow-y-scroll p-10 text-black bg-white/50  backdrop-blur-sm pointer-events-auto">
        <div className="max-w-2xl mx-auto space-y-8">
          <h1 className="text-4xl font-bold">Nike Air Force 1</h1>
          <p className="text-lg">
            The Nike Air Force 1 is a basketball classic turned streetwear staple.
            Designed with timeless style and comfort, it features durable leather
            and responsive cushioning. Step into iconic heritage with a silhouette
            that continues to inspire.
          </p>
          <p>
            Released in 1982, the Air Force 1 was the first basketball shoe to use
            Nike Air technology, revolutionizing performance and setting a new
            standard in sneaker culture. Today, it stands as a symbol of self-expression
            across generations.
          </p>
          <p>
            Available in countless colorways and collaborations, the AF1 remains a
            favorite among sneakerheads, athletes, and artists worldwide.
          </p>
          <div className="h-96" />
        </div>
      </div>

      {/* 3D 모델 배경 (고정) */}
      <Canvas
        className="fixed top-0 left-0 w-full h-full z-10"
        shadows
        camera={{ position: [0, 1, 1.5], fov: 30 }}
        gl={{ alpha: true, preserveDrawingBuffer: true }}
        style={{ background: 'transparent' }}
      >
        <color attach="background" args={[null]} />

        <ambientLight intensity={0.2} />
        <spotLight position={[2, 5, 2]} angle={0.4} penumbra={1} intensity={1.5} castShadow />

        <Suspense fallback={null}>
          <Lens url="/models/nike14.glb" />
          <Environment preset="city" background={false} />

          {/* 바닥 그림자 */}
          <mesh receiveShadow rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.6, 0]}>
            <planeGeometry args={[10, 10]} />
            <shadowMaterial opacity={0.2} />
          </mesh>
        </Suspense>

        <OrbitControls enableZoom={false} enablePan={false} enableRotate={false} autoRotate autoRotateSpeed={0.5} />
      </Canvas>

      
    </div>
  );
}

// 설치 필요 패키지:
// npm install three @react-three/fiber @react-three/drei @react-spring/three
// 모델 파일은 public/models/nike14.glb 경로에 배치
