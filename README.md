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

### Configuration
Property | Required | Type |Description
--- | --- | --- | ---
interpolationTemplate | false | regexp string |The template for searching variables in template |
variablesSchema | false | object | The schema for variables in json. |


### JSON declaration
By default the library make a search `${varibale}` format, but it can be changed for any pattern. For that pass corresponded regexp to `interpolationTemplate` config property.

Example: 
```
const jsonIterpolate = new JSONIterpolate({
    interpolationTemplate: '\$\{(.*?)\}'
})
```

### Variables Schema declaration
The schema is used for validate variables that passed. Also it's a good place to describe what this vatiable is responsible for. 

Example:

```
"ENDPOINT_URL": {
    "description": "This URL will be used to query the third-party API",
    "type": "string"      
}
```

The required field is only type. The variables will be validated by the schema that provided. To see avaliable validation options, see `lib/validation`.

### API 
* <b>interpolate(jsonString, variables, required):string </b> - validate and inject variables to JSON. Returns JSON string. 

    * jsonString - the json string with variables that will be injected
    * variables - the list of variables to inject
* <b>getInvalidVariables(variables)</b> - validate variables according to provided schema. Returns the list of invalid variables.
* <b>isVariableValid(variable)</b> - validate variable according to schema.
*<b>getJsonVariables(jsonString)</b> - Searching variables in json string according to template provided in configuration. Returns the list of variables with their position. 