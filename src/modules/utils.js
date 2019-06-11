function isFunction(func) {
  return typeof func === 'function' || Object.prototype.toString.call(func) === '[object Function]'
}

export function matchesSelectorToParentElements(el, selector, baseNode) {
  let node = el

  const matchesSelectorFunc = [
    'matches',
    'webkitMatchesSelector',
    'mozMatchesSelector',
    'msMatchesSelector',
    'oMatchesSelector'
  ].find(func => isFunction(node[func]))

  if (!isFunction(node[matchesSelectorFunc])) return false

  do {
    if (node[matchesSelectorFunc](selector)) return true
    if (node === baseNode) return false
    node = node.parentNode
  } while (node)

  return false
}

export function getAPIBaseURL() {
  if (window.__APP_EDITION__ === 'MANAGEMENT') {
    return process.env.MANAGEMENT_BASE_URL
  } else if (window.__APP_EDITION__ === 'GROUP') {
    return process.env.GROUP_BASE_URL
  } else if (window.__APP_EDITION__ === 'ENTERPRISE') {
    return process.env.ENTERPRISE_BASE_URL
  }
}

export function getUploadURL() {
  if (window.__APP_EDITION__ === 'MANAGEMENT') {
    return `${process.env.MANAGEMENT_BASE_URL}/upload`
  } else if (window.__APP_EDITION__ === 'GROUP') {
    return `${process.env.GROUP_BASE_URL}/upload`
  } else if (window.__APP_EDITION__ === 'ENTERPRISE') {
    return `${process.env.ENTERPRISE_BASE_URL}/upload`
  }
}

export function getLoginURL() {
  if (window.__APP_EDITION__ === 'MANAGEMENT') {
    return '/login'
  } else if (window.__APP_EDITION__ === 'GROUP') {
    return '/login'
  } else if (window.__APP_EDITION__ === 'ENTERPRISE') {
    return '/web/login'
  }
}
