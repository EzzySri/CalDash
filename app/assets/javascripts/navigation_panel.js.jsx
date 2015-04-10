define(['react'], function(React){
  var NavigationPanel = React.createClass({
    render : function() {
      sessionComponent = this.props.isSignedIn ? (<div className="col-sm-3 col-5-gutter">
                    <div id="sign-out-button" onClick={this.props.onSignOut}> Log Out </div>
                  </div>) : (<div className="col-sm-3 col-5-gutter">
                    <div id="sign-in-button" onClick={this.props.onSignIn}> Log In </div>
                  </div>);

      return (
        <div className="navigation-panel col-sm-12">
          <div className="col-sm-8"></div>
          <div className="col-sm-4">
            <div className="row">
              <div className="col-sm-3 col-5-gutter">
                <div id="sign-up-button" onClick={this.props.onSignUp}> Sign Up </div>
              </div>
              {sessionComponent}
              <div className="col-sm-3 col-5-gutter">
                <div id="profile-button" onClick={this.props.onViewProfile}> My Profile </div>
              </div>
            </div>
          </div>
        </div>
      );
    }
  });
  return NavigationPanel;
});