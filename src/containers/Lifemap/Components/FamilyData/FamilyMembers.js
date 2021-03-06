import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Form, Field } from 'react-final-form'
import { withI18n } from 'react-i18next'
import ErrorComponent from '../../ErrorComponent'
import { addSurveyData, addSurveyDataWhole } from '../../../../redux/actions'

import AppNavbar from '../../../../components/AppNavbar'
class FamilyMembers extends Component {
  constructor(props) {
    super(props)

    let draft = this.props.drafts.filter(
      draft => draft.draftId === this.props.draftId
    )[0]

    let memberCount = draft.familyData.countFamilyMembers || 1

    this.state = {
      memberCount: memberCount-1
    }
  }
  handleChange = event => {
    this.setState({ memberCount: event.target.value })
  }

  //TODO: handler to skip to map view if only 1 family member!
  render() {
    const { t } = this.props

    let draft = this.props.drafts.filter(
      draft => draft.draftId === this.props.draftId
    )[0]


    let initialValues = { memberCount: this.state.memberCount }
    draft.familyData.familyMembersList
      .filter(member => member.firstParticipant === false)
      .forEach((member, idx) => {
        initialValues[`membername${idx + 2}`] = member.firstName
      })

    const forms = []
    for (let i = 0; i < this.state.memberCount; i++) {
      forms.push(
        <div key={`membernId${i + 2}`} >
          <Field name={`membername${i + 2}`}>
            {({ input, meta }) => (
              <div className="form-group">
              <label>{t('views.family.familyMember')} {i+2}</label>
                <input
                  type="text"
                  {...input}
                  className="form-control"
                  placeholder={t('views.family.name')}
                />
                <ErrorComponent name={`membername${i + 2}`} />
              </div>
            )}
          </Field>
        </div>
      )
    }

    return (
      <div>
        <AppNavbar
          text={t('views.familyMembers')}
          showBack={true}
          backHandler={this.props.previousStep}
        />
        <Form
          onSubmit={(values, form) => {
            // need to save familyMembersCount
            let countFamilyMembers = parseInt(values.memberCount) + 1
            console.log(values.memberCount)
            console.log(countFamilyMembers)
            this.props.addSurveyDataWhole(this.props.draftId, 'familyData', {
              countFamilyMembers: countFamilyMembers
            })

            if (countFamilyMembers < 2) {
              this.props.jumpStep(3) // jump to map view
            } else {
              // map through values and extract the firstNames of all family members
              let familyMembers = []
              let familyParticipant = draft.familyData.familyMembersList[0]
              familyMembers.push(familyParticipant)
              let additionalMembersList = Object.keys(values)
                .filter(key => key.includes('membername'))
                .slice(0, values.memberCount)
                .map(key => {
                  let member = {
                    firstParticipant: false,
                    firstName: values[key],
                    socioEconomicAnswers: []
                  }
                  familyMembers.push(member)
                  return member
                })
              // combine familyMembers with firstParticipant from primary participant screen
              this.props.addSurveyDataWhole(this.props.draftId, 'familyData', {
                familyMembersList: familyMembers
              })
              this.props.setMemberCount(additionalMembersList.length)
              this.props.nextStep()
            }
          }}
          validate={values => {
            const errors = {}
            if (values.memberCount === null) {
              errors.memberCount = 'Required'
            }

            for (let i = 0; i < this.state.memberCount; i++) {
              if (!values[`membername${i + 2}`]) {
                errors[`membername${i + 2}`] = 'Required'
              }
            }
            return errors
          }}
          initialValues={initialValues}
          render={({
            handleSubmit,
            submitting,
            pristine,
            values,
            form,
            invalid
          }) => (
            <form onSubmit={handleSubmit}>
              <div>
                <div className="form-group">
                <label>{t('views.family.peopleLivingInThisHousehold')}</label>
                  <Field name="memberCount">
                    {({ input, meta }) => {
                      const { onChange } = input
                      const mergedOnChange = e => {
                        this.handleChange(e)
                        onChange(e)
                      }
                      const newInput = { ...input, onChange: mergedOnChange }
                      return (
                        <select {...newInput} className="custom-select">
                          <option value="" disabled>
                          </option>
                          <option value="0">1</option>
                          <option value="1">2</option>
                          <option value="2">3</option>
                          <option value="3">4</option>
                          <option value="4">5</option>
                          <option value="5">6</option>
                          <option value="6">7</option>
                          <option value="7">8</option>
                          <option value="8">9</option>
                          <option value="9">10</option>
                        </select>
                      )
                    }}
                  </Field>
                  <ErrorComponent name='memberCount' />
                </div>
              </div>
              <div className="form-group">
                <label>{t('views.primaryParticipant')}</label>
                <p className="form-control" placeholder="">
                  {this.props.surveyTakerName}
                </p>
              </div>
              {forms}
              <div style={{ paddingTop: 20 }}>
                <button
                  type="submit"
                  className="btn btn-primary btn-lg btn-block"
                >
                  {t('general.continue')}
                </button>
              </div>
            </form>
          )}
        />
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

export default withI18n()(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(FamilyMembers)
)
