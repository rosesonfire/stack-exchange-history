const _chrome = chrome
const root = 'https://stackoverflow.com/questions/'
const getHistory = (s, f, t) => () => new Promise((resolve, reject) => {
  try {
    const q = { text: s || root, startTime: f, endTime: t, maxResults: 100000 }
    _chrome.history.search(q, data => {
      try {
        const filteredData = data.filter(a => a.url.indexOf(root) !== -1)
        filteredData.forEach(item => {
          const spltResult = item.title.split('-')
          item.subject = spltResult.length < 3 ? '' : spltResult[0].trim()
          item.question = spltResult[spltResult.length - 2].trim()
        })
        resolve(filteredData)
      } catch (e) { reject(e) }
    })
  } catch (e) { reject(e) }
})
const c = d => d
const nc = d => d.toLowerCase()
const r = s => d => d.search(new RegExp(s)) !== -1
const nr = s => d => d.indexOf(s) !== -1
const getFltr = (p, casStrat, regxStrat) => a => regxStrat(casStrat(a[p]))
const filterData = (p, s, regx, cas) => data =>
  data
  .filter(getFltr(p, cas ? c : nc, regx ? r(s) : nr(s)))
const limitData = limit => data => data.slice(0, limit)
const sortAsc = p => (a, b) => a[p] > b[p] ? -1 : 1
const sortDesc = p => (a, b) => a[p] < b[p] ? -1 : 1
const getSorter = (p, order) => order === 'asc' ? sortAsc(p) : sortDesc(p)
const sortData = (p, order) => dat => dat.slice(0).sort(getSorter(p, order))
const escp = s => s.slice(0).replace(/</, '&lt;').replace(/>/, '&gt;')
const createRow = (item, i) => {
  const tr = document.createElement('tr')
  const sl = document.createElement('td')
  const subject = document.createElement('td')
  const question = document.createElement('td')
  const count = document.createElement('td')
  const last = document.createElement('td')
  const a = document.createElement('a')
  sl.innerHTML = i + 1
  subject.innerHTML = escp(item.subject)
  a.innerHTML = escp(item.question)
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
  return tr
}
const updateUI = sites => data => {
  const table = document.createElement('table')
  sites.innerHTML = `<span>${data.length} results found</span>`
  table.innerHTML =
    `<tr>
      <th>Sl</th>
      <th>Subject</th>
      <th>Question</th>
      <th>Visit count</th>
      <th>Last visited</th>
    </tr>`
  data.forEach((item, i) => table.appendChild(createRow(item, i)))
  sites.appendChild(table)
}
const verify = (f, t) => new Promise((resolve, reject) => {
  try {
    t - f > 2592000000 // 30 days
      ? (window.confirm('Searching long time span may be slow. Continue?')
        ? resolve()
        : reject(new Error('limit error')))
      : resolve()
  } catch (e) { reject(e) }
})
const disable = (search, loader, sites) => () => {
  search.setAttribute('disabled', true)
  loader.removeAttribute('hidden')
  sites.setAttribute('hidden', true)
}
const enable = (search, loader, sites) => () => {
  search.removeAttribute('disabled')
  loader.setAttribute('hidden', true)
  sites.removeAttribute('hidden')
}
const getTime = tm => new Date(tm).getTime()
const addADay = tm => tm + 86400000
const reload = (srt, flt, fltT, regx, cas, f, t, srch, ldr, sites, lmt) => () =>
  verify(getTime(f.value), addADay(getTime(t.value)))
  .then(disable(srch, ldr, sites))
  .then(getHistory(fltT.value, getTime(f.value), addADay(getTime(t.value))))
  .then(filterData(flt.value, fltT.value, regx.checked, cas.checked))
  .then(limitData(parseInt(lmt.value)))
  .then(sortData(srt.value.split('-')[0], srt.value.split('-')[1]))
  .then(updateUI(sites))
  .catch(e => console.log(e))
  .then(enable(srch, ldr, sites))
  .catch(e => console.log(e))
const z = (t) => `${t}`.length === 1 ? `0${t}` : `${t}`
const dSt = (t) => `${t.getFullYear()}-${z(t.getMonth() + 1)}-${z(t.getDate())}`
const initializeUI = (from, to) => {
  const dt = new Date()
  to.value = dSt(dt)
  dt.setDate(dt.getDate() - 7)
  from.value = dSt(dt)
}
document.addEventListener('DOMContentLoaded', () => {
  const srtr = document.getElementById('sorter')
  const flt = document.getElementById('filter')
  const fltT = document.getElementById('filter-text')
  const regx = document.getElementById('regex')
  const cas = document.getElementById('case')
  const f = document.getElementById('from')
  const t = document.getElementById('to')
  const srch = document.getElementById('search')
  const ldr = document.getElementById('loader')
  const sites = document.getElementById('sites')
  const limit = document.getElementById('limit')
  const rel = reload(srtr, flt, fltT, regx, cas, f, t, srch, ldr, sites, limit)
  initializeUI(f, t)
  document.getElementById('search').addEventListener('click', rel)
})
// TODO: other stack exchanges
// TODO: Remember all preferances
// TODO: use chrome app instead of extension
// TODO: update css like stackoverflow
// TODO: icon in chrome://extensions
// TODO: sort by date
