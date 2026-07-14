$routes = @('users','clients','posts','approvals','inbox','media','brandKits','team','analytics','settings')
foreach($r in $routes) {
$content = @"
import express from 'express';
import { authenticate } from '../middleware/auth.js';
import { requireRole, Roles } from '../middleware/rbac.js';

const router = express.Router();

router.use(authenticate);

router.get('/', (req, res) => {
  res.json({ message: '${r} endpoint' });
});

export default router;
"@
    Set-Content -Path "d:\SD\projects\socialAgency\backend\src\routes\${r}.ts" -Value $content
}
