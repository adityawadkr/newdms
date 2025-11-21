"use client"

import { useEffect, useRef } from "react"
import * as THREE from "three"
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer.js"
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass.js"
import { ShaderPass } from "three/examples/jsm/postprocessing/ShaderPass.js"
import { UnrealBloomPass } from "three/examples/jsm/postprocessing/UnrealBloomPass.js"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"

gsap.registerPlugin(ScrollTrigger)

export default function Scene3D() {
    const containerRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        if (!containerRef.current) return

        const container = containerRef.current

        // --- SCENE SETUP ---
        const scene = new THREE.Scene()
        scene.background = new THREE.Color(0x020202)
        scene.fog = new THREE.FogExp2(0x020202, 0.02)

        const camera = new THREE.PerspectiveCamera(35, window.innerWidth / window.innerHeight, 0.1, 100)
        // Low profile camera angle
        camera.position.set(6, 1, 9)

        const renderer = new THREE.WebGLRenderer({
            antialias: true,
            powerPreference: "high-performance"
        })
        renderer.setSize(window.innerWidth, window.innerHeight)
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
        renderer.shadowMap.enabled = true
        renderer.shadowMap.type = THREE.PCFSoftShadowMap
        renderer.toneMapping = THREE.ACESFilmicToneMapping
        renderer.toneMappingExposure = 0.8 // Dark exposure
        container.appendChild(renderer.domElement)

        // --- THE "MAGMA" RIBBON (Procedural Flow) ---
        const ribbonGeo = new THREE.PlaneGeometry(30, 10, 100, 40)

        // Custom Shader for the Ribbon
        const RibbonShader = {
            uniforms: {
                time: { value: 0 },
                color: { value: new THREE.Color(0xd90429) }, // Vision Red
            },
            vertexShader: `
        uniform float time;
        varying vec2 vUv;
        varying float vElevation;

        void main() {
          vUv = uv;
          vec3 pos = position;
          
          // Flowing Sine Waves
          float elevation = sin(pos.x * 0.5 + time) * 1.0 
                  + sin(pos.y * 1.0 + time * 0.8) * 0.5;
          
          // Arch over the car
          pos.z += elevation;
          pos.y += cos(pos.x * 0.3) * 2.0; 

          vElevation = elevation;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
        }
      `,
            fragmentShader: `
        uniform vec3 color;
        varying vec2 vUv;
        varying float vElevation;

        void main() {
          // Gradient Fade
          float alpha = smoothstep(0.0, 0.2, vUv.y) * smoothstep(1.0, 0.8, vUv.y);
          
          // Highlights based on elevation
          vec3 finalColor = color + vec3(vElevation * 0.3);
          
          gl_FragColor = vec4(finalColor, alpha * 0.6);
        }
      `,
        }

        const ribbonMat = new THREE.ShaderMaterial({
            uniforms: RibbonShader.uniforms,
            vertexShader: RibbonShader.vertexShader,
            fragmentShader: RibbonShader.fragmentShader,
            transparent: true,
            side: THREE.DoubleSide,
            blending: THREE.AdditiveBlending,
            depthWrite: false,
        })

        const ribbon = new THREE.Mesh(ribbonGeo, ribbonMat)
        ribbon.position.set(0, 4, -5)
        ribbon.rotation.x = -Math.PI / 3
        scene.add(ribbon)

        // --- THE FLAGSHIP VEHICLE ---
        const carGroup = new THREE.Group()
        scene.add(carGroup)
        carGroup.position.set(1, -0.8, 0)
        carGroup.rotation.y = -Math.PI / 6 // Profile view

        // Materials: Concept Black (Super glossy, very dark)
        const paintMat = new THREE.MeshPhysicalMaterial({
            color: 0x000000,
            metalness: 0.9,
            roughness: 0.1,
            clearcoat: 1.0,
            clearcoatRoughness: 0.0,
            envMapIntensity: 2.5, // Rely on reflections
        })
        const chromeMat = new THREE.MeshStandardMaterial({
            color: 0x444444,
            metalness: 1.0,
            roughness: 0.1,
        })
        const redLightMat = new THREE.MeshBasicMaterial({ color: 0xd90429 })

        // 1. Body Sculpting (Vision Concept Shape - Long Tail)
        const bodyGeo = new THREE.BoxGeometry(2.2, 0.75, 6.0, 40, 20, 60)
        const pos = bodyGeo.attributes.position
        for (let i = 0; i < pos.count; i++) {
            let x = pos.getX(i)
            let y = pos.getY(i)
            let z = pos.getZ(i)
            const nz = z / 3.0

            // Streamline Taper
            let w = 1.0
            if (nz > 0.4) w = 1.05 // Hips
            if (nz < -0.7) w = 0.85 // Nose
            x *= w

            // Concept Profile (Very low, very long)
            if (nz < -0.4) y -= Math.pow(nz + 0.4, 2) * 0.5 // Smooth hood
            if (nz > 0.6) y -= Math.pow(nz - 0.6, 2) * 0.8 // Boat tail drop

            // Dome Roof
            if (y > 0) {
                x *= 0.7 // Tumblehome
                if (nz > -0.5 && nz < 0.8) y += Math.cos(nz * 1.2) * 0.35
            }

            // Wheel Wells
            const dF = Math.abs(z - -1.8)
            const dR = Math.abs(z - 1.8)
            if ((dF < 0.8 || dR < 0.8) && y < 0.1) x *= 1.1

            pos.setXYZ(i, x, y, z)
        }
        bodyGeo.computeVertexNormals()
        const body = new THREE.Mesh(bodyGeo, paintMat)
        body.castShadow = true
        body.receiveShadow = true
        carGroup.add(body)

        // 2. Red Light Strip (Rear)
        const tailLight = new THREE.Mesh(
            new THREE.BoxGeometry(1.6, 0.02, 0.05),
            redLightMat
        )
        tailLight.position.set(0, 0.15, 2.85)
        // Curve it
        const tlPos = tailLight.geometry.attributes.position
        for (let i = 0; i < tlPos.count; i++)
            tlPos.setZ(i, tlPos.getZ(i) - Math.pow(tlPos.getX(i), 2) * 0.5)
        carGroup.add(tailLight)

        // 3. Wheels (Turbine Concept - Blacked Out)
        const wheelGeo = new THREE.CylinderGeometry(0.48, 0.48, 0.35, 64)
        const tireMat = new THREE.MeshStandardMaterial({
            color: 0x050505,
            roughness: 0.8,
        })
        const rimMat = new THREE.MeshStandardMaterial({
            color: 0x222222,
            metalness: 0.8,
            roughness: 0.2,
        })

        const wPos = [
            [-1.1, -0.38, 1.8],
            [1.1, -0.38, 1.8],
            [-1.1, -0.38, -1.8],
            [1.1, -0.38, -1.8],
        ]
        wPos.forEach((p) => {
            const grp = new THREE.Group()
            const t = new THREE.Mesh(wheelGeo, tireMat)
            t.rotation.z = Math.PI / 2
            grp.add(t)
            const r = new THREE.Mesh(
                new THREE.CylinderGeometry(0.3, 0.3, 0.36, 16),
                rimMat
            )
            r.rotation.z = Math.PI / 2
            grp.add(r)

            // Red Ring Accent
            const ring = new THREE.Mesh(
                new THREE.TorusGeometry(0.15, 0.005, 16, 32),
                redLightMat
            )
            ring.rotation.y = Math.PI / 2
            ring.position.x = p[0] > 0 ? 0.18 : -0.18
            grp.add(ring)

            grp.position.set(p[0], p[1], p[2])
            carGroup.add(grp)
        })

        // --- LIGHTING (Low Key) ---
        // Top softbox (cool white)
        const areaLight = new THREE.RectAreaLight(0xffffff, 2, 10, 2)
        areaLight.position.set(0, 5, 0)
        areaLight.rotation.x = -Math.PI / 2
        scene.add(areaLight)

        // Rim Light Left (White) - Defines the silhouette
        const spotL = new THREE.SpotLight(0xffffff, 20)
        spotL.position.set(-10, 2, -5)
        spotL.lookAt(0, 0, 0)
        scene.add(spotL)

        // Rim Light Right (Red) - Adds the "Vision" tint
        const spotR = new THREE.SpotLight(0xd90429, 10)
        spotR.position.set(10, 2, -5)
        spotR.lookAt(0, 0, 0)
        scene.add(spotR)

        // Floor Reflection
        const plane = new THREE.Mesh(
            new THREE.PlaneGeometry(50, 50),
            new THREE.MeshPhysicalMaterial({
                color: 0x020202,
                roughness: 0.2,
                metalness: 0.8,
            })
        )
        plane.rotation.x = -Math.PI / 2
        plane.position.y = -0.85
        scene.add(plane)

        // --- POST PROCESSING ---
        const composer = new EffectComposer(renderer)
        composer.addPass(new RenderPass(scene, camera))

        // Bloom (Stronger for the red ribbon)
        const bloom = new UnrealBloomPass(
            new THREE.Vector2(window.innerWidth, window.innerHeight),
            1.5,
            0.4,
            0.85
        )
        bloom.threshold = 0.1
        bloom.strength = 0.8
        bloom.radius = 0.8
        composer.addPass(bloom)

        // Noise/Film Grain
        const NoiseShader = {
            uniforms: { tDiffuse: { value: null }, amount: { value: 0.05 } },
            vertexShader: `varying vec2 vUv; void main() { vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }`,
            fragmentShader: `
        uniform sampler2D tDiffuse; uniform float amount; varying vec2 vUv;
        float random(vec2 p) { return fract(sin(dot(p.xy, vec2(12.9898,78.233))) * 43758.5453); }
        void main() {
          vec4 color = texture2D(tDiffuse, vUv);
          color.rgb += (random(vUv) - 0.5) * amount;
          gl_FragColor = color;
        }
      `,
        }
        const noisePass = new ShaderPass(NoiseShader)
        composer.addPass(noisePass)

        // --- ANIMATION ---

        // Intro
        const tl = gsap.timeline()
        tl.from(carGroup.position, {
            z: -5,
            duration: 2.5,
            ease: "power2.out",
            delay: 1,
        })

        // Scroll Triggers
        // We need to wait for the DOM to be ready for ScrollTrigger to find elements if we were targeting them directly,
        // but here we are animating Three.js objects based on scroll.
        // Note: ScrollTrigger needs the scroll container. In Next.js, it's usually the window/body.

        const ctx = gsap.context(() => {
            gsap.to(carGroup.rotation, {
                scrollTrigger: {
                    trigger: "body",
                    start: "top top",
                    end: "bottom bottom",
                    scrub: 2,
                },
                y: -Math.PI * 0.8, // Rotate to reveal rear lights
            })

            gsap.to(camera.position, {
                scrollTrigger: {
                    trigger: "body",
                    start: "top top",
                    end: "bottom bottom",
                    scrub: 2,
                },
                z: 6,
                y: 3, // Move camera up and close
            })

            gsap.to(ribbon.position, {
                scrollTrigger: {
                    trigger: "body",
                    start: "top top",
                    end: "bottom bottom",
                    scrub: 2,
                },
                z: 5,
                y: 2, // Move ribbon over car
            })

            gsap.to(renderer.domElement, {
                scrollTrigger: {
                    trigger: "#intelligence", // This ID needs to exist in the UI
                    start: "top center",
                    end: "center center",
                    scrub: 1,
                },
                filter: "blur(10px) brightness(0.4)",
            })
        })

        const clock = new THREE.Clock()
        let animationId: number

        function animate() {
            animationId = requestAnimationFrame(animate)
            const t = clock.getElapsedTime()

            // Ribbon Flow
            ribbonMat.uniforms.time.value = t * 0.5

            // Car float
            carGroup.position.y = -0.8 + Math.sin(t * 0.5) * 0.005

            composer.render()
        }

        animate()

        const handleResize = () => {
            camera.aspect = window.innerWidth / window.innerHeight
            camera.updateProjectionMatrix()
            renderer.setSize(window.innerWidth, window.innerHeight)
            composer.setSize(window.innerWidth, window.innerHeight)
        }

        window.addEventListener("resize", handleResize)

        return () => {
            window.removeEventListener("resize", handleResize)
            cancelAnimationFrame(animationId)
            ctx.revert()
            if (container && container.contains(renderer.domElement)) {
                container.removeChild(renderer.domElement)
            }
            renderer.dispose()
            // Dispose other resources if needed
        }
    }, [])

    return <div ref={containerRef} className="fixed top-0 left-0 w-full h-full z-0" />
}
