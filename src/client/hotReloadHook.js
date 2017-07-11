// @flow

const hotReloadHook = (module: any, cb: Function): void => {
  if (module.hot) {
    console.log('hotReloadHook enabled')

    let prevStatus = ''
    // $FlowFixMe
    module.hot.addStatusHandler(status => {
      if (status === 'idle' && status !== prevStatus) {
        cb()
      }
      prevStatus = status
    })
  }
}

export default hotReloadHook
