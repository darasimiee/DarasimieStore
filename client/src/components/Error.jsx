import { Button, Container } from 'react-bootstrap'
import { useNavigate } from 'react-router-dom'

export default function Error() {
  const navigate = useNavigate()
  return (
    <section className='mt-5'>
      <Container className='mx-auto py-5 px-4'>
        <p className='mt-5'>
          {' '}
          The page you are looking for might have been removed, had its name
          changed, <br />
          or is temporarily unavailable.
        </p>
        <Button
          variant='dark'
          className='fw-medium rounded-0'
          onClick={() => navigate('/')}
        >
          Go back
        </Button>
      </Container>
    </section>
  )
}