# json-interpolate
The library provide posibility to inject variables to JSON. 

<b>json-interpolate</b> library provide posibility to provide an interface for variables that can be injected.

## Installation

```npm i json-interpolate```

## Usage

```
const JSONIterpolate = require('json-interpolate');

const jsonIterpolate = new JSONIterpolate(config)

jsonIterpolate.interpolate(jsonString, variables)
```


### JSON declaration
By default the library make a search `${varibale}` format, but it can be changed for any pattern. For that pass corresponded regexp to `interpolationTemplate` config property.

Example: 
```
const jsonIterpolate = new JSONIterpolate({
    interpolationTemplate: '\$\{(.*?)\}'
})
```

### Configuration
Property | Required | Description | Example
--- | --- | --- | ---
interpolationTemplate | false | The template for searching variables in template | 
```
const jsonIterpolate = new JSONIterpolate({
    interpolationTemplate: '\$\{(.*?)\}'
})
```