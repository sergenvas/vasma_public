const jobs = [...jobsAT, ...jobsDE, ...jobsCH, ...jobsLU, ...jobsPL];

const countryMeta = {
  AT: {name:'Österreich', flag:'🇦🇹'},
  DE: {name:'Deutschland', flag:'🇩🇪'},
  CH: {name:'Schweiz', flag:'🇨🇭'},
  LU: {name:'Luxemburg', flag:'🇱🇺'},
  PL: {name:'Polen', flag:'🇵🇱'}
};

const companyWebsites = {
  'KUKA GmbH':'https://www.kuka.com/de-at',
  'TMS Turnkey Manufacturing Solutions GmbH':'https://www.valianttms.com/',
  'Wintersteiger Holding AG':'https://www.wintersteiger.com/',
  'ETEC Automatisierungstechnik Ges.m.b.H.':'https://www.etec.tirol/',
  'HEITEC Systemtechnik Österreich':'https://www.heitec.de/unternehmen/standorte/ardagger-stift',
  'FREY Automation GmbH':'https://www.frey-automation.at/',
  'SPS Technik GmbH':'https://www.sps.at/de/',
  'KNAPP':'https://www.knapp.com/',
  'DCCS GmbH':'https://www.dccs.eu/',
  'DS Automotion GmbH':'https://www.ds-automotion.com/',
  'FERCHAU Austria GmbH':'https://www.ferchau.com/at/de',
  'GTS Green Teuto Systemtechnik GmbH':'https://www.gts-ibbenbueren.de/',
  'Laubinger & Rickmann GmbH & Co. KG':'https://www.laubinger-rickmann.de/',
  'rbc robotics GmbH':'https://www.rbc-robotics.de/',
  'traytec GmbH':'https://www.traytec.de/',
  'JRK Automation GmbH':'https://www.jrk-automation.de/',
  'SPS & CAD AUTOMATION P.O.G. GmbH':'https://www.sps-cad.de/',
  'Jonas & Redmann Automationstechnik GmbH':'https://www.jonas-redmann.com/',
  'ADITOR GmbH':'https://www.aditor.de/',
  'INperfektion GmbH':'https://www.inperfektion.de/',
  'NMH GmbH':'https://www.nmh.de/',
  '2-Connect GmbH':'https://www.2-connect.de/',
  'Baumann GmbH':'https://www.baumann-automation.com/',
  'BEWA solutions GmbH':'https://www.bewa-solutions.de/',
  'HAHN Automation Group GmbH':'https://www.hahnautomation.group/',
  'Maschinenfabrik Berthold HERMLE AG':'https://www.hermle.de/',
  'KRÖNING – Automation':'https://www.kroening-dohna.de/',
  'WMS-engineering Werkzeuge-Maschinen-Systeme GmbH':'https://www.wms-engineering.de/',
  'FERCHAU':'https://www.ferchau.com/de/de',
  'AGEB Elektrotechnik Marburg GmbH':'https://www.ageb-elektrotechnik.de/',
  'über meinestadt.de':'https://www.meinestadt.de/',
  'Fischer EKF GmbH & Co. KG':'https://www.fischer-ekf.de/',
  'Sohns Maschinenbau GmbH':'https://www.sohns-maschinenbau.de/',
  'Strautmann Systemtechnik':'https://www.strautmann-systemtechnik.de/',
  'IAR Group AG':'https://www.iargroup.com/',
  'Siemens Schweiz AG':'https://www.siemens.com/ch/de.html',
  'I/O TECH sp. z o.o.':'https://iotech.com.pl/',
  'ECT POLAND AUTOMATION Sp. z o.o.':'http://ect-tech.com/en/channels/906.html',
  'PROPOINT S.A.':'https://www.propoint.pl/',
  'Robot Partner Sp. z o.o.':'https://www.robotpartner.pl/',
  'ROBOTPOL ROBOTYZACJA PRZEMYSŁU':'https://robotpol.pl/',
  'ledniowski.com Michał Ledniowski':'https://www.ledniowski.com/'
};

const body = document.getElementById('jobsBody');
const search = document.getElementById('search');
const kukaOnly = document.getElementById('kukaOnly');
const buttons = [...document.querySelectorAll('[data-country]')];
const resultline = document.getElementById('resultline');
const empty = document.getElementById('empty');
let selectedCountry = 'all';

