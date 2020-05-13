import React, { Component } from 'react';
import Dropzone from 'react-dropzone';
import './App.css';
import ParseTrace from './ParseTrace';

import TraceEntry from './TraceEntry';
import { map, mapValues } from "lodash";

class App extends Component {

	state = {
		isReady: false,
		traceData: [],
		timeFilterInput: "",
		functionFilterInput: "",
		filterTime: 0,
		filterFunction: "",
	};


	onDrop = ( acceptedFiles ) => {
		const reader = new FileReader();

		reader.onabort = () => console.log( 'file reading was aborted' );
		reader.onerror = () => console.log( 'file reading has failed' );
		//reader.addEventListener( 'progress', console.log );
		reader.onload = () => {
			// Do whatever you want with the file contents
			let parser = new ParseTrace();
			this.setState( { isReady: true, traceData: parser.parse( reader.result ) } );
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
				filterTime={this.state.filterTime}
				filterFunction={this.state.filterFunction}
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

	highlightEntries = () => {
		this.setState( {
			traceData: mapValues( this.state.traceData, el => (
				{ ...el, isHighlighted: this.shouldHighlightEntry( el ) }
			) )
		}, this.expandTree );
	}

	shouldHighlightEntry = ( entry ) => {
		return (
			( this.state.filterTime && entry.timeDiff >= this.state.filterTime )
			|| ( this.state.filterFunction && entry.name.indexOf( this.state.filterFunction ) !== - 1 )
		);
	};
	expandTree = () => {
		this.setState( {
			traceData: mapValues( this.state.traceData, entry => {
				return { ...entry, isExpanded: entry.isExpanded || this.entryHasExpandedChildren( entry ) }
			} )
		} );
	};

	entryHasExpandedChildren = ( entry ) => {
		if ( !entry ) {
			debugger;
		}
		return entry.children && entry.children.map( childId => {
			const childEntry = this.state.traceData[ childId ];
			if ( childEntry.isExpanded || childEntry.isHighlighted || this.entryHasExpandedChildren( childEntry ) ) {
				return childEntry;
			}
			return {};
		} ).some( el => el.isExpanded || el.isHighlighted );
	};

	onChangeFilterFunction = ( event ) => {
		this.setState( { functionFilterInput: event.currentTarget.value } )
	}
	onChangeFilterTime = ( event ) => {
		this.setState( { timeFilterInput: event.currentTarget.value } )
	}

	applyFilters = () => {
		this.setState( {
			filterTime: parseFloat( this.state.timeFilterInput ),
			filterFunction: this.state.functionFilterInput,
		}, this.highlightEntries );
	};

	getHighlightedElements = () => {
		return [].slice.call( document.getElementsByClassName( 'isHighlighted' ) );
	};

	onNextHighlight = () => {
		const highlights = this.getHighlightedElements();
		if ( highlights.length ) {
			const nextHighlight = highlights.find( el => {
				const boundingRectangle = el.getBoundingClientRect();
				return boundingRectangle.top > boundingRectangle.height;
			} )

			const nextPos = nextHighlight || highlights[ 0 ];
			window.scrollTo( 0, window.scrollY + nextPos.getBoundingClientRect().top );
		}
	};

	onPrevHighlight = () => {
		const highlights = this.getHighlightedElements().reverse();
		if ( highlights.length ) {
			const nextHighlight = highlights.find( el => {
				const boundingRectangle = el.getBoundingClientRect();
				return boundingRectangle.top < 0;
			} )

			const nextPos = nextHighlight || highlights[ 0 ];
			window.scrollTo( 0, window.scrollY + nextPos.getBoundingClientRect().top );
		}
	};

	render() {
		return (
			<div className="App" onClick={this.clickHandler}>
				{!this.state.isReady && (
					<Dropzone onDrop={this.onDrop}>
						{( { getRootProps, getInputProps } ) => (
							<div {...getRootProps()} className="TraceViewDropzone">
								<input {...getInputProps()} />
								<p>Drag and drop or click to choose a XDebug Trace File</p>
							</div>
						)}
					</Dropzone>
				)}
				<div className="filters">
					<label htmlFor="function-filter">Filter by function</label>
					<input id="function-filter" name="function-filter" type="text"
						   onChange={this.onChangeFilterFunction}/>
					<label htmlFor="time-filter">Filter by time</label>
					<input id="time-filter" name="time-filter" type="text" onChange={this.onChangeFilterTime}/>
					<button onClick={this.applyFilters}>Apply filters</button>
				</div>
				{this.state.isReady && (
					<div className="entries">
						{map( this.state.traceData, ( entry ) => {
							return this.renderEntry( entry );
						} )}
					</div>
				)}

				<div className="HighlightedNav">
					<button onClick={this.onPrevHighlight}>&laquo; Prev Highlight</button>
					<button onClick={this.onNextHighlight}>Next Highlight &raquo;</button>
				</div>
			</div>
		);
	}
}

export default App;
