/**
 * Alias for chrome extensions library
 */
const _chrome = chrome
/**
 * Root of all the searched history urls
 */
const root = 'https://stackoverflow.com/questions/'

// ===== Search history ========

/**
 * Searches history and gets history items that contain `root` in the url
 *
 * @param {string} text The text that is used to search the history
 * @param {number} startTime Starting time limit in milliseconds for searching the history
 * @param {number} endTime Ending time limit in milliseconds for searching the history
 * @returns {Promise<Object>} The history data
 */
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
/**
 * Filters the data
 * @param {string} property The property on which to apply the filtering
 * @param {string} filterText The filtering text
 * @param {boolean} isCaseSensitive If the filtering should be case sensitive
 * @param {boolean} isRegex If the filtering text is a regex
 * @returns {Object} The filtered data
 */
const filterData = (property, filterText, isCaseSensitive, isRegex) => data =>
  filterText ? data.filter(getFilter(property, filterText,
    getCaseStrategy(isCaseSensitive), getTextTypeStrategy(isRegex))) : data

// ======= Sort =======

const sortAsc = property => (item1, item2) =>
  item1[property] > item2[property] ? -1 : 1
const sortDesc = property => (item1, item2) =>
  item1[property] < item2[property] ? -1 : 1
const getSorter = (property, order) =>
  order === 'asc' ? sortAsc(property) : sortDesc(property)
/**
 * Sorts the data
 * @param {string} property The property on which to apply the sorting
 * @param {string} order If the sorting order is `asc` or `desc`
 */
const sortData = (property, order) => data =>
  data.slice(0).sort(getSorter(property, order))

// ======= Limit =============

/**
 * Limits the data from the first to the Nth result
 * @param {number} limit The limit size
 */
const limitData = (enableLimit, limit) => data =>
  enableLimit ? data.slice(0, limit) : data

// ======= Update UI ===========

/**
 * Disables and hides sensitive elements when searching is going on
 */
const disable = (search, loader, sites) => () => {
  search.setAttribute('disabled', true)
  loader.removeAttribute('hidden')
  sites.setAttribute('hidden', true)
}
/**
 * Re-enables and un-hides sensitive elements when searching is done
 */
const enable = (search, loader, sites) => () => {
  search.removeAttribute('disabled')
  loader.setAttribute('hidden', true)
  sites.removeAttribute('hidden')
}
/**
 * HTML escapes texts to echo
 */
const escape = s => s.slice(0).replace(/</, '&lt;').replace(/>/, '&gt;')
/**
 * Creates a single row element for a single item in the history data
 * @param {number} i Index
 */
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
/**
 * Updates the UI with the new found history items
 */
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

/**
 * Verifies weather to search over long time spans
 */
const verifySearch = ({ startTime, endTime }) =>
new Promise((resolve, reject) => {
  try {
    endTime - startTime > 2592000000 // 30 days
    ? (window.confirm('Searching long time span may be slow. Continue?')
      ? resolve() : reject(new Error('limit error')))
    : resolve()
  } catch (e) { reject(e) }
})
/**
 * Gets milliseconds from date string
 */
const getTime = tm => new Date(tm + ' 00:00:00').getTime()
/**
 * Adds a day worth of milliseconds
 */
const addADay = tm => tm + 86400000
/**
 * Gets the time range for searching the history
 * @param tm1 The starting time in format YYYY-MM-DD
 * @param tm2 The ending time in the format YYYY-MM-DD
 */
const getTRange = (tm1, tm2) =>
  ({ startTime: getTime(tm1), endTime: addADay(getTime(tm2)) })
/**
 * Performs a brand new search
 */
const reload = ({ startTime, endTime, search, loader, sites, filter, filterText,
  regex, caseSensitive, sorter, enableLimit, limit }) => () =>
  verifySearch(getTRange(startTime.value, endTime.value))
  .then(disable(search, loader, sites))
  .then(getHistory(filterText.value, getTRange(startTime.value, endTime.value)))
  .then(filterData(filter.value, filterText.value, regex.checked,
    caseSensitive.checked))
  .then(sortData(sorter.value.split('-')[0], sorter.value.split('-')[1]))
  .then(limitData(enableLimit.checked, parseInt(limit.value)))
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
  startTime, endTime, enableLimit, limit }) => () =>
  new Promise((resolve, reject) => {
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
        enableLimit: enableLimit.checked,
        limit: limit.value
      }, () => resolve())
    } catch (e) { reject(e) }
  })
/**
 * Saves the current search configuration
 * @param {Object} el The dom elements whose value are to be saved
 */
const savePreferences = el => () =>
  verifySave().then(storePreferences(el)).catch(e => console.log(e))

// ========= Initialize ===============

/**
 * Adds a zero before day or month value if the value has just one digit\
 */
const leadZero = t => `${t}`.length === 1 ? `0${t}` : `${t}`
const dateToString = t =>
  `${t.getFullYear()}-${leadZero(t.getMonth() + 1)}-${leadZero(t.getDate())}`
/**
 * Restores the previosly saved preferences
 */
const restorePreferences = ({ startTime, endTime, sorter, filter, filterText,
  regex, caseSensitive, enableLimit, limit }) =>
  new Promise((resolve, reject) => {
    try {
      _chrome.storage.sync.get(['sorter', 'filter', 'filterText', 'regex',
        'caseSensitive', 'startTime', 'endTime', 'enableLimit', 'limit'],
        res => {
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
            enableLimit.checked = res.enableLimit || false
            limit.value = res.limit || 10
            resolve()
          } catch (e) { reject(e) }
        })
    } catch (e) { reject(e) }
  })
const initialize = (rel, el) => {
  restorePreferences(el)
  .then(() => {
    const setLimitEnabled = () =>
      el.enableLimit.checked
      ? el.limit.removeAttribute('disabled')
      : el.limit.setAttribute('disabled', true)
    setLimitEnabled()
    el.enableLimit.addEventListener('change', setLimitEnabled)
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
