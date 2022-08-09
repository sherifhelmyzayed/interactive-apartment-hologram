import { useRef, Suspense } from "react";
import { Canvas, extend } from "@react-three/fiber";
import { OrbitControls, ContactShadows, useProgress, Html, Shadow, BakeShadows, RandomizedLight } from "@react-three/drei";
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
        <fog attach="fog" args={['#17171b', 0, 100000]} />
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
        {/* <ambientLight /> */}

        <pointLight position={[1000, 1000, 1000]} intensity={.5} />
        {/* <pointLight position={[-1000, 1000, -1000]} intensity={.5} /> */}
        <hemisphereLight color="#ffffff" groundColor="#000000" position={[-7, 15, 5]} intensity={.5} />
        <rectAreaLight
          width={2000}
          height={2000}
          intensity={4}
          color={'white'}
          position={[-1000, 2000, -1000]}
          rotation={[180, .4, 0.3]}
          castShadow
        />

        <rectAreaLight
          width={2000}
          height={2000}
          intensity={4}
          color={'white'}
          position={[1000, 2000, -1000]}
          rotation={[180, .4, 0.3]}
          castShadow
        />

        <Suspense fallback={<Loader />}>
          <Model controls={controls} />
        </Suspense>

        <Shadow
          color="black"
          colorStop={0}
          opacity={1}
          fog={true} // Reacts to fog (default=false)
        />



        <ContactShadows frames={1} position={[0, -520, 0]} scale={10000} blur={1} far={9000} />
        <BakeShadows />
      </Canvas>
    </>
  );
}