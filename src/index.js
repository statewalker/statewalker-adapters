export class Adapters {

  constructor(separator = '.') {
    this.index = {};
    this.separator = separator;
  }

  set(from, to, adapter) {
    const adapters = this.index[from] = this.index[from] || {};
    adapters[to] = adapter;
    return () => this.remove(from, to);
  }

  get(from, to, fromExact = false, toExact = false) {
    return this._find(from, fromExact, (f) => {
      const adapters = this.index[f];
      if (!adapters) return;
      return this._find(to, toExact, (t) => adapters[t]);
    })
  }

  getAll(from, to, fromExact = false, toExact = false) {
    const result = [];
    this._find(from, fromExact, (f) => {
      const adapters = this.index[f];
      if (adapters) {
        this._find(to, toExact, (t) => {
          const adapter = adapters[t];
          if (adapter) {
            result.push(adapter);
          }
        })
      }
    })
    return result;
  }

  remove(from, to) {
    const adapters = this.index[from];
    if (!adapters) return;
    const result = adapters[to];
    delete adapters[to];
    if (!Object.keys(adapters).length) delete this.index[from];
    return result;
  }

  _find(path, exact, action) {
    let result;
    const separator = this.separator;
    path = path.split(separator);
    for (let i = path.length; i >= 0; i--) {
      result = action(path.join(separator));
      if (result || exact) break;
      path.pop();
    }
    return result;
  }

}
