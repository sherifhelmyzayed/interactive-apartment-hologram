import { useState, useRef, useEffect } from 'react';
import { useGLTF } from "@react-three/drei";



export function Model(props) {
  const [hovered, setHover] = useState(null);

  const { nodes, materials } = useGLTF("/apartments.glb");
  const arrayOfObj = Object.entries(nodes).map((mesh) => ({ mesh })).slice(3, 20);
  const hoverObj = Object.entries(nodes).map((mesh) => ({ id: mesh[1].uuid, hovered: false })).slice(3, 20);
  // const [{ arrayOfObj, cycle }, set] = useState({ objects: [], cycle: 0 })

  console.log(hoverObj);

  let uuid = []

  arrayOfObj.map(item => (
    uuid.push({ id: item.mesh[1].uuid, hover: false })
  ))

  setHover(hoverObj)

  


  // setTimeout(() => {
  //   setHover(uuid)
  // }, 1000);

  // useEffect(() => {
  //   console.log(hovered);
  //   return () => {
  //     setHover(uuid)
  //   }
  // }, [uuid])



  console.log(hovered);

  const pointOut = (e, id) => {
    e.stopPropagation()
    console.log(id);

    let arr = hovered

    // arr.map(item => console.log(item))

  }

  const pointOver = (e, id) => {
    e.stopPropagation()
    console.log(id);

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
            arrayOfObj.map((item) => {
              return (
                <mesh
                  castShadow
                  receiveShadow
                  geometry={item.mesh[1].geometry}
                  material={materials.GreyColor}
                  material-color={hovered ? "aquamarine" : 'black'}

                  onPointerOver={(e) => pointOver(e, item.mesh[1].uuid)}
                  onPointerOut={(e) => pointOut(e, item.mesh[1].uuid)}>

                  {/* onPointerOver={(e) => {
                    e.stopPropagation()
                    setHover((true))
                  }}
                  onPointerOut={(e) => {
                    e.stopPropagation()
                    setHover(false)
                  }}> */}
                </mesh>

              )
            })
          }

          {/* <mesh
            castShadow
            receiveShadow
            geometry={nodes.Trim.geometry}
            material={materials.GreyColor}
          />
          <mesh
            castShadow
            receiveShadow
            geometry={nodes.Trim1.geometry}
            material={materials.GreyColor}
          />
          <mesh
            castShadow
            receiveShadow
            geometry={nodes.Trim10.geometry}
            material={materials.GreyColor}
          />
          <mesh
            castShadow
            receiveShadow
            geometry={nodes.Trim11.geometry}
            material={materials.GreyColor}
          />
          <mesh
            castShadow
            receiveShadow
            geometry={nodes.Trim12.geometry}
            material={materials.GreyColor}
          />
          <mesh
            castShadow
            receiveShadow
            geometry={nodes.Trim13.geometry}
            material={materials.GreyColor}
          />
          <mesh
            castShadow
            receiveShadow
            geometry={nodes.Trim14.geometry}
            material={materials.GreyColor}
          />
          <mesh
            castShadow
            receiveShadow
            geometry={nodes.Trim15.geometry}
            material={materials.GreyColor}
          />
          <mesh
            castShadow
            receiveShadow
            geometry={nodes.Trim2.geometry}
            material={materials.GreyColor}
          />
          <mesh
            castShadow
            receiveShadow
            geometry={nodes.Trim3.geometry}
            material={materials.GreyColor}
          />
          <mesh
            castShadow
            receiveShadow
            geometry={nodes.Trim4.geometry}
            material={materials.GreyColor}
          />
          <mesh
            castShadow
            receiveShadow
            geometry={nodes.Trim5.geometry}
            material={materials.GreyColor}
          />
          <mesh
            castShadow
            receiveShadow
            geometry={nodes.Trim6.geometry}
            material={materials.GreyColor}
          />
          <mesh
            castShadow
            receiveShadow
            geometry={nodes.Trim7.geometry}
            material={materials.GreyColor}
          />
          <mesh
            castShadow
            receiveShadow
            geometry={nodes.Trim8.geometry}
            material={materials.GreyColor}
          />
          <mesh
            castShadow
            receiveShadow
            geometry={nodes.Trim9.geometry}
            material={materials.GreyColor}
          /> */}
        </group>
      </group>

    </>
  );
}

useGLTF.preload("/apartments.glb");