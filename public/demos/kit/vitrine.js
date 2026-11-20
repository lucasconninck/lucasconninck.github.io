/* vitrine.js — peças comuns dos sites de exemplo da thrustspike (19/11/2026)
 *
 * 1. Faixa no topo: "Site de exemplo feito pela thrustspike" + "Quero um assim".
 *    Some quando o exemplo abre dentro da prévia da página /links (iframe).
 * 2. Botões de WhatsApp do exemplo: o negócio é fictício, então o clique abre
 *    uma janelinha mostrando a mensagem que chegaria no WhatsApp do cliente
 *    de verdade, com o convite "Quero um site assim".
 *
 * Uso no exemplo:
 *   <a href="#" data-whats="Oi! Quero agendar um corte">Agendar</a>
 *   window.vitrine.whats('mensagem montada pelo carrinho')
 * Nada pisca nem fica em loop: só aparece e some quando a pessoa pede.
 */
(function () {
  'use strict'
  var QUIZ = 'https://lucaslimaweb.com.br/quiz/?utm_source=demo&utm_medium=site&utm_campaign='
  var HUB = 'https://lucaslimaweb.com.br/links/#sites'
  var slug = (location.pathname.match(/demos\/([^/]+)/) || [])[1] || 'exemplo'
  var naPrevia = false
  try { naPrevia = window.self !== window.top } catch (e) { naPrevia = true }
  var nomeNegocio = document.documentElement.getAttribute('data-negocio') || 'este negócio'

  var css = '' +
    '.vt-faixa{position:relative;z-index:60;display:flex;align-items:center;justify-content:center;gap:10px 14px;flex-wrap:wrap;' +
    'padding:9px 16px;background:#06100d;color:#e9efe9;font:500 13px/1.35 system-ui,-apple-system,"Segoe UI",Roboto,sans-serif;text-align:center}' +
    '.vt-faixa b{font-weight:700;color:#fff}.vt-faixa .vt-s{color:#9cc4a3}' +
    '.vt-faixa a{display:inline-flex;align-items:center;gap:6px;color:#06100d;background:#36e08a;border-radius:99px;padding:5px 12px;font-weight:700;text-decoration:none;white-space:nowrap}' +
    '.vt-faixa a:hover{background:#5beda2}' +
    '.vt-faixa .vt-volta{background:transparent;color:#e9efe9;border:1px solid rgba(233,239,233,.25)}' +
    '.vt-faixa .vt-volta:hover{background:rgba(233,239,233,.08)}' +
    '.vt-fundo{position:fixed;inset:0;z-index:9998;background:rgba(5,10,8,.62);display:flex;align-items:flex-end;justify-content:center;padding:16px;opacity:0;transition:opacity .2s ease}' +
    '.vt-fundo.vt-on{opacity:1}' +
    '@media (min-width:640px){.vt-fundo{align-items:center}}' +
    '.vt-caixa{width:100%;max-width:420px;background:#fbfaf6;color:#14201b;border-radius:22px;padding:22px 20px 18px;font:400 15px/1.5 system-ui,-apple-system,"Segoe UI",Roboto,sans-serif;' +
    'box-shadow:0 30px 80px rgba(0,0,0,.35);transform:translateY(16px);transition:transform .25s cubic-bezier(.2,.8,.2,1)}' +
    '.vt-on .vt-caixa{transform:none}' +
    /* cada exemplo tem estilos globais próprios (h2 gigante, caixa alta...): zera tudo dentro da janelinha */
    '.vt-caixa,.vt-caixa *{font-stretch:normal;text-transform:none;letter-spacing:normal;text-shadow:none;-webkit-text-stroke:0}' +
    '.vt-caixa .vt-tit{display:block;font:700 19px/1.28 system-ui,-apple-system,"Segoe UI",Roboto,sans-serif;margin:0 0 6px;color:#14201b;letter-spacing:-.01em}' +
    '.vt-caixa p{margin:0;color:#4a5751;font:400 15px/1.5 system-ui,-apple-system,"Segoe UI",Roboto,sans-serif}' +
    '.vt-caixa b{color:#14201b;font-weight:700}' +
    '.vt-chat{margin:16px 0;background:#e7ded3 url("data:image/svg+xml,%3Csvg xmlns=%27http://www.w3.org/2000/svg%27 width=%2740%27 height=%2740%27%3E%3Ccircle cx=%272%27 cy=%272%27 r=%271%27 fill=%27%23d6ccbf%27/%3E%3C/svg%3E");border-radius:16px;padding:14px 12px}' +
    '.vt-chat .vt-quem{display:flex;align-items:center;gap:8px;font-size:12.5px;font-weight:700;color:#3d4a44;margin-bottom:10px}' +
    '.vt-chat .vt-quem i{width:26px;height:26px;border-radius:50%;background:#25d366;display:grid;place-items:center;font-style:normal;color:#fff;font-size:13px}' +
    '.vt-balao{margin-left:auto;max-width:88%;background:#d9fdd3;border-radius:12px 12px 2px 12px;padding:9px 11px 6px;color:#111;font-size:14.5px;line-height:1.42;white-space:pre-line;box-shadow:0 1px 1px rgba(0,0,0,.08)}' +
    '.vt-balao small{display:block;text-align:right;font-size:11px;color:#667;margin-top:2px}' +
    '.vt-acoes{display:grid;gap:8px;margin-top:4px}' +
    '.vt-btn{display:flex;align-items:center;justify-content:center;gap:8px;min-height:50px;border-radius:14px;font-weight:700;font-size:15.5px;text-decoration:none;border:0;cursor:pointer;font-family:inherit}' +
    '.vt-btn.vt-p{background:#0b1a14;color:#fff}.vt-btn.vt-p:hover{background:#163126}' +
    '.vt-btn.vt-s2{background:transparent;color:#14201b;border:1px solid rgba(20,32,27,.18)}.vt-btn.vt-s2:hover{background:rgba(20,32,27,.05)}' +
    '.vt-marca{display:flex;align-items:center;gap:6px;justify-content:center;margin-top:12px;font-size:12px;color:#7a857f}' +
    '.vt-marca b{color:#14201b}' +
    '@media (prefers-reduced-motion:reduce){.vt-fundo,.vt-caixa{transition:none}}'

  function el(tag, attrs, html) {
    var n = document.createElement(tag)
    for (var k in attrs) n.setAttribute(k, attrs[k])
    if (html != null) n.innerHTML = html
    return n
  }
  function esc(t) { return String(t).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c] }) }

  function iniciar() {
    document.head.appendChild(el('style', { 'data-vitrine': '' }, css))
    if (!naPrevia && !/[?&]capa=1/.test(location.search)) {
      var faixa = el('div', { class: 'vt-faixa', role: 'note' },
        '<span><b>Site de exemplo</b> <span class="vt-s">· negócio fictício, feito pela thrustspike</span></span>' +
        '<span style="display:inline-flex;gap:8px"><a class="vt-volta" href="' + HUB + '">← Ver exemplos</a>' +
        '<a href="' + QUIZ + slug + '">Quero um site assim</a></span>')
      document.body.insertBefore(faixa, document.body.firstChild)
      // o topo fixo de cada exemplo usa top:var(--vt-top) e fica logo abaixo da faixa,
      // subindo junto conforme a faixa sai da tela
      var raiz = document.documentElement
      var ajusta = function () { raiz.style.setProperty('--vt-top', Math.max(0, faixa.getBoundingClientRect().bottom) + 'px') }
      ajusta()
      addEventListener('scroll', ajusta, { passive: true })
      addEventListener('resize', ajusta)
    }
    document.addEventListener('click', function (ev) {
      var alvo = ev.target.closest && ev.target.closest('[data-whats]')
      if (!alvo) return
      ev.preventDefault()
      abrir(alvo.getAttribute('data-whats'))
    })
  }

  var aberto = null, focoAntes = null
  function abrir(msg) {
    if (aberto) fechar()
    focoAntes = document.activeElement
    var hora = new Date(); var hh = ('0' + hora.getHours()).slice(-2) + ':' + ('0' + hora.getMinutes()).slice(-2)
    var fundo = el('div', { class: 'vt-fundo' })
    var caixa = el('div', { class: 'vt-caixa', role: 'dialog', 'aria-modal': 'true', 'aria-labelledby': 'vt-t' },
      '<strong class="vt-tit" id="vt-t">No site de verdade, este botão abre o WhatsApp</strong>' +
      '<p>' + esc(nomeNegocio) + ' é um negócio de exemplo. No seu site, o cliente toca aqui e a mensagem já chega pronta no <b>seu</b> WhatsApp:</p>' +
      '<div class="vt-chat"><div class="vt-quem"><i>✓</i>Mensagem que você receberia</div>' +
      '<div class="vt-balao">' + esc(msg || 'Oi! Vim pelo site e queria mais informações.') + '<small>' + hh + ' ✓✓</small></div></div>' +
      '<div class="vt-acoes"><a class="vt-btn vt-p" href="' + QUIZ + slug + '">Quero um site assim pro meu negócio</a>' +
      '<button type="button" class="vt-btn vt-s2" data-vt-fechar>Continuar vendo o exemplo</button></div>' +
      '<div class="vt-marca">Exemplo feito pela <b>thrustspike</b></div>')
    fundo.appendChild(caixa)
    fundo.addEventListener('click', function (e) { if (e.target === fundo || e.target.closest('[data-vt-fechar]')) fechar() })
    document.addEventListener('keydown', teclas)
    document.body.appendChild(fundo)
    aberto = fundo
    requestAnimationFrame(function () { fundo.classList.add('vt-on') })
    var b = caixa.querySelector('.vt-btn.vt-p'); if (b) b.focus({ preventScroll: true })
  }
  function teclas(e) {
    if (e.key === 'Escape') fechar()
    if (e.key === 'Tab' && aberto) {
      var f = aberto.querySelectorAll('a,button'); if (!f.length) return
      var p = f[0], u = f[f.length - 1]
      if (e.shiftKey && document.activeElement === p) { e.preventDefault(); u.focus() }
      else if (!e.shiftKey && document.activeElement === u) { e.preventDefault(); p.focus() }
    }
  }
  function fechar() {
    if (!aberto) return
    var n = aberto; aberto = null
    document.removeEventListener('keydown', teclas)
    n.classList.remove('vt-on')
    setTimeout(function () { n.remove() }, 200)
    if (focoAntes && focoAntes.focus) focoAntes.focus({ preventScroll: true })
  }

  window.vitrine = { whats: abrir }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', iniciar)
  else iniciar()
})()
