import { useRef, Suspense, useState, createContext } from "react";
import { Canvas, extend } from "@react-three/fiber";
import { OrbitControls, ContactShadows, useProgress, Html } from "@react-three/drei";
import { Model } from "./Models/Apartments.js";
import { FullScreen, useFullScreenHandle } from "react-full-screen";
import RotatingModel from "./Components/RotatingModel/RotatingModel.js";

export const HandlerContext = createContext()



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

  const [selectedApt, setSelectedApt] = useState(null);


  const controls = useRef(null);
  const handle = useFullScreenHandle();

  const FullScreenButton = () => (
    <div>
      <button onClick={handle.enter}>
        Enter fullscreen
      </button>

      <FullScreen handle={handle}>
        Any fullscreen content here
      </FullScreen>
    </div>
  )

  const val = {
    exit: null,
    state: null
  }

  return (
    <HandlerContext.Provider value={val}>
      <RotatingModel selectedApt={selectedApt} setSelectedApt={setSelectedApt} />
      <Canvas
        camera={{ fov: 45, zoom: 1, near: 200, far: 200000, position: [0, 400, 4000], }} style={{ height: `100vh`, width: '100vw' }} >
        <fog attach="fog" args={['#17171b', 0, 100000]} />
        <color attach="background" args={['#ffffff']} />

        <OrbitControls
          enablePan={true}
          enableZoom={true}
          enableRotate={true}
          autoRotate={false}
          enableDamping={false}
          autoRotateSpeed={1}
          zoomSpeed={0.3}
          minDistance={0}
          maxDistance={10000}
          ref={controls}
          maxPolarAngle={1.73}
        />

        <hemisphereLight color="#00000" groundColor="#000000" position={[-7, 15, 5]} intensity={1} />
        <pointLight position={[1000, 1000, 1000]} intensity={.5} />

        <Suspense fallback={<Loader />}>
          <Model controls={controls} selectedApt={selectedApt} setSelectedApt={setSelectedApt}
          />
        </Suspense>
        
        <ContactShadows frames={1} position={[0, -520, 0]} scale={10000} blur={1} far={9000} />

      </Canvas>
    </HandlerContext.Provider>
  );
}