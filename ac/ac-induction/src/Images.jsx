// @flow

import React, { Component } from 'react';

class Images extends Component {

  constructor(props: {srcURITrue: String, srcURIFalse: String}) {
    super(props);
  }

  render() {
    if(srcURITrue === 'empty' || srcURIFalse === 'empty'){
      return <div> Chargement des images impossible </div>
    }
    else{
      return (
        <View>
          
        </View>
      )
    }
  }
}

export default Images;
