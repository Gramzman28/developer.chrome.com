const path = require('path');
const {leadingAndTrailingSlash} = require('../../_filters/urls');

/**
 * Returns back some attributes based on whether the
 * link is active or a parent of an active item.
 * It's recommended that both arguments use trailing slashes.
 * This will prevent /x from appearing to be a parent of /xy/
 *
 * @param {string} itemUrl The link in question
 * @param {string} pageUrl The page context
 * @return {string|undefined} The attributes or empty
 */
function getLinkActiveState(itemUrl, pageUrl) {
  if (itemUrl === pageUrl) {
    return ' data-state="active" aria-current="page"';
  } else if (itemUrl.length > 1 && pageUrl.indexOf(itemUrl) === 0) {
    return ' data-state="active"';
  }
  return;
}

/**
 * Flattens all of the nested links in a section to check if the current pageUrl
 * is contained within that section.
 * @param {Section[]} section A section from a _data/docs toc.yml file.
 * @param {string} pageUrl The url of the current page.
 * @param {string} locale The locale for the page.
 * @return {boolean}
 */
function hasActiveLink(section, pageUrl, locale) {
  const queue = section.slice();
  while (queue.length) {
    const item = /** @type {Section} */ (queue.shift());
    if (item.url) {
      const check = leadingAndTrailingSlash(path.join(locale, item.url));
      if (check === pageUrl) {
        return true;
      }
    }
    if (item.sections) {
      queue.push(...item.sections);
    }
  }
  return false;
}

module.exports = {
  getLinkActiveState,
  hasActiveLink,
};