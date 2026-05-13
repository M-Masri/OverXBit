import { Suspense, useEffect, useRef, useState } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls, Sphere, Stars, useTexture } from '@react-three/drei'

const EARTH_DAY = 'https://raw.githubusercontent.com/mrdoob/three.js/dev/examples/textures/planets/earth_atmos_2048.jpg'
const EARTH_BUMP = 'https://raw.githubusercontent.com/mrdoob/three.js/dev/examples/textures/planets/earth_normal_2048.jpg'
const EARTH_SPEC = 'https://raw.githubusercontent.com/mrdoob/three.js/dev/examples/textures/planets/earth_specular_2048.jpg'
const EARTH_NIGHT = 'https://raw.githubusercontent.com/mrdoob/three.js/dev/examples/textures/planets/earth_lights_2048.png'
const EARTH_CLOUDS = 'https://raw.githubusercontent.com/mrdoob/three.js/dev/examples/textures/planets/earth_clouds_1024.png'

function EarthMesh({ isMobileViewport }) {
  const earthRef = useRef(null)
  const cloudRef = useRef(null)

  const textures = useTexture({
    map: EARTH_DAY,
    bumpMap: EARTH_BUMP,
    specularMap: EARTH_SPEC,
    emissiveMap: EARTH_NIGHT,
    alphaMap: EARTH_CLOUDS,
  })

  useFrame((_, delta) => {
    if (earthRef.current) {
      earthRef.current.rotation.y += delta * 0.06
    }
    if (cloudRef.current) {
      cloudRef.current.rotation.y += delta * 0.1
    }
  })

  return (
    <group
      rotation={isMobileViewport ? [0.12, 0.22, 0] : [0.14, 0.24, 0]}
      position={isMobileViewport ? [0, -2.02, 0] : [0, -2.42, 0]}
      scale={isMobileViewport ? 0.82 : 1}
    >
      <Sphere ref={earthRef} args={[3.2, 180, 180]}>
        <meshPhongMaterial
          map={textures.map}
          bumpMap={textures.bumpMap}
          bumpScale={0.045}
          specularMap={textures.specularMap}
          shininess={22}
          emissive="#000000"
          emissiveMap={textures.emissiveMap}
          emissiveIntensity={0}
        />
      </Sphere>

      <Sphere ref={cloudRef} args={[3.24, 144, 144]}>
        <meshPhongMaterial
          transparent
          opacity={0.16}
          alphaMap={textures.alphaMap}
          depthWrite={false}
          color="#ffffff"
        />
      </Sphere>
    </group>
  )
}

function HeroEarth3D() {
  const [isTouchDevice, setIsTouchDevice] = useState(false)
  const [isMobileViewport, setIsMobileViewport] = useState(false)

  useEffect(() => {
    const media = window.matchMedia('(pointer: coarse)')
    const mobileMedia = window.matchMedia('(max-width: 768px)')

    const updateDeviceType = () => {
      setIsTouchDevice(media.matches)
      setIsMobileViewport(mobileMedia.matches)
    }

    updateDeviceType()
    media.addEventListener('change', updateDeviceType)
    mobileMedia.addEventListener('change', updateDeviceType)

    return () => {
      media.removeEventListener('change', updateDeviceType)
      mobileMedia.removeEventListener('change', updateDeviceType)
    }
  }, [])

  const cameraConfig = isMobileViewport
    ? { position: [0, 0.24, 5.7], fov: 34 }
    : { position: [0, 0.34, 6.1], fov: 28 }

  return (
    <div className="hero-earth-canvas">
      <Canvas dpr={[1, 1.6]} camera={cameraConfig}>
        <color attach="background" args={['#020617']} />
        <fog attach="fog" args={['#020617', 4.8, 10.8]} />

        <ambientLight intensity={0.3} color="#ffffff" />
        <directionalLight position={[2.8, 1.6, 2.4]} intensity={1.45} color="#ffffff" />
        <pointLight position={[-2.3, -1.2, 1.1]} intensity={0.32} color="#ffffff" />

        <Suspense fallback={null}>
          <Stars radius={35} depth={60} count={1200} factor={2.4} saturation={0} fade speed={0.2} />
          <EarthMesh isMobileViewport={isMobileViewport} />
        </Suspense>

        <OrbitControls
          makeDefault
          enabled={!isTouchDevice}
          enableRotate={!isTouchDevice}
          enableZoom={false}
          enablePan={false}
          enableDamping
          dampingFactor={0.06}
          minPolarAngle={Math.PI / 2 - 0.24}
          maxPolarAngle={Math.PI / 2 + 0.24}
          rotateSpeed={0.42}
          autoRotate
          autoRotateSpeed={0.34}
        />
      </Canvas>
    </div>
  )
}

export default HeroEarth3D
