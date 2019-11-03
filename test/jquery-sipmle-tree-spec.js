const NAMESPACE = 'simple-tree';

function keydown(elem, code) {
  $(elem).trigger($.Event('keydown', { keyCode: code }));
}

describe('jquery-simple-tree', () => {
  beforeEach(() => {
    document.body.innerHTML = __html__['index.html'];
    eval($('script').text());
  });

  describe('basic', () => {
    let $tree, $node, $icon;
    let $expander, $collapser;

    beforeEach(() => {
      $tree = $('#basic');
      $node = $tree.find('li[data-node-id="1"]');
      $icon = $node.children(`.${NAMESPACE}-icon`);
      $expander = $('#expander');
      $collapser = $('#collapser');
      $open1 = $('#open1');
      $close1 = $('#close1');
    });

    it('opens and closes', () => {
      $icon.click();
      expect($node.children('ul').is(':visible')).toEqual(false);
      $icon.click();
      expect($node.children('ul').is(':visible')).toEqual(true);
    });

    it('has expander and collapser', () => {
      $collapser.click();
      expect($tree.find('ul:visible').length).toEqual(0);
      $expander.click();
      expect($tree.find('ul:hidden').length).toEqual(0);
    });

    it('opens and closes by id', () => {
      $close1.click();
      expect($node.children('ul').is(':visible')).toEqual(false);
      $open1.click();
      expect($node.children('ul').is(':visible')).toEqual(true);
    });
  });

  describe('keyboard events', () => {
    let $tree, $node, $icon;

    beforeEach(() => {
      $tree = $('#basic');
      $node = $tree.find('li[data-node-id="1.1"]');
      $icon = $node.children(`.${NAMESPACE}-icon`);
    });

    it('moves focus by up key', () => {
      $tree.data(NAMESPACE).expand();
      keydown($icon, 38);
      expect($(document.activeElement).parent().attr('data-node-id')).toEqual('1');
    });

    it('moves focus by down key', () => {
      $tree.data(NAMESPACE).expand();
      keydown($icon, 40);
      expect($(document.activeElement).parent().attr('data-node-id')).toEqual('1.1.1');
    });

    it('moves focus by left key', () => {
      $tree.data(NAMESPACE).close($node);
      keydown($icon, 37);
      expect($(document.activeElement).parent().attr('data-node-id')).toEqual('1');
    });

    it('closes node by left key', () => {
      $tree.data(NAMESPACE).open($node);
      keydown($icon, 37);
      expect($node.find('ul').is(':visible')).toEqual(false);
    });

    it('moves focus by right key', () => {
      $tree.data(NAMESPACE).open($node);
      keydown($icon, 39);
      expect($(document.activeElement).parent().attr('data-node-id')).toEqual('1.1.1');
    });

    it('opens node by right key', () => {
      $tree.data(NAMESPACE).close($node);
      keydown($icon, 39);
      expect($node.find('ul').is(':visible')).toEqual(true);
    });
  });

  describe('open', () => {
    let $tree;

    beforeEach(() => {
      $tree = $('#opened');
    });

    it('specifies opened nodes', () => {
      expect($tree.find('li[data-node-id="1"]').is(':visible')).toEqual(true);
      expect($tree.find('li[data-node-id="1.1"]').is(':visible')).toEqual(true);
      expect($tree.find('li[data-node-id="1.1.1"]').is(':visible')).toEqual(true);
      expect($tree.find('li[data-node-id="1.2.1"]').is(':visible')).toEqual(false);
    });
  });

  describe('callbacks', () => {
    let $tree;
    let $message;

    beforeEach(() => {
      $tree = $('#callback');
      $message = $('#message');
    });
    
    it('runs callbacks', () => {
      $tree.find(`li[data-node-id="1.1"] .${NAMESPACE}-icon`).click().click();
      expect($message.html()).toContain("opened 1.1");
      expect($message.html()).toContain("closed 1.1");
    });
  });

  describe('destroy', () => {
    let $tree;

    beforeEach(() => {
      eval($('script').text());
      $tree = $('#callback');
    });
    
    it('destroy', () => {
      $tree.data(NAMESPACE).destroy();
      expect($tree.hasClass(NAMESPACE)).toEqual(false);
      expect($._data($tree.get(0), 'events')).toEqual(undefined);
    });
  });
});
