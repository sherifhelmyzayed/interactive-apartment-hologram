import { useState } from 'react';
import { useFrame } from "@react-three/fiber";
import { useSpring, animated, config, easings } from '@react-spring/three'


import { useGLTF } from "@react-three/drei";

import * as THREE from 'three'



export function Model(props) {

  const { controls } = props;

  const [controlTarget, setControlTarget] = useState(new THREE.Vector3(0,0,0))
  const [selectedApt, setSelectedApt] = useState(null);  

  const { nodes, materials } = useGLTF("/apartments.glb");
  const arrayOfObj = Object.entries(nodes).map((mesh) => ({ mesh })).slice(3, 20);

  console.log(controls);


  
  const springProps = useSpring({
    config: { duration: 2000, easing: easings.easeInOutCubic },
    from: {
      lookAtX: (controls.current) ? controls.current.target.x  : null,
      lookAtY: (controls.current) ? controls.current.target.y  : null,
      lookAtZ: (controls.current) ? controls.current.target.z  : null
    },
    to: {
      lookAtX: controlTarget.x,
      lookAtY: controlTarget.y,
      lookAtZ: controlTarget.z
    }
  });

  const distanceAnimation = useSpring({
    config: { duration: 5000, easing: easings.easeInOutCubic,  delay: 1000  },
    from: {
      minDistance: (controls.current) ? controls.current.minDistance : null,
      maxDistance: (controls.current) ? controls.current.maxDistance : null,
    },
    to: {
      minDistance: 1200,
      maxDistance: 1200,
    }
  })

  const polarAnimation = useSpring({
    config: { duration: 2000, easing: easings.easeInOutCubic},
    from : {
      polarAngle: (controls.current) ? controls.current.getPolarAngle() : null
    },
    to: {
      polarAngle: (controls.current) ? controls.current.setPolarAngle(0.5) : null

    }
  });





  const Apartment = (props) => {
    const [hovered, setHovered] = useState(false);

    const { geometry, material } = props;





    useFrame(() => {

      if (controls.current && springProps.lookAtX.animation.values[0]) {
        controls.current.target.x = springProps.lookAtX.animation.values[0]._value
        controls.current.target.y = springProps.lookAtY.animation.values[0]._value
        controls.current.target.z = springProps.lookAtZ.animation.values[0]._value

        controls.current.minDistance = distanceAnimation.minDistance.animation.values[0]._value;
        controls.current.maxDistance = distanceAnimation.maxDistance.animation.values[0]._value;

        // controls.current.setPolarAngle(polarAnimation.polarAngle.animation.values[0]._value)


        // console.log(polarAnimation.polarAngle.animation.values[0]._value);
      }

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

          const newTarget = new THREE.Vector3(
            (geometry.boundingBox.max.x - geometry.boundingBox.min.x) / 2 + geometry.boundingBox.min.x,
            -geometry.boundingBox.max.z,
            (geometry.boundingBox.max.y - geometry.boundingBox.min.y) / 2 + geometry.boundingBox.min.y,
          )

          setControlTarget(newTarget)
          setSelectedApt(geometry.uuid)

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