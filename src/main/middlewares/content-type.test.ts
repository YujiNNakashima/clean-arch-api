import request from 'supertest'
import app from '../config/app'

describe('Content Type Middleware', () => {
  test('should return default content type as json ', async () => {
    app.post('/test_content_type', (req, res) => {
      res.send('')
    })
    await request(app)
      .post('/test_content_type')
      .expect('content-type', /json/)
  })

  test('should return content type as xml ', async () => {
    app.post('/test_content_type', (req, res) => {
      res.type('xml').send('')
    })
    await request(app)
      .post('/test_content_type')
      .expect('content-type', /json/)
  })
})
