import { Canvas, } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { FixedDiv } from './RotatingModelElements.js';
import { RotatingModel } from "../../Models/RotatingModel.js";


const RotatingModelViewer = (props) => {

  const {selectedApt, setSelectedApt} = props

  const clickHandler = ()=> {
    // setSelectedApt(false)
  }

  return (
    <FixedDiv show={!selectedApt}>
      <Canvas
        camera={{ fov: 45, zoom: 1, near: 200, far: 200000, position: [0, 0, 3000], }} style={{ height: `100%`, width: '100%' }} >
        <fog attach="fog" args={['#17171b', 0, 100000]} />

        <OrbitControls
          enablePan={false}
          enableZoom={false}
          enableRotate={false}
          autoRotate={true}
          autoRotateSpeed={1}
          zoomSpeed={0.3}
          minDistance={2500}
          maxDistance={10000}
          maxPolarAngle={1}
        />

        <hemisphereLight color="#ffffff" groundColor="#000000" position={[-7, 15, 5]} intensity={.9} />


        <RotatingModel onClick={()=>clickHandler()}/>

      </Canvas>
    </FixedDiv >

  )
}

export default RotatingModelViewer