/* Pop-ups e ícones próprios (substituem alert/confirm do navegador). Usado pelo site, painel e página de confirmação.
   UI.alert(msg, {title, kind})  -> Promise<void>
   UI.confirm(msg, {title, ok, cancel, danger}) -> Promise<boolean>
   kind: 'info' | 'ok' | 'warn' | 'error' */
(function () {
  var ICONS = {
    info: '<path d="M12 11v5"/><circle cx="12" cy="7.6" r=".6" fill="currentColor"/><circle cx="12" cy="12" r="9"/>',
    ok: '<circle cx="12" cy="12" r="9"/><path d="M8 12.4l2.8 2.8L16.2 9.6"/>',
    warn: '<path d="M12 3.6l9.2 16H2.8z"/><path d="M12 10v4.4"/><circle cx="12" cy="17.2" r=".6" fill="currentColor"/>',
    error: '<circle cx="12" cy="12" r="9"/><path d="M9 9l6 6M15 9l-6 6"/>',
    ask: '<circle cx="12" cy="12" r="9"/><path d="M9.6 9.4a2.5 2.5 0 114 2c-.8.6-1.6 1-1.6 2.1"/><circle cx="12" cy="16.9" r=".6" fill="currentColor"/>',
    trash: '<path d="M4.5 7h15M10 7V4.8h4V7M6.6 7l.8 12.2h9.2L17.4 7M10.2 11v5M13.8 11v5"/>'
  };
  var CSS = '' +
    '.uix-veil{position:fixed;inset:0;z-index:2147483000;display:grid;place-items:center;padding:20px;background:rgba(22,18,15,.5);-webkit-backdrop-filter:blur(8px);backdrop-filter:blur(8px);opacity:0;transition:opacity .25s ease;font-family:Manrope,system-ui,-apple-system,"Segoe UI",sans-serif}' +
    '.uix-veil.on{opacity:1}' +
    '.uix-box{width:min(100%,400px);background:#fff;color:#16120f;border-radius:28px;padding:30px 26px 22px;text-align:center;box-shadow:0 50px 100px -30px rgba(22,18,15,.55),0 0 0 1px rgba(184,133,85,.12);transform:translateY(24px) scale(.95);transition:transform .45s cubic-bezier(.22,.8,.24,1)}' +
    '.uix-veil.on .uix-box{transform:none}' +
    '.uix-ico{width:64px;height:64px;margin:0 auto 16px;border-radius:50% 50% 50% 14px;display:grid;place-items:center;color:#fff;background:linear-gradient(135deg,#b88555 0%,#8f5f3a 55%,#5c3a22 100%);box-shadow:0 14px 28px -12px rgba(143,95,58,.7)}' +
    '.uix-ico.error,.uix-ico.danger{background:linear-gradient(135deg,#d9695a,#a3392b);box-shadow:0 14px 28px -12px rgba(163,57,43,.7)}' +
    '.uix-ico.warn{background:linear-gradient(135deg,#d9b25f,#b0842a);box-shadow:0 14px 28px -12px rgba(176,132,42,.7)}' +
    '.uix-ico.ok{background:linear-gradient(135deg,#5fae7c,#2e6b43);box-shadow:0 14px 28px -12px rgba(46,107,67,.7)}' +
    '.uix-ico svg{width:30px;height:30px;fill:none;stroke:currentColor;stroke-width:1.8;stroke-linecap:round;stroke-linejoin:round}' +
    '.uix-t{font:italic 500 1.9rem/1.1 "Cormorant Garamond",Georgia,serif;margin:0 0 8px}' +
    '.uix-m{margin:0;color:#776d63;font-size:.93rem;line-height:1.55;white-space:pre-line;overflow-wrap:anywhere}' +
    '.uix-act{display:flex;gap:10px;margin-top:22px}' +
    '.uix-act button{flex:1;font:inherit;font-weight:600;font-size:.9rem;cursor:pointer;border-radius:999px;padding:13px 18px;border:1.5px solid #e3d3c0;background:#fff;color:#16120f;transition:transform .25s cubic-bezier(.22,.8,.24,1),box-shadow .25s,border-color .25s}' +
    '.uix-act button:hover{transform:translateY(-2px);border-color:#b88555}' +
    '.uix-act button:focus-visible{outline:2px solid #a0704a;outline-offset:2px}' +
    '.uix-act .uix-pri{border:0;color:#fff;background:linear-gradient(135deg,#b88555 0%,#8f5f3a 55%,#5c3a22 100%);box-shadow:0 12px 24px -12px rgba(143,95,58,.8)}' +
    '.uix-act .uix-dng{border:0;color:#fff;background:linear-gradient(135deg,#d9695a,#a3392b);box-shadow:0 12px 24px -12px rgba(163,57,43,.8)}' +
    '@media(max-width:420px){.uix-act{flex-direction:column-reverse}}' +
    '@media(prefers-reduced-motion:reduce){.uix-veil,.uix-box{transition:none}}';

  function css() {
    if (document.getElementById('uix-css')) return;
    var s = document.createElement('style'); s.id = 'uix-css'; s.textContent = CSS; (document.head || document.documentElement).appendChild(s);
  }
  function esc(s) { return String(s == null ? '' : s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }

  function dialog(o) {
    css();
    return new Promise(function (resolve) {
      var last = document.activeElement, v = document.createElement('div');
      v.className = 'uix-veil'; v.setAttribute('role', o.ask ? 'alertdialog' : 'dialog'); v.setAttribute('aria-modal', 'true');
      var tone = o.danger ? 'danger' : o.kind;
      v.innerHTML = '<div class="uix-box"><div class="uix-ico ' + esc(tone) + '"><svg viewBox="0 0 24 24" aria-hidden="true">' + (ICONS[o.icon] || ICONS.info) + '</svg></div>' +
        '<h3 class="uix-t">' + esc(o.title) + '</h3><p class="uix-m">' + esc(o.msg) + '</p>' +
        '<div class="uix-act">' + (o.ask ? '<button type="button" data-v="0">' + esc(o.cancel) + '</button>' : '') +
        '<button type="button" data-v="1" class="' + (o.danger ? 'uix-dng' : 'uix-pri') + '">' + esc(o.ok) + '</button></div></div>';
      document.body.appendChild(v);
      var done = false;
      function end(val) {
        if (done) return; done = true;
        document.removeEventListener('keydown', key, true);
        v.classList.remove('on');
        setTimeout(function () { if (v.parentNode) v.parentNode.removeChild(v); }, 260);
        try { last && last.focus && last.focus({ preventScroll: true }); } catch (e) {}
        resolve(val);
      }
      function key(e) {
        if (e.key === 'Escape') { e.preventDefault(); e.stopPropagation(); end(false); }
        else if (e.key === 'Tab') {
          var b = v.querySelectorAll('button'); if (!b.length) return;
          var f = b[0], l = b[b.length - 1];
          if (e.shiftKey && document.activeElement === f) { e.preventDefault(); l.focus(); }
          else if (!e.shiftKey && document.activeElement === l) { e.preventDefault(); f.focus(); }
        }
      }
      document.addEventListener('keydown', key, true);
      v.addEventListener('click', function (e) {
        var b = e.target.closest && e.target.closest('button[data-v]');
        if (b) end(b.dataset.v === '1'); else if (e.target === v) end(false);
      });
      requestAnimationFrame(function () {
        v.classList.add('on');
        var pri = v.querySelector('[data-v="1"]'), can = v.querySelector('[data-v="0"]');
        (o.danger && can ? can : pri).focus({ preventScroll: true });
      });
    });
  }

  var TITLES = { info: 'Aviso', ok: 'Tudo certo', warn: 'Atenção', error: 'Algo deu errado' };
  window.UI = {
    alert: function (msg, o) {
      o = o || {}; var k = o.kind || 'info';
      return dialog({ msg: msg, title: o.title || TITLES[k], kind: k, icon: k === 'info' ? 'info' : k, ok: o.ok || 'Entendi' }).then(function () {});
    },
    confirm: function (msg, o) {
      o = o || {};
      return dialog({ ask: true, msg: msg, title: o.title || 'Confirmar', kind: o.danger ? 'error' : 'info', danger: !!o.danger, icon: o.icon || (o.danger ? 'trash' : 'ask'), ok: o.ok || 'Confirmar', cancel: o.cancel || 'Voltar' });
    },
    icons: ICONS
  };
})();
