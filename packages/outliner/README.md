# Outliner

Adds a className to the documentElement to be used to hide CSS outline on mouse interactions, show on keyboard interactions. To be used to compliment [:focus-visible](https://developer.mozilla.org/en-US/docs/Web/CSS/:focus-visible).

---

## Usage

Install the package
```
npm i -S @stormid/outliner
```

Initialise the module
```
import '@stormid/outliner';

```

Example CSS
```
.no-outline *,
.no-outline *:before,
.no-outline *:after {
    outline: 0 none !important;
    box-shadow: none !important;
}
```

## Tests
```
npm t
```

## License
MIT