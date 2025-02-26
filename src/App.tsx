import { MutableRefObject, useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react'
import { Bodies, Body, Composite, Engine, Render, Runner} from "matter-js";
import './App.css'
import Fireworks from './Fireworks';
import blackBag from './assets/BlackBag.png';
import blueBag from './assets/BlueBag.png';
import pinkBag from './assets/PinkBag.png';
import purpleBag from './assets/PurpleBag.png';
import redBag from './assets/RedBag.png';

const App = () => {
  
  const [counter, setCounter] = useState(0);
  const [constraints, setConstraints] = useState<DOMRect>();
  const [boxElement, setBoxElement] = useState<HTMLDivElement>();
  const [runFireworks, setRunFireworks] = useState(false);
  const [bagsPerFireworks, setBagsPerFireworks] = useState(100);
  const [showButtons, setShowButtons] = useState(true);

  const bagImages = [
    blackBag,
    blueBag,
    pinkBag,
    purpleBag,
    redBag
  ]

  const fireworksDuration: number = 5000; // In ms

  const boxRef = useCallback((node: HTMLDivElement) => {
    if(node != null){
      setBoxElement(node);
      console.log('Entered callback')
      setConstraints(node.getBoundingClientRect());
    }
  }, []);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const engine: MutableRefObject<Engine> = useRef(Engine.create({}));
  const render: MutableRefObject<Render | undefined> = useRef()
  const runner: MutableRefObject<Runner> = useRef(Runner.create());

  const getCanvasSize = (multiplier: number, dimension: string = 'width') => {
    if (constraints) {
      if (dimension == 'width') {
        return (constraints.width * multiplier) // window.devicePixelRatio
      }
      return (constraints.height * multiplier) // window.devicePixelRatio
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

    render.current = Render.create({
      element: boxElement,
      engine: engine.current,
      canvas: canvasRef.current != null ? canvasRef.current : undefined,
      options: {
        background: '#ffffff',
        pixelRatio: window.devicePixelRatio,
        wireframes: false
      }
    });

    Composite.add(engine.current.world, [
      Bodies.rectangle(0, 0, 0, 0, { isStatic: true, friction: 10 }),
      Bodies.rectangle(0, 0, 0, 0, { isStatic: true, friction: 10 }),
      Bodies.rectangle(0, 0, 0, 0, { isStatic: true, friction: 10 }),
    ]);

    Render.run(render.current);
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

  const addBag = (e: React.MouseEvent<HTMLDivElement>) => { //e: React.MouseEvent<HTMLButtonElement>
    e.preventDefault();
    setCounter(counter + 1);

    // counter - 1 due to asynchronus setState call
    if (counter != 0 && (counter + 1) % bagsPerFireworks == 0) { 
      console.log(counter)
      setRunFireworks(true);
      setTimeout(function () {
        setRunFireworks(false);
      }, fireworksDuration);
    }
  };

  const removeBag = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    window.location.reload();
    // setCounter(0);
    // localStorage.clear();
    Composite.remove(engine.current.world, engine.current.world.bodies.splice(3))
    
  }

  useLayoutEffect(() => {
    console.log('Entered layout effect')
    window.addEventListener("resize", handleResize);
    // document.getElementById("canvas")?.addEventListener("click", (e) => addBag(e));

    return (() => {
      console.log('Exiting layout effect')
      window.removeEventListener("resize", handleResize);
      // document.getElementById("canvas")?.removeEventListener('click', (e) => addBag(e));
    })
  }, [boxElement]);

  useEffect(() => {
    if (boxElement) {
      initializeRenderer();
      console.log('Ended initial useEffect')
      

      return (() => {
        clearRenderer();
        
      })
    }
    
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
    console.log('Counter useEffect')
    if (counter != 0) { // Prevents adding bag when counter is initialized
      const width: number = getCanvasSize(1);
      localStorage.setItem('counter', counter.toString())

      Composite.add(engine.current.world, [ // 50, 100
        Bodies.rectangle(Math.floor(Math.random() * -width) + width, 20, getCanvasSize(0.035), getCanvasSize(0.07), { // Add a bag resized according to screen size
          angle: Math.floor(Math.random() * 360), friction: 10, restitution: 0.01, density: 0.001,
          render: { 
            //fillStyle: '#888888', strokeStyle: '#333333', lineWidth: 3,
            sprite: {
              xScale: getCanvasSize(0.1) / 1000,
              yScale: getCanvasSize(0.1) / 1000,
              texture: bagImages[Math.floor(Math.random() * bagImages.length)]
            }
          }
        }),
      ]);
    }
  }, [counter]);

  useEffect(() => {
    console.log('Grabbing local counter')
    const localCounter = localStorage.getItem('counter');
    if (localCounter && boxElement) {
      console.log('Adding previous bags')
      setCounter(parseInt(localCounter));
      // const width: number = getCanvasSize(1);
      // for (let i = 0; i < parseInt(localCounter)-1; i++) {
      //   Composite.add(engine.current.world, [ // 50, 100
      //     Bodies.rectangle(Math.floor(Math.random() * -width) + width, 20, getCanvasSize(0.035), getCanvasSize(0.07), { // Add a bag resized according to screen size
      //       angle: Math.floor(Math.random() * 360), friction: 10, restitution: 0.01, density: 0.001,
      //       render: {
      //         //fillStyle: '#888888', strokeStyle: '#333333', lineWidth: 3,
      //         sprite: {
      //           xScale: getCanvasSize(0.1) / 1000,
      //           yScale: getCanvasSize(0.1) / 1000,
      //           texture: bagImages[Math.floor(Math.random() * bagImages.length)]
      //         }
      //       }
      //     }),
      //   ]);
      // }
    }
  }, [boxElement])
  
  if (boxRef) {
    return (
      <div>
        <div id='canvas' className='windowView'>
          {runFireworks && <Fireworks />}
          <h2 className='counter' onClick={() => setShowButtons(true)} >
            {counter + ' جنطة لحسن وأصدقائه'}
          </h2>
          <div  ref={boxRef} className='canvas' onClick={addBag}>
            <canvas ref={canvasRef}  />
          </div>
          {showButtons && <div>
            <label className='bagNumberLabel'>
              أدخل عدد الحقائب قبل كل احتفال:
              <input className='bagNumberInput' type='number' value={bagsPerFireworks} onChange={e => setBagsPerFireworks(parseInt(e.target.value))} />
            </label>
            
          </div>}
          {showButtons && <div className='row'>
            {/* <button className='addBtn' type='button' >
              إضغط
            </button> */}
            <button className='removeBtn' type='button' onClick={() => setShowButtons(false)}>
              إخفاء
            </button>
            <button className='addBtn' type='button' onClick={()=>{
              setRunFireworks(true);
            setTimeout(function () {
              setRunFireworks(false);
            }, fireworksDuration);
            }}>
              إحتفال
            </button>
            <button className='removeBtn' type='button' onClick={removeBag}>
              إعادة
            </button>
          </div>}
          
        </div>
      </div>
    );
  };
  
  return <></>;
}

export default App;