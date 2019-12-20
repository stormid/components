
# Measure

Measurement and analytics library to send data to the [Google Measurement API](https://developers.google.com/analytics/devguides/collection/protocol), a replacement for Google Tag Manager and Google analytics.js.

---

## Usage

```
npm i @stormid/measure
```
```
import Measure from ' @stormid/measure';

// Pass the Google Analytics tracking ID/web property ID
Measure.init('UA-111111111-1');

```
## Options
```
{
    parameters
    settings
    custom
}
```

Default parameters
```
{
	parameters: {
		v: '1', // API Protocal version, https://developers.google.com/analytics/devguides/collection/protocol/v1/parameters#v
		aip: '1' // Anonymise IP, https://developers.google.com/analytics/devguides/collection/protocol/v1/parameters#aip
	}
}
```

Default settings for link click event tracking
```
settings: {
    tel: {
        category: 'Telephone Link', // category of the event
        obfuscator(input) { // function to anonymise tel number
            const re = /^tel:((?:\d|\+|\-|\s){3})((?:\d|\+|\-|\s){3})((?:\d|\+|\-|\s)*)$/
            const match = input.match(re);
            return match ? `${match[1]}***${match[3]}` : input;
        }
    },
    email: {
        category: 'Email Link',  // category of the event
        obfuscator(input) { // function to anonymise email address
            const re = /^mailto:((?:[a-z]|[A-Z]|[0-9]|\.|!|#|\$|%|&|'|\*|\+|\-|\/|=|\?|\^|_|`|\{|\||\}|~|"|\(|\)|,|:|;|<|>|\[|\\|\]){1,3})((?:[a-z]|[A-Z]|[0-9]|\.|!|#|\$|%|&|'|\*|\+|\-|\/|=|\?|\^|_|`|\{|\||\}|~|"|\(|\)|,|:|;|<|>|\[|\\|\])*)@((?:[a-z]|[A-Z]|[0-9]|\-|\.)+)$/;
            const match = input.match(re);
            return match ? `${match[1]}***@${match[3]}` : input;
        }
    },
    external: {
        category: 'External Link' // category of the link click event
    },
    download: {
        category: 'Download', // category of the link click event
        types: [ // action of the link click event for different types of download 
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
}
```

## API
Each instance returned from init exposes the interface

```
{
    getState
    event
    ecommerce: {
        impression
        action
    }
}
```

## Pageviews

## Events

## E-commerce

## Automatic measurement


## Tests
```
npm t
```

## License
MIT