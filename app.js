const jobs = [...jobsAT, ...jobsDE, ...jobsCH, ...jobsLU, ...jobsPL];

const countryMeta = {
  AT: { name: 'Österreich', flag: '🇦🇹' },
  DE: { name: 'Deutschland', flag: '🇩🇪' },
  CH: { name: 'Schweiz', flag: '🇨🇭' },
  LU: { name: 'Luxemburg', flag: '🇱🇺' },
  PL: { name: 'Polen', flag: '🇵🇱' }
};

const companyWebsites = {
  'KUKA GmbH': 'https://www.kuka.com/de-at',
  'TMS Turnkey Manufacturing Solutions GmbH': 'https://www.valianttms.com/',
  'Wintersteiger Holding AG': 'https://www.wintersteiger.com/',
  'KNAPP': 'https://www.knapp.com/',
  'DCCS GmbH': 'https://www.dccs.eu/',
  'DS Automotion GmbH': 'https://www.ds-automotion.com/',
  'FERCHAU Austria GmbH': 'https://www.ferchau.com/at/de',
  'GTS Green Teuto Systemtechnik GmbH': 'https://www.gts-ibbenbueren.de/',
  'Laubinger & Rickmann GmbH & Co. KG': 'https://www.laubinger-rickmann.de/',
  'rbc robotics GmbH': 'https://www.rbc-robotics.de/',
  'traytec GmbH': 'https://www.traytec.de/',
  'JRK Automation GmbH': 'https://www.jrk-automation.de/',
  'SPS & CAD AUTOMATION P.O.G. GmbH': 'https://www.sps-cad.de/',
  'Jonas & Redmann Automationstechnik GmbH': 'https://www.jonas-redmann.com/',
  'ADITOR GmbH': 'https://www.aditor.de/',
  'INperfektion GmbH': 'https://www.inperfektion.de/',
  'NMH GmbH': 'https://www.nmh.de/',
  '2-Connect GmbH': 'https://www.2-connect.de/',
  'KRÖNING – Automation': 'https://www.kroening-automation.de/',
  'WMS-engineering Werkzeuge-Maschinen-Systeme GmbH': 'https://www.wms-engineering.de/',
  'FERCHAU': 'https://www.ferchau.com/de/de',
  'AGEB Elektrotechnik Marburg GmbH': 'https://www.ageb-elektrotechnik.de/',
  'über meinestadt.de': 'https://www.meinestadt.de/',
  'Fischer EKF GmbH & Co. KG': 'https://www.fischer-ekf.de/',
  'Sohns Maschinenbau GmbH': 'https://www.sohns-maschinenbau.de/',
  'Strautmann Systemtechnik': 'https://www.strautmann-systemtechnik.de/',
  'IAR Group AG': 'https://www.iargroup.com/',
  'Siemens Schweiz AG': 'https://www.siemens.com/ch/de.html',
  'ECT POLAND AUTOMATION Sp. z o.o.': 'http://ect-tech.com/en/channels/906.html',
  'ledniowski.com Michał Ledniowski': 'https://www.ledniowski.com/'
};

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
  body.innerHTML = filtered.map(j => {
    const companyUrl = companyWebsites[j.company];
    const companyHtml = companyUrl
      ? `<a class="company-link" href="${esc(companyUrl)}" target="_blank" rel="noopener noreferrer" title="Unternehmenswebsite öffnen">${esc(j.company)} ↗</a>`
      : esc(j.company);
    const country = countryMeta[j.country] || { name: j.country, flag: '' };
    return `
    <tr>
      <td class="country">${country.flag} ${country.name}</td>
      <td class="jobtitle"><a class="job-link" href="${esc(j.url)}" target="_blank" rel="noopener noreferrer" title="Originalausschreibung öffnen">${esc(j.title)} ↗</a></td>
      <td class="company">${companyHtml}</td>
      <td class="location">${esc(j.location)}</td>
      <td>${kukaLabel(j.kuka)}</td>
      <td>${matchLabel(j.match)}</td>
      <td class="focus">${esc(j.focus)}</td>
      <td class="conditions">${esc(j.conditions)}</td>
      <td><span class="small">${esc(j.freshness)}<br>Link geprüft: 16.07.2026</span></td>
    </tr>`;
  }).join('');
  const selected = countryMeta[selectedCountry];
  const countryText = selected ? ` in ${selected.name}` : '';
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

for (const code of Object.keys(countryMeta)) {
  const counter = document.getElementById(`count${code}`);
  if (counter) counter.textContent = jobs.filter(j => j.country === code).length;
}
document.getElementById('countKuka').textContent = jobs.filter(j => j.kuka !== 'no').length;
render();
