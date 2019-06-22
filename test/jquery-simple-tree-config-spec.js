describe('jquery-simple-tree-config', () => {
  it('gets and sets defaults', () => {
    let defaults = $.SimpleTree.getDefaults();
    expect(defaults.expander).toEqual(null);

    defaults = $.SimpleTree.setDefaults({expander: 'test'});
    expect(defaults.expander).toEqual('test');
  });
});
