import * as React from 'react'
import { dataReducer } from '../reducers/dataReducer'

const useFetchData = () => {

  const initialState = {
    data: null,
    error: null,
    status: 'idle',
  }

  const [state, dispatch] = React.useReducer(dataReducer, initialState )

  const {data, error, status} = state

  const execute = React.useCallback(promise => {
    dispatch({type: 'fetching'})
    promise
      .then(data => dispatch({type: 'done', payload: data}))
      .catch(error => dispatch({type: 'fail', error}))

  }, [])

  return {data, error, status, execute}
}