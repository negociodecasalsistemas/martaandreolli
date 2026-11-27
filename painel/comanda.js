/* Comanda de agendamento: página elegante para imprimir (usa um iframe oculto, sem pop-up).
   Usada pelo site (cliente), pela página confirmar.html e pelo painel. */
(function () {
  var DAYN = ['Domingo', 'Segunda-feira', 'Terça-feira', 'Quarta-feira', 'Quinta-feira', 'Sexta-feira', 'Sábado'];
  var MONN = ['janeiro', 'fevereiro', 'março', 'abril', 'maio', 'junho', 'julho', 'agosto', 'setembro', 'outubro', 'novembro', 'dezembro'];
  var e = function (s) { return String(s == null ? '' : s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); };

  /* lê endereço e telefone que já estão no site (rodapé / onde estamos) */
  window.studioInfo = function (doc) {
    try {
      var clean = function (id) { var el = doc.getElementById(id); return el ? el.innerHTML.replace(/<br\s*\/?>/gi, ' · ').replace(/<[^>]+>/g, '').replace(/&amp;/g, '&').trim() : ''; };
      return { addr: clean('gAddrF'), tel: clean('locTel') };
    } catch (x) { return {}; }
  };

  window.comandaHTML = function (b, o) {
    o = o || {};
    var addr = o.addr || 'R. Gonçalves Crespo, 439-359 · Vila Adélia, Sorocaba – SP';
    var tel = o.tel || '(15) 99605-4322';
    var ok = b.status === 'confirmado';
    var p = String(b.date).split('-'), dt = new Date(+p[0], +p[1] - 1, +p[2]);
    var code = String(b.id || '').slice(-6).toUpperCase();
    var contato = (b.wa ? 'WhatsApp ' : 'Telefone ') + (b.tel || '');
    var rows = [
      ['Cliente', (b.nome || '') + ' ' + (b.sobrenome || '')],
      ['Serviço', b.svcName || ''],
      ['Data', DAYN[dt.getDay()] + ', ' + dt.getDate() + ' de ' + MONN[dt.getMonth()] + ' de ' + dt.getFullYear()],
      ['Horário', b.t],
      ['Contato', contato]
    ].map(function (r) { return '<tr><th>' + e(r[0]) + '</th><td>' + e(r[1]) + '</td></tr>'; }).join('');

    return '<!doctype html><html lang="pt-BR"><head><meta charset="utf-8"><title>Comanda · Marta Andreolli</title>'
      + '<link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,500;0,600;1,500&family=Manrope:wght@400;600;700&display=swap" rel="stylesheet">'
      + '<style>'
      + '@page{size:A4 portrait;margin:0}'
      + '*{box-sizing:border-box;-webkit-print-color-adjust:exact;print-color-adjust:exact}'
      + 'html,body{margin:0;padding:0;background:#fff}'
      + 'body{width:210mm;height:297mm;display:flex;align-items:center;justify-content:center;font-family:Manrope,system-ui,-apple-system,"Segoe UI",sans-serif;color:#16120f}'
      + '.sheet{position:relative;width:148mm;height:214mm;background:linear-gradient(165deg,#fbf6ef 0%,#fff 58%);border-radius:5mm}'
      + '.frame{position:absolute;inset:0;border:.4mm solid #b88555;border-radius:5mm}'
      + '.frame:after{content:"";position:absolute;inset:1.8mm;border:.2mm solid #e3d3c0;border-radius:3.6mm}'
      + '.in{position:relative;height:100%;padding:11mm 11mm 9mm;display:flex;flex-direction:column;align-items:center;text-align:center}'
      + '.mono{width:15mm;height:15mm;border-radius:50% 50% 50% 3mm;background:linear-gradient(135deg,#b88555,#8f5f3a 55%,#5c3a22);color:#fff;display:flex;align-items:center;justify-content:center;font:500 8mm/1 "Cormorant Garamond",Georgia,serif}'
      + '.brand{margin-top:3.2mm;font-weight:700;font-size:3.3mm;letter-spacing:.34em;text-transform:uppercase;padding-left:.34em}'
      + '.tag{margin-top:1mm;font-size:2.7mm;letter-spacing:.14em;color:#776d63;text-transform:uppercase}'
      + '.orn{display:flex;align-items:center;gap:3mm;width:64%;margin:5mm 0 5mm}.orn i{flex:1;height:.25mm;background:#d9c2a6}.orn b{width:1.7mm;height:1.7mm;transform:rotate(45deg);background:#b88555}'
      + '.seal{width:13mm;height:13mm;border-radius:50%;background:linear-gradient(135deg,#b88555,#8f5f3a);display:flex;align-items:center;justify-content:center}'
      + 'h1{margin:4mm 0 1.6mm;font:italic 500 10.5mm/1.02 "Cormorant Garamond",Georgia,serif;color:#16120f}'
      + '.hi{max-width:92mm;font-size:3.3mm;line-height:1.5;color:#776d63}'
      + '.when{display:flex;margin:6mm 0 4mm;border:.25mm solid #e3d3c0;border-radius:3.5mm;background:#fff;overflow:hidden}'
      + '.when>div{padding:4mm 8mm;display:flex;flex-direction:column;align-items:center;justify-content:center}'
      + '.when .d{border-right:.25mm solid #e3d3c0}'
      + '.when small{font-size:2.5mm;letter-spacing:.18em;text-transform:uppercase;color:#a0704a;font-weight:700}'
      + '.when b{font:500 14mm/1 "Cormorant Garamond",Georgia,serif;color:#16120f}'
      + '.when em{font-style:normal;font-size:3mm;color:#776d63}'
      + 'table{width:100%;border-collapse:collapse;margin-top:2mm;text-align:left}'
      + 'th{width:26%;padding:2.6mm 0;font-size:2.5mm;letter-spacing:.16em;text-transform:uppercase;color:#a0704a;font-weight:700;border-bottom:.2mm solid #ece4da;vertical-align:top}'
      + 'td{padding:2.4mm 0;font-size:3.5mm;font-weight:600;border-bottom:.2mm solid #ece4da;text-align:right}'
      + '.foot{margin-top:auto;width:100%;padding-top:5mm}'
      + '.note{font-size:2.9mm;line-height:1.5;color:#776d63;max-width:96mm;margin:0 auto}'
      + '.addr{margin-top:4mm;font-size:3mm;font-weight:600}.addr span{display:block;font-weight:400;color:#776d63;margin-top:.8mm}'
      + '.code{margin-top:4mm;font-size:2.5mm;letter-spacing:.22em;text-transform:uppercase;color:#b9a590}'
      + '.thanks{margin-top:3mm;font:italic 500 5mm/1 "Cormorant Garamond",Georgia,serif;color:#8f5f3a}'
      + '</style></head><body><div class="sheet"><div class="frame"></div><div class="in">'
      + '<div class="mono">M</div><div class="brand">Marta Andreolli</div><div class="tag">Studio de beleza</div>'
      + '<div class="orn"><i></i><b></b><i></i></div>'
      + (ok ? '<div class="seal"><svg viewBox="0 0 16 16" width="7mm" height="7mm" fill="none" stroke="#fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 8.5l3.2 3.2L13 4.5"/></svg></div>' : '')
      + '<h1>' + (ok ? 'Agendamento confirmado' : 'Agendamento reservado') + '</h1>'
      + '<p class="hi">' + (ok ? 'Tudo certo, ' + e(b.nome) + '! Seu horário está garantido. Apresente esta comanda ao chegar.' : 'Olá, ' + e(b.nome) + '. Seu horário está reservado e aguarda a confirmação do studio.') + '</p>'
      + '<div class="when"><div class="d"><small>' + e(MONN[dt.getMonth()].slice(0, 3)) + '</small><b>' + ('0' + dt.getDate()).slice(-2) + '</b><em>' + e(DAYN[dt.getDay()]) + '</em></div>'
      + '<div><small>Horário</small><b>' + e(b.t) + '</b><em>' + e(b.svcName || '') + '</em></div></div>'
      + '<table>' + rows + '</table>'
      + '<div class="foot"><p class="note">Chegue com alguns minutos de antecedência. Se houver qualquer imprevisto, avise com antecedência pelo WhatsApp para podermos reorganizar a agenda.</p>'
      + '<div class="addr">' + e(addr) + '<span>' + e(tel) + '</span></div>'
      + '<div class="thanks">Obrigada pela confiança</div>'
      + (code ? '<div class="code">Comanda nº ' + e(code) + '</div>' : '')
      + '</div></div></div></body></html>';
  };

  /* imprime sem abrir pop-up: escreve a comanda em um iframe invisível e chama print() */
  window.printComanda = function (b, o) {
    var f = document.createElement('iframe');
    f.setAttribute('aria-hidden', 'true');
    f.style.cssText = 'position:fixed;left:-10000px;top:0;width:794px;height:1123px;border:0';
    document.body.appendChild(f);
    var w = f.contentWindow, d = w.document;
    d.open(); d.write(window.comandaHTML(b, o)); d.close();
    var fontsReady = (d.fonts && d.fonts.ready) ? Promise.race([d.fonts.ready, new Promise(function (r) { setTimeout(r, 1800); })]) : Promise.resolve();
    setTimeout(function () {
      fontsReady.then(function () {
        try { w.focus(); w.print(); } catch (x) { window.UI ? UI.alert('Não foi possível abrir a impressão neste aparelho.', { kind: 'warn', title: 'Impressão indisponível' }) : null; }
        setTimeout(function () { if (f.parentNode) f.parentNode.removeChild(f); }, 60000);
      });
    }, 250);
  };
})();
