import $ from 'jquery';

export default class Store {
  constructor(tree, options = {}) {
    this.tree = tree;
    this.key = options.storeKey;
    this.storage = Store.storage(options.storeType);
  }

  save() {
    let ids = this.tree.nodes().filter('.tree-opened').map((i, node) => {
      return $(node).data('node-id');
    }).get();

    Store.saveData(this.storage, this.key, ids);
  }

  load() {
    let ids = Store.loadData(this.storage, this.key);
    if (!ids) {
      return;
    }

    this.tree.nodes().each((i, node) => {
      let $node = $(node);
      if (ids.indexOf($node.data('node-id')) != -1) {
        this.tree.show($node);
      } else {
        this.tree.hide($node);
      }
    });
  }

  static storage(type) {
    if (type == 'local') {
      return window.localStorage;
    } else {
      return window.sessionStorage;
    }
  }

  static saveData(storage, key, data) {
    let json = JSON.stringify(data);
    storage.setItem(key, json);
  }

  static loadData(storage, key) {
    let json = storage.getItem(key);
    if (!json) {
      return null;
    } else {
      return JSON.parse(json);
    }
  }
}
