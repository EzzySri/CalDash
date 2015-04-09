define(['react', 'constants'], function(React, Constants){

  var ReactCSSTransitionGroup = React.addons.CSSTransitionGroup;

  var StepsBar = React.createClass({
    getInitialState: function() {
      return {
        stepLabel: "Step1",
        hover: false,
        explanationVisible: true
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
      if (this.state.explanationVisible) {
        this.setState({explanationVisible: false});
      } else {
        this.setState({explanationVisible: true});
      }
      this.props.onToggleExplanation();
    },
    render: function() {
      var barLeftSytle;
      var barMiddleStyle;
      var barRightStyle;
      var stepExplanation;
      var stepCount = this.props.stepCount;

      var stepExplanation1 = (
        <div className="step-explanation-container">
          <img src="assets/icon_arrow_left.png" className="arrow-left-icon vert-ctr" />
          <img src="assets/icon_step1.png" className="step1-icon" />
          <div className="step-explanation-text">Add events to your schedule from the form.</div> 
        </div>
      );
      var stepExplanation2 = (
        <div className="step-explanation-container">
          <img src="assets/icon_arrow_down.png" className="arrow-down-icon hori-ctr" />
          <img src="assets/icon_step2.png" className="step2-icon" />
          <div className="step-explanation-text">Press the button to optmize them.</div> 
        </div>
      );
      var stepExplanation3 = (
        <div className="step-explanation-container">
          <img src="assets/icon_arrow_right.png" className="arrow-right-icon vert-ctr" />
          <img src="assets/icon_step3.png" className="step3-icon" />
          <div className="step-explanation-text">Confirm your choice of schedule and it will appear in the calendar.</div> 
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

      var isVisible = this.state.explanationVisible ? {display: ""} : {display: "none"};

      return (
        <div className="steps-bar">
          <div className="row">
            <div onMouseOver={this.handleMouseOverBars} onMouseOut={this.handleMouseOutBars} className="col-sm-4 steps-bar-inner-container" style={barLeftStyle}><p>Step1:</p><p>Enter Events</p></div>
            <div onMouseOver={this.handleMouseOverBars} onMouseOut={this.handleMouseOutBars} className="col-sm-4 steps-bar-inner-container" style={barMiddleStyle}><p>Step2:</p><p>Optimize Events</p></div>
            <div onMouseOver={this.handleMouseOverBars} onMouseOut={this.handleMouseOutBars} className="col-sm-4 steps-bar-inner-container" style={barRightStyle}><p>Step3:</p><p>Confirm Schedule</p></div>
          </div>
          <div style={isVisible}>
            {stepExplanation}
          </div>
          <div onClick={this.toggleExplanation} className={this.state.explanationVisible ? "step-explanation-toggle" : "step-explanation-toggle step-explanation-toggle-inverted"}/>
        </div>
      );
    }
  });
  return StepsBar;
});