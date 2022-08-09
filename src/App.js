import { useRef, Suspense } from "react";
import { Canvas, extend } from "@react-three/fiber";
import { OrbitControls, ContactShadows, useProgress, Html } from "@react-three/drei";
import { Model } from "./Models/Apartments.js";


extend({ OrbitControls });



const Loader = () => {
  const { total } = useProgress()

  let cal = total / 154 * 100;
  console.log(cal);
  return (
    <Html center>downloading {Math.round(cal)} %</Html>
  )
};



export default function App() {

  const controls = useRef(null);

  const updateOrbit = () => {
    console.log("updates");
  }


  return (
    <>
      <Canvas
        shadowMap camera={{ fov: 45, zoom: 1, near: 200, far: 200000, position: [0, 0, 3000], }} style={{ height: `100vh` }} >
        {/* <fog attach="fog" args={['#17171b', 100, 6000]} /> */}
        <color attach="background" args={['#ffffff']} />

        <OrbitControls
          enablePan={true}
          enableZoom={true}
          enableRotate={true}
          autoRotate={false}
          autoRotateSpeed={1}
          zoomSpeed={0.3}
          minDistance={2500}
          maxDistance={10000}
          ref={controls}
          onUpdate={updateOrbit}
        />

        <pointLight position={[100, 100, 100]} intensity={1.2} />
        <hemisphereLight color="#ffffff" groundColor="#b9b9b9" position={[-7, 25, 5]} intensity={1} />

        <Suspense fallback={<Loader />}>
          <Model controls={controls} />
        </Suspense>

        <ContactShadows frames={1} position={[0, -520, 0]} scale={10000} blur={1} far={9000} />
      </Canvas>
    </>
  );
}