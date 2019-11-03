import $ from 'jquery';
import Store from '@kanety/js-store';

import './simple-tree.scss';
import { NAMESPACE } from './consts';

const DEFAULTS = {
  expander: null,
  collapser: null,
  opened: 'all',
  iconTemplate: '<a href="#" />',
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
    let detector = (i, className) => {
      let reg = new RegExp(`${NAMESPACE}(-\\S+)?`, 'g');
      return (className.match(reg) || []).join(' ');
    }
    this.$root.removeClass(detector);
    this.nodes().removeClass(detector);
    this.$root.find(`.${NAMESPACE}-icon`).remove();

    this.unbind();
  }

  build() {
    this.nodes().each((i, node) => {
      let $node = $(node);

      if ($node.children(`.${NAMESPACE}-icon`).length == 0) {
        let $icon = $(this.options.iconTemplate).addClass(`${NAMESPACE}-icon`);
        $node.prepend($icon);
      }

      let cls = $node.attr('class');
      let reg = new RegExp(`^(${NAMESPACE}-empty|${NAMESPACE}-opened|${NAMESPACE}-closed)$`);
      if (!cls || !cls.split(' ').some(str => str.match(reg))) {
        if ($node.data('node-lazy')) {
          $node.addClass(`${NAMESPACE}-closed`);
        } else if ($node.children('ul').length == 0) {
          $node.addClass(`${NAMESPACE}-empty`);
        } else if (this.opensDefault($node)) {
          $node.addClass(`${NAMESPACE}-opened`);
        } else {
          $node.addClass(`${NAMESPACE}-closed`);
        }
      }

      if ($node.hasClass(`${NAMESPACE}-opened`)) {
        $node.children('ul').show();
      } else if ($node.hasClass(`${NAMESPACE}-closed`)) {
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
      e.preventDefault();
      this.expand()
    });
    this.$collapser.on(`click.${NAMESPACE}`, (e) => {
      e.preventDefault();
      this.collapse()
    });

    this.$root.on(`click.${NAMESPACE}`, `.${NAMESPACE}-icon`, (e) => {
      e.preventDefault();
      let $node = $(e.currentTarget).parent();
      if (this.isOpened($node)) {
        this.close($node);
      } else {
        this.open($node);
      }
    }).on(`keydown.${NAMESPACE}`, `.${NAMESPACE}-icon`, (e) => {
      let $node = $(e.currentTarget).parent();
      if (this.keydown($node, e.keyCode)) {
        e.preventDefault();
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

  icons() {
    return this.$root.find(`.${NAMESPACE}-icon`);
  }

  visibleIcons() {
    let $icons = this.icons().filter(':visible');
    return $icons.filter((index) => $icons.eq(index).css('visibility') != 'hidden');
  }

  iconOf($node) {
    return $node.children(`.${NAMESPACE}-icon`).first();
  }

  open($node) {
    this.show($node);
    this.save();

    $node.trigger('node:open', [$node]);
  }

  close($node) {
    this.hide($node);
    this.save();

    $node.trigger('node:close', [$node]);
  }

  show($node) {
    if (!this.isEmpty($node)) {
      $node.removeClass(`${NAMESPACE}-closed`).addClass(`${NAMESPACE}-opened`);
      $node.children('ul').show();
    }
  }

  hide($node) {
    if (!this.isEmpty($node)) {
      $node.removeClass(`${NAMESPACE}-opened`).addClass(`${NAMESPACE}-closed`);
      $node.children('ul').hide();
    }
  }

  isOpened($node) {
    return $node.hasClass(`${NAMESPACE}-opened`);
  }

  isClosed($node) {
    return $node.hasClass(`${NAMESPACE}-closed`);
  }

  isEmpty($node) {
    return $node.hasClass(`${NAMESPACE}-empty`);
  }

  keydown($node, keyCode) {
    switch (keyCode) {
    case 37: // left
      this.keyLeft($node);
      return true;
    case 38: // up
      this.keyUp($node);
      return true;
    case 39: // right
      this.keyRight($node);
      return true;
    case 40: // down
      this.keyDown($node);
      return true;
    }
    return false;
  }

  keyUp($node) {
    let $icons = this.visibleIcons();
    let index = $icons.index(this.iconOf($node)) - 1;
    if (index >= 0) $icons.eq(index).focus();
  }

  keyDown($node) {
    let $icons = this.visibleIcons();
    let index = $icons.index(this.iconOf($node)) + 1;
    if (index >= 0) $icons.eq(index).focus();
  }

  keyRight($node) {
    if (this.isOpened($node)) {
      this.iconOf($node.find(`> ul > li`)).focus();
    } else {
      this.open($node);
    }
  }

  keyLeft($node) {
    if (this.isClosed($node)) {
      this.iconOf($node.parent().parent()).focus();
    } else {
      this.close($node);
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

    let ids = this.nodes().filter(`.${NAMESPACE}-opened`).map((i, node) => {
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
