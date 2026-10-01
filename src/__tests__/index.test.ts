import * as path from 'path'

import jestResults from '..'

beforeEach(() => {
  global['message'] = jest.fn()
  global['fail'] = jest.fn()
  global['warn'] = jest.fn()
  global['danger'] = {
    github: {
      pr: {
        head: {
          ref: 'branch',
          repo: {
            full_name: 'repo/slug',
            html_url: 'https://github.com/user',
            owner: {
              login: 'user',
            },
          },
        },
      },
      utils: {
        fileLinks: (a: any) => a,
      },
    },
  }
})

test('no fails with passing test results', () => {
  jestResults({
    testResultsJsonPath: fixture('passing-tests.json'),
  })
  expect(global['fail']).not.toHaveBeenCalled()
})

test('passing test results with visible success message', () => {
  jestResults({
    testResultsJsonPath: fixture('passing-tests.json'),
    showSuccessMessage: true,
  })
  expect(global['message']).toHaveBeenCalledWith(
    expect.stringMatching(/Jest tests passed/)
  )
})

test('passing test results without visible success message', () => {
  jestResults({
    testResultsJsonPath: fixture('passing-tests.json'),
  })
  expect(global['message']).not.toHaveBeenCalled()
})

test('fails with failing test results', () => {
  jestResults({
    testResultsJsonPath: fixture('failing-tests.json'),
  })
  expect(global['fail']).toHaveBeenCalledWith(expect.stringMatching(/FAIL/))
})

test('fails with failing test results from jest 20', () => {
  jestResults({
    testResultsJsonPath: fixture('failed-tests-j20.json'),
  })
  expect(global['fail']).toHaveBeenCalledWith(expect.stringMatching(/FAIL/))
})

test('warns when test results JSON file cannot be read', () => {
  jestResults({
    testResultsJsonPath: fixture('nonexistent.json'),
  })
  expect(global['fail']).toHaveBeenCalled()
})

test('can create links for github', () => {
  jestResults({
    testResultsJsonPath: fixture('failing-tests.json'),
  })
  expect(global['fail']).toHaveBeenCalledWith(
    expect.stringMatching(
      /https:\/\/github.com\/repo\/slug\/blob\/branch\/(.*)?\/file-utils.test.ts#L24/
    )
  )
})

test('can create links for hosted github', () => {
  global['danger'].github.pr.head.repo.html_url =
    'https://mydomain.github.com/user'
  jestResults({
    testResultsJsonPath: fixture('failing-tests.json'),
  })
  expect(global['fail']).toHaveBeenCalledWith(
    expect.stringMatching(
      /https:\/\/mydomain.github.com\/repo\/slug\/blob\/branch\/(.*)?\/file-utils.test.ts#L24/
    )
  )
})

test('links files relative to the repository root', () => {
  jestResults({
    testResultsJsonPath: fixture('failing-tests.json'),
    repoRoot: '/Users/orta/dev/projects/danger/danger-js',
  })
  expect(global['fail']).toHaveBeenCalledWith(
    expect.stringContaining(
      "href='https://github.com/repo/slug/blob/branch/source/commands/utils/_tests/file-utils.test.ts#L24'"
    )
  )
})

test('reports failing tests without a pull request', () => {
  delete global['danger'].github.pr
  jestResults({
    testResultsJsonPath: fixture('failing-tests.json'),
  })
  expect(global['fail']).toHaveBeenCalledWith(
    expect.stringMatching(/FAIL<\/b> in `.*\/file-utils\.test\.ts`/)
  )
  expect(global['fail']).not.toHaveBeenCalledWith(
    expect.stringMatching(/Could not read test results/)
  )
})

test('reports failing tests without GitHub', () => {
  global['danger'] = {}
  jestResults({
    testResultsJsonPath: fixture('failing-tests.json'),
  })
  expect(global['fail']).toHaveBeenCalledWith(
    expect.stringMatching(/FAIL<\/b> in `.*\/file-utils\.test\.ts`/)
  )
  expect(global['fail']).not.toHaveBeenCalledWith(
    expect.stringMatching(/Could not read test results/)
  )
})

test.skip('Fails 6', () => {
  expect({ v: 'asda' }).toContain('s')
})

const fixture = (filename: string) =>
  path.resolve(__dirname, '__fixtures__', filename)
