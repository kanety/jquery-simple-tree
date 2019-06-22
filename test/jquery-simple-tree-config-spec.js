describe('jquery-simple-tree', () => {
  it('config', () => {
    let defaults = $.SimpleTree.getDefaults();
    expect(defaults.expander).toEqual(null);

    defaults = $.SimpleTree.setDefaults({expander: 'test'});
    expect(defaults.expander).toEqual('test');
  });
});
