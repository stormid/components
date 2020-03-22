# Outliner

Adds a classNamw to the documentElement to be used to hide CSS outline on mouse interactions, show on keyboard interactions. Until [:focus-visible](https://developer.mozilla.org/en-US/docs/Web/CSS/:focus-visible) has broader browser support.

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

Add CSS
```
.no-outline * {
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