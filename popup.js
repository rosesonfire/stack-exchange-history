const _chrome = chrome
const root = 'https://stackoverflow.com/questions/'
const escp = (s) => s.slice(0).replace(/</, '&lt;').replace(/>/, '&gt;')
const getHistory = () =>
  new Promise((resolve, reject) => {
    try {
      const q = {text: root, startTime: 0, maxResults: 1000}
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
const c = (d) => d
const nc = (d) => d.toLowerCase()
const r = (s) => (d) => d.search(new RegExp(s)) !== -1
const nr = (s) => (d) => d.indexOf(s) !== -1
const getFltr = (p, casStrat, regxStrat) => a => regxStrat(casStrat(a[p]))
const filterData = (p, s, regx, cas) => data =>
  data
  .filter(a => a.url.indexOf(root) !== -1)
  .filter(getFltr(p, cas ? c : nc, regx ? r(s) : nr(s)))
const sortAsc = (p) => (a, b) => a[p] > b[p] ? -1 : 1
const sortDesc = (p) => (a, b) => a[p] < b[p] ? -1 : 1
const getSorter = (p, order) => order === 'asc' ? sortAsc(p) : sortDesc(p)
const sortData = (p, order) => dat => dat.slice(0).sort(getSorter(p, order))
const updateUI = (sites) => (data) => {
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
const disable = (search, loader, sites) =>
  new Promise((resolve, reject) => {
    search.setAttribute('disabled', true)
    loader.removeAttribute('hidden')
    sites.setAttribute('hidden', true)
    resolve()
  })
const enable = (search, loader, sites) => () => {
  search.removeAttribute('disabled')
  loader.setAttribute('hidden', true)
  sites.removeAttribute('hidden')
}
const reload = (sorter, fltr, fltrTxt, regx, cas, srch, loader, sites) => () =>
  disable(srch, loader, sites)
  .then(getHistory)
  .then(filterData(fltr.value, escp(fltrTxt.value), regx.checked, cas.checked))
  .then(sortData(sorter.value.split('-')[0], sorter.value.split('-')[1]))
  .then(updateUI(sites))
  .catch(e => console.log(e))
  .then(enable(srch, loader, sites))
document.addEventListener('DOMContentLoaded', () => {
  const sorter = document.getElementById('sorter')
  const flt = document.getElementById('filter')
  const fltTxt = document.getElementById('filter-text')
  const regex = document.getElementById('regex')
  const cas = document.getElementById('case')
  const search = document.getElementById('search')
  const loader = document.getElementById('loader')
  const sites = document.getElementById('sites')
  const rel = reload(sorter, flt, fltTxt, regex, cas, search, loader, sites)
  document.getElementById('search').addEventListener('click', rel)
})
// TODO: other stack exchanges
// TODO: Remember sort preferances
// TODO: use chrome app instead of extension
// TODO: update css like stackoverflow
// TODO: not all history loading
// TODO: icon in chrome://extensions
// TODO: show total search result count
// TODO: filter by time (from, to)
// TODO: customize show max result limit
