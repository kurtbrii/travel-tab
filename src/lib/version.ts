import pkg from '../../package.json'

type Pkg = { version?: string }
const { version } = (pkg as Pkg)
export const appVersion: string = version ?? '0.0.0'
