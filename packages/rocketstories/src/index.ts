import type { Init, Rocketstories } from '~/init'
import { init, rocketstories } from '~/init'
import type { IRocketStories } from '~/rocketstories'
import type {
  Configuration,
  Control,
  Controls,
  ControlTypes,
  ElementType,
  PartialControls,
  RocketStoryConfiguration,
  RocketType,
  StorybookControl,
  StoryComponent,
  StoryConfiguration,
} from '~/types'

// NOTE: `ExtractDimensions` and `ExtractProps` exist in `~/types` for
// internal use, but are NOT re-exported here. Both names also exist in
// `@vitus-labs/rocketstyle` with different shapes — re-exporting them
// from rocketstories created a silent name collision in any module that
// pulled both. Consumers needing those helpers should import them from
// `@vitus-labs/rocketstyle` (the canonical source).

export type {
  Configuration,
  Control,
  Controls,
  ControlTypes,
  ElementType,
  Init,
  IRocketStories,
  PartialControls,
  RocketStoryConfiguration,
  Rocketstories,
  RocketType,
  StorybookControl,
  StoryComponent,
  StoryConfiguration,
}

export { init, rocketstories }
export default init
