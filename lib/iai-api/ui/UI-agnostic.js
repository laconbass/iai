/* old trashcan code*/

let UI = module.exports

UI.render = function (content) {
  log.warn('now i should render %s that has url %s', content, content.url)
  throw abc.Error('UI#render should implemented at backend/browser entry points')
}
