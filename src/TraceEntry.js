import React, { Component } from 'react';

import './TraceEntry.css';

class TraceEntry extends Component {

	getChildContainer = () => {
		if ( ! this.props.entry.children.length ) {
			return null;
		}

		if ( ! this.props.entry.isExpanded ) {
			return (
				<div
					className="TraceEntry-children collapsed"
					data-entryid={this.props.entry.id}
					onClick={() => {
						this.props.onExpand( this.props.entry.id )
					}}
				/>
			);
		}

		return (
			<div className="TraceEntry-children expanded" data-entryid={this.props.entry.id}>
				<div
					className="TraceEntry-children-leftpad"
					data-entryid={this.props.entry.id}
					onClick={() => {
						this.props.onCollapse( this.props.entry.id )
					}}
				/>
				<div className="TraceEntry-children-container">
					{this.props.entry.children.map( ( childId ) => {
						return (
							<TraceEntry
								{...this.props}
								key={childId}
								isChild={true}
								entry={this.props.allEntries[ childId ]}
							/> )
					} )}
				</div>
			</div>
		);
	};

	renderParams = ( paramsArray ) => {
		return ' ' + paramsArray.map( ( param ) => ( param.substr( 0, 50 ) ) ).join( ', ' ) + ' ';
	};

	formatFloat = ( number ) => {
		return + ( Math.round( number + "e+5" ) + "e-5" );
	};


	render() {
		const entry = this.props.entry;

		// Calculate percentage difference for time and memory
		const parentEl = this.props.allEntries[ this.props.entry.parent ];

		let timePercent = 0;
		let memoryPercent = 0;

		if ( parentEl ) {
			const parentTime = parentEl.timeDiff;
			const parentMem = parentEl.memoryDiff;

			if ( parentTime !== 0 ) {
				timePercent = ( entry.timeDiff / parentTime ) * 100;

			}
			if ( parentMem !== 0 ) {
				memoryPercent = ( entry.memoryDiff / parentMem ) * 100;
			}
		}

		return (
			<div className="TraceEntry">
				<div className="TraceEntry-data">
					<div className="TraceEntry-func" title={entry.file + ':' + entry.line}>
						<div className="TraceEntry-funcname">{entry.name}</div>
						(
						<div className="TraceEntry-args">
							{entry.params.length ? this.renderParams( entry.params ) : null}
						</div>
						) -> <div className="TraceEntry-return">{entry.return.substr( 0, 50 )}</div>
					</div>
					<div className="TraceEntry-metric">
						{timePercent > 0 ? (
							<div className="TraceEntry-metric-percentage">
								( {this.formatFloat( timePercent )}% ) &nbsp;
							</div>
						) : null}
						{this.formatFloat( entry.timeDiff )}
					</div>

					<div className="TraceEntry-metric">
						{memoryPercent > 0 ? (
							<div className="TraceEntry-metric-percentage">
								( {this.formatFloat( memoryPercent )}% ) &nbsp;
							</div>
						) : null}
						{this.formatFloat( entry.memoryDiff )}
					</div>

					{/*<div className="TraceEntry-metric">{this.props.entry.timeEnter}</div>*/}
					{/*<div className="TraceEntry-metric">{this.props.entry.timeExit}</div>*/}
					{/*<div className="TraceEntry-metric">{this.props.entry.memoryEnter}</div>*/}
					{/*<div className="TraceEntry-metric">{this.props.entry.memoryExit}</div>*/}
				</div>
				{this.getChildContainer()}
			</div>
		);
	}
}

export default TraceEntry;
