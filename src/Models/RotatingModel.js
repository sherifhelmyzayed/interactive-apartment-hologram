import { useGLTF } from '@react-three/drei';
import GLB from '../glb/apartments.glb'


export function RotatingModel(props) {
    const { nodes, materials } = useGLTF(GLB);
    const arrayOfObj = Object.entries(nodes).map((mesh) => ({ mesh })).slice(3, 20);
    const Apartment = (props) => {
        const { geometry } = props
        return (
            <mesh
                castShadow
                receiveShadow
                geometry={geometry}
            >
                <meshStandardMaterial color={"#d4d4d4"} />
            </mesh>
        )
    }

    return (
        <>
            <group {...props} dispose={null}>
                <group rotation={[Math.PI / 2, 0, 0]} scale={1} position={[-10, -500, 0]}>
                    {
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
        </>
    );
}

useGLTF.preload(GLB);