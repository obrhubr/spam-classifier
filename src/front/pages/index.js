import Main from '../components/main';
import { useEffect } from 'react';

export default function Home() {

	useEffect( () => { document.querySelector("body").classList.add("bg-yellow-400") } );

	return (
		<>
			<Main>
      		</Main>
		</>
	)
}