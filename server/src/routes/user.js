import { Router } from 'express';
import { create, getAll} from '../controller/userController'
import { update } from '@/model/user';
const api = Router()

api.post('/api/user', create)
api.get('/api/user', getAll)
api.put('/api/user', update)
export default api;