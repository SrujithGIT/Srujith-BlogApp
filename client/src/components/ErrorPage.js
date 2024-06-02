import React from 'react'
import {useRouteError} from 'react-router-dom'

function ErrorPage() {
    let routingError=useRouteError()
    console.log(routingError)
  return (
    <div className='text-center mt-5 bg-dark p-5'>
        <h1 className='text-primary'>{routingError.status}-{routingError.data}</h1>
    </div>
  )
}

export default ErrorPage;