import { cp, mkdir, readFile, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const source = path.resolve(process.argv[2] || '../salinas-bizznest-scheduler')
const destination = path.join(root, 'public/rsa-demo')
await mkdir(destination, { recursive: true })
await cp(path.join(source, 'index.html'), path.join(destination, 'index.html'))
await cp(path.join(source, 'src'), path.join(destination, 'src'), {
  recursive: true,
  filter: (entry) => !['__tests__', 'run-tests.js'].includes(path.basename(entry)),
})

// Retain the scheduling scenarios while using fictional demo contacts.
const dataPath = path.join(destination, 'src/documents/interns.json')
const data = JSON.parse(await readFile(dataPath, 'utf8'))
data.interns = Object.fromEntries(Object.values(data.interns).map((intern, index) => [
  `Demo Intern ${String(index + 1).padStart(2, '0')}`,
  { ...intern, email: `intern${index + 1}@example.invalid` },
]))
await writeFile(dataPath, `${JSON.stringify(data, null, 2)}\n`)

// Keep saved pairings separate from other apps hosted on the portfolio origin.
const internsPath = path.join(destination, 'src/scripts/interns.js')
await writeFile(internsPath, (await readFile(internsPath, 'utf8')).replaceAll('"internPairs"', '"portfolio-rsa-demo-pairs"'))

// Scheduling should still work if the optional confetti CDN is unavailable.
const appPath = path.join(destination, 'src/app.js')
await writeFile(appPath, (await readFile(appPath, 'utf8'))
  .replace('lottie.loadAnimation({', 'window.lottie?.loadAnimation({')
  .replace('generateButtonAnimation.goToAndPlay(', 'generateButtonAnimation?.goToAndPlay('))

console.log('Imported RSA demo into public/rsa-demo.')
