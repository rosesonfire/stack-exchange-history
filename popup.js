const _chrome = chrome
const root = 'https://stackoverflow.com/questions/'

// ===== Search history ========

const getHistory = (text = root, { startTime, endTime }) => () =>
  new Promise((resolve, reject) => {
    try {
      const query = { text, startTime, endTime, maxResults: 100000 }
      _chrome.history.search(query, dat => {
        try {
          const filteredData = dat.filter(({ url }) => url.indexOf(root) !== -1)
          filteredData.forEach(item => {
            const splitResult = item.title.split('-')
            item.subject = splitResult.length < 3 ? '' : splitResult[0].trim()
            item.question = splitResult[splitResult.length - 2].trim()
          })
          resolve(filteredData)
        } catch (e) { reject(e) }
      })
    } catch (e) { reject(e) }
  })

// ==== Filter =============

const caseSensitiveStrategy = d => d
const caseInsenstiveStrategy = d => d.toLowerCase()
const getCaseStrategy = isCaseSensitive =>
  isCaseSensitive ? caseSensitiveStrategy : caseInsenstiveStrategy
const regexStrategy = (d, s) => d.search(new RegExp(s)) !== -1
const plainTextStrategy = (d, s) => d.indexOf(s) !== -1
const getTextTypeStrategy = isRegex =>
  isRegex ? regexStrategy : plainTextStrategy
const getFilter = (prop, filterText, caseStrategy, textTypeStrategy) => item =>
  textTypeStrategy(caseStrategy(item[prop]), caseStrategy(filterText))
const filterData = (property, filterText, isRegex, isCaseSensitive) => data =>
  filterText ? data.filter(getFilter(property, filterText,
    getCaseStrategy(isCaseSensitive), getTextTypeStrategy(isRegex))) : data

// ======= Sort =======

const sortAsc = property => (item1, item2) =>
  item1[property] > item2[property] ? -1 : 1
const sortDesc = property => (item1, item2) =>
  item1[property] < item2[property] ? -1 : 1
const getSorter = (property, order) =>
  order === 'asc' ? sortAsc(property) : sortDesc(property)
const sortData = (property, order) => data =>
  data.slice(0).sort(getSorter(property, order))

// ======= Limit =============

const limitData = limit => data => data.slice(0, limit)

// ======= Update UI ===========

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
const escape = s => s.slice(0).replace(/</, '&lt;').replace(/>/, '&gt;')
const creatRow = ({ subject, question, url, visitCount, lastVisitTime }, i) => {
  const tr = document.createElement('tr')
  const sl = document.createElement('td')
  const subjectE = document.createElement('td')
  const questionE = document.createElement('td')
  const count = document.createElement('td')
  const last = document.createElement('td')
  const a = document.createElement('a')
  sl.innerHTML = i + 1
  subjectE.innerHTML = escape(subject)
  a.innerHTML = escape(question)
  a.href = url
  a.setAttribute('target', '_blank')
  questionE.appendChild(a)
  count.innerHTML = visitCount
  last.innerHTML = new Date(lastVisitTime)
  tr.appendChild(sl)
  tr.appendChild(subjectE)
  tr.appendChild(questionE)
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
  data.forEach((item, index) => table.appendChild(creatRow(item, index)))
  sites.appendChild(table)
}

// ===== Reload =======

const verifySearch = ({ startTime, endTime }) =>
new Promise((resolve, reject) => {
  try {
    endTime - startTime > 2592000000 // 30 days
    ? (window.confirm('Searching long time span may be slow. Continue?')
      ? resolve() : reject(new Error('limit error')))
    : resolve()
  } catch (e) { reject(e) }
})
const getTime = tm => new Date(tm + ' 00:00:00').getTime()
const addADay = tm => tm + 86400000
const getTRange = (tm1, tm2) =>
  ({ startTime: getTime(tm1), endTime: addADay(getTime(tm2)) })
