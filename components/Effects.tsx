import React from 'react';
import { EffectComposer, Bloom, Vignette, Noise } from '@react-three/postprocessing';
import { BlendFunction } from 'postprocessing';

export const Effects: React.FC = () => {
  return (
    <EffectComposer disableNormalPass>
      {/* Bloom for that Neon Glow */}
      <Bloom 
        luminanceThreshold={0.2} 
        mipmapBlur 
        intensity={1.5} 
        radius={0.4}
      />
      {/* Noise for film grain / grit */}
      <Noise opacity={0.15} blendFunction={BlendFunction.OVERLAY} />
      {/* Vignette for CRT monitor curve feel */}
      <Vignette eskil={false} offset={0.1} darkness={1.1} />
    </EffectComposer>
  );
};