import { useState } from 'react';
import * as THREE from 'three';
import { useFrame } from "@react-three/fiber";
import { Html, useGLTF } from '@react-three/drei';
import { useSpring, easings } from '@react-spring/three';
import { FaMapMarkerAlt, FaTimesCircle } from 'react-icons/fa';
import GLB from '../glb/apartments.glb';
import { Env } from './Env.js';


export function Model(props) {

  const { controls } = props;
  const [controlTarget, setControlTarget] = useState(new THREE.Vector3(0, 0, 0));
  const [hovered, setHovered] = useState(null);
  const [selectedApt, setSelectedApt] = useState(null);
  const [exitApt, setExitApt] = useState(false);
  const [key, setKey] = useState(null)
  const [floor, setFloor] = useState(null)

  const floorRef = [
    [0, 1, 8, 9],
    [10, 11, 12, 13],
    [2, 3, 14, 15],
    [4, 5, 6, 7]
  ]

  console.log("renders");

  const { nodes, materials } = useGLTF(GLB);
  const arrayOfObj = Object.entries(nodes).map((mesh) => ({ mesh })).slice(3, 20);

  const controlToTargetAnimation = useSpring({
    config: { duration: 2000, easing: easings.easeInOutCubic },
    from: {
      lookAtX: (controls.current) ? controls.current.target.x : null,
      lookAtY: (controls.current) ? controls.current.target.y : null,
      lookAtZ: (controls.current) ? controls.current.target.z : null
    },
    to: {
      lookAtX: (selectedApt) ? controlTarget.x : 0,
      lookAtY: (selectedApt) ? controlTarget.y : 0,
      lookAtZ: (selectedApt) ? controlTarget.z : 0
    }
  });

  const distanceToAnimation = useSpring({
    config: { duration: 2000, easing: easings.easeInOutCubic, delay: 1000 },
    from: {
      minDistance: (controls.current) ? controls.current.minDistance : null,
      maxDistance: (controls.current) ? controls.current.maxDistance : null,
    },
    to: {
      minDistance: (selectedApt) ? 1200 : 2500,
      maxDistance: (selectedApt) ? 1200 : 3500,
    }
  })

  const controlFromTargetAnimation = useSpring({
    config: { duration: 1000, easing: easings.easeInOutCubic },
    from: {
      lookAtX: (controls.current && exitApt) ? controls.current.target.x : null,
      lookAtY: (controls.current && exitApt) ? controls.current.target.y : null,
      lookAtZ: (controls.current && exitApt) ? controls.current.target.z : null
    },
    to: {
      lookAtX: (exitApt) ? 0 : controlTarget.x,
      lookAtY: (exitApt) ? 0 : controlTarget.y,
      lookAtZ: (exitApt) ? 0 : controlTarget.z
    }
  });

  const distanceFromAnimation = useSpring({
    config: { duration: 1000, easing: easings.easeInOutCubic },
    from: {
      minDistance: (controls.current && exitApt) ? controls.current.minDistance + 0.1 : null,
      maxDistance: (controls.current && exitApt) ? controls.current.maxDistance + 0.1 : null,
    },
    to: {
      minDistance: (exitApt) ? 2500 : 1200,
      maxDistance: (exitApt) ? 3500 : 1200,
    }
  })


  function Marker({ children, ...props }) {
    // This holds the local occluded state
    return (
      <Html
        transform
        sprite
        occlude
        style={{ transition: 'all 0.2s', opacity: 1, transform: `scale(2)` }}
        {...props}>
        {children}
      </Html>
    )
  }

  const exitHandler = () => {
    setExitApt(true)
    setSelectedApt(null)
    setKey(null)
    setControlTarget(new THREE.Vector3(0, 0, 0))
  }

  const Apartment = (props) => {
    // const [floorMode, setFloorMode] = useState(false)
    const { geometry, material, id } = props;

    const floorSet = (id) => {
      setFloor(floorRef.filter(item => item.includes(id))[0]);
      // setFloorMode(floor.includes(id) && selectedApt !== geometry.uuid);
    }

    useFrame(() => {
      if (controls.current && selectedApt) {
        controls.current.target.x = controlToTargetAnimation.lookAtX.animation.values[0]._value
        controls.current.target.y = controlToTargetAnimation.lookAtY.animation.values[0]._value
        controls.current.target.z = controlToTargetAnimation.lookAtZ.animation.values[0]._value

        controls.current.minDistance = distanceToAnimation.minDistance.animation.values[0]._value;
        controls.current.maxDistance = distanceToAnimation.maxDistance.animation.values[0]._value;
      }

      if (controls.current && exitApt === true) {
        controls.current.target.x = controlFromTargetAnimation.lookAtX.animation.values[0]._value
        controls.current.target.y = controlFromTargetAnimation.lookAtY.animation.values[0]._value
        controls.current.target.z = controlFromTargetAnimation.lookAtZ.animation.values[0]._value

        controls.current.minDistance = distanceFromAnimation.minDistance.animation.values[0]._value;
        controls.current.maxDistance = distanceFromAnimation.maxDistance.animation.values[0]._value;
      }
    })

    return (
      (!selectedApt || selectedApt === geometry.uuid || floor.includes(id)) ? (
        <mesh
          castShadow
          receiveShadow
          geometry={geometry}
          // onPointerOver={e => {
          //   if (selectedApt === null) {
          //     e.stopPropagation();
          //     setHovered(id)
          //   }
          // }}
          onClick={e => {
            if (selectedApt === null) {
              e.stopPropagation();
              setHovered(id)
            }
          }}
          // onPointerOut={e => {
          //   if (selectedApt === null) {
          //     e.stopPropagation();
          //     setHovered(null);
          //   }
          // }}
          onDoubleClick={e => {
            e.stopPropagation();
            const newTarget = new THREE.Vector3(
              (geometry.boundingBox.max.x - geometry.boundingBox.min.x) / 2 + geometry.boundingBox.min.x,
              -geometry.boundingBox.max.z - 250,
              (geometry.boundingBox.max.y - geometry.boundingBox.min.y) / 2 + geometry.boundingBox.min.y,
            )
            setControlTarget(newTarget)
            setSelectedApt(geometry.uuid)
            setKey(id)
            setExitApt(false)
            floorSet(id)
            setHovered(null)
          }}
        >
          <meshStandardMaterial {...material} color={hovered === id ? "aquamarine" : (selectedApt === geometry.uuid) ? "#d4d4d4" : "#ababab"} transparent opacity={
            (!selectedApt)
              ? 1
              : (selectedApt === geometry.uuid) ? 1 : .6
            // 
            } />
        </mesh>
      ) : null
    )
  }


  // return whole model
  return (
    <>
      {
        (selectedApt) ? (
          <>
            <Marker rotation={[0, Math.PI / 2, 0]} position={[controlTarget.x, controlTarget.y + 300, controlTarget.z]} scale={50}>
              Apartment no. {key}
              <FaTimesCircle style={{ color: 'red', cursor: 'pointer', width: '10px', marginLeft: 5 }} onClick={() => exitHandler()} />
            </Marker>
            <Marker rotation={[0, Math.PI / 2, 0]} position={[controlTarget.x, controlTarget.y + 150, controlTarget.z]} scale={100}>
              <FaMapMarkerAlt style={{ color: 'orange' }} />
            </Marker>

          </>
        ) : null
      }
      <group {...props} dispose={null}>
        <group rotation={[Math.PI / 2, 0, 0]} scale={1} position={[-10, -500, 0]}>
          {
            (!selectedApt) ? (
              <mesh
                castShadow
                receiveShadow
                geometry={nodes.Roof.geometry}
                material={materials.GreyColor}
                position={[166.46, 559.72, -1189.83]}
                scale={[1, 1, 0.03]}
              >
                <meshStandardMaterial {...materials.GreyColor} color={"#d4d4d4"} />
              </mesh>
            ) : null
          }
          {
            arrayOfObj.map((item, key) => {
              return (
                <Apartment geometry={item.mesh[1].geometry} material={materials.GreyColor} id={key} />
              )
            })
          }

        </group>
      </group>
      {
        (selectedApt) ? null : <Env />
      }
    </>
  );
}

useGLTF.preload(GLB);