function esc(value) {
  return String(value).replace(/[&<>'"]/g, char => ({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[char]));
}

function kukaLabel(value) {
  if (value === 'employer') return '<span class="badge kuka">KUKA-Arbeitgeber</span>';
  if (value === 'partner_explicit') return '<span class="badge kuka">Systempartner + KUKA</span>';
  if (value === 'partner') return '<span class="badge kuka">KUKA-Systempartner</span>';
  if (value === 'yes') return '<span class="badge kuka">KUKA ausdrücklich</span>';
  return '<span class="badge neutral">Nicht genannt</span>';
}

function matchLabel(value) {
  return value === 'direct'
    ? '<span class="badge direct">Direkttreffer</span>'
    : '<span class="badge extended">Erweiterter Treffer</span>';
}

function carLabel(value) {
  if (value === 'private') {
    return '<span class="car-marker" role="img" aria-label="Firmenwagen auch zur Privatnutzung" title="Firmenwagen – auch zur Privatnutzung">🚗</span>';
  }
  if (value === 'service') {
    return '<span class="car-marker" role="img" aria-label="Dienst- oder Servicefahrzeug für Außeneinsätze" title="Dienst-/Servicefahrzeug für Außeneinsätze">🚗</span>';
  }
  return '';
}

function render() {
  const query = search.value.trim().toLocaleLowerCase('de');
  const filtered = jobs.filter(job => {
    const countryOk = selectedCountry === 'all' || job.country === selectedCountry;
    const kukaOk = !kukaOnly.checked || job.kuka !== 'no';
    const vehicleText = job.car ? 'dienstfahrzeug firmenwagen servicefahrzeug auto' : '';
    const text = `${job.title} ${job.company} ${job.location} ${job.focus} ${job.conditions} ${vehicleText}`.toLocaleLowerCase('de');
    return countryOk && kukaOk && (!query || text.includes(query));
  });

  body.innerHTML = filtered.map(job => {
    const companyUrl = companyWebsites[job.company];
    const company = companyUrl
      ? `<a class="company-link" href="${esc(companyUrl)}" target="_blank" rel="noopener noreferrer">${esc(job.company)} ↗</a>`
      : esc(job.company);
    const country = countryMeta[job.country] || {name:job.country, flag:''};
    return `<tr>
      <td class="country">${country.flag} ${country.name}</td>
      <td class="jobtitle"><a class="job-link" href="${esc(job.url)}" target="_blank" rel="noopener noreferrer">${esc(job.title)} ↗</a></td>
      <td class="company">${company}</td>
      <td class="location">${esc(job.location)}</td>
      <td>${kukaLabel(job.kuka)}</td>
      <td>${matchLabel(job.match)}</td>
      <td class="focus">${esc(job.focus)}</td>
      <td class="conditions">${esc(job.conditions)}</td>
      <td class="car-cell">${carLabel(job.car)}</td>
      <td><span class="small">${esc(job.freshness)}<br>Link geprüft: 16.07.2026</span></td>
    </tr>`;
  }).join('');

  const selected = countryMeta[selectedCountry];
  const countryText = selected ? ` in ${selected.name}` : '';
  const kukaText = kukaOnly.checked ? ' mit KUKA-Bezug oder bei KUKA-Systempartnern' : '';
  resultline.textContent = `${filtered.length} Treffer${countryText}${kukaText}`;
  empty.style.display = filtered.length ? 'none' : 'block';
  document.querySelector('.scroll').style.display = filtered.length ? 'block' : 'none';
}

buttons.forEach(button => button.addEventListener('click', () => {
  selectedCountry = button.dataset.country;
  buttons.forEach(item => item.classList.toggle('active', item === button));
  render();
}));
search.addEventListener('input', render);
kukaOnly.addEventListener('change', render);

Object.keys(countryMeta).forEach(code => {
  const counter = document.getElementById(`count${code}`);
  if (counter) counter.textContent = jobs.filter(job => job.country === code).length;
});
document.getElementById('countKuka').textContent = jobs.filter(job => job.kuka !== 'no').length;
render();