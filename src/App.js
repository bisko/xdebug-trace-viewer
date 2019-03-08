import React, { Component } from 'react';
import Dropzone from 'react-dropzone';
import './App.css';
import ParseTrace from './ParseTrace';

import TraceEntry from './TraceEntry';
import { map } from 'lodash';

class App extends Component {

	state = {
		isReady: false,
		traceData: {},
	};


	onDrop = ( acceptedFiles ) => {
		const reader = new FileReader();

		reader.onabort = () => console.log( 'file reading was aborted' );
		reader.onerror = () => console.log( 'file reading has failed' );
		reader.addEventListener( 'progress', console.log );
		reader.onload = () => {
			// Do whatever you want with the file contents
			const binaryStr = reader.result;

			let parser = new ParseTrace();

			this.setState( { isReady: true, traceData: parser.parse( binaryStr ) } );
		};

		acceptedFiles.forEach( file => reader.readAsText( file, 'utf-8' ) )
	};

	renderEntry = ( entry ) => {
		if ( entry.parent ) {
			return null;
		}
		return (
			<TraceEntry
				key={entry.id}
				entry={entry}
				allEntries={this.state.traceData}
				onExpand={this.expandEntry}
				onCollapse={this.collapseEntry}
			/> )
	};

	expandEntry = ( entryId ) => {
		this.setState( {
			traceData: {
				...this.state.traceData,
				[ entryId ]: { ...this.state.traceData[ entryId ], isExpanded: 1 }
			}
		} )
	};

	collapseEntry = ( entryId ) => {
		this.setState( {
			traceData: {
				...this.state.traceData,
				[ entryId ]: { ...this.state.traceData[ entryId ], isExpanded: 0 }
			}
		} )
	};

	render() {
		return (
			<div className="App" onClick={this.clickHandler}>
				<Dropzone onDrop={this.onDrop}>
					{( { getRootProps, getInputProps } ) => (
						<section>
							<div {...getRootProps()}>
								<input {...getInputProps()} />
								<p>Drag 'n' drop some files here, or click to select files</p>
							</div>
						</section>
					)}
				</Dropzone>
				{this.state.isReady && (
					<div className="entries">
						{map( this.state.traceData, ( entry ) => {
							return this.renderEntry( entry );
						} )}
					</div>
				)}

			</div>
		);
	}
}

export default App;
