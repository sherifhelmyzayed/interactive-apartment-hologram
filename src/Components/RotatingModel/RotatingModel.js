import { Suspense } from "react";
import { Canvas,  } from "@react-three/fiber";
import { OrbitControls, useProgress, Html } from "@react-three/drei";
import { FixedDiv} from './RotatingModelElements.js';
import { RotatingModel } from "../../Models/RotatingModel.js";

const Loader = () => {
  const { total } = useProgress()

  let cal = total / 154 * 100;
  console.log(cal);
  return (
    <Html center>downloading {Math.round(cal)} %</Html>
  )
};


const RotatingModelViewer = () => {

  return (
    <FixedDiv>
      <Canvas
        shadowMap camera={{ fov: 45, zoom: 1, near: 200, far: 200000, position: [0, 0, 3000], }} style={{ height: `100%`, width: '100%' }} >
        <fog attach="fog" args={['#17171b', 0, 100000]} />

        <OrbitControls
          enablePan={true}
          enableZoom={true}
          enableRotate={true}
          autoRotate={false}
          autoRotateSpeed={1}
          zoomSpeed={0.3}
          minDistance={2500}
          maxDistance={10000}
          maxPolarAngle={1.73}
        />

        <pointLight position={[1000, 1000, 1000]} intensity={.5} />
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

        <Suspense fallback={<Loader />}>
          <RotatingModel/>
        </Suspense>

      </Canvas>
    </FixedDiv >

  )
}

export default RotatingModelViewer