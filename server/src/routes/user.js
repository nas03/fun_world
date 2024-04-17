import { Router } from 'express';
import { create, getAll, update} from '../controller/userController'

const api = Router()

api.post('/api/user', create)
api.get('/api/user', getAll)
api.put('/api/user', update)
export default api;