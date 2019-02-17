const canvasSketch = require('canvas-sketch');
const { lerp } = require('canvas-sketch-util/math')
const random = require('canvas-sketch-util/random')
const colourPalletes = require('nice-color-palettes')

// random.setSeed(random.getRandomSeed())
random.setSeed('402577')
console.log(`current seed: ${random.getSeed()}`)


const settings = {
  suffix: random.getSeed(),
  dimensions: [ 2048, 2048 ],
  scaleToView: true,
};

const sketch = () => {
  const pallete = random.pick(colourPalletes)
  const bgColour = pallete.shift()
  /**
   * create normalised coordinates space:
   */
  const createGrid = () => {
    const count = 100
    const points = []
    const frequency = 2;

    for (let y = 0; y < count; y++) {
      for (let x = 0; x < count; x++) {
        const uCoor = x/(count - 1)
        const vCoor = y/(count - 1)
        const noise = random.noise2D(uCoor * frequency, vCoor * frequency)
        points.push({
          position: [ uCoor, vCoor, ],
          radius: noise * 0.5 + 0.5 * 200,
          rotation: noise * Math.PI * 1,
          colour: random.pick(pallete),
        })
      }
    }
    return points
  }
  // create grid before rendering:
  const grid = createGrid().filter(() => {
    // discard 50% of points:
    return random.chance(0.90)
  })

  // return the render function:
  return ({ context, width, height }) => {
    context.fillStyle = bgColour;
    context.fillRect(0, 0, width, height);
    // use grid to render points each times a render happens.
    const margin = width * 0.1

    grid.forEach(({ position, rotation, radius, colour, }) => {
      const [u, v,] = position
      const x = lerp(margin, width - margin, u)
      const y = lerp(margin, height - margin, v)
      context.fillStyle = colour

      context.save()
      context.translate(x, y)
      context.rotate(rotation)
      context.font = `${radius}px Consolas`
      context.fillText('-', x, y)
      context.restore()
      // context.beginPath()
      // context.arc(x, y, radius, 0, Math.PI * 2)
      // context.fill()
    })
  };
};

canvasSketch(sketch, settings);
