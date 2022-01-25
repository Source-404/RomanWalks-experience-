import "./style.css";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

import * as dat from "dat.gui";

import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader.js";

// Debug
const gui = new dat.GUI();

// Canvas
const canvas = document.querySelector("canvas.webgl");

// Scene
const scene = new THREE.Scene();

// Objects
const geometry = new THREE.TorusGeometry(0.3, 0.02, 16, 100);
const geometry2 = new THREE.SphereGeometry(0.1, 32, 32);

// Materials

const material = new THREE.MeshBasicMaterial();
material.color = new THREE.Color(0xff0000);

// Mesh
const sphere = new THREE.Mesh(geometry, material);

const sphere2 = new THREE.Mesh(geometry2, material);
sphere2.position.set(0, 1, 0);
scene.add(sphere2);
sphere2.add(sphere);

// Music

function boomMusic() {
  var audio = new Audio("./music/audio2.mp3");
  audio.play();
  // .then(() => {
  //   console.log("something");
  // })
  // .catch((e) => {
  //   console.log(e);
  // });
}

// Location Points

class DescriptionBox {
  constructor(node) {
    this.parent = node;
  }
  createBox() {
    // this.dracoLoader2 = new DRACOLoader();
    // this.dracoLoader2.setDecoderPath("js/libs/draco/gltf/");

    // let example = new THREE.Object3D();
    // this.loader2 = new GLTFLoader();
    // this.loader2.setDRACOLoader(this.dracoLoader2);
    // this.loader2.load(
    //   "/models/text_bubble.gltf",
    //   function (gltf) {
    //     const model = gltf.scene;

    //     model.scale.set(5, 5, 5);
    //     console.log(model);
    //     model.position.set(0, 2, 0);
    //     example = model;
    //     console.log(example.position);
    //     this.parent.add(model);

    //     // tick();
    //   },
    //   undefined,
    //   function (e) {
    //     console.log(here);
    //     console.error(e);
    //   }
    // );

    // return example;

    this.geometry = new THREE.BoxGeometry(1, 1, 0.1);
    this.material = new THREE.MeshBasicMaterial({ color: 0xffd700 });
    this.cube = new THREE.Mesh(this.geometry, this.material);
    this.parent.add(this.cube);
    this.cube.position.y = 1.5;
    this.cube.name = "kaboom";
    return this.cube;
  }
  destroyBox() {
    this.parent.remove(this.cube);
  }
}

class LocationPointer {
  constructor(xx, yy, zz, name = "boom") {
    this.x = xx;
    this.y = yy;
    this.z = zz;

    // Objects
    this.geometry = new THREE.TorusGeometry(0.3, 0.02, 16, 100);
    this.geometry2 = new THREE.SphereGeometry(0.1, 32, 32);

    // Materials

    this.material = new THREE.MeshBasicMaterial();
    this.material.color = new THREE.Color(0xff0000);

    // Mesh
    this.sphere = new THREE.Mesh(this.geometry, this.material);

    this.sphere2 = new THREE.Mesh(this.geometry2, this.material);
    this.sphere2.position.set(this.x, this.y, this.z);
    scene.add(this.sphere2);
    this.sphere2.add(this.sphere);
    this.sphere2.name = name;
  }
  update(timeElapsed) {
    this.sphere.rotation.y = 0.5 * timeElapsed;
  }
}

const cityPointer = new LocationPointer(5, 1, 0, "city");
const parkPointer = new LocationPointer(-5, 1, 0, "park");

// Lights

const lightControl = new THREE.Object3D();
lightControl.position.x = 0;
lightControl.position.y = 0;
lightControl.position.z = 0;
scene.add(lightControl);

const pointLight = new THREE.PointLight(0xfdfbd3, 0.1);
pointLight.position.x = -2;
pointLight.position.y = 10;
pointLight.position.z = 4;
pointLight.intensity = 2;

lightControl.add(pointLight);

// Custom Model

const dracoLoader = new DRACOLoader();
dracoLoader.setDecoderPath("js/libs/draco/gltf/");

const loader = new GLTFLoader();
loader.setDRACOLoader(dracoLoader);
loader.load(
  "./models/Rome_city.gltf",
  function (gltf) {
    const model = gltf.scene;
    model.position.set(0, 0, 0);
    model.scale.set(0.5, 0.5, 0.5);
    scene.add(model);
    console.log(model);

    // mixer = new THREE.AnimationMixer(model);
    // mixer.clipAction(gltf.animations[0]).play();
    boomMusic();

    tick();
  },
  undefined,
  function (e) {
    console.error(e);
  }
);

/**
 * Sizes
 */
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};

window.addEventListener("resize", () => {
  // Update sizes
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;

  // Update camera
  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();

  // Update renderer
  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(
  75,
  sizes.width / sizes.height,
  0.1,
  100
);
camera.position.x = 0;
camera.position.y = 0.5;
camera.position.z = 5;
scene.add(camera);

// Controls

const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
  alpha: true,
});
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

/**
 * Animate
 */

const clock = new THREE.Clock();

const tick = () => {
  const elapsedTime = clock.getElapsedTime();

  // Update objects
  sphere.rotation.y = 0.5 * elapsedTime;
  cityPointer.update(elapsedTime);
  parkPointer.update(elapsedTime);

  // lightControl.rotation.x = 0.05 * elapsedTime;

  // Update Orbital Controls
  controls.update();

  // Render
  renderer.render(scene, camera);

  // Call tick again on the next frame
  window.requestAnimationFrame(tick);
};

const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();

function joinChatRoom() {
  console.log("you have entered our server");
}

window.addEventListener("click", (event) => {
  // calculate mouse position in normalized device coordinates
  // (-1 to +1) for both components

  mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

  // update the picking ray with the camera and mouse position
  raycaster.setFromCamera(mouse, camera);

  // calculate objects intersecting the picking ray
  const intersects = raycaster.intersectObjects(scene.children);
  console.log(intersects);
  //&& intersects[0].object.name
  if (intersects.length > 0) {
    console.log(intersects[0].object.children);
    var element = window.document.getElementById("heading-container");
    if (intersects[0].object.children.length >= 2) {
      console.log(intersects[0].object.children[1]);
      element.classList.toggle("hide");
      intersects[0].object.remove(intersects[0].object.children[1]);
    } else {
      let smallBox = new DescriptionBox(intersects[0].object).createBox();
      //   smallBox.position.set(0, 5, 0);
      //   console.log(smallBox.position);
      //intersects[0].object.add(smallBox);
      //   window.alert("You are about to enter our chat room, okay?");
      joinChatRoom();

      element.classList.toggle("hide");
    }
  }
});

tick();
