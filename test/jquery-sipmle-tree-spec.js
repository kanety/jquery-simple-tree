describe('jquery-simple-tree', function() {
  beforeEach(function() {
    document.body.innerHTML = __html__['index.html'];
    eval($('script').text());
  });

  it('opens or closes a node', function() {
    var $tree = $('#basic');
    var $node = $tree.find('li[data-node-id="1.1"]');
    var $icon = $node.children('.tree-icon');

    $icon.click();
    expect($node.children('ul').is(':visible')).toEqual(false);
    $icon.click();
    expect($node.children('ul').is(':visible')).toEqual(true);
  });

  it('has expander and collapser', function() {
    var $tree = $('#basic');
    var $expander = $('#expander');
    var $collapser = $('#collapser');

    $collapser.click();
    expect($tree.find('ul:visible').length).toEqual(0);
    $expander.click();
    expect($tree.find('ul:hidden').length).toEqual(0);
  });

  it('specifies opened nodes', function() {
    var $tree = $('#opened');

    expect($tree.find('li[data-node-id="1"]').is(':visible')).toEqual(true);
    expect($tree.find('li[data-node-id="1.1"]').is(':visible')).toEqual(true);
    expect($tree.find('li[data-node-id="1.1.1"]').is(':visible')).toEqual(true);
    expect($tree.find('li[data-node-id="1.2.1"]').is(':visible')).toEqual(false);
  });

  it('has callbacks', function() {
    var $tree = $('#callback');
    var $message = $('#message');

    $tree.find('li[data-node-id="1.1"] .tree-icon').click().click();
    expect($message.html()).toContain("opened 1.1");
    expect($message.html()).toContain("closed 1.1");
  });
});
