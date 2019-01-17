import React, { Component } from 'react'
import { connect } from 'react-redux'
import StopLightPresentational from './StopLightPresentational'
import { addSurveyData, addSurveyDataWhole } from '../../../../redux/actions'

class StopLight extends Component {
  constructor(props) {
    super(props)
    this.state = {
      step: 0
    }
  }

  nextStep = (value, codeName) => {
    const { step } = this.state
    let answer = {}
    answer[codeName] = value.value
    this.props.addSurveyDataWhole(
      this.props.draftId,
      'indicator_survey_data',
      answer
    )
    console.log(this.props.drafts)
    if (this.state.step === this.props.data.length - 1) {
      this.props.nextStep()
    } else {
      this.setState({ step: step + 1 })
    }
  }

  previousStep = () => {
    const { step } = this.state
    this.setState({ step: step - 1 })
  }

  render() {
    let stopLightQuestions = this.props.data
    return (
      <div style={{ marginTop: 50 }}>
        {
          <StopLightPresentational
            data={stopLightQuestions[this.state.step]}
            index={this.state.step}
            total={stopLightQuestions.length - 1}
            nextStep={this.nextStep}
            previousStep={this.previousStep}
            parentPreviousStep={this.props.parentPreviousStep}
          />
        }
      </div>
    )
  }
}

const mapDispatchToProps = {
  addSurveyData,
  addSurveyDataWhole
}

const mapStateToProps = ({ surveys, drafts }) => ({
  surveys,
  drafts
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(StopLight)
