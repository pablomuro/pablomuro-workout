interface ConfigSpeechSynthesisUtteranceFactory {
  pitch?: number
  rate?: number
  lang?: 'pt-BR' | 'en-US'
}

export class SpeechSynthesisUtteranceFactory {
  static new(config: ConfigSpeechSynthesisUtteranceFactory = { pitch: 0.8, rate: 0.8, lang: 'en-US' }) {
    const speechSynthesis = new SpeechSynthesisUtterance()
    speechSynthesis.pitch = config.pitch as number
    speechSynthesis.rate = config.rate as number
    speechSynthesis.lang = config.lang as 'pt-BR' | 'en-US'
    return speechSynthesis
  }
}