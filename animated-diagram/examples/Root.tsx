import React from 'react';
import { Composition } from 'remotion';
import { TierCheck } from './tier-check';

/**
 * Remotion composition registry. Point your project's entry (registerRoot) at
 * this, or copy the <Composition> into your existing Root.
 *
 * Length math: cover the full reveal + the last trace's finish. Here the trace
 * starts at frame 130, walks 3 hops at 20f each (= +60), then we let it sit, so
 * ~7s at 30fps is comfortable.
 */
export const RemotionRoot: React.FC = () => (
  <>
    <Composition
      id="TierCheck"
      component={TierCheck}
      durationInFrames={210}
      fps={30}
      width={1920}
      height={1080}
    />
  </>
);
