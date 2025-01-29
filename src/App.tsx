import { MutableRefObject, useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react'
import { Bodies, Body, Composite, Engine, Render, Runner} from "matter-js";
import './App.css'
import Fireworks from './Fireworks';


const App = () => {
  
  const [counter, setCounter] = useState(0);
  const [constraints, setConstraints] = useState<DOMRect>();
  const [boxElement, setBoxElement] = useState<HTMLDivElement>();
  const [runFireworks, setRunFireworks] = useState(false);
  const [bagsPerFireworks, setBagsPerFireworks] = useState(5);
  // const [scene, setScene] = useState();

  // const boxRef = useRef<HTMLDivElement>(null);
  // const observer = new ResizeObserver(([entry]) => {
  //   console.log('Entered observer')
  //   setConstraints(entry.contentRect);

  // })
  const boxRef = useCallback((node: HTMLDivElement) => {
    
    // observer.observe(boxRef.);
    if(node != null){
      setBoxElement(node);
      console.log('Entered callback')
      setConstraints(node.getBoundingClientRect());
    }

    // return () => {
    //   observer.disconnect();
    // }
  }, []);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  // const composite: MutableRefObject<Composite | undefined> = useRef();
  const engine: MutableRefObject<Engine> = useRef(Engine.create({}));
  const render: MutableRefObject<Render | undefined> = useRef()
  const runner: MutableRefObject<Runner> = useRef(Runner.create());

  // let height: number;
  // let width: number;

  const getCanvasSize = (multiplier: number, dimension: string = 'width') => {
    if (constraints) {
      if (dimension == 'width') {
        return (constraints.width * multiplier) / window.devicePixelRatio
      }
      return (constraints.height * multiplier) / window.devicePixelRatio
    }
    return 0;
  }

  const handleResize = () => {
    if (!boxElement) return;
    console.log('Resized')
    console.log(boxElement.getBoundingClientRect())
    setConstraints(boxElement.getBoundingClientRect());
  };

  const initializeRenderer = () => {
    console.log('Began initalization')
    // if (!boxRef || !canvasRef.current) return;

    // height = boxRef.current.offsetHeight;
    // width = boxRef.current.offsetWidth;

    render.current = Render.create({
      element: boxElement,
      engine: engine.current,
      canvas: canvasRef.current != null ? canvasRef.current : undefined,
      options: {
        background: '#BBBBBB',
        pixelRatio: window.devicePixelRatio
        // wireframes: false
      }
    });

    Composite.add(engine.current.world, [
      Bodies.rectangle(0, 0, 0, 0, { isStatic: true, friction: 10 }),
      Bodies.rectangle(0, 0, 0, 0, { isStatic: true, friction: 10 }),
      Bodies.rectangle(0, 0, 0, 0, { isStatic: true, friction: 10 }),
    ]);

    Render.run(render.current);
    // runner.current = Runner.create();
    Runner.run(runner.current, engine.current);
    
    console.log('Finished initialization')
    // setConstraints(boxRef.current.getBoundingClientRect());
    // window.addEventListener('resize', handleResize);

  };

  const clearRenderer = () => {
    if (!render.current) return;
    console.log('Cleaning render')
    Render.stop(render.current);
    Runner.stop(runner.current);
    render.current.canvas.remove();

    if (!engine.current) return;
    Composite.clear(engine.current.world, false);
    Engine.clear(engine.current);
  };

  const addBag = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setCounter(counter + 1);

    // counter - 1 due to asynchronus setState call
    if (counter != 0 && (counter + 1) % bagsPerFireworks == 0) { 
      console.log(counter)
      setRunFireworks(true);
      setTimeout(function () {
        setRunFireworks(false);
      }, 2000);
    }
  };

  useLayoutEffect(() => {
    console.log('Entered layout effect')
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    }
  }, [boxElement]);

  useEffect(() => {

    // if (render.current) {
    //   // Render.run(render.current);
    //   // // runner.current = Runner.create();
    //   // Runner.run(runner.current, engine.current);
    //   console.log('oehfoew')
    //   return
    // };
    initializeRenderer(); 
    console.log('Ended initial useEffect')

    return(() => {
      clearRenderer();
      // window.removeEventListener('resize', handleResize);
    })
  }, [boxElement]);

  useEffect(() => {
    if (render.current && constraints) {
      console.log('Initial constraints')
      console.log(constraints);
      console.log(render.current)
      console.log(engine.current)
      console.log(window.devicePixelRatio)
      render.current.bounds.max.x = getCanvasSize(1);
      render.current.bounds.max.y = getCanvasSize(1, 'height');
      render.current.options.width = getCanvasSize(1);
      render.current.options.height = getCanvasSize(1, 'height');
      render.current.canvas.width = getCanvasSize(1);
      render.current.canvas.height = getCanvasSize(1, 'height');
      Render.setPixelRatio(render.current, window.devicePixelRatio);

      const floor = engine.current.world.bodies[0];
      const leftWall = engine.current.world.bodies[1];
      const rightWall = engine.current.world.bodies[2];

      Body.setPosition(floor, { x: getCanvasSize(0.5), y: getCanvasSize(1, 'height') + 10});
      Body.setVertices(floor, [
        { x: 0, y: getCanvasSize(1, 'height') },
        { x: getCanvasSize(1), y: getCanvasSize(1, 'height') },
        { x: getCanvasSize(1), y: getCanvasSize(1, 'height') + 20},
        { x: 0, y: getCanvasSize(1, 'height') + 20 },
      ]);

      Body.setPosition(leftWall, { x: -10, y: getCanvasSize(0.5, 'height') });
      Body.setVertices(leftWall, [
        { x: -20, y: -10 },
        { x: -20, y: getCanvasSize(1, 'height') },
        { x: 0, y: getCanvasSize(1, 'height') },
        { x: 0, y: -10 },
      ]);

      Body.setPosition(rightWall, { x: getCanvasSize(1) + 10, y: getCanvasSize(0.5, 'height') });
      Body.setVertices(rightWall, [
        { x: getCanvasSize(1), y: -10 },
        { x: getCanvasSize(1) + 20, y: -10 },
        { x: getCanvasSize(1) + 20, y: getCanvasSize(1, 'height') },
        { x: getCanvasSize(1), y: getCanvasSize(1, 'height') },
      ]);

    }
  }, [render, constraints])

  useEffect(() => {
    if (counter != 0) { // Prevents adding bag when counter is initialized
      const width: number = getCanvasSize(1);
      // console.log(engine.current.world.bodies[0])

      Composite.add(engine.current.world, [
        Bodies.rectangle(Math.floor(Math.random() * -width) + width, 10, 50, 100, { //Add a grain to the current mouse position.
          angle: 45, friction: 10, restitution: 0.01, density: 0.001,
          render: { //Just color change
            fillStyle: '#888888', strokeStyle: '#333333', lineWidth: 3
          }
        }),
      ]);
      // console.log(engine.current.world)
    }
  }, [counter]);
  
  if (boxRef) {
    return (
      <div>
        <div className='windowView'>
          {runFireworks && <Fireworks />}
          <h2 className='counter'>{counter + ' Bags'}</h2>
          <div ref={boxRef} className='canvas'>
            <canvas ref={canvasRef}  />
          </div>
          <div>
            <label className='bagNumberLabel'>
              Enter how many bags drop before each fireworks:
              <input className='bagNumberInput' type='number' value={bagsPerFireworks} onChange={e => setBagsPerFireworks(parseInt(e.target.value))} />
            </label>
            
          </div>
          <button className='addBtn' type='button' onClick={addBag}>
            Click
          </button>
        </div>
      </div>
    );
  };
  
  return <></>;
}

export default App;