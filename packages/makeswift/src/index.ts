#!/usr/bin/env node

import { Command } from 'commander'
import init from './init'
import pkg from '../package.json'

const program = new Command()

program
  .name('Makeswift CLI')
  .description('The official command-line tool to interact with Makeswift.')
  .version(pkg.version)

program
  .command('init')
  .description('Create a new Next.js app or integrate an existing one, to use with Makeswift.')
  .argument('<name>', 'The name of the folder to create.')
  .option('--example <example>', 'The Github URL, or name of the Makeswift example to clone.')
  .action(init)

program.parse()