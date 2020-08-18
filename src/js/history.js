class History {
  constructor(allCallback = () => {}, addCallback = () => {}, popCallback = () => {}) {
    this.history = [];
    this.allCallback = allCallback;
    this.addCallback = addCallback;
    this.popCallback = popCallback;
  }
  length() {
    return this.history.length;
  }
  add(entry, ...callbackArgs) {
    this.history.push(entry);
    this.allCallback();
    this.addCallback(entry, ...callbackArgs);
  }
  clear() {
    this.history = [];
    this.allCallback();
  }
  pop() {
    const popped = this.history.pop();
    this.allCallback();
    this.popCallback();
    return popped;
  }
}

module.exports = History;
