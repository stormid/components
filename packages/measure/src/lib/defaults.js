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
				action: 'Text file'
			},
			{
				regex: /^.+\.(csv|dat|ged|key.*|pps|pptx?|sdf|tar|tax2.+|tsv|vcf|xml)$/,
				action: 'Data file'
			},			
			{
				regex: /^.+\.(indd|pct|pdf)$/,
				action: 'Page layout file'
			},
			{
				regex: /^.+\.(aif|iff|m3u|m4a|mid|mp3|mpa|wav|wma)$/,
				action: 'Audio file'
			},
			{
				regex: /^.+\.(3g2|3gp|asf|avi|flv|m4v|mov|mp4|mpe?g|rm|srt|swf|vob|wmv)$/,
				action: 'Video file'
			},
			{
				regex: /^.+\.(3dm|3ds|max|obj)$/,
				action: '3D image file'
			},
			{
				regex: /^.+\.(bmp|dds|gif|heic|jpe?g|png|psd|pspimage|tga|thm|tif|tiff|yuv)$/,
				action: 'Raster image file'
			},
			{
				regex: /^.+\.(ai|eps|ps|svg)$/,
				action: 'Vector image file'
			},
			{
				regex: /^.+\.(accdb|db|dbf|mdb|pdb|sql)$/,
				action: 'Database file'
			},
			{
				regex: /^.+\.(dwg|dxf)$/,
				action: 'CAD file'
			},
			{
				regex: /^.+\.(gpx|kml|kmz)$/,
				action: 'GIS file'
			},
			{
				regex: /^.+\.(crx|plugin)$/,
				action: 'Plug-in file'
			},
			{
				regex: /^.+\.(fnt|fon|otf|ttf)$/,
				action: 'Font file'
			},
			{
				regex: /^.+\.(cab|cpl|cur|deskthemepack|dll|dmp|drv|icns|ico|lnk|sys)$/,
				action: 'System file'
			},
			{
				regex: /^.+\.(cfg|ini|prf)$/,
				action: 'Settings file'
			},
			{
				regex: /^.+\.(hqx|mim|uue)$/,
				action: 'Encoded file'
			},
			{
				regex: /^.+\.(7z|cbr|deb|gz|pkg|rar|rpm|sitx|zipx?)$/,
				action: 'Compressed file'
			},
			{
				regex: /^.+\.(bak|tmp)$/,
				action: 'Back-up file'
			},
			{
				regex: /^.+\.(xlr|xlsx?|ods)$/,
				action: 'Spreadsheet file'
			}
		]
	}
};