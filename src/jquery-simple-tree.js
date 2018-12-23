'use strict';

import './jquery-simple-tree.scss';
import SimpleTree from './simple-tree';
import { NAMESPACE } from './consts';

$.fn.simpleTree = function(options) {
  return this.each((i, elem) => {
    let $elem = $(elem);
    if (!$elem.data(NAMESPACE)) {
      let st = new SimpleTree($elem, options);
      $elem.data(NAMESPACE, st);
    }
  });
};

$.SimpleTree = SimpleTree;
