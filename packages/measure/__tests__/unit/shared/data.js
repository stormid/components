import { systemInfo, documentInfo, clientId, cacheBuster, download } from '../../../src/lib/shared/data';
import { COOKIE_NAME, COOKIE_VALUE } from '../../../src/lib/constants';
import defaults from '../../../src/lib/defaults';

//JSDOM returns
//screen resolution 0 x 0
//document.documentElement.clientWidth x document.documentElement.clientHeight 0x0
//document.characterSet 'UTF-8'
//window.screen.colorDepth: 24,
//navigator.userLanguage  'en-US' }
describe('Measure > shared > data > systemInfo', () => {
	
	it('should acquire the systemInfo from the window, navigator and document', () => {
        expect(systemInfo()).toEqual({ sr: '0x0', vp: '0x0', de: 'UTF-8', sd: '24-bit', ul: 'en-US' });
    });

});

describe('Measure > shared > data > documentInfo', () => {
    const title = 'Test title';
    delete global.window.location;
    global.window = Object.create(window);
    global.window.location = { hostname: 'localhost' };
    document.title = title;

	it('should acquire the url and document title from the window and document', () => {
        expect(documentInfo()).toEqual({ dl: 'http://localhost/', dh: 'localhost', dp: '/', dt: 'Test title' });
    });

});

describe('Measure > shared > data > cacheBuster', () => {
    
	it('should produce a unique numeric string', () => {
        const cb = cacheBuster();
        const isNumeric = n => !isNaN(parseFloat(n)) && isFinite(n);

        expect(String(cb).length).toBeGreaterThanOrEqual(9);
        expect(isNumeric(cb)).toEqual(true);
    });

});

describe('Measure > shared > data > clientId', () => {
    
	it('should acquire the url and document title from the window and document', () => {
        document.cookie = `${COOKIE_NAME}=${COOKIE_VALUE}.123456789; expires=${new Date(new Date().getTime() + 30000).toGMTString()}`;
        expect(clientId()).toEqual('123456789');
    });

});

//To do: download
//download(link, settings.download);
describe('Measure > shared > data > download', () => {
    
	it('should return a download type for a given link and dictionary of download types', () => {
       //defaults.settings.downloads
       const textFileLink = { href: '/download/tests.doc' };
       const zipFileLink = { href: '/download/tests.zip' };
       const spreadsheetFileLink = { href: '/download/tests.xls' };

       expect(download(textFileLink, defaults.settings.download.types))
        .toEqual({
            regex: /^.+\.(docx?|log|msg|odt|pages|rtf|tex|txt|wpd|wps)$/,
            action: 'Text file'
        });

        expect(download(zipFileLink, defaults.settings.download.types))
        .toEqual({
            regex: /^.+\.(7z|cbr|deb|gz|pkg|rar|rpm|sitx|zipx?)$/,
            action: 'Compressed file'
        });

        expect(download(spreadsheetFileLink, defaults.settings.download.types))
        .toEqual({
            regex: /^.+\.(xlr|xlsx?|ods)$/,
            action: 'Spreadsheet file'
        });

        
        /*
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
            */
    });

});