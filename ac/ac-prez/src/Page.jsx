import React, { Component } from 'react';

export default class Page extends Component {
  constructor (props) {
    super(props)
    this.state = {
      status: 'N/A',
      page: null,
      width: 0,
      height: 0
    }
  }
  shouldComponentUpdate (nextProps, nextState) {
    return this.props.pdf !== nextProps.pdf || this.state.status !== nextState.status
  }
  componentDidUpdate (nextProps) {
    this._update(nextProps.pdf)
  }
  componentDidMount () {
    this._update(this.props.pdf)
  }
  _update (pdf) {
    if (pdf) {
      this._loadPage(pdf)
    } else {
      this.setState({ status: 'loading' })
    }
  }
  _loadPage (pdf) {
    if (this.state.status === 'rendering' || this.state.page != null) return;
    pdf.getPage(this.props.index).then(this._renderPage.bind(this))
    this.setState({ status: 'rendering' })
  }
  _renderPage (page) {
    console.log(page)
    const scale = this.props.scale
    const viewport = page.getViewport(scale)
    const { width, height } = viewport
    const canvas = this.refs.canvas
    const context = canvas.getContext('2d')
    console.log(viewport.height, viewport.width)
    canvas.width = width
    canvas.height = height

    page.render({
      canvasContext: context,
      viewport
    })

    this.setState({ status: 'rendered', page, width, height })
  }

  render () {
    let { width, height, status } = this.state

    // id={'pageContainer'+this.props.index}
    
    return (
      <div className={'pdf-page '+status} style={{width, height}}>
        <canvas ref='canvas' />
      </div>
    )
  }
}
