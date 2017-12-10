const _chrome = chrome
const root = 'https://stackoverflow.com/questions/'
const escp = (s) => s.slice(0).replace(/</, '&lt;').replace(/>/, '&gt;')
const getHistory = () => new Promise((resolve, reject) => {
  try {
    const q = {text: root, maxResults: 1000}
    _chrome.history.search(q, data => {
      data.forEach(item => {
        const spltResult = item.title.split('-')
        item.subject = escp(spltResult.length < 3 ? '' : spltResult[0].trim())
        item.question = escp(spltResult[spltResult.length - 2].trim())
      })
      resolve(data)
    })
  } catch (e) { reject(e) }
})
const ft1 = (prop, s) => a => a[prop].search(new RegExp(s)) !== -1
const ft2 = (prop, s) => a => a[prop].indexOf(s) !== -1
const ft3 = (prop, s) => a => a[prop].toLowerCase().search(new RegExp(s)) !== -1
const ft4 = (prop, s) => a => a[prop].toLowerCase().indexOf(s) !== -1
const getFilter = (regx, cas, p, s) => cas
  ? (regx ? ft1(p, s) : ft2(p, s))
  : (regx ? ft3(p, s.toLowerCase()) : ft4(p, s.toLowerCase()))
const filterData = (flt, fltTxt, regx, cas) => data => data
  .filter(a => a.url.indexOf(root) !== -1)
  .filter(getFilter(regx.checked, cas.checked, flt.value, escp(fltTxt.value)))
const sAsc = (prop) => (a, b) => a[prop] > b[prop] ? -1 : 1
const sDesc = (prop) => (a, b) => a[prop] < b[prop] ? -1 : 1
const getSrt = (prop, order) => order === 'asc' ? sAsc(prop) : sDesc(prop)
const sortData = (prop, order) => dat => dat.slice(0).sort(getSrt(prop, order))
const updateUI = (data) => {
  const sites = document.getElementById('sites')
  const table = document.createElement('table')
  sites.innerHTML = ''
  table.innerHTML =
    `<tr>
      <th>Sl</th>
      <th>Subject</th>
      <th>Question</th>
      <th>Visit count</th>
      <th>Last visited</th>
    </tr>`
  data.forEach((item, i) => {
    const tr = document.createElement('tr')
    const sl = document.createElement('td')
    const subject = document.createElement('td')
    const question = document.createElement('td')
    const count = document.createElement('td')
    const last = document.createElement('td')
    const a = document.createElement('a')
    sl.innerHTML = i + 1
    subject.innerHTML = item.subject
    a.innerHTML = item.question
    a.href = item.url
    a.setAttribute('target', '_blank')
    question.appendChild(a)
    count.innerHTML = item.visitCount
    last.innerHTML = new Date(item.lastVisitTime)
    tr.appendChild(sl)
    tr.appendChild(subject)
    tr.appendChild(question)
    tr.appendChild(count)
    tr.appendChild(last)
    table.appendChild(tr)
  })
  sites.appendChild(table)
}
const reload = (sorter, filter, filterText, regex, cas) => () => getHistory()
  .then(filterData(filter, filterText, regex, cas))
  .then(sortData(sorter.value.split('-')[0], sorter.value.split('-')[1]))
  .then(updateUI)
  .catch(e => console.log(e))
document.addEventListener('DOMContentLoaded', () => {
  const sorter = document.getElementById('sorter')
  const filter = document.getElementById('filter')
  const filterText = document.getElementById('filter-text')
  const regex = document.getElementById('regex')
  const cas = document.getElementById('case')
  const rel = reload(sorter, filter, filterText, regex, cas)
  document.getElementById('search-button').addEventListener('click', rel)
  document.addEventListener('keypress', (e) => e.charCode === 13 ? rel() : null)
})
// TODO: other stack exchanges
// TODO: Remember sort preferances
// TODO: use chrome app instead of extension
// TODO: update css
// TODO: not all history loading
// TODO: icon in chrome://extensions
