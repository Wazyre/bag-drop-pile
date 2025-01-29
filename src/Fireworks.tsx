import Particles, { initParticlesEngine } from '@tsparticles/react';
import { Container, Engine, ISourceOptions } from '@tsparticles/engine';
// import { loadFireworksPreset } from '@tsparticles/preset-fireworks';
import { loadFull } from 'tsparticles';
import { useCallback, useEffect, useState } from 'react';

import './App.css';
import React from 'react';
import { initOptions } from './InitOptions';

interface FireworksProps {
	runFireworks: boolean
};

const Fireworks = React.memo(() => {
	const [init, setInit] = useState(false); 
	const [options, setOptions] = useState<ISourceOptions>();
	const [fContainer, setFContainer] = useState<Container>();
	
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
	
	// const options: ISourceOptions = useMemo(() => ({
	// 	background: {
	// 		color: "#ffffff",
	// 		opacity: 0
	// 	},
	// 	preset: "fireworks"
	// }), []);

	useEffect(() => {
		initParticlesEngine(async (partEngine: Engine) => {
		await loadFull(partEngine);
		setOptions(initOptions(partEngine));
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