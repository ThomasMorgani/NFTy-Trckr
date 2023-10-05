export default {
  async copyToClipboard(content) {
    const result = navigator.clipboard.writeText(content)
    return result
  },
  epochToHuman(time) {
    const dateOptions = { month: 'numeric', day: 'numeric', year: '2-digit' }
    const timeOptions = { hour12: false, hour: '2-digit', minute: '2-digit' }
    return `${new Date(time).toLocaleDateString(
      undefined,
      dateOptions
    )} ${new Date(time).toLocaleTimeString(undefined, timeOptions)}`
  },
  generateId() {
    return crypto?.randomUUID() || new Date().getTime()
  },
  isEnsAddress(address) {
    //TODO: HIT API FOR VALIDITY
    return address.filter((x) => x === '.').length >= 2
  },
  isObject(v) {
    if (v === null) return false
    return typeof v === 'object' || typeof v === 'function'
  },
}
