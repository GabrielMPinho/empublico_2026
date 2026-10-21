/* Mini runtime: renders the site's HTML template (holes {{ }}, <sc-for>, <sc-if>) with Preact. */
(function () {
  var h = preact.h, Fragment = preact.Fragment;
  var ONE = /^\s*\{\{\s*([^}]+?)\s*\}\}\s*$/, RE = /\{\{\s*([^}]+?)\s*\}\}/g;
  var TPL = null;

  function lookup(path, scopes) {
    path = path.trim();
    if (path === 'true') return true;
    if (path === 'false') return false;
    if (/^-?\d+(\.\d+)?$/.test(path)) return +path;
    var parts = path.split('.');
    for (var i = scopes.length - 1; i >= 0; i--) {
      var s = scopes[i];
      if (s && Object.prototype.hasOwnProperty.call(s, parts[0])) {
        var v = s[parts[0]];
        for (var j = 1; j < parts.length; j++) { if (v == null) return undefined; v = v[parts[j]]; }
        return v;
      }
    }
    return undefined;
  }
  function interp(str, sc) {
    var m = str.match(ONE);
    if (m) return lookup(m[1], sc);
    return str.replace(RE, function (_, p) { var v = lookup(p, sc); return v == null ? '' : v; });
  }
  function kids(node, sc) {
    var out = [];
    node.childNodes.forEach(function (n) {
      var r = one(n, sc);
      if (Array.isArray(r)) out.push.apply(out, r); else if (r != null) out.push(r);
    });
    return out;
  }
  function one(n, sc) {
    if (n.nodeType === 3) {
      var t = n.nodeValue;
      if (t.indexOf('{{') < 0) return t;
      var v = interp(t, sc);
      return v == null ? '' : String(v);
    }
    if (n.nodeType !== 1) return null;
    var tag = n.localName;
    if (tag === 'sc-if') return interp(n.getAttribute('value'), sc) ? kids(n, sc) : null;
    if (tag === 'sc-for') {
      var list = interp(n.getAttribute('list'), sc) || [];
      var as = n.getAttribute('as') || 'item', res = [];
      list.forEach(function (it, i) { var o = { $index: i }; o[as] = it; res.push.apply(res, kids(n, sc.concat([o]))); });
      return res;
    }
    var props = {};
    for (var a = 0; a < n.attributes.length; a++) {
      var at = n.attributes[a];
      if (at.name.indexOf('hint-') === 0) continue;
      props[at.name] = at.value.indexOf('{{') >= 0 ? interp(at.value, sc) : at.value;
    }
    return h.apply(null, [tag, props].concat(kids(n, sc)));
  }

  window.DCLogic = class extends preact.Component {
    render() {
      if (!TPL) TPL = document.getElementById('dc-template').content;
      return h.apply(null, [Fragment, null].concat(kids(TPL, [this.renderVals()])));
    }
  };
})();
