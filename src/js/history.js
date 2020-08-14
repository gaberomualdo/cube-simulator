class History {
  constructor(addCallback = () => {}, popCallback = () => {}) {
    this.history = [];
    this.addCallback = addCallback;
    this.popCallback = popCallback;
  }
  length() {
    return this.history.length;
  }
  add(entry) {
    this.history.push(entry);
    this.addCallback(entry);
  }
  pop() {
    const popped = this.history.pop();
    this.popCallback();
    return popped;
  }
}

module.exports = History;
