import { cp, mkdir, mkdtemp, readFile, rm, symlink, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { execFileSync } from 'node:child_process'

// Import a self-contained demo snapshot; the portfolio build needs no sibling repo.
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const source = path.resolve(process.argv[2] || '../spacio')
const stage = await mkdtemp(path.join(tmpdir(), 'portfolio-spacio-'))
try {
  for (const entry of ['src', 'public', 'index.html', 'package.json', 'vite.config.js']) {
    await cp(path.join(source, entry), path.join(stage, entry), { recursive: true })
  }
  await symlink(path.join(source, 'node_modules'), path.join(stage, 'node_modules'), 'dir')
  const configPath = path.join(stage, 'vite.config.js')
  await writeFile(configPath, (await readFile(configPath, 'utf8')).replaceAll('__dirname', 'process.cwd()'))
  // Hash routes survive reloads on static hosting and work under any portfolio base.
  const routesPath = path.join(stage, 'src/pages/Routes.jsx')
  let routes = await readFile(routesPath, 'utf8')
  routes = routes.replaceAll('createBrowserRouter', 'createHashRouter')
  routes = routes.replace('  Route,', '  Route,\n  Navigate,')
  routes = routes.replace('<Route path="/" element={<Login />} />', '<Route path="/" element={<Navigate to="/home" replace />} />')
  routes = routes.replace('{/* Public Routes */}', '{/* Public Routes */}\n      <Route path="/login-preview" element={<Login />} />')
  routes = routes.replace("basename: import.meta.env.BASE_URL.replace(/\\/$/, '') || '/',", "basename: '/',")
  await writeFile(routesPath, routes)
  const authPath = path.join(stage, 'src/contexts/authContext/index.jsx')
  let auth = await readFile(authPath, 'utf8')
  // Open the embedded snapshot directly with the local sample account.
  auth = auth.replace("const storedToken = localStorage.getItem('token');", "const storedToken = 'demo-access-token';")
  auth = auth.replace("const expiresAt = parseInt(localStorage.getItem('expires_at'), 10);", 'const expiresAt = Date.now() + 24 * 60 * 60 * 1000;')
  auth = auth.replace("localStorage.getItem('userEmail') || null", "'alex.rivera@bizznest.demo'")
  await writeFile(authPath, auth.replace("window.location.href = '/';", "window.location.assign('./');"))
  // startOfToday ignores its argument; use startOfDay to honor the frozen demo date.
  const eventsPath = path.join(stage, 'src/api/events/getEvents.js')
  const events = await readFile(eventsPath, 'utf8')
  await writeFile(eventsPath, events.replaceAll('startOfToday', 'startOfDay'))
  // The portfolio demo uses only the sample account, with no OAuth setup required.
  const loginPath = path.join(stage, 'src/pages/Login.jsx')
  let login = await readFile(loginPath, 'utf8')
  login = login.replace('if (!loading && isUserLoggedIn)', "if (!loading && isUserLoggedIn && !window.location.hash.includes('/login-preview'))")
  login = login.replace(/  const googleSignIn = useGoogleLogin\([\s\S]*?  const demoSignIn =/, '  const demoSignIn =')
  login = login.replace(/        <button onClick={googleSignIn}[\s\S]*?<\/button>/, '')
  await writeFile(loginPath, login)
  const appPath = path.join(stage, 'src/App.jsx')
  let app = await readFile(appPath, 'utf8')
  app = app.replace('<GoogleOAuthProvider clientId={CLIENT_ID}>', '<>').replace('</GoogleOAuthProvider>', '</>')
  await writeFile(appPath, app)
  execFileSync(path.join(source, 'node_modules/.bin/vite'), ['build', '--configLoader', 'runner', '--mode', 'demo', '--base', './'], {
    cwd: stage,
    env: { ...process.env, VITE_DEMO: 'true', VITE_CLIENT_ID: '', VITE_SCOPE: '' },
    stdio: 'inherit',
  })
  // Keep the demo's original styles with its document when embedded in Vite.
  const htmlPath = path.join(stage, 'dist/index.html')
  let html = await readFile(htmlPath, 'utf8')
  for (const match of html.matchAll(/<link\b[^>]*rel="stylesheet"[^>]*href="(\.\/assets\/[^"]+\.css)"[^>]*>/g)) {
    const cssPath = path.join(stage, 'dist', match[1])
    const css = await readFile(cssPath, 'utf8')
    // Inline styles resolve relative URLs from the document, not the CSS folder.
    const rebased = css.replace(/url\((['"]?)(?!data:|https?:|\/|#)([^)'"\s]+)\1\)/g,
      (_match, quote, url) => `url(${quote}./assets/${url}${quote})`)
    html = html.replace(match[0], () => `<style data-spacio-styles>${rebased.replace(/<\/style/gi, '<\\/style')}</style>`)
  }
  await writeFile(htmlPath, html)
  const destination = path.join(root, 'public/spacio-demo')
  await mkdir(path.dirname(destination), { recursive: true })
  await rm(destination, { recursive: true, force: true })
  await cp(path.join(stage, 'dist'), destination, { recursive: true })
  console.log('Imported Spaceio demo into public/spacio-demo.')
} finally {
  await rm(stage, { recursive: true, force: true })
}
