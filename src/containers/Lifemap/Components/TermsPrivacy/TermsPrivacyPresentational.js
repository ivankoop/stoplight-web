import React from 'react'
import { Link } from 'react-router-dom'

const TermsPrivacyPresentational = ({ data, header, nextStep }) => {
  return (
    <div style={{ marginTop: 50 }}>
      <h2>{header}</h2>
      <hr />
      <div>
        <p className="lead">{data.title}</p>
        <hr className="my-4" />
        <p
          dangerouslySetInnerHTML={{
            __html: data.text.split('\\n').join('<br/>')
          }}
        />
        <p className="lead">
          <button
            className="btn btn-primary btn-lg"
            href="#"
            onClick={() => nextStep()}
          >
            Agree
          </button>
          <Link to={`/`}>
            <button className="btn btn-primary btn-lg" href="#">
              Disagree
            </button>
          </Link>
        </p>
      </div>
    </div>
  )
}

export default TermsPrivacyPresentational
