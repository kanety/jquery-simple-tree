import $ from 'jquery';

import { NAMESPACE } from './consts';
import Store from './store';

const DEFAULTS = {
  expander: null,
  collapser: null,
  opened: 'all',
  storeState: false,
  storeKey: NAMESPACE,
  storeType: 'session',
  iconTemplate: '<span />'
};

export default class SimpleTree {
  constructor(element, options = {}) {
    this.options = $.extend({}, DEFAULTS, options);

    this.$root = $(element);
    this.$expander = $(this.options.expander);
    this.$collapser = $(this.options.collapser);

    if (this.options.storeState) {
      this.store = new Store(this, this.options)
    }

    this.init();
  }

  init() {
    this.$root.addClass(NAMESPACE);
    this.build();
    this.bind();
    this.loadState();
  }

  build() {
    this.nodes().each((i, node) => {
      let $node = $(node);

      if ($node.children('.tree-icon').length == 0) {
        let $icon = $(this.options.iconTemplate).addClass('tree-icon');
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

    this.$root.on(`click.${NAMESPACE}`, '.tree-icon', (e) => {
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
    this.$root.off(`.${NAMESPACE}`);
  }

  expand() {
    this.nodes().each((i, node) => {
      this.show($(node));
    });
    this.saveState();
  }

  collapse() {
    this.nodes().each((i, node) => {
      this.hide($(node));
    });
    this.saveState();
  }

  nodes() {
    return this.$root.find('li[data-node-id]');
  }

  open($node) {
    this.show($node);
    this.saveState();

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
    this.saveState();

    $node.trigger('node:close', [$node]);
  }

  hide($node) {
    if (!$node.hasClass('tree-empty')) {
      $node.removeClass('tree-opened').addClass('tree-closed');
      $node.children('ul').hide();
    }
  }

  findByID(id) {
    return this.$root.find(`li[data-node-id="${id}"]:first`);
  }

  openByID(id) {
    this.open(this.findByID(id));
  }

  closeByID(id) {
    this.close(this.findByID(id));
  }

  saveState() {
    this.store && this.store.save();
  }

  loadState() {
    this.store && this.store.load();
  }

  static getDefaults() {
    return DEFAULTS;
  }

  static setDefaults(options) {
    $.extend(DEFAULTS, options);
  }
}
