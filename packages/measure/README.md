
# Measure

Measurement and analytics library to send data to the [Google Measurement API](https://developers.google.com/analytics/devguides/collection/protocol), a replacement for Google Tag Manager and Google analytics.js.

---

## Usage

```
npm i @stormid/measure
```
```
import Measure from ' @stormid/measure';

Measure.init('UA-111111111-1');

```
## Options
```
{
    parameters
    custom
    settings
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

##E-commerce

## Automatic measurement


## Tests
```
npm t
```
## Dependencies

## License
MIT