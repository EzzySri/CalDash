var NavigationPanel = React.createClass({
  getInitialState: function() {
    return {
    };
  },
  render : function() {
    return (
      <div className="navigation-panel col-sm-12">
        <div className="col-sm-8"></div>
        <div className="col-sm-4">
          <div className="row">
            <div className="col-sm-4 col-5-gutter">
              <div id="sign-up-button"> Sign Up </div>
            </div>
            <div className="col-sm-4 col-5-gutter">
              <div id="sign-in-button"> Log In </div>
            </div>
            <div className="col-sm-4 col-5-gutter">
              <div id="profile-button"> My Profile </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
});