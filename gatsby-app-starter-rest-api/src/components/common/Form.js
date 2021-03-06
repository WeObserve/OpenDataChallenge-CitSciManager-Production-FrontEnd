import React, { useContext, useState } from 'react'
import axios from 'axios'
import { Link, navigate } from 'gatsby'
import Context from 'components/common/Context'
import setAuthToken from 'helpers/setAuthToken'
import SignUpForm from 'components/common/SignUpForm'
import { Container, 
         Typography, 
         Button, 
         TextField,
         InputAdornment } from '@material-ui/core'
import EmailIcon from '@material-ui/icons/Email'
import LockIcon from '@material-ui/icons/Lock'

export default ({ form }) => {
  const { data, dispatchUserAction } = useContext(Context)
  const [isSubmitting, setSubmitting] = useState(false)
  const [details, setDetails] = useState({
    username: '',
    email: '',
    password: '',
  })
  const [errors, setErrors] = useState({
    username: '',
    email: '',
    password: '',
  })

  //Context variable renaming to accomodate axiom calls
  const meta = data

  const handleChange = e => {
    setDetails({ ...details, [e.target.name]: e.target.value })
  }

  const handleBlur = e => {
    if (!e.target.value) {
      setErrors({ ...errors, [e.target.name]: 'Required field' })
    }
  }

  const handleSubmit = async e => {
    e.preventDefault()
    setSubmitting(true)

    //console.log(e)
    try {
      const { username, email, password } = details

      if (form === 'login') {
        if (!email || !password) {
          setErrors({
            ...errors,
            email: 'Field is required',
            password: 'Field is required',
          })
        } else {
          //console.log(details)
          const { data } = await axios.post(`${process.env.API}/login`, {
            email,
            password,
          })

          await setAuthToken(data.token)
          dispatchUserAction({ type: 'SAVE_USER', payload: data })
          window.localStorage.setItem('token', data.token)

          // console.log(data.response.token)
          if (data.status === 'SUCCESS') {
            //console.log(data)
            console.log('login success!')
            // meta.toggleLogStatus()
            // console.log(data.response.user.role)
            // let role = data.response.user.role
            // console.log(role)
            meta.setUserData(
              true,
              data.response.token,
              data.response.tokenId,
              data.response.user.email,
              data.response.user.id,
              data.response.user.name,
              data.response.user.organisations,
              data.response.user.role
            )
            //Need to update the redirect based on role. This is for testing.
            if (data.response.user.role == 'SENDER') {
              navigate('/app/send/project')
            } else if (data.response.user.role == 'COLLECTOR') {
              navigate('/app/collect')
            }
          } else {
           // console.log(data)
            if (data.reason === 'Incorrect password') {
              setErrors({
                //...errors,
                password: 'Incorrect password',
              })
              setSubmitting(false)
            } else {
              setErrors({
                //...errors,
                email: 'No account found for this email',
              })
              setSubmitting(false)
            }
          }
        }
      } else {
        if (!username || !email || !password) {
          alert('aye sir')
        } else {
          const { data } = await axios.post(
            `${process.env.API}/user/register`,
            {
              username,
              email,
              password,
            }
          )

          await setAuthToken(data.token)
          dispatchUserAction({ type: 'SAVE_USER', payload: data })
          window.localStorage.setItem('token', data.token)

          navigate('/app/tasks/')
        }
      }
    } catch (err) {
      setSubmitting(false)
      console.log(err)
      if (err.response.data.email) {
        setErrors({ ...errors, email: err.response.data.email })
      } else if (err.response.data.email) {
        setErrors({ ...errors, email: err.response.data.password })
      } else if (err.response.data.email && err.response.data.email) {
        setErrors({
          ...errors,
          email: err.response.data.email,
          password: err.response.data.password,
        })
      } else {
        setErrors({
          ...errors,
          email: err.response.data.error,
        })
      }
      setSubmitting(false)
    }
  }

  return (
    <Container maxWidth="xs">
      <Typography align="center" variant="subtitle1" gutterBottom>
        Login to Send or Collect Your Data
      </Typography>
      <br/>
      <form onSubmit={handleSubmit}>
        {/* {form === 'register' && (                              <== Don't need this for now, all accounts
          <div className="input-field black-input">                    created in backend
            <input
              onChange={handleChange}
              onBlur={handleBlur}
              type="text"
              placeholder="Enter your username"
              name="username"
            />
            {errors.username && (
              <span style={{ color: 'red' }}>{errors.username}</span>
            )}
          </div>
        )} */}
        {/* <div className="input-field black-input">
          <span className="email-icon" />
          <input
            onChange={handleChange}
            onBlur={handleBlur}
            type="email"
            placeholder="Enter your email"
            name="email"
          />
          {errors.email && <span style={{ color: 'red' }}>{errors.email}</span>}
        </div> */}
        <TextField
          variant='outlined'
          name="email"
          onChange={handleChange}
          onBlur={handleBlur}
          type="email"
          fullWidth
          placeholder="Enter your email"
          style={{ backgroundColor: '#e9ecef' }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <EmailIcon />
              </InputAdornment>
            ),
          }}
        />
        <Typography variant='body1' align='center' gutterBottom style={{marginTop: '.5rem'}}>
          {errors.email && <span style={{ color: 'red' }}>{errors.email}</span>}
        </Typography>
        <br/>
        <TextField
          variant='outlined'
          name="password"
          onChange={handleChange}
          onBlur={handleBlur}
          type="password"
          fullWidth
          placeholder="Enter your email"
          style={{ backgroundColor: '#e9ecef' }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <LockIcon />
              </InputAdornment>
            ),
          }}
        />
        <Typography variant='body1' align='center' gutterBottom style={{marginTop: '.5rem'}}>
        {errors.password && (
            <span style={{ color: 'red' }}>{errors.password}</span>
          )}
        </Typography>
        <br/>
       
        <div className="center-text">
          <Button
            type="submit"
            variant="contained"
            size="large"
            disabled={isSubmitting}
            style={{
              backgroundColor: '#3EC28F',
              color: 'white',
              marginLeft: '0px',
            }}
          >
            {form}
          </Button>
        </div>
      </form>

      <br />
      <Typography variant="body2" align="center" gutterBottom={true}>
        List your organization and citizen science projects in our directory 
        and help accelerate collaboration and innovation!
      </Typography>
      <Typography align="center">
        <SignUpForm/>
      </Typography>
    </Container>
  )
}
