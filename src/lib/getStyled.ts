import chalk, { ChalkInstance } from "chalk";


export default function(char: string, property: string|undefined){
    if (!property) return char 

    let styledChar: string|ChalkInstance = ''
    char = char.toLocaleLowerCase()
    
    switch(property){
        case 'reset':
            styledChar = chalk.reset(char)
            break
        case 'bold':
            styledChar = chalk.bold(char)
            break
        case 'dim':
            styledChar = chalk.dim(char)
            break
        case 'italic':
            styledChar = chalk.italic(char)
            break
        case 'underline':
            styledChar = chalk.underline(char)
            break
        case 'overline':
            styledChar = chalk.overline(char)
            break
        case 'inverse':
            styledChar = chalk.inverse(char)
            break
        case 'hidden':
            styledChar = chalk.hidden(char)
            break
        case 'strikethrough':
            styledChar = chalk.strikethrough(char)
            break
        case 'visible':
            styledChar = chalk.visible(char)
            break
        case 'black':
            styledChar = chalk.black(char)
            break
        case 'red':
            styledChar = chalk.red(char)
            break
        case 'green':
            styledChar = chalk.green(char)
            break
        case 'yellow':
            styledChar = chalk.yellow(char)
            break
        case 'blue':
            styledChar = chalk.blue(char)
            break
        case 'magenta':
            styledChar = chalk.magenta(char)
            break
        case 'cyan':
            styledChar = chalk.cyan(char)
            break
        case 'white':
            styledChar = chalk.white(char)
            break
        case 'blackbright':
            styledChar = chalk.blackBright(char)
            break
        case 'redbright':
            styledChar = chalk.redBright(char)
            break
        case 'greenbright':
            styledChar = chalk.greenBright(char)
            break
        case 'yellowbright':
            styledChar = chalk.yellowBright(char)
            break
        case 'bluebright':
            styledChar = chalk.blueBright(char)
            break
        case 'magentabright':
            styledChar = chalk.magentaBright(char)
            break
        case 'cyanbright':
            styledChar = chalk.cyanBright(char)
            break
        case 'whitebright':
            styledChar = chalk.whiteBright(char)
            break
        case 'bgblack':
            styledChar = chalk.bgBlack(char)
            break
        case 'bgred':
            styledChar = chalk.bgRed(char)
            break
        case 'bggreen':
            styledChar = chalk.bgGreen(char)
            break
        case 'bgyellow':
            styledChar = chalk.bgYellow(char)
            break
        case 'bgblue':
            styledChar = chalk.bgBlue(char)
            break
        case 'bgmagenta':
            styledChar = chalk.bgMagenta(char)
            break
        case 'bgcyan':
            styledChar = chalk.bgCyan(char)
            break
        case 'bgwhite':
            styledChar = chalk.bgWhite(char)
            break
        case 'bgblackbright':
            styledChar = chalk.bgBlackBright(char)
            break
        case 'bgredbright':
            styledChar = chalk.bgRedBright(char)
            break
        case 'bggreenbright':
            styledChar = chalk.bgGreenBright(char)
            break
        case 'bgyellowbright':
            styledChar = chalk.bgYellowBright(char)
            break
        case 'bgbluebright':
            styledChar = chalk.bgBlueBright(char)
            break
        case 'bgmagentabright':
            styledChar = chalk.bgMagentaBright(char)
            break
        case 'bgcyanbright':
            styledChar = chalk.bgCyanBright(char)
            break
        case 'bgwhitebright':
            styledChar = chalk.bgWhiteBright(char)
            break
    }

    if (property[0] === '#') styledChar = chalk.hex(property)
    else if (property.slice(0, 3) === 'bg#') styledChar = chalk.bgHex(property)

    return styledChar
}