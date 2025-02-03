import Particles, { initParticlesEngine } from '@tsparticles/react';
import { Container, Engine, ISourceOptions } from '@tsparticles/engine';
// import { loadFireworksPreset } from '@tsparticles/preset-fireworks';
// import { loadFull } from 'tsparticles';
import { useCallback, useEffect, useMemo, useState } from 'react';

import './App.css';
import React from 'react';
// import { initOptions } from './InitOptions';
import { loadConfettiPreset } from '@tsparticles/preset-confetti';

// interface FireworksProps {
// 	runFireworks: boolean
// };

const Fireworks = React.memo(() => {
	const [init, setInit] = useState(false); 
	// const [options, setOptions] = useState<ISourceOptions>();
	// const [fContainer, setFContainer] = useState<Container>();
	
	const particlesLoaded = useCallback(async (container?: Container): Promise<void> => {
		console.log(container);
		// setFContainer(container);
		// container.zLayers = 10
		// container?.play();

		// setTimeout(function () {
		// 	container?.stop();
		// }, 2000);
	}, []);

	
	// const playFireworks = () => {
	// 	fContainer?.play();

	// 	setTimeout(function () {
	// 		fContainer?.stop();
	// 	}, 5000);
	// }
	
	const options: ISourceOptions = useMemo(() => ({
		emitters: [
			{
				life: {
					duration: 1,
					count: 1
				},
				position: {
					x: 0,
					y: 90,
				},
				particles: {
					move: {
						direction: "top-right",
					},
				},
				rate: {
					delay: 0,
				},
				startCount: 100
			},
			{
				life: {
					duration: 1,
					count: 1
				},
				position: {
					x: 100,
					y: 90,
				},
				particles: {
					move: {
						direction: "top-left",
						
					},
				},
				rate: {
					delay: 0,
				},
				startCount: 100
			},
			{
				life: {
					duration: 1,
					count: 1
				},
				position: {
					x: 100,
					y: 50,
				},
				particles: {
					move: {
						direction: "left",

					},
				},
				rate: {
					delay: 0,
				},
				startCount: 100
			},
			{
				life: {
					duration: 1,
					count: 1
				},
				position: {
					x: 0,
					y: 50,
				},
				particles: {
					move: {
						direction: "right",

					},
				},
				rate: {
					delay: 0,
				},
				startCount: 100
			},
		],
		preset: "confetti"
	}), []);

	useEffect(() => {
		initParticlesEngine(async (partEngine: Engine) => {
		await loadConfettiPreset(partEngine);
		// setOptions(initOptions(partEngine));
		}).then(() => {
		setInit(true);
		});
	}, []);

	// useEffect(() => {
	// 	playFireworks()
	// }, [props.runFireworks])

	if (init) {
		return (
			<Particles
				className='tsparticles'
				options={options}
				particlesLoaded={particlesLoaded}
			/>
		);
	}
	return <></>;

});

export default Fireworks;