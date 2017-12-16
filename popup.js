/**
 * Alias for chrome extensions library
 */
const _chrome = chrome
/**
 * Root of all the searched history urls
 */
const roots = {
  '3D Printing': 'https://3dprinting.stackexchange.com/questions/',
  'Academia': 'https://academia.stackexchange.com/questions/',
  'Amateur Radio': 'https://ham.stackexchange.com/questions/',
  'Android Enthusiasts': 'https://android.stackexchange.com/questions/',
  'Arduino': 'https://arduino.stackexchange.com/questions/',
  'Arqade': 'https://gaming.stackexchange.com/questions/',
  'Artificial Intelligence': 'https://ai.stackexchange.com/questions/',
  'Arts & Crafts': 'https://crafts.stackexchange.com/questions/',
  'Ask Different': 'https://apple.stackexchange.com/questions/',
  'Ask Patents': 'https://patents.stackexchange.com/questions/',
  'Ask Ubuntu': 'https://askubuntu.com/questions/',
  'Astronomy': 'https://astronomy.stackexchange.com/questions/',
  'Augur': 'https://augur.stackexchange.com/questions/',
  'Aviation': 'https://aviation.stackexchange.com/questions/',
  'Bicycles': 'https://bicycles.stackexchange.com/questions/',
  'Bioinformatics': 'https://bioinformatics.stackexchange.com/questions/',
  'Biology': 'https://biology.stackexchange.com/questions/',
  'Blender': 'https://blender.stackexchange.com/questions/',
  'Bricks': 'https://bricks.stackexchange.com/questions/',
  'Chemistry': 'https://chemistry.stackexchange.com/questions/',
  'Chess': 'https://chess.stackexchange.com/questions/',
  'Chinese Language': 'https://chinese.stackexchange.com/questions/',
  'CiviCRM': 'https://civicrm.stackexchange.com/questions/',
  'Code Review': 'https://codereview.stackexchange.com/questions/',
  'Coffee': 'https://coffee.stackexchange.com/questions/',
  'Cognitive Sciences': 'https://cogsci.stackexchange.com/questions/',
  'Community Building': 'https://communitybuilding.stackexchange.com/questions/',
  'Computational Science': 'https://scicomp.stackexchange.com/questions/',
  'Computer Graphics': 'https://computergraphics.stackexchange.com/questions/',
  'Computer Science': 'https://cs.stackexchange.com/questions/',
  'Computer Science Educators': 'https://cseducators.stackexchange.com/questions/',
  'Craft CMS': 'https://craftcms.stackexchange.com/questions/',
  'Cross Validated': 'https://stats.stackexchange.com/questions/',
  'Cryptography': 'https://crypto.stackexchange.com/questions/',
  'Data Science': 'https://datascience.stackexchange.com/questions/',
  'Database Administrators': 'https://dba.stackexchange.com/questions/',
  'DevOps': 'https://devops.stackexchange.com/questions/',
  'Drupal Answers': 'https://drupal.stackexchange.com/questions/',
  'Earth Science': 'https://earthscience.stackexchange.com/questions/',
  'Ebooks': 'https://ebooks.stackexchange.com/questions/',
  'Economics': 'https://economics.stackexchange.com/questions/',
  'Electrical Engineering': 'https://electronics.stackexchange.com/questions/',
  'elementary OS': 'https://elementaryos.stackexchange.com/questions/',
  'Emacs': 'https://emacs.stackexchange.com/questions/',
  'Engineering': 'https://engineering.stackexchange.com/questions/',
  'English Language & Usage': 'https://english.stackexchange.com/questions/',
  'English Language Learners': 'https://ell.stackexchange.com/questions/',
  'Esperanto Language': 'https://esperanto.stackexchange.com/questions/',
  'Ethereum': 'https://ethereum.stackexchange.com/questions/',
  'Expatriates': 'https://expatriates.stackexchange.com/questions/',
  'ExpressionEngine® Answers': 'https://expressionengine.stackexchange.com/questions/',
  'Freelancing': 'https://freelancing.stackexchange.com/questions/',
  'French Language': 'https://french.stackexchange.com/questions/',
  'Game Development': 'https://gamedev.stackexchange.com/questions/',
  'Gardening & Landscaping': 'https://gardening.stackexchange.com/questions/',
  'Genealogy & Family History': 'https://genealogy.stackexchange.com/questions/',
  'Geographic Information Systems': 'https://gis.stackexchange.com/questions/',
  'German Language': 'https://german.stackexchange.com/questions/',
  'Graphic Design': 'https://graphicdesign.stackexchange.com/questions/',
  'Hardware Recommendations': 'https://hardwarerecs.stackexchange.com/questions/',
  'Health': 'https://health.stackexchange.com/questions/',
  'History': 'https://history.stackexchange.com/questions/',
  'History of Science and Mathematics': 'https://hsm.stackexchange.com/questions/',
  'Home Improvement': 'https://diy.stackexchange.com/questions/',
  'Homebrewing': 'https://homebrew.stackexchange.com/questions/',
  'Information Security': 'https://security.stackexchange.com/questions/',
  'Internet of Things': 'https://iot.stackexchange.com/questions/',
  'Interpersonal Skills': 'https://interpersonal.stackexchange.com/questions/',
  'Islam': 'https://islam.stackexchange.com/questions/',
  'Italian Language': 'https://italian.stackexchange.com/questions/',
  'Japanese Language': 'https://japanese.stackexchange.com/questions/',
  'Joomla': 'https://joomla.stackexchange.com/questions/',
  'Korean Language': 'https://korean.stackexchange.com/questions/',
  'Language Learning': 'https://languagelearning.stackexchange.com/questions/',
  'Latin Language': 'https://latin.stackexchange.com/questions/',
  'Law': 'https://law.stackexchange.com/questions/',
  'Lifehacks': 'https://lifehacks.stackexchange.com/questions/',
  'Linguistics': 'https://linguistics.stackexchange.com/questions/',
  'Literature': 'https://literature.stackexchange.com/questions/',
  'Magento': 'https://magento.stackexchange.com/questions/',
  'Martial Arts': 'https://martialarts.stackexchange.com/questions/',
  'Mathematica': 'https://mathematica.stackexchange.com/questions/',
  'Mathematics': 'https://math.stackexchange.com/questions/',
  'Mathematics Educators': 'https://matheducators.stackexchange.com/questions/',
  'MathOverflow': 'https://mathoverflow.net/questions/',
  'Meta Stack Exchange': 'https://meta.stackexchange.com/questions/',
  'Motor Vehicle Maintenance & Repair': 'https://mechanics.stackexchange.com/questions/',
  'Network Engineering': 'https://networkengineering.stackexchange.com/questions/',
  'Open Data': 'https://opendata.stackexchange.com/questions/',
  'Open Source': 'https://opensource.stackexchange.com/questions/',
  'Parenting': 'https://parenting.stackexchange.com/questions/',
  'Personal Finance & Money': 'https://money.stackexchange.com/questions/',
  'Personal Productivity': 'https://productivity.stackexchange.com/questions/',
  'Pets': 'https://pets.stackexchange.com/questions/',
  'Philosophy': 'https://philosophy.stackexchange.com/questions/',
  'Photography': 'https://photo.stackexchange.com/questions/',
  'Physical Fitness': 'https://fitness.stackexchange.com/questions/',
  'Physics': 'https://physics.stackexchange.com/questions/',
  'Portuguese Language': 'https://portuguese.stackexchange.com/questions/',
  'Programming Puzzles & Code Golf': 'https://codegolf.stackexchange.com/questions/',
  'Project Management': 'https://pm.stackexchange.com/questions/',
  'Puzzling': 'https://puzzling.stackexchange.com/questions/',
  'Quantitative Finance': 'https://quant.stackexchange.com/questions/',
  'Raspberry Pi': 'https://raspberrypi.stackexchange.com/questions/',
  'Retrocomputing': 'https://retrocomputing.stackexchange.com/questions/',
  'Reverse Engineering': 'https://reverseengineering.stackexchange.com/questions/',
  'Robotics': 'https://robotics.stackexchange.com/questions/',
  'Role-playing Games': 'https://rpg.stackexchange.com/questions/',
  'Russian Language': 'https://russian.stackexchange.com/questions/',
  'Salesforce': 'https://salesforce.stackexchange.com/questions/',
  'Science Fiction & Fantasy': 'https://scifi.stackexchange.com/questions/',
  'Seasoned Advice': 'https://cooking.stackexchange.com/questions/',
  'Server Fault': 'https://serverfault.com/questions/',
  'SharePoint': 'https://sharepoint.stackexchange.com/questions/',
  'Signal Processing': 'https://dsp.stackexchange.com/questions/',
  'Sitecore': 'https://sitecore.stackexchange.com/questions/',
  'Software Engineering': 'https://softwareengineering.stackexchange.com/questions/',
  'Software Quality Assurance & Testing': 'https://sqa.stackexchange.com/questions/',
  'Software Recommendations': 'https://softwarerecs.stackexchange.com/questions/',
  'Sound Design': 'https://sound.stackexchange.com/questions/',
  'Space Exploration': 'https://space.stackexchange.com/questions/',
  'Spanish Language': 'https://spanish.stackexchange.com/questions/',
  'Sports': 'https://sports.stackexchange.com/questions/',
  'Stack Apps': 'https://stackapps.com/questions/',
  'Stack Overflow': 'https://stackoverflow.com/questions/',
  'Stack Overflow em Português': 'https://pt.stackoverflow.com/questions/',
  'Stack Overflow en español': 'https://es.stackoverflow.com/questions/',
  'Stack Overflow на русском': 'https://ru.stackoverflow.com/questions/',
  'Super User': 'https://superuser.com/questions/',
  'Sustainable Living': 'https://sustainability.stackexchange.com/questions/',
  'TeX - LaTeX': 'https://tex.stackexchange.com/questions/',
  'The Great Outdoors': 'https://outdoors.stackexchange.com/questions/',
  'The Workplace': 'https://workplace.stackexchange.com/questions/',
  'Theoretical Computer Science': 'https://cstheory.stackexchange.com/questions/',
  'Tor': 'https://tor.stackexchange.com/questions/',
  'Travel': 'https://travel.stackexchange.com/questions/',
  'Tridion': 'https://tridion.stackexchange.com/questions/',
  'Ukrainian Language': 'https://ukrainian.stackexchange.com/questions/',
  'Unix & Linux': 'https://unix.stackexchange.com/questions/',
  'User Experience': 'https://ux.stackexchange.com/questions/',
  'Vi and Vim': 'https://vi.stackexchange.com/questions/',
  'Video Production': 'https://video.stackexchange.com/questions/',
  'Web Applications': 'https://webapps.stackexchange.com/questions/',
  'Webmasters': 'https://webmasters.stackexchange.com/questions/',
  'Windows Phone': 'https://windowsphone.stackexchange.com/questions/',
  'Woodworking': 'https://woodworking.stackexchange.com/questions/',
  'WordPress Development': 'https://wordpress.stackexchange.com/questions/',
  'Worldbuilding': 'https://worldbuilding.stackexchange.com/questions/',
  'Writers': 'https://writers.stackexchange.com/questions/',
  'Русский язык': 'https://rus.stackexchange.com/questions/',
  'スタック・オーバーフロー': 'https://ja.stackoverflow.com'
}

