import { useState } from 'react';
import { useFrame } from "@react-three/fiber";


import { useGLTF } from "@react-three/drei";

import * as THREE from 'three'



export function Model(props) {

  const { controls } = props;

  const [controlTarget, setControlTarget] = useState(new THREE.Vector3(0,0,0))
  const [selectedApt, setSelectedApt] = useState(null);  

  const { nodes, materials } = useGLTF("/apartments.glb");
  const arrayOfObj = Object.entries(nodes).map((mesh) => ({ mesh })).slice(3, 20);


  const Apartment = (props) => {
    const [hovered, setHovered] = useState(false);

    const { geometry, material } = props;

    const speed = 0.6

    useFrame(() => {

      // const setTarget = ()=> {

      // }
      // setTarget()

      // console.log(controls.current.target);
      // console.log(controlTarget);

      // console.log(controls.current.target.x);
      // console.log(controlTarget.x);

      if (controlTarget.x > controls.current.target.x) {
        controls.current.target.x += speed
      } else {
        controls.current.target.x -= speed
      }

      
      if (controlTarget.y > controls.current.target.y) {
        controls.current.target.y += speed
      } else {
        controls.current.target.y -= speed
      }

      if (controlTarget.z > controls.current.target.z) {
        controls.current.target.z += speed
      } else {
        controls.current.target.z -= speed
      }

      if (selectedApt && controls.current.maxDistance > 1200) {
        controls.current.maxDistance -= 2
        controls.current.minDistance = 0
      }

      // console.log("frame");
    })


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

          // controls.current.setPolarAngle(0.5)


          // controls.current.target = new THREE.Vector3(
          //   (geometry.boundingBox.max.x - geometry.boundingBox.min.x) / 2 + geometry.boundingBox.min.x,
          //   -geometry.boundingBox.max.z,
          //   (geometry.boundingBox.max.y - geometry.boundingBox.min.y) / 2 + geometry.boundingBox.min.y,
          // )

          const newTarget = new THREE.Vector3(
            (geometry.boundingBox.max.x - geometry.boundingBox.min.x) / 2 + geometry.boundingBox.min.x,
            -geometry.boundingBox.max.z,
            (geometry.boundingBox.max.y - geometry.boundingBox.min.y) / 2 + geometry.boundingBox.min.y,
          )

          setControlTarget(newTarget)
          setSelectedApt(geometry.uuid)

          // console.log(geometry.uuid);


          
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