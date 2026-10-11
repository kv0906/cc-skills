import React from 'react';
import { AbsoluteFill } from 'remotion';
import { DiagramBoard } from '../templates/DiagramBoard';
import { CRTShader } from '../templates/CRTShader';

/**
 * The tier-check flow, animated.
 *
 * This is the worked example of the whole pipeline: a plain-English ask ("show
 * the tier check — an action comes in, it's Tier 3, hits the classifier, gets
 * denied") becomes Mermaid, the board reveals it, and a trace dot narrates the
 * Tier 3 -> classifier -> deny path. Wrapped in the CRT shader for the finish.
 */

const tierCheck = `flowchart TD
  action[Action] --> t1[Tier 1<br/>read-only]
  action --> t2[Tier 2<br/>in-project writes]
  action --> t3[Tier 3<br/>everything else]
  t1 --> skip([Skips classifier])
  t2 --> skip
  t3 --> classifier{Classifier}
  classifier --> approve[Approve]
  classifier --> deny[Deny]`;

export const TierCheck: React.FC = () => (
  <AbsoluteFill style={{ background: '#000' }}>
    <CRTShader>
      <DiagramBoard
        mermaid={tierCheck}
        revealStart={10}
        nodeStagger={7}
        traces={[
          {
            path: ['action', 't3', 'classifier', 'deny'],
            startFrame: 130,
            segDuration: 20,
            holdDuration: 9999,
          },
        ]}
      />
    </CRTShader>
  </AbsoluteFill>
);
