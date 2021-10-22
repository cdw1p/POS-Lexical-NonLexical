const WordPOS = require('wordpos')
const WordPOSClient = new WordPOS()
const fs = require('fs-extra')

;(async () => {
  const tempText = []
  const inputText = await (await fs.readFileSync('./words.txt', 'utf-8')).split('\n')
  console.log(`+ Kata POS (Part-of-Speech) :`)
  for (kata of inputText) {
    const kataClean = kata.replace(/\('|'\)/g, '').replace(/', '/g, ' ')
    const { nouns, verbs, adjectives, adverbs, rest } = await WordPOSClient.getPOS(kataClean)
    const grammaticalRules = [
      { type: 'G1 (Gramatikal)', pattern: 'Adjektiva + Kf + Nomina', valid: (adjectives.length > 0 && rest.length > 0 && nouns.length > 0) },
      { type: 'G2 (Gramatikal)', pattern: 'Verba + Kf + Nomina', valid: (verbs.length > 0 && rest.length > 0 && nouns.length > 0) },
      { type: 'G3 (Gramatikal)', pattern: 'Verba + Kf + Verba + Nomina', valid: (verbs.length > 0 && rest.length > 0 && verbs.length > 0 && nouns.length > 0) },
      { type: 'G4 (Gramatikal)', pattern: 'Kf + Nomina', valid: (rest.length > 0 && nouns.length > 0) },
      { type: 'G5 (Gramatikal)', pattern: 'Kf + Adjektiva', valid: (rest.length > 0 && adjectives.length > 0) },
      { type: 'G6 (Gramatikal)', pattern: 'Nomina + Kf + Klausa', valid: (nouns.length > 0 && adjectives.length > 0) },
      { type: 'G7 (Gramatikal)', pattern: 'Verb + Kf + Klausa', valid: (nouns.length > 0 && rest.length > 0) },
      { type: 'G8 (Gramatikal)', pattern: 'Kf + Adverbia', valid: (rest.length > 0 && adverbs.length > 0) }
    ]
    const lexicalRules = [
      { type: 'L1 (Leksikal)', pattern: 'Nomina + Verba', valid: (nouns.length > 0 && verbs.length > 0) },
      { type: 'L2 (Leksikal)', pattern: 'Nomina + Adjektiva', valid: (nouns.length > 0 && adjectives.length > 0) },
      { type: 'L3 (Leksikal)', pattern: 'Nomina + Nomina', valid: (nouns.length > 0) },
      { type: 'L4 (Leksikal)', pattern: 'Verba + Nomina', valid: (verbs.length > 0 && nouns.length > 0) },
      { type: 'L5 (Leksikal)', pattern: 'Adjektiva + Verba', valid: (adjectives.length > 0 && verbs.length > 0) },
      { type: 'L6 (Leksikal)', pattern: 'Verba + Adjektiva', valid: (verbs.length > 0 && adjectives.length > 0) },
      { type: 'L7 (Leksikal)', pattern: 'Nomina + Adverbia', valid: (nouns.length > 0 && adverbs.length > 0) },
      { type: 'L8 (Leksikal)', pattern: 'Verba + Adverbia', valid: (verbs.length > 0 && adverbs.length > 0) },
      { type: 'L9 (Leksikal)', pattern: 'Adjektiva + Nomina', valid: (adjectives.length > 0 && nouns.length > 0) }
    ]
    const lexicalRulesValid = await lexicalRules.filter(data => data.valid === true)
    const grammaticalRulesValid = await grammaticalRules.filter(data => data.valid === true)
    if (grammaticalRulesValid.length > 0) {
      tempText.push({ word: kataClean, ...grammaticalRulesValid[0] })
    } else {
      tempText.push({ word: kataClean, ...lexicalRulesValid[0] })
    }
  }
  tempText.filter(data => console.log(`${data.word} - ${data.pattern || 'null'} - ${data.type || 'null'}`))
})()