const reload = ({ startTime, endTime, search, loader, sites, filter, filterText,
  regex, caseSensitive, sorter, limit }) => () =>
  verifySearch(getTRange(startTime.value, endTime.value))
  .then(disable(search, loader, sites))
  .then(getHistory(filterText.value, getTRange(startTime.value, endTime.value)))
  .then(filterData(filter.value, filterText.value, regex.checked,
    caseSensitive.checked))
  .then(sortData(sorter.value.split('-')[0], sorter.value.split('-')[1]))
  .then(limitData(parseInt(limit.value)))
  .then(updateUI(sites))
  .catch(e => console.log(e))
  .then(enable(search, loader, sites))
  .catch(e => console.log(e))

// ========== Save preferences ==================

const verifySave = () => new Promise((resolve, reject) => {
  try {
    window.confirm('Save current search configuration?')
    ? resolve() : reject(new Error('Save verification declined'))
  } catch (e) { reject(e) }
})
const storePreferences = ({ sorter, filter, filterText, regex, caseSensitive,
  startTime, endTime, limit }) => () => new Promise((resolve, reject) => {
    try {
      _chrome.storage.sync.clear()
      _chrome.storage.sync.set({
        sorter: sorter.value,
        filter: filter.value,
        filterText: filterText.value,
        regex: regex.checked,
        caseSensitive: caseSensitive.checked,
        startTime: startTime.value,
        endTime: endTime.value,
        limit: limit.value
      }, () => resolve())
    } catch (e) { reject(e) }
  })
const savePreferences = el => () =>
  verifySave().then(storePreferences(el)).catch(e => console.log(e))
const leadZero = t => `${t}`.length === 1 ? `0${t}` : `${t}`
const dateToString = t =>
  `${t.getFullYear()}-${leadZero(t.getMonth() + 1)}-${leadZero(t.getDate())}`

// ========= Initialize ===============

const restorePreferences = ({ startTime, endTime, sorter, filter, filterText,
  regex, caseSensitive, limit }) => new Promise((resolve, reject) => {
    try {
      _chrome.storage.sync.get(['sorter', 'filter', 'filterText', 'regex',
        'caseSensitive', 'startTime', 'endTime', 'limit'], res => {
        try {
          const dt = new Date()
          endTime.value = res.endTime || dateToString(dt)
          dt.setDate(dt.getDate() - 7)
          startTime.value = res.startTime || dateToString(dt)
          sorter.value = res.sorter || 'visitCount-asc'
          filter.value = res.filter || 'question'
          filterText.value = res.filterText || ''
          regex.checked = res.regex || false
          caseSensitive.checked = res.caseSensitive || false
          limit.value = res.limit || 10
          resolve()
        } catch (e) { reject(e) }
      })
    } catch (e) { reject(e) }
  })
const initialize = (rel, el) => {
  restorePreferences(el)
  .then(() => {
    el.search.addEventListener('click', rel)
    el.save.addEventListener('click', savePreferences(el))
  })
  .catch(e => console.log(e))
}
document.addEventListener('DOMContentLoaded', () => {
  const el = {
    sorter: document.getElementById('sorter'),
    filter: document.getElementById('filter'),
    filterText: document.getElementById('filter-text'),
    regex: document.getElementById('regex'),
    caseSensitive: document.getElementById('case'),
    startTime: document.getElementById('startTime'),
    endTime: document.getElementById('endTime'),
    search: document.getElementById('search'),
    loader: document.getElementById('loader'),
    sites: document.getElementById('sites'),
    enableLimit: document.getElementById('enable-limit'),
    limit: document.getElementById('limit'),
    save: document.getElementById('save')
  }
  initialize(reload(el), el)
})
// TODO: === FIRST EPOC ===
// TODO: other stack exchanges
// TODO: update css like stackoverflow
// TODO: refactor
// TODO: reset preferences
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
