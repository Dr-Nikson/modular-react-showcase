// @flow
import React from 'react'
import { Route } from 'react-router-dom'
import UsedTwice from 'common/bundles/test/UsedTwice'
import DetailsComponent from './DetailsComponent'
import { Switch } from 'react-router-dom'

import { PupperSubBundle } from '../pupperSubBundle'
import { Link } from 'react-router-dom'

const ItemInfo = () => (
  <UsedTwice className="ItemInfo">
    Item page
    Item page
    <h1>
      Item page
      Item page
    </h1>
    <br />
    FUCK YEAH, kek, lol, GOD DAMN Why it is so good?dsadsa
    <br />
    <Link to="/item/pupper">Pupper sub bub boooooooooooob</Link>
    <br />
    IM SO HAPPPY SO SO SO SO SO <b>MUCH</b>
    <h3>GOD BLESS ME</h3>
    <h2>MAKE NIK GREAT AGAIN</h2>
    <h1>BABY, I AM THE BEST</h1>
    Why it is so good?
    <hr />
    <i>YO YO YO</i>
    <hr />
    <br />
    <b>does everything works correctly?</b>
    <Switch>
      <Route exact path="/item/details" component={DetailsComponent} />
      <Route path="/item/pupper" component={PupperSubBundle} />
    </Switch>
  </UsedTwice>
)

export default ItemInfo
