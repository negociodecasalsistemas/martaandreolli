/* Busca dados do perfil no Google (Places API New) e guarda em cache no Firestore.
   Só roda com um administrador logado (a chave fica privada em site/google, nunca vai para visitantes).
   Proteções para ficar sempre no gratuito: 1 consulta por intervalo (padrão 24 h) e teto de 900 consultas/mês. */
window.googleSync = async function (db, force) {
  var gs = await db.doc('site/google').get();
  if (!gs.exists) return { skipped: 'Google não configurado' };
  var g = gs.data();
  if (!g.enabled || !g.apiKey || !g.placeId) return { skipped: 'desligado' };
  var cur = await db.doc('site/gdata').get(), c = cur.exists ? cur.data() : {};
  var every = (g.everyHours || 24) * 36e5;
  if (!force && Date.now() - (c.fetchedAt || 0) < every) return { skipped: 'cache ainda válido' };
  var d = new Date(), mk = d.getFullYear() + '-' + (d.getMonth() + 1), calls = c.month === mk ? (c.calls || 0) : 0;
  if (calls >= 900) throw new Error('Limite de segurança do mês atingido (900 consultas). Volta no mês que vem para continuar no gratuito.');
  var fields = 'displayName,formattedAddress,nationalPhoneNumber,internationalPhoneNumber,rating,userRatingCount,regularOpeningHours.weekdayDescriptions,websiteUri,googleMapsUri,reviews';
  var r = await fetch('https://places.googleapis.com/v1/places/' + encodeURIComponent(g.placeId) + '?languageCode=pt-BR', {
    headers: { 'X-Goog-Api-Key': g.apiKey, 'X-Goog-FieldMask': fields }
  });
  if (!r.ok) { var j = await r.json().catch(function () { return {}; }); throw new Error('Google ' + r.status + ': ' + ((j.error && j.error.message) || 'erro')); }
  var p = await r.json();
  var data = {
    name: (p.displayName && p.displayName.text) || '', address: p.formattedAddress || '',
    phone: p.nationalPhoneNumber || '', intl: p.internationalPhoneNumber || '',
    rating: p.rating == null ? null : p.rating, count: p.userRatingCount || 0,
    hours: (p.regularOpeningHours && p.regularOpeningHours.weekdayDescriptions) || [],
    website: p.websiteUri || '', mapsUri: p.googleMapsUri || '',
    reviews: (p.reviews || []).map(function (v) {
      return { n: (v.authorAttribution && v.authorAttribution.displayName) || '', photo: (v.authorAttribution && v.authorAttribution.photoUri) || '',
        s: v.rating || 5, t: (v.text && v.text.text) || (v.originalText && v.originalText.text) || '', when: v.relativePublishTimeDescription || '' };
    })
  };
  await db.doc('site/gdata').set({ enabled: true, data: data, fetchedAt: Date.now(), month: mk, calls: calls + 1 });
  return { ok: true, data: data };
};
