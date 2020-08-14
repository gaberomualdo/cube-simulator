class History {
  constructor(addCallback = () => {}, popCallback = () => {}) {
    this.history = [];
    this.addCallback = addCallback;
    this.popCallback = popCallback;
  }
  length() {
    return this.history.length;
  }
  add(entry, ...callbackArgs) {
    this.history.push(entry);
    this.addCallback(entry, ...callbackArgs);
  }
  pop() {
    const popped = this.history.pop();
    this.popCallback();
    return popped;
  }
}

module.exports = History;
