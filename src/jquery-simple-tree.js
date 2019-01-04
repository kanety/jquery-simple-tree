import $ from 'jquery';

import { NAMESPACE } from './consts';
import SimpleTree from './simple-tree';
import './jquery-simple-tree.scss';

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
