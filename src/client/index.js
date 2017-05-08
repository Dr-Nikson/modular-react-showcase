import React from 'react'
import bar from 'some/coolStuff'

const text = 'Hello, world!'

export default function* myCode() {
  console.log('text')
  yield bar()

  return (
    <h1>Hello, world!</h1>
  )
}

console.log('App is ok!')
console.error('App is ok!')

myCode()
