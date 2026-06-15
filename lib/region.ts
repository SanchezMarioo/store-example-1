import { cache } from 'react'
import { sdk } from './medusa'

export const getDefaultRegionId = cache(async (): Promise<string | undefined> => {
  try {
    const { regions } = await sdk.store.region.list()
    return regions[0]?.id
  } catch {
    return undefined
  }
})
