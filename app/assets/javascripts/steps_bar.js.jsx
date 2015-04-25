define(['react', 'constants'], function(React, Constants){

  var ReactCSSTransitionGroup = React.addons.CSSTransitionGroup;

  var StepsBar = React.createClass({
    getInitialState: function() {
      return {
        stepLabel: "Step1",
        hover: false
      };
    },
    handleMouseOverBars: function(e) {
      if (e.target.textContent.indexOf("Step1") > -1) {
        this.setState({hover: true, stepLabel: "Step1"});
      } else if (e.target.textContent.indexOf("Step2") > -1) {
        this.setState({hover: true, stepLabel: "Step2"});
      } else if (e.target.textContent.indexOf("Step3") > -1) {
        this.setState({hover: true, stepLabel: "Step3"});
      }
    },
    handleMouseOutBars: function(e) {
      this.setState({hover: false});
    },
    toggleExplanation: function(e) {
      if (this.props.applicationStoreState.explanationVisible) {
        this.props.flux.actions.applicationActions.stepExplanationCollapse();
      } else {
        this.props.flux.actions.applicationActions.stepExplanationExpand();
      }
    },
    render: function() {
      var barLeftSytle;
      var barMiddleStyle;
      var barRightStyle;
      var stepExplanation;
      var stepCount = this.props.applicationStoreState.stepCount;

      var stepExplanation1 = (
        <div className="step-explanation-container">
          <img src={Constants.Images.ARROW_LEFT} className="arrow-left-icon vert-ctr" />
          <img src={Constants.Images.STEP_1} className="step1-icon" />
          <div className="step-explanation-text">Add your events to your schedule from the form.</div> 
        </div>
      );
      var stepExplanation2 = (
        <div className="step-explanation-container">
          <img src={Constants.Images.ARROW_DOWN} className="arrow-down-icon hori-ctr" />
          <img src={Constants.Images.STEP_2} className="step2-icon" />
          <div className="step-explanation-text">Press the button to optmize and choose your schedule.</div> 
        </div>
      );
      var stepExplanation3 = (
        <div className="step-explanation-container">
          <img src={Constants.Images.ARROW_RIGHT} className="arrow-right-icon vert-ctr" />
          <img src={Constants.Images.STEP_3} className="step3-icon" />
          <div className="step-explanation-text">Your confirmed schedule will appear in the calendar.</div> 
        </div>
      );

      if (stepCount >= 2) {
        barRightStyle = {
          backgroundColor: Constants.Colors.DARK_RED,
          color: "white"
        };
      }
      if (stepCount >= 1) {
        barMiddleStyle = {
          backgroundColor: Constants.Colors.DARK_RED,
          color: "white"
        };
      }
      if (stepCount >= 0) {
        barLeftStyle = {
          backgroundColor: Constants.Colors.DARK_RED,
          color: "white"
        };
      }
      if (stepCount == 2) {
        stepExplanation = stepExplanation3;
      }
      if (stepCount >= 1) {
        stepExplanation = stepExplanation2;
      }
      if (stepCount >= 0) {
        stepExplanation = stepExplanation1;
      }

      if (this.state.hover) {
        switch(this.state.stepLabel) {
          case "Step1":
            stepExplanation = stepExplanation1;
            barLeftStyle = {
              backgroundColor: Constants.Colors.DARK_RED,
              color: "white"
            };
            barMiddleStyle = {};
            barRightStyle = {};
            break;
          case "Step2":
            stepExplanation = stepExplanation2;
            barMiddleStyle = {
              backgroundColor: Constants.Colors.DARK_RED,
              color: "white"
            };
            barLeftStyle = {};
            barRightStyle = {};
            break;
          case "Step3":
            stepExplanation = stepExplanation3;
            barRightStyle = {
              backgroundColor: Constants.Colors.DARK_RED,
              color: "white"
            };
            barLeftStyle = {};
            barMiddleStyle = {};
            break;
        }
      }

      var isVisible = this.props.applicationStoreState.explanationVisible ? {display: ""} : {display: "none"};

      return (
        <div className="steps-bar">
          <div className="row">
            <div onMouseEnter={this.handleMouseOverBars} onMouseLeave={this.handleMouseOutBars} className="col-sm-4 steps-bar-inner-container" style={barLeftStyle}>Step1:<br/>Enter Events</div>
            <div onMouseEnter={this.handleMouseOverBars} onMouseLeave={this.handleMouseOutBars} className="col-sm-4 steps-bar-inner-container" style={barMiddleStyle}>Step2:<br/>Optimize Events</div>
            <div onMouseEnter={this.handleMouseOverBars} onMouseLeave={this.handleMouseOutBars} className="col-sm-4 steps-bar-inner-container" style={barRightStyle}>Step3:<br/>Schedule Confirmed</div>
          </div>
          <div style={isVisible}>
            {stepExplanation}
          </div>
          <div onClick={this.toggleExplanation} className={this.props.applicationStoreState.explanationVisible ? "step-explanation-toggle" : "step-explanation-toggle step-explanation-toggle-inverted"}/>
        </div>
      );
    }
  });
  return StepsBar;
});