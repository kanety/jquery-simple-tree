import $ from 'jquery';
import Store from '@kanety/js-store';

import { NAMESPACE } from './consts';

const DEFAULTS = {
  expander: null,
  collapser: null,
  opened: 'all',
  iconTemplate: '<span />',
  store: null,
  storeKey: null
};

export default class SimpleTree {
  constructor(element, options = {}) {
    this.options = $.extend({}, DEFAULTS, options);

    this.$root = $(element);
    this.$expander = $(this.options.expander);
    this.$collapser = $(this.options.collapser);

    if (this.options.store && this.options.storeKey) {
      this.store = new Store({
        type: this.options.store,
        key: this.options.storeKey
      })
    }

    this.init();
    this.load();
  }

  init() {
    this.$root.addClass(NAMESPACE);
    this.build();

    this.unbind();
    this.bind();
  }

  destroy() {
    this.$root.removeClass(NAMESPACE);
    this.$root.find('.tree-icon').remove();
    this.nodes().removeClass('tree-empty tree-opened tree-closed');

    this.unbind();
  }

  build() {
    this.nodes().each((i, node) => {
      let $node = $(node);

      if ($node.children('.tree-handler').length == 0) {
        let $icon = $(this.options.iconTemplate).addClass('tree-handler tree-icon');
        $node.prepend($icon);
      }

      let cls = $node.attr('class');
      if (!cls || !cls.split(' ').some(str => str.match(/^(tree-empty|tree-opened|tree-closed)$/))) {
        if ($node.data('node-lazy')) {
          $node.addClass('tree-closed');
        } else if ($node.children('ul').length == 0) {
          $node.addClass('tree-empty');
        } else if (this.opensDefault($node)) {
          $node.addClass('tree-opened');
        } else {
          $node.addClass('tree-closed');
        }
      }

      if ($node.hasClass('tree-opened')) {
        $node.children('ul').show();
      } else if ($node.hasClass('tree-closed')) {
        $node.children('ul').hide();
      }
    });
  }

  opensDefault($node) {
    let opened = this.options.opened;
    return opened && (opened == 'all' || opened.indexOf($node.data('node-id')) != -1);
  }

  bind() {
    this.$expander.on(`click.${NAMESPACE}`, (e) => {
      this.expand()
    });
    this.$collapser.on(`click.${NAMESPACE}`, (e) => {
      this.collapse()
    });

    this.$root.on(`click.${NAMESPACE}`, '.tree-handler', (e) => {
      let $node = $(e.currentTarget).parent();
      if ($node.hasClass('tree-opened')) {
        this.close($node);
      } else {
        this.open($node);
      }
    });
  }

  unbind() {
    this.$expander.off(`.${NAMESPACE}`);
    this.$collapser.off(`.${NAMESPACE}`);
    this.$root.off(`.${NAMESPACE} node:open node:close`);
  }

  expand() {
    this.nodes().each((i, node) => {
      this.show($(node));
    });
    this.save();
  }

  collapse() {
    this.nodes().each((i, node) => {
      this.hide($(node));
    });
    this.save();
  }

  nodes() {
    return this.$root.find('li');
  }

  open($node) {
    this.show($node);
    this.save();

    $node.trigger('node:open', [$node]);
  }

  show($node) {
    if (!$node.hasClass('tree-empty')) {
      $node.removeClass('tree-closed').addClass('tree-opened');
      $node.children('ul').show();
    }
  }

  close($node) {
    this.hide($node);
    this.save();

    $node.trigger('node:close', [$node]);
  }

  hide($node) {
    if (!$node.hasClass('tree-empty')) {
      $node.removeClass('tree-opened').addClass('tree-closed');
      $node.children('ul').hide();
    }
  }

  findByID(id) {
    return this.$root.find(`li[data-node-id="${id}"]`).first();
  }

  openByID(id) {
    this.open(this.findByID(id));
  }

  closeByID(id) {
    this.close(this.findByID(id));
  }

  save() {
    if (!this.store) return;

    let ids = this.nodes().filter('.tree-opened').map((i, node) => {
      return $(node).data('node-id');
    }).get();

    this.store.set(ids);
  }

  load() {
    if (!this.store) return;

    let ids = this.store.get();
    if (!ids) return;

    this.nodes().each((i, node) => {
      let $node = $(node);
      if (ids.indexOf($node.data('node-id')) != -1) {
        this.show($node);
      } else {
        this.hide($node);
      }
    });
  }

  static getDefaults() {
    return DEFAULTS;
  }

  static setDefaults(options) {
    return $.extend(DEFAULTS, options);
  }
}
