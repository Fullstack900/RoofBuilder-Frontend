export function convertUoM(sourceUoM, destUoM, value) {
    try {

        if (sourceUoM === destUoM) {
            return value
        }

        const s = sourceUoM.toLowerCase()
        const d = destUoM.toLowerCase()

        if (d === 'ea') {
            return 1
        }

        if (s === 'f') {
            if (d === 'm') {
                return Math.round((value / 3.28084) * 100) / 100
            }
        } else if (s === 'm') {
            if (d === 'f') {
                return Math.round((value * 3.28084) * 100) / 100
            }
        } else if (s === 'f2') {
            if (d === 'm2') {
                return Math.round((value * 0.092903) * 100) / 100
            }
        } else if (s === 'm2') {
            if (d === 'f2') {
                return Math.round((value / 0.092903) * 100) / 100
            }
        }
    } catch (e) {
        throw Error(`convertUoM ${sourceUoM} => ${destUoM} ${value}`)   
    }
}