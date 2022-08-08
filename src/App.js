import { useRef, useState, Suspense } from "react";
import * as THREE from "three";
import { Canvas, extend, useFrame } from "@react-three/fiber";
import { OrbitControls, Environment, ContactShadows, useProgress, Html, useTexture } from "@react-three/drei";
import { Model } from "./Models/Apartments.js";

// import B02 from "./Components/B02";
// import B01 from "./Components/B01";

extend({ OrbitControls });


function Dome() {

  return (
    <group>
      <mesh rotation={[0, 3, 0]}>
        <sphereBufferGeometry attach="geometry" args={[5000, 200, 200]} />
        <meshBasicMaterial
          attach="material"
          map={useTexture('https://bricksvisuals.com/images/test/pic1.jpeg')}
          side={THREE.BackSide}
        />
      </mesh>
    </group>
  );
}


const Loader = () => {
  const { total } = useProgress()

  let cal = total / 154 * 100;
  console.log(cal);
  return (
    <Html center>downloading {Math.round(cal)} %</Html>
  )
};

const Frame = () => {
  useFrame(() => {
    console.log("frame");
  })
}


export default function App() {

  const controls = useRef(null);

  const updateOrbit = () => {
    console.log("updates");
  }






  return (
    <>
      <Canvas
        shadowMap camera={{ fov: 45, zoom: 1, near: 200, far: 20000, position: [0, 0, 3000], }} style={{ height: `100vh` }} >
        <fog attach="fog" args={['#17171b', 1000, 6000]} />
        <color attach="background" args={['#cdcdcd']} />

        <OrbitControls
          enablePan={true}
          enableZoom={true}
          enableRotate={true}
          autoRotate={false}
          autoRotateSpeed={1}
          zoomSpeed={0.3}
          minDistance={2500}
          maxDistance={3500}
          ref={controls}
          onUpdate={updateOrbit}
        />

        {/* <Frame></Frame> */}

        <pointLight position={[100, 100, 100]} intensity={1.2} />
        <hemisphereLight color="#ffffff" groundColor="#b9b9b9" position={[-7, 25, 13]} intensity={2} />

        <Suspense fallback={<Loader />}>
          <Model controls={controls} />
        </Suspense>


        <ContactShadows frames={1} position={[0, -520, 0]} scale={10000} blur={2} far={9000} />
      </Canvas>
    </>
  );
}