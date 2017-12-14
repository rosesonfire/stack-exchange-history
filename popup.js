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
const r = (d, s) => d.search(new RegExp(s)) !== -1
const nr = (d, s) => d.indexOf(s) !== -1
const getFltr = (p, s, casStrat, regxStrat) => a =>
  regxStrat(casStrat(a[p]), casStrat(s))
const filterData = (p, s, regx, cas) => data =>
  s ? data.filter(getFltr(p, s, cas ? c : nc, regx ? r : nr)) : data
const limitData = limit => data => data.slice(0, limit)
const sortAsc = p => (a, b) => a[p] > b[p] ? -1 : 1
const sortDesc = p => (a, b) => a[p] < b[p] ? -1 : 1
const getSorter = (p, order) => order === 'asc' ? sortAsc(p) : sortDesc(p)
const sortData = (p, order) => data => data.slice(0).sort(getSorter(p, order))
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
const verifySearch = (f, t) => new Promise((resolve, reject) => {
  try {
    t - f > 2592000000 // 30 days
      ? (window.confirm('Searching long time span may be slow. Continue?')
        ? resolve() : reject(new Error('limit error')))
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
const getTime = tm => new Date(tm + ' 00:00:00').getTime()
const addADay = tm => tm + 86400000
const reload = (srt, flt, fltT, regx, cas, f, t, srch, ldr, sites, lmt) => () =>
  verifySearch(getTime(f.value), addADay(getTime(t.value)))
  .then(disable(srch, ldr, sites))
  .then(getHistory(fltT.value, getTime(f.value), addADay(getTime(t.value))))
  .then(filterData(flt.value, fltT.value, regx.checked, cas.checked))
  .then(sortData(srt.value.split('-')[0], srt.value.split('-')[1]))
  .then(limitData(parseInt(lmt.value)))
  .then(updateUI(sites))
  .catch(e => console.log(e))
  .then(enable(srch, ldr, sites))
  .catch(e => console.log(e))
const verifySave = () => new Promise((resolve, reject) => {
  try {
    window.confirm('Save current search configuration?')
    ? resolve() : reject(new Error('Save verification declined'))
  } catch (e) { reject(e) }
})
const storePreferences = (srtr, flt, fltT, regx, cas, from, to, limit) => () =>
  new Promise((resolve, reject) => {
    try {
      _chrome.storage.sync.clear()
      _chrome.storage.sync.set({
        sorter: srtr,
        filter: flt,
        filterText: fltT,
        regex: regx,
        caseSensitive: cas,
        from: from,
        to: to,
        limit: limit
      }, () => resolve())
    } catch (e) { reject(e) }
  })
const savePreferences = (srtr, flt, fltT, regx, cas, from, to, limit) => () => {
  verifySave()
  .then(storePreferences(srtr.value, flt.value, fltT.value, regx.checked,
    cas.checked, from.value, to.value, limit.value))
  .catch(e => console.log(e))
}
const z = (t) => `${t}`.length === 1 ? `0${t}` : `${t}`
const dSt = (t) => `${t.getFullYear()}-${z(t.getMonth() + 1)}-${z(t.getDate())}`
const restorePreferences = (srtr, flt, fltT, regx, cas, from, to, limit) =>
  new Promise((resolve, reject) => {
    try {
      _chrome.storage.sync.get(['sorter', 'filter', 'filterText', 'regex',
        'caseSensitive', 'from', 'to', 'limit'], res => {
        try {
          const dt = new Date()
          to.value = res.to || dSt(dt)
          dt.setDate(dt.getDate() - 7)
          from.value = res.from || dSt(dt)
          srtr.value = res.sorter || 'visitCount-asc'
          flt.value = res.filter || 'question'
          fltT.value = res.filterText || ''
          regx.checked = res.regex || false
          cas.checked = res.caseSensitive || false
          limit.value = res.limit || 10
          resolve()
        } catch (e) { reject(e) }
      })
    } catch (e) { reject(e) }
  })
const initialize = (srch, save, rel, srtr, flt, fltT, regx, cas, f, t, lmt) => {
  restorePreferences(srtr, flt, fltT, regx, cas, f, t, lmt)
  .then(() => {
    srch.addEventListener('click', rel)
    save.addEventListener('click',
      savePreferences(srtr, flt, fltT, regx, cas, f, t, lmt))
  })
  .catch(e => console.log(e))
}
document.addEventListener('DOMContentLoaded', () => {
  const srtr = document.getElementById('sorter')
  const flt = document.getElementById('filter')
  const fltT = document.getElementById('filter-text')
  const regx = document.getElementById('regex')
  const cas = document.getElementById('case')
  const frm = document.getElementById('from')
  const to = document.getElementById('to')
  const srch = document.getElementById('search')
  const ldr = document.getElementById('loader')
  const sites = document.getElementById('sites')
  const lmt = document.getElementById('limit')
  const save = document.getElementById('save')
  const rel = reload(srtr, flt, fltT, regx, cas, frm, to, srch, ldr, sites, lmt)
  initialize(srch, save, rel, srtr, flt, fltT, regx, cas, frm, to, lmt)
})
// TODO: === FIRST EPOC ===
// TODO: other stack exchanges
// TODO: update css like stackoverflow
// TODO: refactor
// TODO: reset preferences
// TODO: make limit optional
// TODO: update readme
// TODO: screenshots
// TODO: === SECOND EPOC ===
// TODO: use chrome app instead of extension
// TODO: remove items from history
// TODO: export history
// TODO: import history
// TODO: click on table header to sort, AFTER LIMIT HAS BEEN APPLIED
// TODO: remember searching long span setting (will it be safe?)
// TODO: make filter optional (will not really add any functionality)
