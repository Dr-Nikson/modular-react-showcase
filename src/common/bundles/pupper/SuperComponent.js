// @flow
import React from 'react'
import { connect } from 'react-redux'

import UsedTwice from 'common/bundles/test/UsedTwice'
import {
  doGood,
  sayWord,
  runForYourLife,
} from 'common/bundles/pupper/redux/index'

import type { Dispatch } from 'redux'
import type { MapDispatchToProps, MapStateToProps } from 'react-redux'

type SuperComponentProps = {
  count: number,
  word: string,
  doIT: Function,
  say: Function,
  run: Function,
}

const SuperComponent = (props: SuperComponentProps) => (
  <UsedTwice className="SuperComponent">
    This is exactly a super-pupper component!
    <br />
    <h1 style={{ textAlign: 'center' }}>
      {props.count}
      <br />
      {props.word}
      <br />
      <button onClick={props.doIT}>LEEEEESSS GOOOO</button>
      <br />
      <button onClick={props.say}>SAY!</button>
      <br />
      <button onClick={props.run}>RUN RUN RUN!</button>
    </h1>
  </UsedTwice>
)

const mapState = (state, props) => {
  return {
    count: state.pupper.count,
    word: state.pupper.word,
  }
}

const mapActions: MapDispatchToProps<*, Object, Object> = (
  dispatch: Dispatch<*>,
  props: Object
): Object => {
  return {
    doIT: () => dispatch(doGood()),
    say: () => dispatch(sayWord()),
    run: () => dispatch(runForYourLife()),
  }
}

export default connect(mapState, mapActions)(SuperComponent)
