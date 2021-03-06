import React from 'react'
import { withI18n } from 'react-i18next'
import moment from 'moment'

class DatePicker extends React.Component {
  constructor(props) {
    super(props)
    const { dayLabel, monthLabel, yearLabel, defaultDate } = props
    let defaultDateMS = defaultDate * 1000 // convert to miliseconds because we save the date in seconds
    this.state = {
      day: this.props.day || null,
      month: this.props.month || null,
      year: this.props.year || null,
      selectDay: defaultDateMS ? moment(defaultDateMS).date() : dayLabel,
      selectMonth: defaultDateMS
        ? moment(defaultDateMS).month() + 1
        : monthLabel,
      selectYear: defaultDateMS ? moment(defaultDateMS).year() : yearLabel
    }
  }

  shouldComponentUpdate(_nextProps, nextState) {
    return (
      this.state.selectMonth !== nextState.selectMonth ||
      (this.state.selectDay !== nextState.selectDay) |
        (this.state.selectYear !== nextState.selectYear)
    )
  }

  componentWillMount() {
    let day = [],
      month = [],
      year = []

    const pad = n => {
      return n < 10 ? '0' + n : n
    }

    for (let i = 1; i <= 31; i++) {
      day.push(this.props.padDay ? pad(i) : i)
    }

    let monthIndex = 1
    for (const monthName of moment.localeData().months()) {
      month.push({
        text: this.props.useMonthNames
          ? monthName
          : this.props.padMonth
          ? pad(monthIndex)
          : monthIndex,
        value: monthIndex
      })
      monthIndex++
    }

    for (let i = this.props.maxYear; i >= this.props.minYear; i--) {
      year.push(i)
    }

    this.setState({
      day: day,
      month: month,
      year: year
    })
  }

  changeDate(e, type) {
    this.setState({
      [type]: e.target.value
    })
    this.checkDate(e.target.value, type)
  }

  getDate(date) {
    if (moment(date).isValid()) {
      return moment(date).format()
    } else {
      return undefined
    }
  }

  checkDate(value, type) {
    let { selectDay, selectMonth, selectYear } = this.state

    if (type === 'selectDay') {
      selectDay = value
    } else if (type === 'selectMonth') {
      selectMonth = value
    } else if (type === 'selectYear') {
      selectYear = value
    }

    if (this.isSelectedAllDropdowns(selectDay, selectMonth, selectYear)) {
      const dateObject = {
        year: selectYear,
        month: selectMonth - 1,
        day: selectDay
      }
      this.props.dateChange(this.getDate(dateObject))
    } else {
      this.props.dateChange(undefined)
    }
  }

  isSelectedAllDropdowns(selectDay, selectMonth, selectYear) {
    if (selectDay === '' || selectMonth === '' || selectYear === '') {
      return false
    }
    return (
      selectDay !== this.props.dayLabel &&
      selectMonth !== this.props.monthLabel &&
      selectYear !== this.props.yearLabel
    )
  }

  render() {
    const { t } = this.props
    const dayElement = this.state.day.map((day, id) => {
      return (
        <option value={day} key={id}>
          {day}
        </option>
      )
    })
    const monthElement = this.state.month.map((month, id) => {
      return (
        <option value={month.value} key={id}>
          {t(
            `months.${moment()
              .month(month.value - 1)
              .format('MMMM')
              .toLowerCase()}`
          )}
        </option>
      )
    })
    const yearElement = this.state.year.map((year, id) => {
      return (
        <option value={year} key={id}>
          {year}
        </option>
      )
    })

    return (
      <div className="form-group m0">
        <div className="p0 row justify-content-around">
          <select
            defaultValue=""
            className="custom-select col-3 form-control "
            value={this.state.selectMonth}
            onChange={e => this.changeDate(e, 'selectMonth')}
          >
            <option value="" disabled>
              {t('views.family.selectMonth')}
            </option>
            {monthElement}
          </select>
          <select
            defaultValue=""
            className="custom-select col-3 form-control "
            value={this.state.selectDay}
            onChange={e => this.changeDate(e, 'selectDay')}
          >
            <option value="" disabled>
              {t('general.day')}
            </option>
            {dayElement}
          </select>
          <select
            defaultValue=""
            className="custom-select col-3 form-control "
            value={this.state.selectYear}
            onChange={e => this.changeDate(e, 'selectYear')}
          >
            <option value="" disabled>
              {t('general.year')}
            </option>
            {yearElement}
          </select>
        </div>
      </div>
    )
  }
}

export default withI18n()(DatePicker)
