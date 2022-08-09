import GLB from '../glb/envirounment.glb'
import { useGLTF } from '@react-three/drei'

export function Env(props) {
    const { nodes, materials } = useGLTF(GLB)
    return (
        <group {...props} dispose={null} scale={100} position={[-46000, -1900, -16500]}>
            <mesh geometry={nodes.Terrain.geometry} material={materials.roof} >
                <meshStandardMaterial {...materials.GreyColor} color={"#ededed"} />
            </mesh>
            <mesh geometry={nodes.Terrain_envelope.geometry} material={nodes.Terrain_envelope.material} >
                <meshStandardMaterial {...materials.GreyColor} color={"#ededed"} />
            </mesh>
            <mesh geometry={nodes.maposm_buildings.geometry} material={materials.wall} rotation={[0, -0.16, 0]} >
                <meshStandardMaterial {...materials.GreyColor} color={"#ededed"} />
            </mesh>
            <mesh geometry={nodes.maposm_buildings001.geometry} material={materials.roof} rotation={[0, -0.16, 0]} >
                <meshStandardMaterial {...materials.GreyColor} color={"#ededed"} />
            </mesh>
        </group>
    )
}

useGLTF.preload(GLB)
