import React, { useState } from 'react';

export default function Main () {
    const [prediction, setPrediction] = useState("");
    const [status, setStatus] = useState("");

    async function handleClickScratch(e) {
        e.preventDefault();
        let response = await fetch(window.location.protocol + '//' + window.location.hostname + ':3001/retrain-scratch', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json;charset=utf-8'
            },
            body: JSON.stringify({})
        });
        let result = await response.json();
    }

    async function handleClickRetrain(e) {
        e.preventDefault();
        let response = await fetch(window.location.protocol + '//' + window.location.hostname + ':3001/retrain', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json;charset=utf-8'
            },
            body: JSON.stringify({})
        });
        let result = await response.json();
    }

    async function handleClickPrediction(e) {
        e.preventDefault();
        let response = await fetch(window.location.protocol + '//' + window.location.hostname + ':3001/predict', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json;charset=utf-8'
            },
            body: JSON.stringify({'text': document.getElementById('textarea-prediction').value})
        });
        let result = await response.json();
        setPrediction(result.Prediction);
    }

    async function handleClickNewData(e) {
        e.preventDefault();
        let response = await fetch(window.location.protocol + '//' + window.location.hostname + ':3001/newdata', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json;charset=utf-8'
            },
            body: JSON.stringify({'text': document.getElementById('textarea-newdata').value, 'label': document.getElementById('textarea-label').value})
        });
        let result = await response.json();
    }

    async function handleClickStatus(e) {
        e.preventDefault();
        let response = await fetch(window.location.protocol + '//' + window.location.hostname + ':3001/status', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json;charset=utf-8'
            },
            body: JSON.stringify({})
        });
        let result = await response.json();
        setStatus(result.status.model + " - MongoDB contains " + result.status.mongodata + " new emails.");
    }

	return (
		<div className="">
            {/* <div className="flex space-x-3 mb-4 text-sm font-medium m-8">
                <div className="flex-auto flex space-x-3">
                <button onClick={handleClickStatus} className="w-1/2 flex items-center justify-center rounded-md bg-black text-white p-2" type="submit">Get Status</button>
                    <p className="w-1/2 flex items-center justify-center rounded-md bg-black text-white p-2 ml-3">{status}</p>
                </div>
            </div> */}
			<div className="flex space-x-3 mb-4 text-sm font-medium m-8">
                <div className='w-20 p-0.5 text-xl underline mr-4'>
                    Training: 
                </div>
                <div className="flex-auto flex space-x-3">
                    <button onClick={handleClickScratch} className="w-1/2 flex items-center justify-center rounded-md bg-blue-400 text-white hover:bg-blue-600 hover:text-white text-lg p-2" type="submit">Train from scratch</button>
                    <button onClick={handleClickRetrain} className="w-1/2 flex items-center justify-center rounded-md bg-yellow-500 text-white hover:bg-yellow-900 hover:text-white text-lg p-2" type="button">Train with newest data</button>
                </div>
            </div>
            <div className="flex space-x-3 mb-4 text-sm font-medium m-8 h-1/3">
                <textarea id="textarea-prediction" className="h-full w-1/2 flex focus:border-light-blue-500 focus:ring-1 focus:ring-light-blue-500 focus:outline-none text-sm text-black placeholder-gray-500 border border-gray-200 rounded-md p-2" type="text" aria-label="Filter projects" placeholder="Email Text" />
                <div className="flex-auto flex w-1/2">
                    <button onClick={handleClickPrediction} className="w-1/2 flex items-center justify-center rounded-md bg-gray-300 text-gray-700 hover:bg-gray-800 hover:text-white text-lg" type="submit">Get Prediction</button>
                    <p className="w-1/2 flex items-center justify-center rounded-md border-gray-500 border-2 text-white p-2 ml-3">{prediction}</p>
                </div>
            </div>
            <div className="flex space-x-3 mb-4 text-sm font-medium m-8 h-1/3">
                <textarea id="textarea-newdata" className="h-full w-1/2 flex focus:border-light-blue-500 focus:ring-1 focus:ring-light-blue-500 focus:outline-none text-sm text-black placeholder-gray-500 border border-gray-200 rounded-md p-2" type="text" aria-label="Filter projects" placeholder="Email Text" />
                <input id="textarea-label" className="w-1/4 flex focus:border-light-blue-500 focus:ring-1 focus:ring-light-blue-500 focus:outline-none text-sm text-black placeholder-gray-500 border border-gray-200 rounded-md p-2" type="text" aria-label="Filter projects" placeholder="0 or 1, spam or not spam" />
                <div className="flex-auto flex w-1/4">
                    <button onClick={handleClickNewData} className="w-full flex items-center justify-center rounded-md bg-gray-300 text-gray-700 hover:bg-gray-800 hover:text-white text-lg" type="submit">Add data</button>
                </div>
            </div>
		</div>
	)
};