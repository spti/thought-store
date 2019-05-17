class Dev {
  constructor(devEnv) {
    if (typeof(devEnv) != 'boolean') throw new TypeError('devEnv must be boolean, instead got '+ typeof(devEnv))
    this.devEnv = devEnv
    this.logs = []
  }

  log(msg, data) {
    if (this.devEnv) {
      this.logs.unshift({msg, data})
      console.log(msg, data)
    }
  }
}
