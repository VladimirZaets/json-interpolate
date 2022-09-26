const validator = require('./lib/validator');
const errors = require('./lib/errors')

class InterpolateJson {
    constructor(config) {
        this.variablesInterface = config.variablesInterface;
        this.interpolationTemplate = config.interpolationTemplate ? new RegExp(config.interpolationTemplate, 'g') : /\$\{(.*?)\}/g;
    }

    interpolate(jsonString, variables, required = true) {
        const variablesInJson = this.getJsonVariables(jsonString);
        const result = {
            error: null,
            data: null
        };

        if (!variables) {
            result.error = new Error(`Variables parameter is required.`);
            return result;
        }

        if (required) {
            const missedVariables = this.getMissedVariables(variables, variablesInJson);
            if (missedVariables.length) {
                result.error = new errors.JSONInterpolateAggregateError(
                    `JSON contain variables that are not passed.`,
                    missedVariables.map(variable => new errors.MissedVariableError(
                        `Variable ${variable.name}`,
                        {
                            variable: variable.name,
                            requestedType: this.variablesInterface[variable.name]
                        }
                    ))
                );
                return result;
            }
        };

        if (this.variablesInterface) {
            const variablesWithoutInterface = this.getVariablesWithoutDeclaredInterface(variablesInJson)
            if (variablesWithoutInterface.length) {
                result.error = new errors.JSONInterpolateAggregateError(
                    `JSON contain variables for which interface is not declared.`,
                    variablesWithoutInterface.map(variable => new errors.VariableDeclarationError(
                        `Variable: ${variable.name}`,
                        {
                            variable: variable.name,
                            requestedType: null
                        }
                    ))           
                );
                return result;
            }
        }

        const validationResult = this.getInvalidVariables(variables);
        if (validationResult.errors.length) {
            result.error = validationResult.errors;
            return result;
        }

        if (validationResult.variables.length) {
            result.error = errors.JSONInterpolateAggregateError(
                `The next variables has invalid type.`,
                {
                    list: validationResult.variables.map(variable => new VariableTypeError(
                        `Variable: ${variable}. /n
                        Requested type: ${this.variablesInterface[variable].type}`,
                        {
                            requestedType: this.variablesInterface[variable].type,
                            variable
                        }
                    ))
                }
            );
            return result;
        }

        let resultString = jsonString
        for (const variableInJson of variablesInJson) {        
            resultString = resultString.replace(
                variableInJson.full,
                variables[variableInJson.name]
            );
        }
        result.data = resultString
        return result;
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