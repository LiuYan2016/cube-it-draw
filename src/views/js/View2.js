// @flow
import React, { Component } from 'react';
import Draw from '../../components/Draw';

import type { Output } from '../Types';
import type { Coordinates } from '../../components/Draw';

//Import relevant components as required by specs document here
import { Button } from 'aq-miniapp-components-ui';

/* Import Assets as required by specs document
ex.
import asset from '../../assets/asset.png';
*/

// Import CSS here
import '../css/View2.css';

/* Define constants here

ex.
const MY_CONSTANT = 42;
*/

export type Props = {
  onClick: (Output) => void
};

export default class View2 extends Component {

  item: any;

  state: {
    output: Output
  }

  constructor(props: Props){
    super(props);

    this.state = {
      output: {}
    }
  }
  /*
  _onDraw(coordinates: Coordinates) {
    // TODO: Update position of hand cursor based on current coordinates of Draw component
  }
  */
  render() {
    return (
      <Draw onDrawFinished={this.props.onClick}/>
    )
  }
//{/* TODO: insert additional assets here (hand, whiteboard, pen icon) as required be the specs document */}
//{/* TODO: fix .draw class in View2.css as required by specs document*/}
//<Button title="Done" onClick={() => this.props.onClick(this.state.output)}/>
}
