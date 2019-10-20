import $ from 'jquery';

import { NAMESPACE } from './consts';
import SimpleTree from './simple-tree';

$.fn.simpleTree = function(options) {
  return this.each((i, elem) => {
    let $elem = $(elem);
    if ($elem.data(NAMESPACE)) $elem.data(NAMESPACE).destroy();
    $elem.data(NAMESPACE, new SimpleTree($elem, options));
  });
};

$.SimpleTree = SimpleTree;
