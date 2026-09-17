import { describe, expect, it } from 'vitest'
import { buildRegionSuggestionFolders } from './proxyFolders'

describe('buildRegionSuggestionFolders', () => {
  it('creates default region buckets for common proxy group names', () => {
    const folders = buildRegionSuggestionFolders(['HK-1', 'JP-2', 'US-1', 'GLOBAL', 'DIRECT'])

    expect(folders.map((folder) => folder.name)).toEqual(['HK', 'JP', 'US'])
    expect(folders[0].manualIncludes).toEqual(['HK-1'])
    expect(folders[1].manualIncludes).toEqual(['JP-2'])
    expect(folders[2].manualIncludes).toEqual(['US-1'])
  })
})
