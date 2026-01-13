import { Hono } from 'hono'

// routing
import productRoutes from './routes/product.route.js'

const app = new Hono()

app.route('/', productRoutes);

app.get('/', (c) => { return c.text('POS Services API') })

export default app
