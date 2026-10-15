import React from 'react';
import {Composition, Folder} from 'remotion';
import {Film} from './Film';
import {filmFrames} from './timeline';
import {Hero} from './scenes/Hero';
import {Engine} from './scenes/Engine';
import {Craft} from './scenes/Craft';
import {Chassis} from './scenes/Chassis';
import {Edition} from './scenes/Edition';
import {Closing} from './scenes/Closing';
export const Root = () => <>
  <Composition id="ChiefFilm" component={Film} durationInFrames={filmFrames} fps={30} width={1920} height={1080} />
  <Folder name="Scenes">
    <Composition id="Hero" component={Hero} durationInFrames={209} fps={30} width={1920} height={1080}/>
    <Composition id="Engine" component={Engine} durationInFrames={278} fps={30} width={1920} height={1080}/>
    <Composition id="Craft" component={Craft} durationInFrames={286} fps={30} width={1920} height={1080}/>
    <Composition id="Chassis" component={Chassis} durationInFrames={254} fps={30} width={1920} height={1080}/>
    <Composition id="Edition" component={Edition} durationInFrames={270} fps={30} width={1920} height={1080}/>
    <Composition id="Closing" component={Closing} durationInFrames={150} fps={30} width={1920} height={1080}/>
  </Folder>
</>;
