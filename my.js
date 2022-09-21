const IJ = require('./index')

const ij = new IJ({
    interpolationTemplate: /\$\{(.*?)\}/,
    variablesInterface: {    
        super: {
            name: "Name for field A",
            description: "Description of field A",
            type: "int",
            isRequired: true
        },
        vovasuper2: {
            name: "Name for field vovasuper2",
            description: "Description of field vovasuper2",
            type: "string",
            isRequired: false,
            default: "valueForVovasuper2"
        },
        "super-3": {
            name: "Name for field d",
            description: "Description of field D",
            type: "string",
            isRequired: true
        }
    },
})

console.log(ij.interpolate(JSON.stringify({
    a: "${super}",
    b: "vova",
    c: {q: {w: "${vovasuper2}"}},
    d: "${super-3}",
    t: "${super-3}"
}), {super: 11, vovasuper2: "super-param-2", "super-3": "super-param-3"}))


//console.log(Number.isInteger("10"))
//validator = new vl()
//console.log(vl('date', "2020/01/01"))