/** ****************************************************************************
 * HighlightClick
 *
 * @author       Isaac Suttell <isaac_suttell@playstation.sony.com>
 * @file         Show expanding circles where the user clicks
 ******************************************************************************/

// Modules
import React from 'react';
import ReactDOM from 'react-dom';

export default class HighlightClick extends React.Component {

  /**
   * Wrapper component that generates click highlights when the user clicks inside it
   * @param  {Object} props
   */
  constructor(props) {
    super(props);
    this.state = {
      clicks: []
    };
  }

  /**
   * Figure out the relative position in the element where the user clicked
   * @param  {React}   el
   * @param  {Event}   event
   * @return {Object}
   */
  getRelativeClickPosition(el, event) {
    el = el || ReactDOM.findDOMNode(this);
    let elOffset = HighlightClick.getElementOffset(el);
    return {
      top: event.pageY - elOffset.top,
      left: event.pageX - elOffset.left
    };
  }

  /**
   * The bread and butter. Creates a highglight
   * @param  {Event} event
   * @return {[type]}       [description]
   */
  handleClick(event) {
    let el = ReactDOM.findDOMNode(this);

    // Figure out where the click is
    let click = this.getRelativeClickPosition(el, event);

    // Ensure we have a unqiue id we can keep track of
    click.id = Date.now();

    // Clone to prevent accidently changes
    let clicks = this.state.clicks.slice(0);

    // Add the new click
    clicks.push(click);

    // Save
    this.setState({
      clicks: clicks
    });

    // Clean it up after it's gone
    setTimeout(this.removeClick.bind(this, click), this.props.timeout);

    if (typeof this.props.onClick === 'function') {
      this.props.onClick(event);
    }
  }

  /**
   * Remove the click from the state since we don't need it anymore
   * @param  {Object} click
   */
  removeClick(click) {
    // Clone
    let clicks = this.state.clicks.slice(0);

    // Find it
    let index = clicks.findIndex((item) => item.id === click.id);

    if(index > -1) {

      // Remove it
      clicks.splice(index, 1);

      // Update
      this.setState({
        clicks: clicks
      });
    }
  }

  /**
   * Render any active highlights
   * @return {React}
   */
  renderHighlights() {
    if (!this.state.clicks.length) {
      return null;
    }

    return this.state.clicks.map((click) => {
      let styles = {};

      // Size
      styles.width = this.props.size;
      styles.height = this.props.size;

      // Center
      styles.left = (click.left || 0) - (this.props.size / 2);
      styles.top = (click.top || 0) - (this.props.size / 2);

      return (
        <div
          key={click.id}
          style={styles}
          className='highlight-click--click'
        />
      );
    });
  }

  /**
   * This component is mostly a wrapper.
   * @return {React}
   */
  render() {
    return (
      <this.props.tag
        className={'highligh-click ' + (this.props.className ? this.props.className : ' ')}
        onClick={this.handleClick.bind(this)}>
          {this.renderHighlights()}

          {this.props.children}
      </this.props.tag>
    );
  }
}

/**
 * Based on jQuery. Get the elements offset to the top/left of page
 * @param    {Node}    el    [description]
 * @static
 */
HighlightClick.getElementOffset = function getElementOffset(el) {
  let doc = el && el.ownerDocument;

  if (!doc) {
    return;
  }

  let box = el.getBoundingClientRect();

  let docElem = doc.documentElement;

  return {
    top: box.top + ( window.pageYOffset || docElem.scrollTop ) - ( docElem.clientTop || 0 ),
    left: box.left + ( window.pageXOffset || docElem.scrollLeft ) - ( docElem.clientLeft || 0 )
  };
}

/**
 * Expected Types
 * @type {Object}
 * @static
 */
HighlightClick.propTypes = {
  onClick: React.PropTypes.func,
  className: React.PropTypes.string,
  tag: React.PropTypes.string,
  size: React.PropTypes.number,
  timeout: React.PropTypes.number
};

/**
 * Defaults
 * @type {Object}
 * @static
 */
HighlightClick.defaultProps = {
  className: '',
  tag: 'div',
  size: 100,
  timeout: 500
};
