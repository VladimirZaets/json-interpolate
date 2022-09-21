const validator = require('./lib/validator');

class InterpolateJson {
    constructor(config) {
        this.variablesInterface = config.variablesInterface;
        this.interpolationTemplate = new RegExp(config.interpolationTemplate, 'g') || /\$\{(.*?)\}/g;
    }

    interpolate(jsonString, variables, required = true) {
        const variablesInJson = this.getJsonVariables(jsonString);

        if (!variables) {
            return new Error(`Variables parameter is required.`);
        }

        if (required) {
            const missedVariables = this.getMissedVariables(variables, variablesInJson);
            if (missedVariables.length) {
                return new Error(
                    `JSON contain variables that are not passed.
                    Variables: ${missedVariables.map(variable => variable.name).join(', ')}`
                );
            }
        };

        if (this.variablesInterface) {
            const variablesWithoutInterface = this.getVariablesWithoutDeclaredInterface(variablesInJson)
            if (variablesWithoutInterface.length) {
                return new Error(
                    `JSON contain variables for which interface is not declared.
                    Variables: ${variablesWithoutInterface.map(variable => variable.name).join(', ')}`
                );
            }
        }

        const validationResult = this.getInvalidVariables(variables);
        if (validationResult.errors.length) {
            return validationResult.errors;
        }

        if (validationResult.variables.length) {
            return new Error(
                `The next variables has invalid type. 
                Variables: ${validationResult.variables.join(', ')}
                Please verify the type and try again.`
            );
        }

        let resultString = jsonString
        for (const variableInJson of variablesInJson) {
            
            resultString = resultString.replace(
                variableInJson.full,
                variables[variableInJson.name]
            );
        }
        console.log(resultString)
    }

    getMissedVariables(passedVariables, variablesInJson) {
        const passedVariablesKeys = Object.keys(passedVariables);
        const notPassedVariables = [];
        for (const variableInJson of variablesInJson) {            
            if (!passedVariablesKeys.includes(variableInJson.name)) {
                notPassedVariables.push(variableInJson)
            }
        }
        return notPassedVariables;
    }

    getVariablesWithoutDeclaredInterface(variablesInJson) {
        const variablesInterfaceNames = Object.keys(this.variablesInterface);
        const notDeclared = [];
        for (const variableInJson of variablesInJson) {
            if (!variablesInterfaceNames.includes(variableInJson.name)) {
                notDeclared.push(variableInJson)
            }
        }
        return notDeclared;
    }
    
    getInvalidVariables(variables) {        
        const result = {
            variables: [],
            errors: []
        };

        for (let [variable, value] of Object.entries(variables)) {
            const validationResult = this.isVariableValid(variable, value);
            
            if (validationResult instanceof Error) {
                result.errors.push(validationResult)
            }

            if (!validationResult) {
                result.variables.push(variable)
            }
        }
        return result;
    }

    isVariableValid(variable, value) {
        if (this.variablesInterface[variable]) {
            return validator(this.variablesInterface[variable].type, value)
        }
        return true
    }

    getJsonVariables(jsonString) {
        const variablesInJson = [];
        for (const match of jsonString.matchAll(this.interpolationTemplate)) {
            variablesInJson.push({
                from: match.index,
                to: match.index + match[0].length,
                name: match[1],
                full: match[0]
            });
          };
       
        return variablesInJson;
    }
}

module.exports = InterpolateJson;