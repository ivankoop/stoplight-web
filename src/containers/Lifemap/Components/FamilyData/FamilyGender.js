import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Form, Field } from 'react-final-form'
import { withI18n } from 'react-i18next'

import { addSurveyData, addSurveyDataWhole } from '../../../../redux/actions'
import ErrorComponent from '../../ErrorComponent'

class FamilyGender extends Component {
  constructor(props) {
    super(props)
    this.state = {}
  }
  handleChange = event => {
    this.setState({ memberCount: event.target.value })
  }

  //TODO: handler to skip to map view if only 1 family member!

  render() {
    const { t } = this.props
    const draft = this.props.drafts.filter(
      draft => draft.draftId === this.props.draftId
    )[0]
    const additionalMembersList = draft.familyData.familyMembersList.filter(
      member => member.firstParticipant === false
    )

    const forms = additionalMembersList.map((member, idx) => {
      return (
        <div key={idx}>
          <Field
            name={`gender${idx}`}
            component="select"
            className="custom-select"
          >
            <option value="" disabled>
              {t('views.family.selectGender')}
            </option>
            {this.props.data.gender.map(gender => (
              <option value={gender.value} key={gender.text + gender.value}>
                {gender.text}
              </option>
            ))}
          </Field>
          <ErrorComponent name={`gender${idx}`} />
        </div>
      )
    })

    return (
      <div style={{ marginTop: 50 }}>
        <h2> {t('views.gender')} </h2>
        <hr />
        <Form
          onSubmit={(values, form) => {
            let familyMembersList = draft.familyData.familyMembersList.filter(
              member => member.firstParticipant === true
            )

            additionalMembersList.forEach((member, idx) => {
              member.gender = values[`gender${idx}`]
              familyMembersList.push(member)
            })

            this.props.addSurveyDataWhole(this.props.draftId, 'familyData', {
              familyMembersList: familyMembersList
            })

            this.props.nextStep()
          }}
          validate={values => {
            const errors = {}
            if (!values.length === this.props.memberCount) {
              errors.values = 'Required'
            }
            for (let i = 0; i < this.props.memberCount; i++) {
              if (!values[`gender${i}`]) {
                errors[`gender${i}`] = 'Required'
              }
            }
            return errors
          }}
          initialValues={{}}
          render={({
            handleSubmit,
            submitting,
            pristine,
            values,
            form,
            invalid
          }) => (
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <p className="form-control" placeholder="">
                  {
                    draft.familyData.familyMembersList.filter(
                      member => member.firstParticipant === true
                    )[0].gender
                  }
                </p>
              </div>
              {forms}
              <div style={{ paddingTop: 20 }}>
                <button
                  type="submit"
                  className="btn btn-primary btn-sm btn-block"
                  disabled={pristine || invalid}
                >
                  Submit
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
  )(FamilyGender)
)