# jquery-simple-tree

A jquery plugin for simple tree ui.

## Dependencies

* jquery

## Installation

Install from npm:

    $ npm install @kanety/jquery-simple-tree --save

## Usage

Build tree using list elements as follows:

```html
<ul id="tree">
  <li data-node-id="1">
    <span>text of 1</span>
    <ul>
      <li data-node-id="1.1">
        <span>text of 1.1</span>
        <ul>
          <li data-node-id="1.1.1">
            <span>text of 1.1.1</span>
          </li>
          <li data-node-id="1.1.2">
            <span>text of 1.1.2</span>
          </li>
        </ul>
      </li>
    </ul>
  </li>
</ul>
```

Then run:

```javascript
$('#tree').simpleTree();
```

### Options

Specify opened nodes:

```javascript
$('#tree').simpleTree({
  opened: [1, 1.1]
});
```

Save node state to `sessionStorage` or `localStorage`:

```javascript
$('#tree').simpleTree({
  store: 'session', // or 'local'
  storeKey: 'YOUR_KEY'
});
```

### Callbacks

Run callbacks when a node is opened or closed:

```javascript
$('#tree').simpleTree({
  ...
}).on('node:open', function(e, $node) {
  ...
}).on('node:close', function(e, $node) {
  ...
});
```

### Functions

Manipulate nodes from your script:

```javascript
var tree = $('#tree').data('simple-tree');  // get SimpleTree instance
tree.openByID(1);
tree.closeByID(1);
```

## License

The library is available as open source under the terms of the [MIT License](http://opensource.org/licenses/MIT).
