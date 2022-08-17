import { useState } from 'react';
import * as THREE from 'three';
import { useFrame, useThree } from "@react-three/fiber";
import { Html, useGLTF } from '@react-three/drei';
import { useSpring, easings } from '@react-spring/three';
import { FaMapMarkerAlt, FaTimesCircle } from 'react-icons/fa';
import GLB from '../glb/apartments.glb';
import { Env } from './Env.js';



export function Model(props) {

  const three = useThree();

  const { controls, setSelectedApt, selectedApt } = props;

  const [controlTarget, setControlTarget] = useState(new THREE.Vector3(0, 0, 0));
  const [positionTarget, setPositionTarget] = useState(new THREE.Vector3(0, 0, 0));

  const [hovered, setHovered] = useState(null);

  const [exitApt, setExitApt] = useState(false);
  const [key, setKey] = useState(null);
  const [floor, setFloor] = useState([]);

  const floorRef = [
    [0, 1, 8, 9],
    [10, 11, 12, 13],
    [2, 3, 14, 15],
    [4, 5, 6, 7]
  ];

  const unAvailable = [0, 3, 9, 12, 13];

  const { nodes, materials } = useGLTF(GLB);
  const arrayOfObj = Object.entries(nodes).map((mesh) => ({ mesh })).slice(3, 20);

  const controlToTargetAnimation = useSpring({
    config: { duration: 1500, easing: easings.easeInOutExpo },
    from: {
      lookAtX: (controls.current) ? controls.current.target.x : 0,
      lookAtY: (controls.current) ? controls.current.target.y : 0,
      lookAtZ: (controls.current) ? controls.current.target.z : 0,
      positionX: three.camera.position.x,
      positionY: three.camera.position.y,
      positionZ: three.camera.position.z
    },
    to: {
      lookAtX: (controlTarget) ? controlTarget.x : 0,
      lookAtY: (controlTarget) ? controlTarget.y : 0,
      lookAtZ: (controlTarget) ? controlTarget.z : 0,
      positionX: positionTarget.x,
      positionY: positionTarget.y,
      positionZ: positionTarget.z
    },
    onRest: () => {
      controls.current.enableRotate = true
    },
    reset: true
  });

  const controlFromTargetAnimation = useSpring({
    config: { duration: 1000, easing: easings.easeInOutCubic },
    from: {
      lookAtX: (controls.current && exitApt) ? controls.current.target.x : null,
      lookAtY: (controls.current && exitApt) ? controls.current.target.y : null,
      lookAtZ: (controls.current && exitApt) ? controls.current.target.z : null,
      positionX: three.camera.position.x,
      positionY: three.camera.position.y,
      positionZ: three.camera.position.z
    },
    to: {
      lookAtX: (exitApt) ? 0 : controlTarget.x,
      lookAtY: (exitApt) ? 0 : controlTarget.y,
      lookAtZ: (exitApt) ? 0 : controlTarget.z,
      positionX: positionTarget.x,
      positionY: positionTarget.y,
      positionZ: positionTarget.z
    },
    onRest: () => {
      setExitApt(false);
      controls.current.enableRotate = true;
    },
    reset: true
  });



  function Marker({ children, ...props }) {
    // This holds the local occluded state
    return (
      <Html
        transform
        sprite
        occlude
        style={{ transition: 'all 0.2s', opacity: 1, transform: `scale(2)`, userSelect: 'none' }}
        {...props}>
        {children}
      </Html>
    )
  }

  const exitHandler = () => {
    controls.current.enableRotate = true
    const positionTargetnew = new THREE.Vector3(
      (5000 * Math.sin(controls.current.getAzimuthalAngle()) * Math.sin(controls.current.getPolarAngle())),
      (400),
      (5000 * Math.cos(controls.current.getAzimuthalAngle()) * Math.sin(controls.current.getPolarAngle())),
    )
    controls.current.enableRotate = false;
    setPositionTarget(positionTargetnew)
    setExitApt(true)
    setSelectedApt(null)
    setKey(null)
    setControlTarget(new THREE.Vector3(0, 0, 0))
    setFloor([])
  };


  const Apartment = (props) => {
    const { geometry, material, id } = props;

    const floorSet = (id) => {
      setFloor(floorRef.filter(item => item.includes(id))[0]);
    }

    useFrame(() => {
      if (controlToTargetAnimation.lookAtX.animation.changed) {
        controls.current.target.x = controlToTargetAnimation.lookAtX.animation.values[0]._value;
        controls.current.target.y = controlToTargetAnimation.lookAtY.animation.values[0]._value;
        controls.current.target.z = controlToTargetAnimation.lookAtZ.animation.values[0]._value;

        three.camera.position.x = controlToTargetAnimation.positionX.animation.values[0]._value;
        three.camera.position.y = controlToTargetAnimation.positionY.animation.values[0]._value;
        three.camera.position.z = controlToTargetAnimation.positionZ.animation.values[0]._value;
      }
      if (controls.current && exitApt === true) {
        controls.current.target.x = controlFromTargetAnimation.lookAtX.animation.values[0]._value;
        controls.current.target.y = controlFromTargetAnimation.lookAtY.animation.values[0]._value;
        controls.current.target.z = controlFromTargetAnimation.lookAtZ.animation.values[0]._value;

        three.camera.position.x = controlFromTargetAnimation.positionX.animation.values[0]._value;
        three.camera.position.y = controlFromTargetAnimation.positionY.animation.values[0]._value;
        three.camera.position.z = controlFromTargetAnimation.positionZ.animation.values[0]._value;
      }
    })

    return (
      <>{

        (!selectedApt || selectedApt === id || floor.includes(id)) ? (
          <mesh
            castShadow
            receiveShadow
            geometry={geometry}
            onClick={e => {
              if (selectedApt === null) {
                e.stopPropagation();
                setHovered(id);
              }
            }}
            onDoubleClick={e => {
              controls.current.enableRotate = false
              e.stopPropagation();
              if (!unAvailable.includes(id)) {
                controls.current.enableRotate = false
                const newTarget = new THREE.Vector3(
                  (geometry.boundingBox.max.x - geometry.boundingBox.min.x) / 2 + geometry.boundingBox.min.x,
                  -geometry.boundingBox.max.z - 250,
                  (geometry.boundingBox.max.y - geometry.boundingBox.min.y) / 2 + geometry.boundingBox.min.y,
                )
                let distance = controls.current.object.position.distanceTo(controls.current.target)
                if (distance > 1600) distance = 1600
                if (distance < 1200) distance = 1200
                const positionTargetnew = new THREE.Vector3(
                  (newTarget.x + distance * Math.sin(controls.current.getAzimuthalAngle()) * Math.sin(controls.current.getPolarAngle())),
                  (newTarget.y + distance * Math.sin(controls.current.getPolarAngle())),
                  (newTarget.z + distance * Math.cos(controls.current.getAzimuthalAngle()) * Math.sin(controls.current.getPolarAngle())),
                )
                setControlTarget(newTarget)
                setPositionTarget(positionTargetnew)
                setSelectedApt(id)
                setKey(id)
                setExitApt(false)
                floorSet(id)
                setHovered(null)
              }
            }}
          >
            <meshStandardMaterial {...material} color={
              hovered === id
                ? !unAvailable.includes(id)
                  ? "aquamarine"
                  : "red"
                : (selectedApt === id)
                  ? "#d4d4d4"
                  : unAvailable.includes(id) && selectedApt
                    ? "red"
                    : "#ababab"
            } transparent opacity={
              (!selectedApt)
                ? 1
                : (selectedApt === id) ? 1 : .6
              // 
            } />
          </mesh>
        ) : null
      }
        {
          (selectedApt !== id && floor.includes(id)) ? (
            <Marker rotation={[0, Math.PI / 2, 0]} position={[
              (geometry.boundingBox.max.x - geometry.boundingBox.min.x) / 2 + geometry.boundingBox.min.x,
              (geometry.boundingBox.max.y - geometry.boundingBox.min.y) / 2 + geometry.boundingBox.min.y,
              (geometry.boundingBox.max.z - geometry.boundingBox.min.z) / 2 + geometry.boundingBox.min.z - 250,
            ]} scale={50}>
              Apartment no. {id}
            </Marker>
          ) : null
        }
      </>
    )
  }

  // const newTarget = new THREE.Vector3(
  //   (geometry.boundingBox.max.x - geometry.boundingBox.min.x) / 2 + geometry.boundingBox.min.x,
  //   -geometry.boundingBox.max.z - 250,
  //   (geometry.boundingBox.max.y - geometry.boundingBox.min.y) / 2 + geometry.boundingBox.min.y,
  // )

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
      <Env selectedApt={selectedApt} />
    </>
  );
}

useGLTF.preload(GLB);