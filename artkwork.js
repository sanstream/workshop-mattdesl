const canvasSketch = require('canvas-sketch');

const settings = {
  dimensions: 'A4',
  pixelsPerInch: 300,
  orientation: 'landscape',
  units: 'cm',
};

const sketch = () => {
  return ({ context, width, height }) => {
    context.clearRect(0, 0, width, height);

    // context.fillStyle = 'cyan';
    // context.fillRect(0, 0, width, height);

    // context.fillStyle = 'green';
    // context.fillRect(50, 10, 100, 100);

    // context.strokeStyle = 'pink'
    // context.lineWidth = 30
    // context.strokeRect(250, 500, 500, 250)

    context.fillStyle = 'azure';
    context.strokeStyle = 'orange';
    context.beginPath()
    context.arc(width/2, height/2, width / 6, 0, Math.PI * 2)
    context.stroke()
    context.fill()
  };
};

canvasSketch(sketch, settings);
