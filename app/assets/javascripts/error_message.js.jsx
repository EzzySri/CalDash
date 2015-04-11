define(['react'], function(React){
  var ReactCSSTransitionGroup = React.addons.CSSTransitionGroup;

  var ErrorMessage = React.createClass({
    getInitialState: function() {
      return {
      };
    },
    render : function() {
      var errorMessageComponent = (
        <div key={this.props.flashMessageStoreState.flashMessageRandom} className="error-message-container"><div className="vert-ctr">{this.props.flashMessageStoreState.flashMessage}</div></div>
      );

      return (
        <div className="error-message-display">
          <ReactCSSTransitionGroup transitionName="error-message" transitionLeave={false}>
            {errorMessageComponent}
          </ReactCSSTransitionGroup>
        </div>
      );
    }
  });  
  return ErrorMessage;
});

