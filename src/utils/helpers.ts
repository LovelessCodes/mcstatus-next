import type { ChatComponent } from '@minescope/mineping'

export const copyIP = async (
    e:
        | React.MouseEvent<Element, MouseEvent>
        | React.KeyboardEvent<HTMLParagraphElement>,
    ip: string,
) => {
    await navigator.clipboard.writeText(ip)
    const target = e.currentTarget
    if (target) {
        target.classList.toggle('tooltip-success')
        target.setAttribute('data-tip', 'Copied')
        setTimeout(() => {
            target.classList.toggle('tooltip-success')
            target.setAttribute('data-tip', 'Copy IP')
        }, 1000)
    }
}

const addExtras = (extras: ChatComponent[], newMotd: string) => {
    if (!extras) return newMotd
    if (!extras.length) return newMotd
    for (let i = 0; i < extras.length; i++) {
        const extra = extras[i]
        if (!!extra) {
            if (extra.bold) newMotd += '§l'
            if (extra.color) newMotd += colorToColorCode[extra.color]
            newMotd += extra.text
            if (extra.extra) newMotd = addExtras(extra.extra, newMotd)
        }
    }
    return newMotd
}

export function htmlStringFormatting(text: string): string {
    return text
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;')
        .replace(/\n/g, '<br/>')
}

interface extraLibraryType {
    [key: string]: string
}

const extras: extraLibraryType = {
    '§k': 'obfuscated;',
    '§l': 'font-weight: bold;',
    '§m': 'text-decoration: line-through;',
    '§n': 'text-decoration: underline;',
    '§o': 'font-style: italic;',
    '§r': 'color: inherit;text-decoration: none !important;font-weight:normal!important;font-style: normal!important;',
}

const colorToColorCode: extraLibraryType = {
    black: '§0',
    dark_blue: '§1',
    dark_green: '§2',
    dark_aqua: '§3',
    dark_red: '§4',
    dark_purple: '§5',
    gold: '§6',
    gray: '§7',
    dark_gray: '§8',
    blue: '§9',
    green: '§a',
    aqua: '§b',
    red: '§c',
    light_purple: '§d',
    yellow: '§e',
    white: '§f',
}

const colorCodeToHex: extraLibraryType = {
    '§0': '#000000',
    '§1': '#0000AA',
    '§2': '#00AA00',
    '§3': '#00AAAA',
    '§4': '#AA0000',
    '§5': '#AA00AA',
    '§6': '#FFAA00',
    '§7': '#AAAAAA',
    '§8': '#555555',
    '§9': '#5555FF',
    '§a': '#55FF55',
    '§b': '#55FFFF',
    '§c': '#FF5555',
    '§d': '#FF55FF',
    '§e': '#FFFF55',
    '§f': '#FFFFFF',
}

export default function textToHTML(motdText: string) {
    const colorCodeReg = /([§][0-9a-f0-9a-fA-FklmnorFKLMNOR])/g
    const codeREGEX = new RegExp(colorCodeReg.source)
    const codeSplit = motdText.split(codeREGEX).filter((item) => item !== '')

    let fontStyle = ''
    let colorHex: string | undefined = ''
    let resultHTML = ''

    codeSplit.forEach((item) => {
        const motdStringToLowerCase = item.toLowerCase()
        if (Object.hasOwn(colorCodeToHex, motdStringToLowerCase)) {
            colorHex = colorCodeToHex[motdStringToLowerCase]

            if (motdStringToLowerCase === '§f') {
                fontStyle = ''
            }
        } else if (Object.hasOwn(extras, motdStringToLowerCase)) {
            if (motdStringToLowerCase === '§r') {
                colorHex = ''
                fontStyle = ''
            } else {
                fontStyle += extras[motdStringToLowerCase]
            }
        } else {
            let resultColor = ''
            let textContent = item
            if (colorHex !== '') {
                resultColor = `color:${colorHex};`
            }

            if (textContent !== '') {
                textContent = htmlStringFormatting(textContent)

                if (resultColor.length !== 0 || fontStyle.length !== 0) {
                    resultHTML += `<span style="${resultColor}${fontStyle}">${textContent}</span>`
                } else {
                    resultHTML += textContent
                }
            }
        }
    })
    return resultHTML
}

export const convertMotd = (motd: string | ChatComponent) => {
    if (typeof motd === 'string') return textToHTML(motd)
    if (!motd.extra) return textToHTML(motd.text)

    return textToHTML(addExtras(motd.extra, motd.text))
}
