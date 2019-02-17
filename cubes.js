const canvasSketch = require('canvas-sketch');
const random = require('canvas-sketch-util/random')
const colourPalletes = require('nice-color-palettes')

// Ensure ThreeJS is in global scope for the 'examples/'
global.THREE = require('three');

// Include any additional ThreeJS examples below
require('three/examples/js/controls/OrbitControls');

// random.setSeed(random.getRandomSeed())
random.setSeed('495208')
console.log(`current seed: ${random.getSeed()}`)

const settings = {
  dimensions: [512, 512,],
  fps: 24, // frame rate for gifs
  duration: 4, // gif duration (so export is for a 4s gif)
  playbackRate: 'throtle',
  // Make the loop animated
  animate: true,
  // Get a WebGL canvas rather than 2D
  context: 'webgl',
  // Turn on MSAA
  attributes: { antialias: true }
};

const sketch = ({ context }) => {
  const pallete = random.pick(colourPalletes)
  // Create a renderer
  const renderer = new THREE.WebGLRenderer({
    context
  });

  // WebGL background color
  renderer.setClearColor('#ababab', 1);

  // Setup a camera
  const camera = new THREE.OrthographicCamera();

  // Setup camera controller
  const controls = new THREE.OrbitControls(camera);

  // Setup your scene
  const scene = new THREE.Scene();
  const box = new THREE.BoxGeometry(1, 1, 1)

  const group = new THREE.Group()
  for (let i = 0; i < 60; i++) {
    const mesh = new THREE.Mesh(
      box,
    new THREE.MeshStandardMaterial({
      color: random.pick(pallete),
      roughness: 0.75,
      metalness: 0,
      flatShading: false
    })
    );
    mesh.position.set(
      random.range(-0.5, 0.5) * random.gaussian(),
      random.range(-0.5, 0.5) * random.gaussian() * 2.5,
      random.range(-0.5, 0.5) * random.gaussian(),
    ).multiplyScalar(3)

    mesh.scale.set(
      random.range(-1, 1) * random.gaussian(),
      random.range(-1, 1) * random.gaussian(),
      random.range(-1, 1) * random.gaussian(),
    )

    group.add(mesh);
  }
  scene.add(group);

  // Specify an ambient/unlit colour
  scene.add(new THREE.AmbientLight('#222'));

  // Add some light
  const light = new THREE.PointLight('white', 1, 20);
  light.position.set(4, 4, 4);
  scene.add(light);

  // draw each frame
  return {
    // Handle resize events here
    resize ({ pixelRatio, viewportWidth, viewportHeight }) {
      renderer.setPixelRatio(pixelRatio);
      renderer.setSize(viewportWidth, viewportHeight);
      const aspect = viewportWidth / viewportHeight;

      // Ortho zoom
      const zoom = 7;

      // Bounds
      camera.left = -zoom * aspect;
      camera.right = zoom * aspect;
      camera.top = zoom;
      camera.bottom = -zoom;

      // Near/Far
      camera.near = -100;
      camera.far = 100;

      // Set position & look at world center
      camera.position.set(zoom, zoom, zoom);
      camera.lookAt(new THREE.Vector3());

      // Update the camera
      camera.updateProjectionMatrix();
    },
    // Update & render your scene here
    render ({ time, playhead }) {
      group.rotation.y = playhead * Math.PI * 2
      group.rotation.x = playhead * Math.PI * 2
      controls.update();
      renderer.render(scene, camera);
    },
    // Dispose of events & renderer for cleaner hot-reloading
    unload () {
      controls.dispose();
      renderer.dispose();
    }
  };
};

canvasSketch(sketch, settings);
