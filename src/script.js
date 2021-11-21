import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as dat from 'dat.gui'
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader'

// Debug
const gui = new dat.GUI()

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

const loader = new FBXLoader()

let mixer = null

loader.load('model/fbx/Capoeira-Digimon.fbx', (fbx) => {
    mixer = new THREE.AnimationMixer(fbx)
    const action = mixer.clipAction(fbx.animations[0])
    action.play() 
    fbx.scale.set(.1, .1, .1)
    scene.add(fbx)
})

// Lights

const L1 = new THREE.PointLight(0xffffff, 1)
L1.position.set(0, 14, 15)
const L2 = L1.clone()
L2.position.z *= -1
scene.add(L1, L2)

/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

window.addEventListener('resize', () =>
{
    // Update sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    // Update camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    // Update renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.set(-8, 14, 15)
scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    alpha: true
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

/**
 * Animate
 */

const clock = new THREE.Clock()

const tick = () => {

    const delta = clock.getDelta()
    if (mixer) {
        mixer.update(delta)
    }

    // Update Orbital Controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()