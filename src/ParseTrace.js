export default class ParseTrace {

	numLines = 0;

	functionData = {};

	currentStack = [];

	parse = ( fileData ) => {
		const data = fileData.split( "\n" );

		this.numLines = data.length;

		let currentIndex = 0;

		const header1 = data[ currentIndex ++ ];
		const header2 = data[ currentIndex ++ ];

		if ( ! header1.match( /Version: [23].*/ ) || ! header2.match( /File format: [2-4]/ ) ) {
			console.log( 'Invalid file' );
			console.log( header1, header2 );
		}

		for ( ; currentIndex < this.numLines; currentIndex ++ ) {
			this.parseLine( data[ currentIndex ] );
		}

		return this.functionData;
	};

	parseLine = ( line ) => {
		const parts = line.split( "\t" );

		if ( parts.length < 5 ) {
			return;
		}

		const functionNumber = parseInt( parts[ 1 ], 10 );
		const entryType = parts[ 2 ];

		if ( ! this.functionData[ functionNumber ] ) {
			this.functionData[ functionNumber ] = {
				id: functionNumber,
				timeEnter: 0,
				memoryEnter: 0,
				timeExit: 0,
				memoryExit: 0,
				timeDiff: 0,
				memoryDiff: 0,
				depth: 0,
				name: '',
				internal: 0,
				file: '',
				line: '',
				params: [],
				return: '',
				children: [],
				parent: 0,
				isExpanded: 1, // react prop, move to react not here
			};
		}

		switch ( entryType ) {
			// Function enter
			case '0':
				this.functionData[ functionNumber ].depth = parseInt( parts[ 0 ], 10 );
				this.functionData[ functionNumber ].timeEnter = this.formatFloat( parts[ 3 ] );
				this.functionData[ functionNumber ].memoryEnter = this.formatFloat( parts[ 4 ] );
				this.functionData[ functionNumber ].name = parts[ 5 ];
				this.functionData[ functionNumber ].internal = ! ! parts[ 6 ];
				this.functionData[ functionNumber ].file = parts[ 8 ];
				this.functionData[ functionNumber ].line = parts[ 9 ];
				if ( parts[ 7 ] ) {
					this.functionData[ functionNumber ].params = [ parts[ 7 ] ]
				} else {
					this.functionData[ functionNumber ].params = parts.slice( 11 );
				}

				if ( this.currentStack.length ) {
					this.functionData[ functionNumber ].isExpanded = 0;
					this.functionData[ functionNumber ].parent = this.currentStack[ this.currentStack.length - 1 ];
					const lastParent = this.currentStack[ this.currentStack.length - 1 ];
					this.functionData[ lastParent ].children.push( functionNumber );
				}

				this.currentStack.push( functionNumber );

				break;
			case '1':

				this.functionData[ functionNumber ].timeExit = this.formatFloat( parts[ 3 ] );
				this.functionData[ functionNumber ].memoryExit = this.formatFloat( parts[ 4 ] );
				this.functionData[ functionNumber ].timeDiff = this.formatFloat( this.functionData[ functionNumber ].timeExit - this.functionData[ functionNumber ].timeEnter );
				this.functionData[ functionNumber ].memoryDiff = this.formatFloat( this.functionData[ functionNumber ].memoryExit - this.functionData[ functionNumber ].memoryEnter );

				this.currentStack.pop();

				break;
			case 'R':
				this.functionData[ functionNumber ].return = parts[ 5 ];

				break;
			default:
				console.log( 'Invalid line', line );
		}
	};

	formatFloat = ( time ) => {
		return parseFloat( time );
	};
}
