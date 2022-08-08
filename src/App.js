import { useRef, useState, Suspense } from "react";
import * as THREE from "three";
import { Canvas, extend } from "@react-three/fiber";
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



function Box(props) {

  const [hovered, setHover] = useState(false);
  const mesh = useRef();
  return (
    <mesh
      {...props}
      ref={mesh}
      onPointerOver={(e) => {
        e.stopPropagation()
        setHover(true)
      }}
      onPointerOut={(e) => {
        e.stopPropagation()
        setHover(false)
      }}
    >
      <boxGeometry args={[90, 30, 70]} />
      <meshStandardMaterial color={hovered ? props.free ? "cyan" : "orange" : ""} transparent opacity={hovered ? .6 : 0} />
    </mesh>
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

export default function App() {


  return (
    <>
      <Canvas
        shadowMap camera={{ fov: 45, zoom: 1, near: 200, far: 20000, position: [0, 0, 3000] }} style={{ height: `100vh` }}>
        <color attach="background" args={["#696969"]} />

        <OrbitControls
          enablePan={true}
          enableZoom={true}
          enableRotate={true}
          autoRotate={true}
          autoRotateSpeed={1}
          zoomSpeed={0.3}
          minDistance={2500}
          maxDistance={3500}
        ></OrbitControls>
        {/* <Suspense fallback={<Loader/>}>

          <B02 rotation={[0, Math.PI / -2, 0]} position={[-150, -200, 0]} />
          <Box position={[-295, -175, 110]} free={true} floor={1} color={"orange"} />

          <B01 position={[-150, -200, -800]} />
        </Suspense> */}
        <Suspense fallback={<Loader />}>


          <Dome />
          <Model />
          {
          /* <B02 rotation={[0, Math.PI / -2, 0]} position={[-150, -200, 0]} />

          <B01 position={[-150, -200, -800]} />
          <B02 rotation={[0, Math.PI / -2, 0]} position={[-150, -200, 0]} />
          <B01 position={[-900, -200, -800]} />
          <B02 rotation={[0, Math.PI / -2, 0]} position={[-900, -200, 0]} />
          <B01 position={[-900, -200, 800]} />
          <B01 position={[-150, -200, 800]} />

        */}

          <Environment preset="warehouse" background="./098_hdrmaps_com_free1.exr" />
        </Suspense>

        <directionalLight position={[-600, -500, 50]} intensity={.1}
        />
        <group rotation={[0, -1.6, 0]} position={[206, 0, 212]} >
          <Box position={[-295, -175, 110]} free={true} floor={1} color={"orange"} />
          <Box position={[-295, -146, 110]} free={true} floor={2} color={"orange"} />
          <Box position={[-295, -117, 110]} free={false} floor={3} color={"orange"} />
          <Box position={[-295, -59, 110]} free={true} floor={4} color={"orange"} />
          <Box position={[-295, -88, 110]} free={false} floor={5} color={"orange"} />
          <Box position={[-295, -30, 110]} free={true} floor={6} color={"orange"} />
          <Box position={[-295, 1, 110]} free={false} floor={7} color={"orange"} />
          <Box position={[-295, 32, 110]} free={true} floor={8} color={"orange"} />
          <Box position={[-295, 63, 110]} free={true} floor={9} color={"orange"} />
          <Box position={[-295, 94, 110]} free={false} floor={10} color={"orange"} />
          <Box position={[-295, 125, 110]} free={true} floor={11} color={"orange"} />
          <Box position={[-295, 156, 110]} free={false} floor={12} color={"orange"} />
          <Box position={[-295, 187, 110]} free={false} floor={13} color={"orange"} />
          <Box position={[-295, 218, 110]} free={true} floor={14} color={"orange"} />
          <Box position={[-178, 62, 110]} free={true} floor={15} color={"yellow"} />
        </group>
        <ContactShadows frames={1} position={[0, -200, 0]} scale={1000} blur={2} far={1000} />
      </Canvas>
    </>
  );
}