// ===== Searches history ========

/**
 * Searches history and gets history items that contain `root` in the url
 *
 * @param {string} text The text that is used to search the history
 * @param {number} startTime Starting time limit in milliseconds for searching the history
 * @param {number} endTime Ending time limit in milliseconds for searching the history
 * @returns {Promise<Object>} The history data
 */
const getHistory = (root, text, { startTime, endTime }) => () =>
  new Promise((resolve, reject) => {
    try {
      text = text || root
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

// ==== Filters =============

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

// ======= Sorts =======

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

// ======= Limits =============

/**
 * Limits the data from the first to the Nth result
 * @param {number} limit The limit size
 */
const limitData = (enableLimit, limit) => data =>
  enableLimit ? data.slice(0, limit) : data

// ======= Updates UI ===========

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
const setLimitEnabled = ({ enableLimit, limit }) => () =>
  enableLimit.checked
  ? limit.removeAttribute('disabled') : limit.setAttribute('disabled', true)
const initializeRoots = ({ root }) => () => {
  root.innerHTML = Object.keys(roots).map(r =>
    `<option value="${r}">${r}</option>`).join('')
}
const setRootImage = ({ root, rootImage, rootUrl }) => () => {
  rootImage.setAttribute('src', `img/${root.value}.png`)
  rootUrl.setAttribute('href', roots[root.value].split('/questions/')[0])
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

// ===== Performs new search =======

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
const reload = ({ startTime, endTime, search, loader, sites, root, filter,
  filterText, regex, caseSensitive, sorter, enableLimit, limit }) => () =>
  verifySearch(getTRange(startTime.value, endTime.value))
  .then(disable(search, loader, sites))
  .then(getHistory(roots[root.value], filterText.value,
    getTRange(startTime.value, endTime.value)))
  .then(filterData(filter.value, filterText.value, regex.checked,
    caseSensitive.checked))
  .then(sortData(sorter.value.split('-')[0], sorter.value.split('-')[1]))
  .then(limitData(enableLimit.checked, parseInt(limit.value)))
  .then(updateUI(sites))
  .catch(e => console.log(e))
  .then(enable(search, loader, sites))
  .catch(e => console.log(e))

// ========== Saves preferences ==================

const verifySave = () => new Promise((resolve, reject) => {
  try {
    window.confirm('Save current search configurations?')
    ? resolve() : reject(new Error('Save verification declined'))
  } catch (e) { reject(e) }
})
const storePreferences = ({ sorter, root, filter, filterText, regex,
  caseSensitive, startTime, endTime, enableLimit, limit }) => () =>
  new Promise((resolve, reject) => {
    try {
      _chrome.storage.sync.clear()
      _chrome.storage.sync.set({
        sorter: sorter.value,
        root: root.value,
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

// ========= Restores preferences ===============

/**
 * Adds a zero before day or month value if the value has just one digit\
 */
const leadZero = t => `${t}`.length === 1 ? `0${t}` : `${t}`
const dateToString = t =>
  `${t.getFullYear()}-${leadZero(t.getMonth() + 1)}-${leadZero(t.getDate())}`
/**
 * Restores the previosly saved preferences
 */
const restorePreferences = ({ startTime, endTime, sorter, root, rootImage, rootUrl,
  filter, filterText, regex, caseSensitive, enableLimit, limit, sites }) =>
  () => new Promise((resolve, reject) => {
    try {
      _chrome.storage.sync.get(['sorter', 'root', 'filter', 'filterText',
        'regex', 'caseSensitive', 'startTime', 'endTime', 'enableLimit',
        'limit'],
        res => {
          try {
            const dt = new Date()
            endTime.value = res.endTime || dateToString(dt)
            dt.setDate(dt.getDate() - 7)
            startTime.value = res.startTime || dateToString(dt)
            sorter.value = res.sorter || 'visitCount-asc'
            root.value = res.root || 'Stack Overflow'
            filter.value = res.filter || 'question'
            filterText.value = res.filterText || ''
            regex.checked = res.regex || false
            caseSensitive.checked = res.caseSensitive || false
            enableLimit.checked = res.enableLimit || false
            limit.value = res.limit || 10
            sites.innerHTML = ''
            setRootImage({ root, rootImage, rootUrl })()
            setLimitEnabled({ enableLimit, limit })()
            resolve()
          } catch (e) { reject(e) }
        })
    } catch (e) { reject(e) }
  })

// ============= RESETS PREFERENCES =============

const verifyReset = () => new Promise((resolve, reject) => {
  try {
    window.confirm('Are you sure you want to reset your saved search ' +
    'configurations? This will clear the current search result as well. ' +
    'Continue?') ? resolve() : reject(new Error('Reset verification declined'))
  } catch (e) { reject(e) }
})
const clearPreferences = () => new Promise((resolve, reject) => {
  try {
    _chrome.storage.sync.clear()
    resolve()
  } catch (e) { reject(e) }
})
/**
 * Clears existing saved preferences
 */
const resetPreferences = (el) => () =>
  verifyReset()
  .then(clearPreferences)
  .then(restorePreferences(el))
  .catch(e => console.log(e))

// ============= INITIALIZES ====================

const initialize = (el) => {
  Promise.resolve()
  .then(initializeRoots(el))
  .then(restorePreferences(el))
  .then(() => {
    el.enableLimit.addEventListener('change', setLimitEnabled(el))
    el.search.addEventListener('click', reload(el))
    el.save.addEventListener('click', savePreferences(el))
    el.reset.addEventListener('click', resetPreferences(el))
    el.root.addEventListener('change', setRootImage(el))
  })
  .catch(e => console.log(e))
}
document.addEventListener('DOMContentLoaded', () => {
  const el = {
    sorter: document.getElementById('sorter'),
    root: document.getElementById('root'),
    rootImage: document.getElementById('root-image'),
    rootUrl: document.getElementById('root-url'),
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
    save: document.getElementById('save'),
    reset: document.getElementById('reset')
  }
  initialize(el)
})
// TODO: === FIRST EPOC ===
// TODO: update css like stackoverflow
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
// TODO: make favorite stack exchange sites
