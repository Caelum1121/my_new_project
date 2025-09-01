/**
 *
 * scrollToTop.js
 * scroll restoration
 */

import React from 'react';
import { withRouter } from 'react-router-dom';

class ScrollToTop extends React.Component {
  // Scroll to top when the pathname changes
  componentDidUpdate(prevProps) {
    if (this.props.location.pathname !== prevProps.location.pathname) {
      window.scroll({
        top: 0,
        behavior: 'smooth' // Smooth scroll to top
      });
    }
  }

  render() {
    return this.props.children; // Render child components
  }
}

export default withRouter(ScrollToTop); // Enhance component with router props
