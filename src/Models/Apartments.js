import { useState } from 'react';
import { useGLTF } from "@react-three/drei";



export function Model(props) {

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
          console.log(geometry.boundingSphere.center);
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
                <Apartment geometry={item.mesh[1].geometry} material = {materials.GreyColor}/>
              )
            })
          }

        </group>
      </group>

    </>
  );
}

useGLTF.preload("/apartments.glb");