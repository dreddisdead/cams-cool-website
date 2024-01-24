import './styles.css';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import moon_img from './moon.jpg';
import space_img from './space5.jpg';
import cam_img from './cam.jpg';

// Setup

const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );

const renderer = new THREE.WebGLRenderer({
  canvas: document.querySelector('#bg'),
});

renderer.setPixelRatio( window.devicePixelRatio );
renderer.setSize( window.innerWidth, window.innerHeight );
camera.position.z = 30;
camera.position.x = -3;

renderer.render( scene, camera );

// Torus

const geometry = new THREE.TorusGeometry( 25, 0.05, 20, 100 );
const material = new THREE.MeshStandardMaterial({ color: 0xffffff});
const torus = new THREE.Mesh( geometry, material );

scene.add( torus );

// Lights

const pointLight = new THREE.PointLight(0xffffff, 2, 500);
pointLight.position.set(50, 50, 50);
pointLight.decay = 2;

const ambientLight = new THREE.AmbientLight(0x404040, 50);

scene.add(pointLight, ambientLight);

// Helpers

// const lightHelper = new THREE.PointLightHelper( pointLight )
// const gridHelper = new THREE.GridHelper( 200, 50 );
// scene.add( lightHelper, gridHelper )

// const controls = new OrbitControls( camera, renderer.domElement );

// Stars

function addStar() {
  const geometry = new THREE.SphereGeometry( 0.25, 24, 24 );
  const material = new THREE.MeshStandardMaterial( { color: 0xffffff } );
  const star = new THREE.Mesh( geometry, material );

  const [x, y, z] = Array(3)
    .fill()
    .map( () => THREE.MathUtils.randFloatSpread( 200 ));

  star.position.set( x, y, z );
  scene.add( star );
}

Array(300).fill().forEach( addStar );

// Background

// --- simple way to load texture ---
// const spaceTexture = new THREE.TextureLoader().load('space.jpg');
// scene.background = spaceTexture;

// --- better way to load texture ---
const loader = new THREE.TextureLoader();
const spaceTexture = loader.load( space_img, function( texture ) {
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.magFilter = THREE.NearestFilter;
  texture.anisotropy = renderer.capabilities.getMaxAnisotropy();
});

// scene.background = spaceTexture;

// Avatar

// --- simple way to load texture ---
// const camTexture = new THREE.TextureLoader().load('cam.png');

// --- better way to load texture ---
const camTexture = loader.load( cam_img, function( texture ) {
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.magFilter = THREE.NearestFilter;
  texture.anisotropy = renderer.capabilities.getMaxAnisotropy();
});

const cam = new THREE.Mesh(new THREE.BoxGeometry(3, 3, 3), new THREE.MeshBasicMaterial({ map: camTexture }));

scene.add( cam );

// Moon

const moonTexture = new THREE.TextureLoader().load( moon_img );


const moon = new THREE.Mesh(
  new THREE.SphereGeometry( 3, 32, 32 ),
  new THREE.MeshStandardMaterial({
    map: moonTexture,
  })
);

scene.add( moon );

moon.position.z = 35;
moon.position.y = -5;
moon.position.x = -18;

cam.position.z = -5;
cam.position.y = 0.5;
cam.position.x = 3;

torus.position.z = -5;
torus.position.y = 0.5;
torus.position.x = 3;

// Scroll Animation

function moveCamera() {
  const t = document.body.getBoundingClientRect().top;

  camera.position.z = t * -0.01;
  camera.position.x = t * -0.0002;
  camera.rotation.y = t * -0.0002;

}

document.body.onscroll = moveCamera;
moveCamera();

// Animation Loop

function animate() {
  requestAnimationFrame( animate );

  torus.rotation.x += 0.001;
  torus.rotation.y += 0.005;
  torus.rotation.z += 0.001;

  moon.rotation.x += 0.005;

  cam.rotation.y += 0.005;
  cam.rotation.x += 0.001;
  cam.rotation.z += 0.001;

  // controls.update();

  renderer.render( scene, camera );
}

animate();