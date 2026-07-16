const jobs = [...jobsAT, ...jobsDE];

const body = document.getElementById('jobsBody');
const search = document.getElementById('search');
const kukaOnly = document.getElementById('kukaOnly');
const buttons = [...document.querySelectorAll('[data-country]')];
const resultline = document.getElementById('resultline');
const empty = document.getElementById('empty');
let selectedCountry = 'all';

function esc(value) {
  return String(value).replace(/[&<>'"]/g, ch => ({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[ch]));
}
function kukaLabel(v) {
  if (v === 'employer') return '<span class="badge kuka">KUKA-Arbeitgeber</span>';
  if (v === 'yes') return '<span class="badge kuka">Ja, ausdrücklich</span>';
  return '<span class="badge neutral">Nicht genannt</span>';
}
function matchLabel(v) {
  return v === 'direct' ? '<span class="badge direct">Direkttreffer</span>' : '<span class="badge extended">Erweiterter Treffer</span>';
}
function render() {
  const q = search.value.trim().toLocaleLowerCase('de');
  const onlyKuka = kukaOnly.checked;
  const filtered = jobs.filter(j => {
    const countryOk = selectedCountry === 'all' || j.country === selectedCountry;
    const kukaOk = !onlyKuka || j.kuka !== 'no';
    const hay = `${j.title} ${j.company} ${j.location} ${j.focus} ${j.conditions}`.toLocaleLowerCase('de');
    return countryOk && kukaOk && (!q || hay.includes(q));
  });
  body.innerHTML = filtered.map(j => `
    <tr>
      <td class="country">${j.country === 'AT' ? '🇦🇹 Österreich' : '🇩🇪 Deutschland'}</td>
      <td class="jobtitle">${esc(j.title)}</td>
      <td class="company">${esc(j.company)}</td>
      <td class="location">${esc(j.location)}</td>
      <td>${kukaLabel(j.kuka)}</td>
      <td>${matchLabel(j.match)}</td>
      <td class="focus">${esc(j.focus)}</td>
      <td class="conditions">${esc(j.conditions)}</td>
      <td><span class="small">${esc(j.freshness)}<br>Link geprüft: 16.07.2026</span></td>
      <td><a class="apply" href="${esc(j.url)}" target="_blank" rel="noopener noreferrer">Ausschreibung ↗</a></td>
    </tr>`).join('');
  const countryText = selectedCountry === 'AT' ? ' in Österreich' : selectedCountry === 'DE' ? ' in Deutschland' : '';
  resultline.textContent = `${filtered.length} Treffer${countryText}${onlyKuka ? ' mit KUKA-Bezug' : ''}`;
  empty.style.display = filtered.length ? 'none' : 'block';
  document.querySelector('.scroll').style.display = filtered.length ? 'block' : 'none';
}
buttons.forEach(btn => btn.addEventListener('click', () => {
  selectedCountry = btn.dataset.country;
  buttons.forEach(b => b.classList.toggle('active', b === btn));
  render();
}));
search.addEventListener('input', render);
kukaOnly.addEventListener('change', render);

document.getElementById('countAT').textContent = jobs.filter(j => j.country === 'AT').length;
document.getElementById('countDE').textContent = jobs.filter(j => j.country === 'DE').length;
document.getElementById('countKuka').textContent = jobs.filter(j => j.kuka !== 'no').length;
render();
