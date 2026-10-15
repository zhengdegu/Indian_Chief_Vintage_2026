import data from '../content.json';

export type SceneId = 'hero' | 'engine' | 'craft' | 'chassis' | 'edition' | 'closing';
type Scene = {id: SceneId; start: number; duration: number; startFrame?: number; durationFrames?: number; speechStart?: number; subtitleLines: string[]; subtitleCues?: {start:number;end:number;text:string}[]};
export const content = data as unknown as {variant?:string;duration:number;durationInFrames?:number;soundtrack?:string;narrationDisclosure:string;subtitleCues?:{start:number;end:number;text:string;sceneId:string}[];scenes: Scene[]};
export const scenes = content.scenes;
export const start = (index:number, fps=30) => Math.round(scenes[index].start * fps);
export const length = (index:number, fps=30) => Math.round(scenes[index].duration * fps);
export const filmFrames = content.durationInFrames ?? Math.round(content.duration * 30);
export const currentShot = (frame:number) => {let index=0;scenes.forEach((s,i)=>{if(frame>=Math.round(s.start*30))index=i;});return index;};
