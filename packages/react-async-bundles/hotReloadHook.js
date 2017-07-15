// @flow

const hotReloadHook = (module: any, cb: Function): void => {
  let prevStatus = ''
  // $FlowFixMe
  return module.hot && module.hot.addStatusHandler(status => {
    if (status === 'idle' && status !== prevStatus) {
      cb()
    }
    prevStatus = status
  })
}

export default hotReloadHook
