const americanOnly = require('./american-only.js');
const americanToBritishSpelling = require('./american-to-british-spelling.js');
const americanToBritishTitles = require("./american-to-british-titles.js")
const britishOnly = require('./british-only.js')

const getReverseDictionary = (dictionary) => Object.fromEntries(Object.entries(dictionary).map(([am, br]) => [br, am]))
const britishToAmericanSpelling = getReverseDictionary(americanToBritishSpelling)
const britishToAmericanTitles = getReverseDictionary(americanToBritishTitles)
class Translator {
    checkAndReplace(text, dictionary, cb = word => word, replace = true) {
        const matcherRE = v => RegExp("\\b" + v.replace(".", "") + (v.endsWith(".") ? "\\b[.]" : "\\b"), "ig")
        Object.keys(dictionary).filter(v => text.match(matcherRE(v))).sort((a, b) => b.length - a.length).forEach(v => {
            if (text.match(matcherRE(v))) {
                text = text.replaceAll(matcherRE(v), w => cb(replace ? dictionary[v] : w))
            }
        })
        return text
    }
    highlight(word) {
        return '<span class="highlight">word</span>'.replace("word", word)
    }
    correctTitlesCase(text) {
        return text.replaceAll(/(\b)(mr|mrs|ms|mx|dr|prof)(\b)/gi, (_, b1, s, b2) => b1 + s.at(0)?.toUpperCase() + s.substring(1) + b2)
    }
    getAmericanToBritishDictionary() {
        return { ...americanOnly, ...americanToBritishSpelling, ...americanToBritishTitles }
    }
    getBritishToAmericanDictionary() {
        return { ...britishOnly, ...britishToAmericanSpelling, ...britishToAmericanTitles }
    }
    translate(text, locale, highlight = true) {
        let res = ""
        const cb = (d) => highlight ? this.highlight(d) : d
        switch (locale) {
            case "american-to-british":
                res = this.checkAndReplace(text, this.getAmericanToBritishDictionary(), cb)
                res = res.replaceAll(/(\d{1,2}):(\d{1,2})/g, (_, d1, d2) => cb(d1 + "." + d2))
                break;
            case "british-to-american":
                res = this.checkAndReplace(text, this.getBritishToAmericanDictionary(), cb)
                res = res.replaceAll(/(\d{1,2})[.](\d{1,2})/g, (_, d1, d2) => cb(d1 + ":" + d2))
                break;
            case null:
                res = this.checkAndReplace(text, { ...this.getAmericanToBritishDictionary(), ...this.getBritishToAmericanDictionary() }, cb, false)
                break;
            default:
                res = "Invalid value for locale field"
        }
        res = res[0].toUpperCase() + res.substring(1)
        res = this.correctTitlesCase(res)
        if (res === text) {
            res = "Everything looks good to me!"
        }
        return res
    }

}

module.exports = Translator;