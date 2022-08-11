import Main from '../components/main';
import { useEffect } from 'react';

export default function Home() {

	useEffect( () => { document.querySelector("body").classList.add("bg-white") } );

	return (
		<>
			<nav class="bg-white border-gray-200 px-2 sm:px-4 py-2.5 dark:bg-gray-900 shadow-md">
				<div class="container flex flex-wrap justify-between items-center mx-auto">
					<a href="/" class="flex items-center">
						<div className='mx-2 pt-1 text-blue-600'>
							<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
								<path fillRule="evenodd" d="M14.243 5.757a6 6 0 10-.986 9.284 1 1 0 111.087 1.678A8 8 0 1118 10a3 3 0 01-4.8 2.401A4 4 0 1114 10a1 1 0 102 0c0-1.537-.586-3.07-1.757-4.243zM12 10a2 2 0 10-4 0 2 2 0 004 0z" clipRule="evenodd" />
							</svg>
						</div>
						<span class="self-center text-xl font-semibold whitespace-nowrap dark:text-white">Spam Classifier</span>
					</a>
					<button data-collapse-toggle="navbar-default" type="button" class="inline-flex items-center p-2 ml-3 text-sm text-gray-500 rounded-lg md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600" aria-controls="navbar-default" aria-expanded="false">
						<span class="sr-only">Open main menu</span>
						<svg class="w-6 h-6" aria-hidden="true" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clip-rule="evenodd"></path></svg>
					</button>
				</div>
			</nav>
			<Main>
      		</Main>
		</>
	)
}