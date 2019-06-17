/* istanbul ignore file */
export default {
	parameters: {
		v: '1',
		aip: '1'
	},
	settings: {
		tel: {
			category: 'Telephone Link',
			obfuscator: {
				input: 'href',
				fn(input) {
					const re = /^tel:((?:\d|\+|\-|\s){3})((?:\d|\+|\-|\s){3})((?:\d|\+|\-|\s)*)$/
					const match = input.match(re);
					return match ? `${match[1]}***${match[3]}` : input;
				}
			}
		},
		email: {
			category: 'Email Link',
			obfuscator: {
				input: 'href',
				fn(input) {
					const re = /^mailto:((?:[a-z]|[A-Z]|[0-9]|\.|!|#|\$|%|&|'|\*|\+|\-|\/|=|\?|\^|_|`|\{|\||\}|~|"|\(|\)|,|:|;|<|>|\[|\\|\]){1,3})((?:[a-z]|[A-Z]|[0-9]|\.|!|#|\$|%|&|'|\*|\+|\-|\/|=|\?|\^|_|`|\{|\||\}|~|"|\(|\)|,|:|;|<|>|\[|\\|\])*)@((?:[a-z]|[A-Z]|[0-9]|\-|\.)+)$/;
					const match = input.match(re);
					return match ? `${match[1]}***@${match[3]}` : input;
				}
			}
		},
		external: {
			category: 'External Link'
		},
		download: [
			{
				regex: /^.+\.(docx?|log|msg|odt|pages|rtf|tex|txt|wpd|wps)$/,
				category: 'Text file download'
			},
			// {
			// 	regex: /^.+\.(csv|dat|ged|key.*|pps|pptx?|sdf|tar|tax2.+|tsv|vcf|xml)$/,
			// 	category: 'Data file download'
			// },			
			{
				regex: /^.+\.(indd|pct|pdf)$/,
				category: 'Page layout file download'
			},
			// {
			// 	regex: /^.+\.(aif|iff|m3u|m4a|mid|mp3|mpa|wav|wma)$/,
			// 	category: 'Audio file download'
			// },
			// {
			// 	regex: /^.+\.(3g2|3gp|asf|avi|flv|m4v|mov|mp4|mpe?g|rm|srt|swf|vob|wmv)$/,
			// 	category: 'Video file download'
			// },
			// {
			// 	regex: /^.+\.(3dm|3ds|max|obj)$/,
			// 	category: '3D image file download'
			// },
			// {
			// 	regex: /^.+\.(bmp|dds|gif|heic|jpe?g|png|psd|pspimage|tga|thm|tif|tiff|yuv)$/,
			// 	category: 'Raster image file download'
			// },
			// {
			// 	regex: /^.+\.(ai|eps|ps|svg)$/,
			// 	category: 'Vector image file download'
			// },
			// {
			// 	regex: /^.+\.(accdb|db|dbf|mdb|pdb|sql)$/,
			// 	category: 'Database file download'
			// },
			// {
			// 	regex: /^.+\.(dwg|dxf)$/,
			// 	category: 'CAD file download'
			// },
			// {
			// 	regex: /^.+\.(gpx|kml|kmz)$/,
			// 	category: 'GIS file download'
			// },
			// {
			// 	regex: /^.+\.(crx|plugin)$/,
			// 	category: 'Plug-in file download'
			// },
			// {
			// 	regex: /^.+\.(fnt|fon|otf|ttf)$/,
			// 	category: 'Font file download'
			// },
			// {
			// 	regex: /^.+\.(cab|cpl|cur|deskthemepack|dll|dmp|drv|icns|ico|lnk|sys)$/,
			// 	category: 'System file download'
			// },
			// {
			// 	regex: /^.+\.(cfg|ini|prf)$/,
			// 	category: 'Settings file download'
			// },
			// {
			// 	regex: /^.+\.(hqx|mim|uue)$/,
			// 	category: 'Encoded file download'
			// },
			// {
			// 	regex: /^.+\.(7z|cbr|deb|gz|pkg|rar|rpm|sitx|zipx?)$/,
			// 	category: 'Compressed file download'
			// },
			// {
			// 	regex: /^.+\.(bak|tmp)$/,
			// 	category: 'Back-up file download'
			// },
			{
				regex: /^.+\.(xlr|xlsx?|ods)$/,
				category: 'Spreadsheet file download'
			}
		]
	}
};