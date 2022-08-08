import { useState } from 'react';
import { useGLTF } from "@react-three/drei";

import * as THREE from 'three'



export function Model(props) {

  const { controls } = props

  const { nodes, materials } = useGLTF("/apartments.glb");
  const arrayOfObj = Object.entries(nodes).map((mesh) => ({ mesh })).slice(3, 20);


  const Apartment = (props) => {
    const [hovered, setHovered] = useState(false);

    const { geometry, material } = props;


    return (
      <mesh
        castShadow
        receiveShadow
        geometry={geometry}

        onPointerOver={e => {
          e.stopPropagation();
          setHovered(true)
        }}
        onPointerOut={e => {
          e.stopPropagation();
          setHovered(false);
        }}

        onClick={e => {
          e.stopPropagation();

          controls.current.setPolarAngle(0.5)

          console.log(controls.current.zoom0);
          controls.current.zoom0 = 5000
          // controls.current.maxDistance = 1200;
          // controls.current.minDistance = 1150;

          // console.log(geometry.boundingBox.max.x);

          controls.current.target = new THREE.Vector3(
            (geometry.boundingBox.max.x - geometry.boundingBox.min.x) / 2 + geometry.boundingBox.min.x,
            -geometry.boundingBox.max.z,
            (geometry.boundingBox.max.y - geometry.boundingBox.min.y) / 2 + geometry.boundingBox.min.y,
          )

          console.log(

            
          );
        }}
      >
        <meshStandardMaterial {...material} color={hovered ? "aquamarine" : "#d4d4d4"} />
      </mesh>
    )
  }



  return (
    <>
      <group {...props} dispose={null}>
        <group rotation={[Math.PI / 2, 0, 0]} scale={1} position={[-10, -500, 0]}>
          <mesh
            castShadow
            receiveShadow
            geometry={nodes.Roof.geometry}
            material={materials.GreyColor}
            position={[166.46, 559.72, -1189.83]}
            scale={[1, 1, 0.03]}
          />
          {
            arrayOfObj.map(item => {
              return (
                <Apartment geometry={item.mesh[1].geometry} material={materials.GreyColor} />
              )
            })
          }

        </group>
      </group>

    </>
  );
}

useGLTF.preload("/apartments.glb");